import { setupCanvas } from './src/Canvas/setupcanvas.js';
import { setupInput } from './src/input/input.js';
import { startLoop } from './src/canvas/loop.js';

const canvas = document.getElementById('canvas');

const ctx = setupCanvas(canvas);
const input = setupInput(canvas);

startLoop(ctx, canvas, input);