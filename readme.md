# Switchboard

Switchboard is a local-first awareness tool for repeated switching between work and distraction. It shows the pattern without judging it. The person decides what the pattern means and what to do next.

The core ritual is **Switch -> Notice -> Pause -> Choose**.

## What It Shows

The Instrument Panel can show active apps or windows, switch times, repeated pairs, counts, and observed time. It cannot know why a switch happened or whether it was useful.

The repeated-switch pause is a suggestion, not a lockout. A person can view the pattern or keep going.

## Privacy and Storage

Activity data is intended to stay on the local device and persist between sessions. The user must be able to pause tracking and clear stored history. AI is optional and may summarize selected measured data, but must not infer intent.

When tracking or an API fails, the interface names the technical problem and preserves locally available history. A technical failure must never look like a detected behavior pattern.

## System Design Before Code

### What data does this tool need?

The Chrome extension uses the active tab or window name, a timestamp for each change, the previous and current tab identifiers when available, and a source label such as `browser`. It uses only enough data to describe switching patterns. It does not use page content, keystrokes, messages, or an inferred reason for switching.

### Where is it stored?

The data is stored locally in the browser extension's local storage. It is not sent online by default. The user must be able to clear the stored history.

### Is it temporary or persistent?

The activity history is persistent between sessions until the user clears it. A current warning is temporary and should be dismissed after the user chooses what to do.

### Does the system need memory between sessions?

Yes. Memory between sessions is needed for the history view and for seeing recurring patterns over time. The extension must show when data was last observed and must not present old data as current if tracking has stopped.

### Does the system require AI inference?

No. The core detection does not require AI. Local rules can count tab switches and repeated pairs. AI is optional and may provide a neutral summary of data already measured; it may not infer intent, diagnose behavior, or decide what the user should do.

### How many API calls are realistically required?

Zero API calls are required for the core system. If optional AI summaries are added later, the target is no more than nine API calls in a normal session. Local aggregation should handle switch counts, time windows, persistence, and warnings.

### What happens if the API fails?

The local history remains available. The interface says that the optional summary service is unavailable, shows the last locally known data with its timestamp, and lets the user continue without a forced retry. API failure must look different from a detected switching pattern.

## Prototype Architecture

The extension keeps three responsibilities separate:

- **Input layer:** the service worker in `main.js` receives Chrome tab activation events with the current tab identifier and timestamp.
- **Logic layer:** the service worker stores events, discards events outside the ten-minute window, counts repeated pairs, and triggers a warning after four switches.
- **Output layer:** `Index.html` displays the detected tabs, count, time window, and a visible choice: return to the previous tab or keep going. It never blocks navigation.

The only new file is `manifest.json`, which Chrome requires to load the project as an extension. The existing `Index.html`, `main.js`, and `style.css` provide the popup, processing, and presentation.

## Behavior Integrity Check

Before coding, the design must pass these checks:

- It interrupts only after repeated switching, not after one ordinary tab change.
- It shows the actual tabs involved and the measured count.
- It does not claim to know why the user switched.
- It does not shame, surveil beyond the required tab signal, manipulate, or remove the user's control.
- The warning is an intentional pause, not a punishment or lockout.
- The first version stays minimal: detection, local history, warning, and choice. Extra features wait.

## How to Run Locally

Open `index.html` in a browser, or use a simple local server through VS Code.

## How to Deploy

I use **Netlify** to deploy the project. The GitHub repository is connected to Netlify, so the project can be published as a shareable public link.

## Project Method

This project starts with meaning and boundaries before implementation. Build the smallest visible behavior, test it with real event sequences, and polish only after the meaning is clear. The product constraints are in `docs/systemcharter.md`; implementation steps are in `docs/roadmap.md`.
