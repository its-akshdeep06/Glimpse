import React, { useEffect, useRef } from 'react';
import { animate, useInView } from 'framer-motion';

const pad = (v) => String(Math.round(v)).padStart(2, '0');

export default function LiquidNumber({ value, from = 0, className = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-10% 0px' });

  useEffect(() => {
    if (!inView) return undefined;
    const ctrl = animate(from, value, {
      duration: 2.2,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => { if (ref.current) ref.current.textContent = pad(v); },
    });
    return () => ctrl.stop();
  }, [inView, value, from]);

  return <span ref={ref} className={className}>{pad(from)}</span>;
}