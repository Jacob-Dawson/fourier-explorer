import type { Point } from "../types";

// Canvas drawing helpers

export function drawGrid(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d")!;
  const { width, height } = canvas;
  ctx.clearRect(0, 0, width, height);

  ctx.strokeStyle = "rgba(34,211,238,0.06)";
  ctx.lineWidth = 1;
  const step = 40;
  for (let x = 0; x <= width; x += step) {

    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
  
  }
  for (let y = 0; y <= height; y += step) {

    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
  
  }

  ctx.strokeStyle = "rgba(34,211,238,0.15)";
  ctx.setLineDash([4, 6]);
  ctx.beginPath(); ctx.moveTo(width / 2, 0); ctx.lineTo(width / 2, height); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(0, height / 2); ctx.lineTo(width, height / 2); ctx.stroke();
  ctx.setLineDash([]);
}

export function drawStroke(canvas: HTMLCanvasElement, pts: Point[]) {
  const ctx = canvas.getContext("2d")!;
  ctx.strokeStyle = "#22d3ee";
  ctx.lineWidth = 2.5;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  ctx.shadowColor = "#22d3ee";
  ctx.shadowBlur = 8;
  ctx.beginPath();
  ctx.moveTo(pts[0].x, pts[0].y);
  for (let i = 1; i < pts.length; i++) {

    ctx.lineTo(pts[i].x, pts[i].y);
    
  }
  ctx.stroke();
  ctx.shadowBlur = 0;
}

export function drawSampleDots(canvas: HTMLCanvasElement, pts: Point[]) {
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "rgba(34,211,238,0.45)";
  pts.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
    ctx.fill();
  });
}