import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import GridField from '@/components/fx/GridField';
import SplitText from '@/components/fx/SplitText';
import Magnetic from '@/components/fx/Magnetic';
import HeroQR from '@/components/landing/HeroQR';
import HeroReadout from '@/components/landing/HeroReadout';

export default function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-[100svh] overflow-hidden border-b border-carbon">
      <GridField className="absolute inset-0 h-full w-full" />
      <motion.div style={{ opacity: fade }} className="relative z-10 mx-auto grid min-h-[100svh] max-w-[1600px] grid-cols-1 items-center gap-16 px-6 pb-28 pt-32 md:px-10 lg:grid-cols-[1.3fr_1fr]">
        <div>
          <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.8 }} className="flex items-center gap-3 label-caps text-mute">
            <span className="relative flex h-2 w-2"><span className="absolute inset-0 animate-ping rounded-full bg-volt opacity-70" /><span className="relative h-2 w-2 rounded-full bg-volt" /></span>
            QR atelier · runs entirely in your browser
          </motion.p>
          <h1 className="mt-8 font-wide text-[clamp(2.4rem,6.6vw,7rem)] font-black uppercase leading-[0.9] tracking-[-0.03em]">
            <SplitText text="Encode" className="block" />
            <span className="block">
              <SplitText text="anything" delay={0.25} />
              <motion.span className="inline-block text-volt" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.9, type: 'spring', stiffness: 300, damping: 12 }}>.</motion.span>
            </span>
          </h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.9 }} className="mt-8 max-w-xl text-lg leading-relaxed text-mute">
            A precision instrument for QR codes. Five formats, total visual control, a full undo history and nothing ever leaves your device!
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.85, duration: 0.9 }} className="mt-10 flex flex-wrap items-center gap-6">
            <Magnetic>
              <Link to="/app" className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-volt px-8 py-4 label-caps font-semibold text-on-volt">
                <span className="relative z-10">Get started</span>
                <ArrowRight className="relative z-10 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/60 to-transparent group-hover:animate-[sheen_0.9s_ease]" />
              </Link>
            </Magnetic>
            <a href="#gallery" className="label-caps text-mute underline decoration-carbon underline-offset-8 transition-colors hover:text-ink hover:decoration-volt">Browse presets</a>
          </motion.div>
        </div>
        <HeroQR />
      </motion.div>
      <HeroReadout />
    </section>
  );
}