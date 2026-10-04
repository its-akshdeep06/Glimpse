import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { SECTIONS } from '@/lib/sections';

export default function OrbitNav({ section, onNavigate }) {
  const [open, setOpen] = useState(false);
  const current = SECTIONS.find((item) => item.id === section);
  const CurrentIcon = current.icon;

  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (event) => event.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open]);

  return (
    <>
      <AnimatePresence>
        {open && <motion.div className="fixed inset-0 z-40 bg-void/60 backdrop-blur-none sm:backdrop-blur-[3px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} />}
      </AnimatePresence>
      <div className="fixed bottom-6 right-6 z-50 lg:hidden">
        <div className="relative h-16 w-16">
          {SECTIONS.map((item, index) => {
            const x = open ? -120 : 0;
            const y = open ? -(56 + index * 52) : 0;
            const Icon = item.icon;
            const active = item.id === section;
            return (
              <motion.button
                key={item.id}
                aria-label={item.label}
                aria-current={active ? 'page' : undefined}
                tabIndex={open ? 0 : -1}
                onClick={() => { setOpen(false); onNavigate(item.id); }}
                initial={false}
                animate={open ? { x, y, scale: 1, opacity: 1 } : { x: 0, y: 0, scale: 0.3, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 420, damping: 26, delay: open ? index * 0.035 : 0 }}
                className={`absolute left-2 top-2 flex items-center ${open ? 'h-11 w-44 justify-start gap-3 rounded-full px-3 border border-carbon bg-panel text-ink shadow-lg transition-colors hover:bg-volt hover:text-on-volt active:bg-volt active:text-on-volt' : `h-12 w-12 justify-center rounded-full ${active ? 'bg-volt text-on-volt' : 'glass text-ink'}`} ${open ? '' : 'pointer-events-none'}`}
              >
                <Icon className="h-5 w-5" />
                <span className={`pointer-events-none ${open ? 'relative whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.1em]' : 'sr-only'}`}>{item.label}</span>
              </motion.button>
            );
          })}
          <motion.button
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-label={open ? 'Close navigation' : 'Open navigation'}
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.06 }}
            className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-volt text-on-volt shadow-[0_12px_40px_rgba(66,133,244,0.35)]"
          >
            {!open && <span className="absolute inset-0 animate-ping rounded-full bg-volt opacity-20" />}
            <AnimatePresence mode="wait" initial={false}>
              <motion.span key={open ? 'close' : section} initial={{ rotate: -90, opacity: 0, scale: 0.5 }} animate={{ rotate: 0, opacity: 1, scale: 1 }} exit={{ rotate: 90, opacity: 0, scale: 0.5 }} transition={{ duration: 0.2 }}>
                {open ? <X className="h-6 w-6" /> : <CurrentIcon className="h-6 w-6" />}
              </motion.span>
            </AnimatePresence>
          </motion.button>
        </div>
      </div>
    </>
  );
}