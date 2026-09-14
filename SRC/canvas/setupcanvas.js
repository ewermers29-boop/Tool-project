export function setupCanvas(canvas) {
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  resize();

  window.addEventListener('resize', resize);

  return ctx;
}