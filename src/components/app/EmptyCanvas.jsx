import React from 'react';
import { motion } from 'framer-motion';
import CropMarks from '@/components/fx/CropMarks';

export default function EmptyCanvas() {
  return (
    <div className="relative aspect-square w-full max-w-[min(420px,52svh)]">
      <CropMarks className="inset-0" />
      <div className="absolute inset-8 grid grid-cols-7 grid-rows-7 gap-1.5">
        {Array.from({ length: 49 }).map((_, i) => (
          <motion.span
            key={i}
            className="bg-carbon"
            animate={{ opacity: [0.25, 1, 0.25] }}
            transition={{ duration: 2.6, repeat: Infinity, delay: ((i % 7) + Math.floor(i / 7)) * 0.12 }}
          />
        ))}
      </div>
      <motion.div
        className="absolute inset-x-8 h-px bg-volt shadow-[0_0_24px_rgba(66,133,244,0.9)]"
        animate={{ top: ['10%', '90%', '10%'] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <p className="bg-void px-3 py-1 label-caps">No signal</p>
        <p className="mt-2 max-w-[15rem] bg-void/85 px-3 py-1 text-sm text-mute">Enter valid content and your code assembles here.</p>
      </div>
    </div>
  );
}