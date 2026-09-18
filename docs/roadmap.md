# Roadmap

## Product Foundation

- [x] Define the ritual: Switch -> Notice -> Pause -> Choose.
- [x] Choose Instrument Panel as the primary interface direction.
- [x] Document what activity data can and cannot say.
- [x] Define local persistence and tracking states.

## Smallest Working Version

- [ ] Replace the canvas starter with a dashboard shell.
- [ ] Show a current switching pattern with named windows and a count.
- [ ] Add a non-blocking repeated-switch pause with two user choices.
- [ ] Add a detailed history view.
- [ ] Add explicit paused, unavailable, and error tracking states.

## Local Activity Layer

- [ ] Define an activity event shape: window name, timestamp, and source.
- [ ] Aggregate consecutive events into switches and repeated pairs.
- [ ] Store history locally with a versioned schema.
- [ ] Add permission and clear-history controls.

## Resilience and AI

- [ ] Keep local measurement working when activity access stops.
- [ ] Add optional neutral AI summaries for selected history.
- [ ] Cap normal AI use at nine API calls.
- [ ] Fall back to local data when an API fails.

## Visible Tests

- [ ] One switch does not interrupt the person.
- [ ] Repeated work/distraction switches surface the pause.
- [ ] The pause names the actual windows and count.
- [ ] Either choice leaves the person in control.
- [ ] History survives reload and can be cleared.
- [ ] Technical states are distinct from behavior states.

## Release

- [ ] Test desktop and mobile layouts.
- [ ] Review language for judgment or implied intent.
- [ ] Capture a screenshot after each completed roadmap step.
- [ ] Deploy only after the local-only flow is reliable.