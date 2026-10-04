import React, { useEffect, useRef } from 'react';

// Canvas "grid of life": cells light up like QR modules along the cursor's path.
export default function GridField({ className = '', cell = 36 }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext('2d');
    const gridCanvas = document.createElement('canvas');
    const gridCtx = gridCanvas.getContext('2d');
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    let w = 0; let h = 0; let cols = 0; let rows = 0; let heat = new Float32Array(0); let targetHeat = new Float32Array(0); let raf = 0; let hasHeat = false;

    const resize = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      const r = canvas.getBoundingClientRect();
      w = r.width; h = r.height;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      gridCanvas.width = canvas.width; gridCanvas.height = canvas.height;
      gridCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(w / cell); rows = Math.ceil(h / cell);
      heat = new Float32Array(cols * rows);
      targetHeat = new Float32Array(cols * rows);
      hasHeat = false;

      gridCtx.clearRect(0, 0, w, h);
      gridCtx.strokeStyle = 'rgba(240,240,242,0.05)';
      gridCtx.lineWidth = 1;
      gridCtx.beginPath();
      for (let x = 0; x <= w; x += cell) { gridCtx.moveTo(x + 0.5, 0); gridCtx.lineTo(x + 0.5, h); }
      for (let y = 0; y <= h; y += cell) { gridCtx.moveTo(0, y + 0.5); gridCtx.lineTo(w, y + 0.5); }
      gridCtx.stroke();

      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(gridCanvas, 0, 0, w, h);
    };
    const onMove = (e) => {
      const r = canvas.getBoundingClientRect();
      targetHeat.fill(0);
      const mc = Math.floor((e.clientX - r.left) / cell);
      const mr = Math.floor((e.clientY - r.top) / cell);
      let hasTarget = false;
      for (let dy = -2; dy <= 2; dy++) {
        for (let dx = -2; dx <= 2; dx++) {
          const cx = mc + dx; const cy = mr + dy;
          if (cx < 0 || cy < 0 || cx >= cols || cy >= rows) continue;
          const d = Math.hypot(dx, dy);
          if (d <= 2.2) {
            targetHeat[cy * cols + cx] = Math.max(targetHeat[cy * cols + cx], 1 - d / 2.6);
            hasTarget = true;
          }
        }
      }
      if ((hasTarget || hasHeat) && !raf) raf = requestAnimationFrame(tick);
    };
    const tick = () => {
      raf = 0;
      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(gridCanvas, 0, 0, w, h);

      const inset = cell * 0.2;
      let fadingHeat = false;
      hasHeat = false;
      for (let i = 0; i < heat.length; i++) {
        const target = targetHeat[i];
        const v = (target > 0 ? Math.max(heat[i], target) : heat[i]) * 0.95;
        heat[i] = v < 0.01 ? 0 : v;
        if (heat[i] === 0) continue;
        hasHeat = true;
        if (target === 0) fadingHeat = true;
        ctx.fillStyle = `rgba(66,133,244,${heat[i] * 0.5})`;
        ctx.fillRect((i % cols) * cell + inset, Math.floor(i / cols) * cell + inset, cell - inset * 2, cell - inset * 2);
      }
      if (fadingHeat) raf = requestAnimationFrame(tick);
    };

    resize();
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