# Roadmap

## Product Foundation

- [x] Define the ritual: Switch -> Notice -> Pause -> Choose.
- [x] Choose Instrument Panel as the primary interface direction.
- [x] Document what activity data can and cannot say.
- [x] Define local persistence and tracking states.

## Smallest Working Version

- [x] Replace the canvas starter with a dashboard shell.
- [x] Show a current switching pattern with named windows and a count.
- [x] Add a non-blocking repeated-switch pause with two user choices.
- [ ] Add a detailed history view.
- [x] Add an unavailable tracking state.

## Interface and Warning Cadence

- [x] Use Cambria with bright, restrained comic-book styling and white choice buttons.
- [x] Show a warning every six switches, restarting the interval when the warning is resolved.

## Local Activity Layer

- [x] Define an activity event shape: tab names, identifiers, timestamp, and source.
- [x] Aggregate recent events into switches and repeated pairs.
- [x] Store history locally with browser extension storage.
- [x] Add a clear-history control.
- [ ] Add a separate permission settings screen.

## Resilience and AI

- [ ] Keep local measurement working when activity access stops.
- [ ] Add optional neutral AI summaries for selected history.
- [ ] Cap normal AI use at nine API calls.
- [ ] Fall back to local data when an API fails.

## Visible Tests

- [x] Fewer than six switches do not interrupt the person.
- [x] The first pause appears on the sixth switch.
- [x] After resolving a pause, five switches do not trigger another; the sixth does.
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