import React from 'react';
import { motion } from 'framer-motion';
import { Link2, Mail, Phone, Type, Wifi } from 'lucide-react';
import { QR_TYPES } from '@/utils/validation';

const ICONS = { url: Link2, text: Type, email: Mail, phone: Phone, wifi: Wifi };

export default function TypeSelector({ value, onChange }) {
  return (
    <div>
      <span className="label-caps text-mute">Format</span>
      <div role="radiogroup" aria-label="QR type" className="-mx-1 mt-3 flex flex-wrap gap-1">
        {QR_TYPES.map((t) => {
          const Icon = ICONS[t.id];
          const active = value === t.id;
          return (
            <button
              key={t.id}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(t.id)}
              className={`relative flex items-center gap-2 rounded-full border px-4 py-2.5 label-caps transition-colors ${active ? 'border-volt text-on-volt' : 'border-carbon text-mute hover:border-steel hover:text-ink'}`}
            >
              {active && <motion.span layoutId="type-pill" className="absolute inset-0 rounded-full bg-volt" transition={{ type: 'spring', stiffness: 500, damping: 34 }} />}
              <Icon className="relative h-4 w-4" />
              <span className="relative">{t.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}