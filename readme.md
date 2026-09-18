# Switchboard

Switchboard is a local-first awareness tool for repeated switching between work and distraction. It shows the pattern without judging it. The person decides what the pattern means and what to do next.

The core ritual is **Switch -> Notice -> Pause -> Choose**.

## What It Shows

The Instrument Panel can show active apps or windows, switch times, repeated pairs, counts, and observed time. It cannot know why a switch happened or whether it was useful.

The repeated-switch pause is a suggestion, not a lockout. A person can view the pattern or keep going.

## Privacy and Storage

Activity data is intended to stay on the local device and persist between sessions. The user must be able to pause tracking and clear stored history. AI is optional and may summarize selected measured data, but must not infer intent.

When tracking or an API fails, the interface names the technical problem and preserves locally available history. A technical failure must never look like a detected behavior pattern.

## How to Run Locally

Open `index.html` in a browser, or use a simple local server through VS Code.

## How to Deploy

I use **Netlify** to deploy the project. The GitHub repository is connected to Netlify, so the project can be published as a shareable public link.

## Project Method

This project starts with meaning and boundaries before implementation. Build the smallest visible behavior, test it with real event sequences, and polish only after the meaning is clear. The product constraints are in `docs/systemcharter.md`; implementation steps are in `docs/roadmap.md`.
