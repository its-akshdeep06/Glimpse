import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import LiquidNumber from '@/components/fx/LiquidNumber';

const TEXT = "Your links, passwords and phone numbers are encoded right here, inside your browser. No accounts. No servers. No tracking. Close the tab — it's still yours.";
const STATS = [
  { value: 5, from: 0, label: 'QR formats' },
  { value: 0, from: 99, label: 'Servers involved' },
  { value: 20, from: 0, label: 'Recent projects kept' },
  { value: 4, from: 0, label: 'Error-correction levels' },
];

function Word({ children, progress, range }) {
  const opacity = useTransform(progress, range, [0.12, 1]);
  return <motion.span style={{ opacity }} className="mr-[0.25em] inline-block">{children}</motion.span>;
}

export default function PrivacySection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.8', 'end 0.45'] });
  const words = TEXT.split(' ');

  return (
    <section id="privacy" className="border-b border-carbon py-28 md:py-40">
      <div className="mx-auto max-w-[1600px] px-6 md:px-10">
        <p className="label-caps text-volt-text">05 — Privacy</p>
        <p ref={ref} className="mt-10 max-w-6xl font-wide text-[clamp(1.75rem,4.2vw,4rem)] font-extrabold leading-[1.08] tracking-tight">
          {words.map((w, i) => (
            <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>{w}</Word>
          ))}
        </p>
        <div className="mt-24 grid grid-cols-2 border-l border-t border-carbon md:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="border-b border-r border-carbon p-6 md:p-10">
              <LiquidNumber value={s.value} from={s.from} className="font-wide text-[clamp(3rem,7vw,6.5rem)] font-black leading-none tabular-nums" />
              <p className="mt-4 label-caps text-mute">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}