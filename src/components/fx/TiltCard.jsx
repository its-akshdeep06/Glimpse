import React, { useRef } from 'react';
import { motion, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion';

// 3D parallax tilt with a moving sheen that follows the pointer.
export default function TiltCard({ children, className = '', max = 10 }) {
  const ref = useRef(null);
  const rx = useSpring(0, { stiffness: 150, damping: 18 });
  const ry = useSpring(0, { stiffness: 150, damping: 18 });
  const gx = useMotionValue(50);
  const gy = useMotionValue(50);
  const sheenOpacity = useSpring(0, { stiffness: 200, damping: 30 });
  const sheen = useMotionTemplate`radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,0.35), transparent 55%)`;

  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    ry.set((px - 0.5) * max * 2);
    rx.set(-(py - 0.5) * max * 2);
    gx.set(px * 100);
    gy.set(py * 100);
    sheenOpacity.set(1);
  };
  const reset = () => { rx.set(0); ry.set(0); sheenOpacity.set(0); };

  return (
    <div className={className} style={{ perspective: 1200 }}>
      <motion.div ref={ref} onPointerMove={onMove} onPointerLeave={reset} style={{ rotateX: rx, rotateY: ry, transformStyle: 'preserve-3d' }} className="relative">
        {children}
        <motion.div className="pointer-events-none absolute inset-0 mix-blend-soft-light" style={{ background: sheen, opacity: sheenOpacity }} />
      </motion.div>
    </div>
  );
}