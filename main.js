const STORAGE_KEY = 'switchboardState';
const WINDOW_MS = 10 * 60 * 1000;
const WARNING_SWITCHES = 6;

const emptyState = {
	status: 'tracking',
	events: [],
	lastTabId: null,
	previousTabId: null,
	switchesSinceWarning: 0,
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
	if (!state.warning) {
		state.switchesSinceWarning = (state.switchesSinceWarning || 0) + 1;
	}

	let shouldOpenPopup = false;
	if (state.switchesSinceWarning >= WARNING_SWITCHES && !state.warning) {
		state.warning = {
			from: event.from,
			to: event.to,
			count: state.switchesSinceWarning,
			timestamp: now,
			previousTabId: previousTab.id
		};
		shouldOpenPopup = true;
	}

	await writeState(state);
	if (shouldOpenPopup) {
		try {
			chrome.action?.openPopup?.();
		} catch {
			// Ignore popup-opening failures in restricted contexts.
		}
	}
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
				.then((state) => writeState({ ...state, warning: null, switchesSinceWarning: 0 }))
				.then(() => sendResponse({ ok: true }));
			return true;
		}

		if (message.type === 'RETURN_TO_PREVIOUS_TAB') {
			readState().then(async (state) => {
				if (state.warning?.previousTabId !== null) {
					await chrome.tabs.update(state.warning.previousTabId, { active: true }).catch(() => {});
				}
				await writeState({ ...state, warning: null, switchesSinceWarning: 0 });
				sendResponse({ ok: true });
			});
			return true;
		}
	});
}

function renderPatternSequence(events) {
	const sequence = events.map((event) => event.to).slice(-8);
	const patternNode = document.getElementById('patternSequence');
	patternNode.textContent = sequence.length ? sequence.join(' → ') : 'No pattern yet';
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
		document.getElementById('patternTitle').textContent = `${latest.from} → ${latest.to}`;
		document.getElementById('patternSummary').textContent = 'These are the tabs Switchboard actually observed switching.';
		renderPatternSequence(recentEvents);
	} else {
		document.getElementById('patternSequence').textContent = 'No pattern yet';
	}

	if (!state.warning) {
		warningView.classList.add('is-hidden');
		patternView.classList.remove('is-hidden');
		return;
	}

	patternView.classList.add('is-hidden');
	warningView.classList.remove('is-hidden');
	document.getElementById('warningTitle').textContent = `You switched tabs ${state.warning.count} times. The latest switch was ${state.warning.from} → ${state.warning.to}.`;
	document.getElementById('warningSummary').textContent = 'This is a measured pattern, not a judgment about why it happened.';
}

function startPopup() {
	chrome.runtime.sendMessage({ type: 'GET_STATE' }, renderPopup);

	document.getElementById('seePatternButton').addEventListener('click', () => {
		chrome.runtime.sendMessage({ type: 'DISMISS_WARNING' }, () => {
			document.getElementById('warningView').classList.add('is-hidden');
			document.getElementById('patternView').classList.remove('is-hidden');
		});
	});

	document.getElementById('continueButton').addEventListener('click', () => {
		chrome.runtime.sendMessage({ type: 'DISMISS_WARNING' }, () => {
			document.getElementById('choiceNote').textContent = 'Continuing. The next notice will appear after six more switches.';
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