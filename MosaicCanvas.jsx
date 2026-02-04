import { useRef, useState } from "react";

const GRID = 32;
const CELL = 15;

export default function MosaicCanvas() {
  const canvasRef = useRef(null);
  const [grid, setGrid] = useState(
    Array(GRID).fill().map(() => Array(GRID).fill(0))
  );

  function draw() {
    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, 480, 480);

    for (let y = 0; y < GRID; y++) {
      for (let x = 0; x < GRID; x++) {
        ctx.strokeRect(x * CELL, y * CELL, CELL, CELL);
        if (grid[y][x] !== 0) {
          ctx.fillStyle = grid[y][x];
          ctx.fillRect(x * CELL, y * CELL, CELL, CELL);
        }
      }
    }
  }

  function handleTouch(e) {
    const rect = canvasRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const x = Math.floor((touch.clientX - rect.left) / CELL);
    const y = Math.floor((touch.clientY - rect.top) / CELL);

    if (x >= 0 && y >= 0 && x < GRID && y < GRID) {
      const newGrid = [...grid];
      newGrid[y][x] = "#ff0000"; // példa szín
      setGrid(newGrid);
      sendPixel(x, y, 1);
    }
  }

  function sendPixel(x, y, color) {
    fetch("/api/pixel", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ x, y, color })
    });
  }

  draw();

  return (
    <canvas
      ref={canvasRef}
      width={480}
      height={480}
      onTouchStart={handleTouch}
    />
  );
}