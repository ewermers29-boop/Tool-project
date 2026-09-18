# Copilot Prompts

## Product Context

I am building Switchboard, a local-first Instrument Panel for repeated switching between work and distraction.

The ritual is: Switch -> Notice -> Pause -> Choose.

Show which windows or apps were active, when they changed, how often a pair repeated, and how long each was observed. Do not infer why the person switched, label the behavior, block access, or decide for the person.

The signature moment is a non-blocking repeated-switch pause. It appears only after a meaningful pattern and offers a suggestion, not a command.

## Data Rules

- Keep activity history on the local device by default.
- Treat persistence as intentional and provide a clear way to clear it.
- Distinguish active, paused, unavailable, and error tracking states.
- If tracking stops, say tracking stopped; never present stale data as current.
- Prefer local aggregation over network requests.
- Normal AI use must stay at nine API calls or fewer.
- AI may summarize measured data but may not infer intent or diagnose the user.
- If an API fails, preserve local history and show a calm error state.

## Behavior Change

Identify the controlling code path first. State one falsifiable hypothesis and one cheap test. Keep the change local, preserve the measurement boundary, and explain what changed and what was deliberately left unchanged.

## AI Rule

Every AI-generated code response must be followed by a plain-language explanation of what changed, why it supports the ritual, and what was not changed.
