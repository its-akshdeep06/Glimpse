import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { SECTIONS } from '@/lib/sections';

const RADIUS = 154;

// "Fixed orbit" hub: expands into a radial array of the six sections.
export default function OrbitNav({ section, onNavigate }) {
  const [open, setOpen] = useState(false);
  const current = SECTIONS.find((s) => s.id === section);
  const Icon = current.icon;

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <>
      <AnimatePresence>
        {open && <motion.div className="fixed inset-0 z-40 bg-void/60 backdrop-blur-[3px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} />}
      </AnimatePresence>
      <div className="fixed bottom-6 right-6 z-50 lg:hidden">
        <div className="relative h-16 w-16">
          {SECTIONS.map((s, i) => {
            const a = Math.PI - (i * Math.PI / 2) / (SECTIONS.length - 1);
            const x = Math.cos(a) * RADIUS;
            const y = -Math.sin(a) * RADIUS * 0.95;
            const SIcon = s.icon;
            const active = s.id === section;
            return (
              <motion.button
                key={s.id}
                aria-label={s.label}
                tabIndex={open ? 0 : -1}
                onClick={() => { setOpen(false); onNavigate(s.id); }}
                initial={false}
                animate={open ? { x, y, scale: 1, opacity: 1 } : { x: 0, y: 0, scale: 0.3, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 420, damping: 26, delay: open ? i * 0.035 : 0 }}
                className={`absolute left-2 top-2 flex h-12 w-12 items-center justify-center rounded-full ${active ? 'bg-volt text-on-volt' : 'glass text-ink'} ${open ? '' : 'pointer-events-none'}`}
              >
                <SIcon className="h-5 w-5" />
                <span className="pointer-events-none absolute top-full mt-1.5 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.1em] text-ink">{s.label}</span>
              </motion.button>
            );
          })}
          <motion.button
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-label={open ? 'Close navigation' : 'Open navigation'}
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.06 }}
            className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-volt text-on-volt shadow-[0_12px_40px_rgba(66,133,244,0.35)]"
          >
            {!open && <span className="absolute inset-0 animate-ping rounded-full bg-volt opacity-20" />}
            <AnimatePresence mode="wait" initial={false}>
              <motion.span key={open ? 'x' : section} initial={{ rotate: -90, opacity: 0, scale: 0.5 }} animate={{ rotate: 0, opacity: 1, scale: 1 }} exit={{ rotate: 90, opacity: 0, scale: 0.5 }} transition={{ duration: 0.2 }}>
                {open ? <X className="h-6 w-6" /> : <Icon className="h-6 w-6" />}
              </motion.span>
            </AnimatePresence>
          </motion.button>
        </div>
      </div>
    </>
  );
}