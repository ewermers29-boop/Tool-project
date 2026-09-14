# Copilot Prompts

## Context Block

I am building a reusable Canvas project using plain HTML, CSS, and JavaScript.

The project uses:

- `index.html` for the page and Canvas
- `style.css` for styling
- `main.js` for connecting systems
- `src/canvas/setupCanvas.js` for Canvas setup
- `src/canvas/loop.js` for animation and drawing
- `src/input/input.js` for input
- `src/utils/math.js` for reusable math

The project should remain simple, readable, and use no external libraries.

## Canvas Draw Loop

Help me modify the Canvas animation loop.

Keep the existing file structure and explain exactly what code should change and why.

Do not add unnecessary effects, libraries, or systems.

## Input Mapping

Help me connect one input signal to one parameter.

Explain what the input value represents, where it is stored, and how the loop uses it.

Do not introduce additional controls unless I specifically ask for them.

## Debugging

Help me debug this Canvas system.

Identify the likely problem first, explain why it is happening in plain language, and then give the smallest code change needed to fix it.

Do not rewrite unrelated parts of the project.

## AI Rule

Every AI-generated code response must be followed by my own explanation of what changed and why.