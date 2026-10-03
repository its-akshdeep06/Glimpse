import React, { useRef } from 'react';
import { motion, useAnimationFrame, useMotionValue, useScroll, useSpring, useTransform, useVelocity } from 'framer-motion';

const wrap = (min, max, v) => {
  const r = max - min;
  return ((((v - min) % r) + r) % r) + min;
};

// A marquee whose speed and direction respond to scroll velocity.
function VelocityRow({ children, baseVelocity, className }) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smooth = useSpring(velocity, { damping: 50, stiffness: 400 });
  const factor = useTransform(smooth, [0, 1000], [0, 5], { clamp: false });
  const x = useTransform(baseX, (v) => `${wrap(-25, 0, v)}%`);
  const dir = useRef(1);

  useAnimationFrame((_, delta) => {
    let move = dir.current * baseVelocity * (delta / 1000);
    if (factor.get() < 0) dir.current = -1;
    else if (factor.get() > 0) dir.current = 1;
    move += dir.current * move * factor.get();
    baseX.set(baseX.get() + move);
  });

  return (
    <div className="flex overflow-hidden whitespace-nowrap">
      <motion.div className={`flex whitespace-nowrap ${className}`} style={{ x }}>
        {[0, 1, 2, 3].map((i) => <span key={i} className="mr-10 block">{children}</span>)}
      </motion.div>
    </div>
  );
}

const TYPES = 'URL ✦ PLAIN TEXT ✦ EMAIL ✦ PHONE ✦ WI-FI ✦ ';

export default function TypesMarquee() {
  return (
    <section aria-label="Supported formats" className="border-b border-carbon py-10 md:py-14">
      <VelocityRow baseVelocity={-3} className="font-wide text-[clamp(3rem,9vw,8rem)] font-black leading-none tracking-tight">
        <span className="text-outline">{TYPES}</span>
      </VelocityRow>
      <VelocityRow baseVelocity={2} className="mt-4 label-caps text-volt-text">
        {'Validated as you type · Rendered in your browser · Exported as PNG or SVG · Shared as an image only · '.repeat(2)}
      </VelocityRow>
    </section>
  );
}