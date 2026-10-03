import React, { useEffect, useRef } from 'react';

// Canvas "grid of life": cells light up like QR modules along the cursor's path.
export default function GridField({ className = '', cell = 36 }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    let w = 0; let h = 0; let cols = 0; let rows = 0; let heat = new Float32Array(0); let raf = 0;
    let mouse = { x: -999, y: -999 };

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      w = r.width; h = r.height;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(w / cell); rows = Math.ceil(h / cell);
      heat = new Float32Array(cols * rows);
    };
    const onMove = (e) => {
      const r = canvas.getBoundingClientRect();
      mouse = { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      const mc = Math.floor(mouse.x / cell);
      const mr = Math.floor(mouse.y / cell);
      for (let dy = -2; dy <= 2; dy++) {
        for (let dx = -2; dx <= 2; dx++) {
          const cx = mc + dx; const cy = mr + dy;
          if (cx < 0 || cy < 0 || cx >= cols || cy >= rows) continue;
          const d = Math.hypot(dx, dy);
          if (d <= 2.2) heat[cy * cols + cx] = Math.max(heat[cy * cols + cx], 1 - d / 2.6);
        }
      }
      if (heat.length && Math.random() < 0.3) heat[Math.floor(Math.random() * heat.length)] = 0.45;
      const inset = cell * 0.2;
      for (let i = 0; i < heat.length; i++) {
        const v = heat[i];
        if (v < 0.01) continue;
        heat[i] = v * 0.95;
        ctx.fillStyle = `rgba(66,133,244,${v * 0.5})`;
        ctx.fillRect((i % cols) * cell + inset, Math.floor(i / cols) * cell + inset, cell - inset * 2, cell - inset * 2);
      }
      ctx.strokeStyle = 'rgba(240,240,242,0.05)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = 0; x <= w; x += cell) { ctx.moveTo(x + 0.5, 0); ctx.lineTo(x + 0.5, h); }
      for (let y = 0; y <= h; y += cell) { ctx.moveTo(0, y + 0.5); ctx.lineTo(w, y + 0.5); }
      ctx.stroke();
      raf = requestAnimationFrame(tick);
    };

    resize();
    tick();
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', onMove);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onMove);
    };
  }, [cell]);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}