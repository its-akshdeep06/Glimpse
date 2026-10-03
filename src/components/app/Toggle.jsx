import React from 'react';
import { motion } from 'framer-motion';

export default function Toggle({ checked, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative flex h-7 w-12 shrink-0 items-center rounded-full border px-1 transition-colors ${checked ? 'justify-end border-volt bg-volt' : 'justify-start border-carbon'}`}
    >
      <motion.span layout transition={{ type: 'spring', stiffness: 600, damping: 32 }} className={`h-[18px] w-[18px] rounded-full ${checked ? 'bg-on-volt' : 'bg-ink'}`} />
    </button>
  );
}