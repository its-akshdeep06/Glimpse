import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

export default function FavoriteButton({ active, onToggle }) {
  const [burst, setBurst] = useState(0);
  return (
    <button
      type="button"
      onClick={() => { if (!active) setBurst((b) => b + 1); onToggle(); }}
      aria-pressed={active}
      aria-label={active ? 'Remove from favorites' : 'Add to favorites'}
      className={`relative flex h-10 w-10 items-center justify-center rounded-full border transition-colors ${active ? 'border-volt-text' : 'border-carbon hover:border-ink'}`}
    >
      <motion.span key={active ? 'on' : 'off'} initial={{ scale: 0.4, rotate: -30 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 500, damping: 14 }}>
        <Star className={`h-4 w-4 ${active ? 'fill-volt-text text-volt-text' : ''}`} />
      </motion.span>
      {burst > 0 && (
        <span key={burst} className="pointer-events-none absolute inset-0">
          {Array.from({ length: 8 }).map((_, i) => {
            const a = (i / 8) * Math.PI * 2;
            return (
              <motion.span
                key={i}
                className="absolute left-1/2 top-1/2 h-1.5 w-1.5 bg-volt-text"
                initial={{ x: -3, y: -3, opacity: 1, scale: 1 }}
                animate={{ x: Math.cos(a) * 24 - 3, y: Math.sin(a) * 24 - 3, opacity: 0, scale: 0.3 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              />
            );
          })}
        </span>
      )}
    </button>
  );
}