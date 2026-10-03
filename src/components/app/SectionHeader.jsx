import React from 'react';
import { motion } from 'framer-motion';

export default function SectionHeader({ index, title, meta, children }) {
  return (
    <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
      <div>
        <motion.p initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} className="label-caps text-volt-text">{index} — {title}</motion.p>
        <h1 className="mt-4 overflow-hidden font-wide text-[clamp(2.25rem,8vw,7rem)] font-black uppercase leading-[0.9] tracking-[-0.03em]">
          <motion.span className="block" initial={{ y: '100%' }} animate={{ y: 0 }} transition={{ duration: 0.8, ease: [0.2, 0.9, 0.1, 1] }}>{title}</motion.span>
        </h1>
      </div>
      <div className="flex items-center gap-4">
        {meta && <span className="label-caps text-mute">{meta}</span>}
        {children}
      </div>
    </div>
  );
}