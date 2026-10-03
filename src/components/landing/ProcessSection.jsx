import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Image } from '@/components/ui/image';
import Reveal from '@/components/fx/Reveal';

const GEARS = 'https://media.base44.com/images/public/6aba836498fb6f1d61ad6917/647dec71e_generated_f5da170f.jpg';

const STEPS = [
  { n: '01', t: 'Encode', d: 'Pick one of five formats and type. Validation happens as you go, and nothing generates until the data is right.' },
  { n: '02', t: 'Design', d: 'Colour, gradient, geometry, margin, logo and error correction — or start from a preset. Every change is one undo away.' },
  { n: '03', t: 'Export', d: 'Download crisp PNG or SVG, share the image natively, and find every export again in your history.' },
];

export default function ProcessSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const scale = useTransform(scrollYProgress, [0, 1], [1.3, 1]);
  const rotate = useTransform(scrollYProgress, [0, 1], [-4, 4]);

  return (
    <section ref={ref} className="relative border-b border-carbon py-28 md:py-40">
      <div className="relative z-10 mx-auto grid max-w-[1600px] gap-16 px-6 md:px-10 lg:grid-cols-2">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="label-caps text-volt-text">04 — Process</p>
          <h2 className="mt-6 font-wide text-[clamp(2.4rem,5.5vw,5.5rem)] font-black uppercase leading-[0.95] tracking-tight">
            Three moves.<br /><span className="text-outline">Zero friction.</span>
          </h2>
          <div className="relative mt-10 aspect-[4/5] max-h-[60svh] overflow-hidden rounded-[1.5rem]">
            <motion.div style={{ scale, rotate }} className="absolute inset-0">
              <Image src={GEARS} alt="Macro photograph of precision watch gears" className="h-full w-full" />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-t from-void/80 via-transparent to-transparent" />
            <span className="absolute bottom-5 left-5 label-caps text-ink/80">Fig. 04 — Precision</span>
          </div>
        </div>
        <div className="flex flex-col">
          {STEPS.map((s) => (
            <Reveal key={s.n} className="flex min-h-[46svh] flex-col justify-center border-b border-carbon py-12 last:border-b-0">
              <span className="font-wide text-[clamp(4rem,10vw,9rem)] font-black leading-none text-outline">{s.n}</span>
              <h3 className="mt-6 font-wide text-4xl font-extrabold uppercase tracking-tight">{s.t}</h3>
              <p className="mt-4 max-w-md text-lg leading-relaxed text-mute">{s.d}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}