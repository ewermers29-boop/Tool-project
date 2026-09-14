export function setupInput(canvas) {
  const input = {
    mouseX: canvas.width / 2
  };

  canvas.addEventListener('mousemove', (event) => {
    input.mouseX = event.clientX;
  });

  return input;
}