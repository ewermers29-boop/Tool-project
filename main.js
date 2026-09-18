const STORAGE_KEY = 'switchboardState';
const WINDOW_MS = 10 * 60 * 1000;
const WARNING_SWITCHES = 4;

const emptyState = { status: 'tracking', events: [], warning: null };

function readState() {
	try {
		const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
		return { ...emptyState, ...stored };
	} catch {
		return { ...emptyState };
	}
}

function writeState(state) {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function keepRecentEvents(events, now) {
	return events.filter((event) => now - event.timestamp <= WINDOW_MS);
}

function recordSwitch(from, to) {
	const state = readState();
	const now = Date.now();
	const event = { from, to, timestamp: now };
	state.events = keepRecentEvents([...state.events, event], now);

	const pairEvents = state.events.filter((item) => {
		const names = new Set([item.from, item.to, event.from, event.to]);
		return names.size === 2;
	});

	if (pairEvents.length >= WARNING_SWITCHES) {
		state.warning = { from, to, count: pairEvents.length, timestamp: now };
	}

	writeState(state);
}

function renderPage(state) {
	const recentEvents = keepRecentEvents(state.events, Date.now());
	const latest = recentEvents[recentEvents.length - 1];
	const warningView = document.getElementById('warningView');
	const patternView = document.getElementById('patternView');

	document.getElementById('trackingState').textContent = 'Tracking locally';
	document.getElementById('switchCount').textContent = recentEvents.length;
	document.getElementById('historySummary').textContent = `Local history: ${state.events.length} switches`;

	if (latest) {
		document.getElementById('patternTitle').textContent = `${latest.from} <-> ${latest.to}`;
		document.getElementById('patternSummary').textContent = 'These are the labels you entered for observed switches.';
	}

	if (!state.warning) {
		warningView.classList.add('is-hidden');
		patternView.classList.remove('is-hidden');
		return;
	}

	patternView.classList.add('is-hidden');
	warningView.classList.remove('is-hidden');
	document.getElementById('warningTitle').textContent = `You switched between ${state.warning.from} and ${state.warning.to} ${state.warning.count} times.`;
}

function dismissWarning() {
	const state = readState();
	writeState({ ...state, warning: null });
	renderPage(readState());
}

document.getElementById('recordButton').addEventListener('click', () => {
	const from = document.getElementById('fromInput').value.trim();
	const to = document.getElementById('toInput').value.trim();
	if (!from || !to || from === to) return;
	recordSwitch(from, to);
	renderPage(readState());
});

document.getElementById('continueButton').addEventListener('click', () => {
	document.getElementById('choiceNote').textContent = 'Continuing. The next switch will remain part of the local pattern.';
	dismissWarning();
});

document.getElementById('returnButton').addEventListener('click', dismissWarning);

document.getElementById('clearButton').addEventListener('click', () => {
	writeState({ ...emptyState });
	renderPage(readState());
});

renderPage(readState());