# System Charter

## Intent

Switchboard is a local-first awareness tool for repeated switching between work and distraction. It shows the pattern without judging it, guessing the person's intention, blocking access, or deciding what they should do.

The main ritual is **Switch -> Notice -> Pause -> Choose**.

## Ritual Map

| Stage | What happens | What Switchboard does |
| --- | --- | --- |
| Trigger | The person is working and switches to a distraction. | Observes the active app or window change. |
| Craving moment | The person moves between work and the distraction repeatedly. | Waits for a meaningful repeated pattern. |
| Choice point | The pattern becomes visible. | Shows which windows were involved and how often they changed. |
| Tool intervention | A small pause appears. | Offers reflection as a suggestion, never a command. |
| Outcome | The person returns to work or continues the distraction. | Respects the choice and records the next switch as more pattern data. |
| Next time | Another switching pattern may form. | Makes the history available for later reflection. |

## Product Direction

The primary direction is **Instrument Panel**: calm, factual, and scannable. It should show the current pattern, switch count, windows involved, observed time, and history.

- **Speed Bump:** a brief interruption after repeated switching.
- **Companion:** warmer language and a supportive tone.
- **Instrument Panel:** factual summary and user interpretation.

The visual center remains the Instrument Panel. The interruption is only a small layer over it.

## Signature Interaction

A pause may appear only after a meaningful repeated pattern, such as switching between School Work and Game six times in twenty minutes. It names the measured windows and count, offers the detailed history, and offers a way to keep going.

There are no lockouts, forced timers, shame labels, or productivity scores.

## Measurement Boundary

Switchboard can measure:

- Active app or window name, when available.
- The time of each switch.
- The number of switches between a pair.
- Time observed in each app or window.
- Whether local tracking is active or paused.

Switchboard cannot know why the person switched, whether it was useful, what they should do next, or whether a distraction was intentional.

## Data and Privacy

- Required inputs: browser or desktop activity access, plus optional AI access for neutral summaries.
- Storage: local device memory only by default; no online history by default.
- Retention: persistent between sessions until the user clears it.
- Permission: activity access must be explicit and revocable.
- Tracking states: active, paused, unavailable, and error must be visually distinct.

## AI and Failure Boundary

AI is optional. It may name a neutral pattern or summarize selected, already-measured history. It must not infer intent or diagnose behavior. A normal session should require no more than nine API calls; local aggregation should handle counts, pairs, durations, and persistence.

If an API fails, local history remains available. The interface says the summary service is unavailable and lets the user continue without a forced retry loop.

If tracking fails, the interface says tracking has stopped, stops making current-pattern claims, preserves prior history with its timestamp, and never makes the technical failure look like behavior data.

## Taste Vow

I will make the observation precise and the choice spacious. I will avoid moralizing language, attention-grabbing animation, fake certainty, and unnecessary effects.