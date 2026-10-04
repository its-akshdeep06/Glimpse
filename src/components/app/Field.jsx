import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export default function Field({ label, hint = '', error = null, children, asDiv = false }) {
  const Root = asDiv ? 'div' : 'label';
  return (
    <Root className="group block">
      <span className="flex items-baseline justify-between gap-3">
        <span className="label-caps text-mute transition-colors group-focus-within:text-volt-text">{label}</span>
        {hint && <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-steel">{hint}</span>}
      </span>
      {children}
      <AnimatePresence initial={false}>
        {error && (
          <motion.span
            key={error}
            role="alert"
            className="mt-2 block text-sm text-[#FF6B5B]"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto', x: [0, -6, 6, -3, 0] }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35 }}
          >
            {error}
          </motion.span>
        )}
      </AnimatePresence>
    </Root>
  );
}