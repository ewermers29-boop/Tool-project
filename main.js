const STORAGE_KEY = 'switchboardState';
const WINDOW_MS = 10 * 60 * 1000;
const WARNING_SWITCHES = 4;

const emptyState = {
	status: 'tracking',
	events: [],
	lastTabId: null,
	previousTabId: null,
	warning: null
};

async function readState() {
	const stored = await chrome.storage.local.get(STORAGE_KEY);
	return { ...emptyState, ...(stored[STORAGE_KEY] || {}) };
}

async function writeState(state) {
	await chrome.storage.local.set({ [STORAGE_KEY]: state });
}

function getTabName(tab) {
	if (!tab) return 'Unknown tab';
	return tab.title || (tab.url ? new URL(tab.url).hostname : 'Untitled tab');
}

function keepRecentEvents(events, now) {
	return events.filter((event) => now - event.timestamp <= WINDOW_MS);
}

async function recordTabSwitch(tabId) {
	const state = await readState();
	const currentTab = await chrome.tabs.get(tabId);
	const previousTab = state.lastTabId === null
		? null
		: await chrome.tabs.get(state.lastTabId).catch(() => null);

	state.status = 'tracking';
	state.lastTabId = currentTab.id;

	if (!previousTab || previousTab.id === currentTab.id) {
		await writeState(state);
		return;
	}

	const now = Date.now();
	const event = {
		from: getTabName(previousTab),
		to: getTabName(currentTab),
		fromId: previousTab.id,
		toId: currentTab.id,
		timestamp: now
	};

	state.events = keepRecentEvents([...state.events, event], now);
	state.previousTabId = previousTab.id;

	const pairEvents = state.events.filter((item) => {
		const names = new Set([item.from, item.to, event.from, event.to]);
		return names.size === 2;
	});

	if (pairEvents.length >= WARNING_SWITCHES) {
		state.warning = {
			from: event.from,
			to: event.to,
			count: pairEvents.length,
			timestamp: now,
			previousTabId: previousTab.id
		};
	}

	await writeState(state);
}

function startBackgroundService() {
	chrome.tabs.onActivated.addListener(({ tabId }) => {
		recordTabSwitch(tabId).catch(async () => {
			const state = await readState();
			await writeState({ ...state, status: 'unavailable' });
		});
	});

	chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
		if (message.type === 'GET_STATE') {
			readState().then(sendResponse);
			return true;
		}

		if (message.type === 'CLEAR_HISTORY') {
			writeState(emptyState).then(() => sendResponse(emptyState));
			return true;
		}

		if (message.type === 'DISMISS_WARNING') {
			readState()
				.then((state) => writeState({ ...state, warning: null }))
				.then(() => sendResponse({ ok: true }));
			return true;
		}

		if (message.type === 'RETURN_TO_PREVIOUS_TAB') {
			readState().then(async (state) => {
				if (state.warning?.previousTabId !== null) {
					await chrome.tabs.update(state.warning.previousTabId, { active: true }).catch(() => {});
				}
				await writeState({ ...state, warning: null });
				sendResponse({ ok: true });
			});
			return true;
		}
	});
}

function renderPopup(state) {
	const trackingState = document.getElementById('trackingState');
	const warningView = document.getElementById('warningView');
	const patternView = document.getElementById('patternView');
	const recentEvents = keepRecentEvents(state.events, Date.now());
	const latest = recentEvents[recentEvents.length - 1];
	const switchCount = document.getElementById('switchCount');

	trackingState.textContent = state.status === 'tracking' ? 'Tracking locally' : 'Tracking unavailable';
	trackingState.classList.toggle('is-error', state.status !== 'tracking');
	switchCount.textContent = recentEvents.length;
	document.getElementById('historySummary').textContent = `Local history: ${state.events.length} switches`;

	if (latest) {
		document.getElementById('patternTitle').textContent = `${latest.from} <-> ${latest.to}`;
		document.getElementById('patternSummary').textContent = 'These are the tabs Switchboard actually observed switching.';
	}

	if (!state.warning) {
		warningView.classList.add('is-hidden');
		patternView.classList.remove('is-hidden');
		return;
	}

	patternView.classList.add('is-hidden');
	warningView.classList.remove('is-hidden');
	document.getElementById('warningTitle').textContent = `You switched between ${state.warning.from} and ${state.warning.to} ${state.warning.count} times.`;
	document.getElementById('warningSummary').textContent = 'This is a measured pattern, not a judgment about why it happened.';
}

function startPopup() {
	chrome.runtime.sendMessage({ type: 'GET_STATE' }, renderPopup);

	document.getElementById('continueButton').addEventListener('click', () => {
		chrome.runtime.sendMessage({ type: 'DISMISS_WARNING' }, () => {
			document.getElementById('choiceNote').textContent = 'Continuing. The next switch will remain part of the local pattern.';
			document.getElementById('warningView').classList.add('is-hidden');
			document.getElementById('patternView').classList.remove('is-hidden');
		});
	});

	document.getElementById('returnButton').addEventListener('click', () => {
		chrome.runtime.sendMessage({ type: 'RETURN_TO_PREVIOUS_TAB' }, () => window.close());
	});

	document.getElementById('clearButton').addEventListener('click', () => {
		chrome.runtime.sendMessage({ type: 'CLEAR_HISTORY' }, renderPopup);
	});
}

if (typeof document === 'undefined') {
	startBackgroundService();
} else {
	startPopup();
}