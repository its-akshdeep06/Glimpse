import React, { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

// Square image with a circular magnifying lens that follows the cursor.
export default function LensCard({ src, alt, className = '', zoom = 2.6, lens = 150 }) {
  const ref = useRef(null);
  const [pos, setPos] = useState(null);

  const onMove = (e) => {
    if (e.pointerType !== 'mouse') return;
    const r = ref.current.getBoundingClientRect();
    setPos({ x: e.clientX - r.left, y: e.clientY - r.top, w: r.width });
  };

  return (
    <div ref={ref} onPointerMove={onMove} onPointerLeave={() => setPos(null)} className={`relative overflow-hidden ${className}`} data-cursor>
      <img src={src} alt={alt} className="block h-full w-full select-none" draggable={false} />
      <AnimatePresence>
        {pos && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="pointer-events-none absolute rounded-full border-2 border-volt shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
            style={{
              width: lens,
              height: lens,
              left: pos.x - lens / 2,
              top: pos.y - lens / 2,
              backgroundImage: `url("${src}")`,
              backgroundRepeat: 'no-repeat',
              backgroundSize: `${pos.w * zoom}px ${pos.w * zoom}px`,
              backgroundPosition: `${lens / 2 - pos.x * zoom}px ${lens / 2 - pos.y * zoom}px`,
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}