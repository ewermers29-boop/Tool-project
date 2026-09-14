export function startLoop(ctx, canvas, input) {
  let pulse = 0;

  function frame() {
    pulse += 0.04;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    const radiusFromMouse = (input.mouseX / canvas.width) * 100;
    const radius = radiusFromMouse + Math.sin(pulse) * 10;

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);

    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.stroke();

    requestAnimationFrame(frame);
  }

  frame();
}