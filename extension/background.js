const STORAGE_KEY = 'switchboardState';
const WINDOW_MS = 10 * 60 * 1000;
const WARNING_SWITCHES = 4;

const emptyState = { status: 'tracking', events: [], warning: null };

async function readState() {
	const stored = await chrome.storage.local.get(STORAGE_KEY);
	return { ...emptyState, ...(stored[STORAGE_KEY] || {}) };
}

async function writeState(state) {
	await chrome.storage.local.set({ [STORAGE_KEY]: state });
}

function tabName(tab) {
	if (!tab) return 'Unknown tab';
	return tab.title || (tab.url ? new URL(tab.url).hostname : 'Untitled tab');
}

function recentEvents(events, now) {
	return events.filter((event) => now - event.timestamp <= WINDOW_MS);
}

async function recordTabSwitch(tabId) {
	const state = await readState();
	const currentTab = await chrome.tabs.get(tabId);
	const previousTab = state.lastTabId === null || state.lastTabId === undefined
		? null
		: await chrome.tabs.get(state.lastTabId).catch(() => null);

	state.lastTabId = currentTab.id;
	if (!previousTab || previousTab.id === currentTab.id) {
		await writeState(state);
		return;
	}

	const now = Date.now();
	const event = {
		from: tabName(previousTab),
		to: tabName(currentTab),
		fromId: previousTab.id,
		toId: currentTab.id,
		timestamp: now,
		source: 'chrome'
	};
	state.events = recentEvents([...state.events, event], now);

	const pairEvents = state.events.filter((item) => {
		const names = new Set([item.from, item.to, event.from, event.to]);
		return names.size === 2;
	});

	if (pairEvents.length >= WARNING_SWITCHES) {
		const shouldNotify = !state.warning || state.warning.count < pairEvents.length;
		state.warning = {
			from: event.from,
			to: event.to,
			count: pairEvents.length,
			timestamp: now,
			previousTabId: previousTab.id
		};
		if (shouldNotify) {
			chrome.notifications.create({
				type: 'basic',
				iconUrl: 'icon.png',
				title: 'Switchboard noticed a pattern',
				message: `You switched between ${event.from} and ${event.to} ${pairEvents.length} times.`
			});
		}
	}

	await writeState(state);
}

chrome.tabs.onActivated.addListener(({ tabId }) => {
	recordTabSwitch(tabId).catch(async () => {
		const state = await readState();
		await writeState({ ...state, status: 'unavailable' });
	});
});

chrome.runtime.onMessageExternal.addListener((message, sender, sendResponse) => {
	if (message.type === 'GET_STATE') {
		readState().then(sendResponse);
		return true;
	}

	if (message.type === 'CLEAR_HISTORY') {
		writeState({ ...emptyState }).then(() => sendResponse({ ...emptyState }));
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
			if (state.warning?.previousTabId !== undefined) {
				await chrome.tabs.update(state.warning.previousTabId, { active: true }).catch(() => {});
			}
			await writeState({ ...state, warning: null });
			sendResponse({ ok: true });
		});
		return true;
	}
});