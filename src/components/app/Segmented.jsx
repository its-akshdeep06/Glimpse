import React, { useId } from 'react';
import { motion } from 'framer-motion';

export default function Segmented({ options, value, onChange }) {
  const id = useId();
  return (
    <div role="radiogroup" className="relative flex rounded-full border border-carbon p-1">
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(o.value)}
            className={`relative flex-1 whitespace-nowrap rounded-full px-3 py-2 label-caps transition-colors ${active ? 'text-on-volt' : 'text-mute hover:text-ink'}`}
          >
            {active && <motion.span layoutId={`seg-${id}`} className="absolute inset-0 rounded-full bg-volt" transition={{ type: 'spring', stiffness: 500, damping: 35 }} />}
            <span className="relative">{o.label}</span>
          </button>
        );
      })}
    </div>
  );
}