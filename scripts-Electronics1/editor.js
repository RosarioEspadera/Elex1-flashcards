function addText() {
  const text = prompt("Enter text to add:");
  if (text) {
    ctx.font = "16px Arial";
    ctx.fillStyle = "black";
    ctx.fillText(text, 50, 50);
  }
}

function highlight() {
  ctx.fillStyle = "rgba(255, 255, 0, 0.5)";
  ctx.fillRect(50, 50, 200, 30);
}
