import React from 'react';
import { motion } from 'framer-motion';

export default function SplitText({ text, className = '', delay = 0, stagger = 0.04 }) {
  return (
    <span className={className} aria-label={text}>
      {text.split('').map((ch, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.08em] align-bottom" aria-hidden="true">
          <motion.span
            className="inline-block"
            initial={{ y: '115%', rotate: 8 }}
            animate={{ y: '0%', rotate: 0 }}
            transition={{ delay: delay + i * stagger, duration: 1, ease: [0.2, 0.9, 0.1, 1] }}
          >
            {ch === ' ' ? '\u00A0' : ch}
          </motion.span>
        </span>
      ))}
    </span>
  );
}