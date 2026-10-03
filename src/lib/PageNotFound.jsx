import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import LogoMark from '@/components/brand/LogoMark';
import Magnetic from '@/components/fx/Magnetic';

export default function PageNotFound() {
  const path = useLocation().pathname || '/';

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-void px-6 text-ink">
      <div className="pointer-events-none absolute inset-0 grid-lines opacity-60 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.2, 0.9, 0.1, 1] }}
        className="relative z-10 w-full max-w-xl text-center"
      >
        <Link to="/" className="inline-flex items-center gap-3">
          <LogoMark />
          <span className="font-wide text-lg font-extrabold tracking-tight">GLIMPSE</span>
        </Link>
        <p className="mt-10 font-wide text-[clamp(7rem,28vw,16rem)] font-black leading-[0.8] tracking-[-0.04em] text-outline">404</p>
        <h1 className="mt-4 font-wide text-2xl font-extrabold uppercase tracking-tight md:text-3xl">Signal lost</h1>
        <p className="mx-auto mt-4 max-w-md text-lg leading-relaxed text-mute">
          The path <span className="font-mono text-ink">{path}</span> isn't part of this atelier. Every code here is encoded in your browser — this one just didn't resolve.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link to="/" className="inline-flex items-center gap-2 rounded-full border border-carbon px-5 py-3 label-caps transition-colors hover:border-ink">
            <ArrowLeft className="h-4 w-4" /> Back to home
          </Link>
          <Magnetic>
            <Link to="/app" className="group inline-flex items-center gap-2 rounded-full bg-volt px-6 py-3 label-caps font-semibold text-on-volt">
              Open atelier <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45" />
            </Link>
          </Magnetic>
        </div>
      </motion.div>
    </div>
  );
}