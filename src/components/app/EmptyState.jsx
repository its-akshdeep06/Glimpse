import React from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';

const PATTERN = [1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1];

export default function EmptyState({ title, text, actionLabel, onAction }) {
  return (
    <div className="mt-12 flex flex-col items-center border border-dashed border-carbon px-6 py-20 text-center">
      <div className="grid grid-cols-5 gap-1.5" aria-hidden="true">
        {PATTERN.map((on, i) => (
          <motion.span
            key={i}
            className={`h-3.5 w-3.5 ${on ? 'bg-volt' : 'bg-carbon'}`}
            animate={{ opacity: on ? [0.15, 1, 0.15] : 0.5 }}
            transition={{ duration: 2.4, repeat: Infinity, delay: ((i % 5) + Math.floor(i / 5)) * 0.1 }}
          />
        ))}
      </div>
      <h2 className="mt-8 font-wide text-2xl font-extrabold uppercase">{title}</h2>
      <p className="mt-3 max-w-sm text-mute">{text}</p>
      {onAction && (
        <button type="button" onClick={onAction} className="mt-8 flex items-center gap-2 rounded-full bg-volt px-6 py-3 label-caps font-semibold text-on-volt transition-transform hover:scale-105">
          <Plus className="h-4 w-4" /> {actionLabel}
        </button>
      )}
    </div>
  );
}