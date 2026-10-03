import React from 'react';
import { motion } from 'framer-motion';
import QRArt from '@/components/qr/QRArt';
import TiltCard from '@/components/fx/TiltCard';
import CropMarks from '@/components/fx/CropMarks';

export default function PreviewStage({ matrix, customization, assembleKey }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 22 }}
      className="relative w-full max-w-[min(400px,50svh)]"
    >
      <CropMarks className="-inset-4" />
      <div className="pointer-events-none absolute -inset-10 rounded-full bg-volt/10 blur-3xl" />
      <TiltCard max={8}>
        <div className="overflow-hidden rounded-xl shadow-[0_40px_120px_-20px_rgba(0,0,0,0.6)]">
          <QRArt matrix={matrix} customization={customization} assembleKey={assembleKey} className="block h-auto w-full" />
        </div>
      </TiltCard>
    </motion.div>
  );
}