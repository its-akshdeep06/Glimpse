import React, { useEffect, useState } from 'react';
// motion import removed; no animation needed

export default function HeroReadout() {
  const [p, setP] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const h = (e) => setP({ x: Math.round(e.clientX), y: Math.round(e.clientY) });
    window.addEventListener('pointermove', h);
    return () => window.removeEventListener('pointermove', h);
  }, []);

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 mx-auto flex max-w-[1600px] items-end justify-between px-6 pb-8 md:px-10">
      <p className="hidden label-caps tabular-nums text-steel md:block">
        X {String(p.x).padStart(4, '0')} · Y {String(p.y).padStart(4, '0')} · Grid 36
      </p>
      <div className="flex items-center gap-3 label-caps text-mute">
        Scroll
        <span className="relative h-10 w-px overflow-hidden bg-carbon">
          <span className="absolute inset-x-0 top-0 h-1/2 bg-volt" />
        </span>
      </div>
    </div>
  );
}