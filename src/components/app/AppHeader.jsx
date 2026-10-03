import React from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import LogoMark from '@/components/brand/LogoMark';
import { SECTIONS } from '@/lib/sections';

export default function AppHeader({ section, onNavigate }) {
  const idx = SECTIONS.findIndex((s) => s.id === section);
  return (
    <header className="sticky top-0 z-30 h-16 border-b border-carbon bg-void/80 backdrop-blur-xl">
      <div className="flex h-full items-center justify-between px-5 md:px-8">
        <Link to="/" className="flex items-center gap-3">
          <LogoMark />
          <span className="font-wide font-extrabold tracking-tight">GLIMPSE</span>
        </Link>
        <nav className="hidden h-full items-center lg:flex">
          {SECTIONS.map((s) => (
            <button key={s.id} onClick={() => onNavigate(s.id)} className={`relative flex h-full items-center px-4 label-caps transition-colors ${section === s.id ? 'text-ink' : 'text-mute hover:text-ink'}`}>
              {s.label}
              {section === s.id && <motion.span layoutId="nav-underline" className="absolute inset-x-3 -bottom-px h-[2px] bg-volt" transition={{ type: 'spring', stiffness: 500, damping: 36 }} />}
            </button>
          ))}
        </nav>
        <div className="overflow-hidden label-caps text-mute">
          <AnimatePresence mode="wait">
            <motion.span key={section} className="block tabular-nums" initial={{ y: 14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -14, opacity: 0 }}>
              {String(idx + 1).padStart(2, '0')} / 06<span className="lg:hidden"> — {SECTIONS[idx].label}</span>
            </motion.span>
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}