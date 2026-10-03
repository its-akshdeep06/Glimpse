import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import Reveal from '@/components/fx/Reveal';
import { buildSVGString, generateMatrix, svgDataUrl } from '@/services/qrService';
import { defaultCustomization } from '@/hooks/useQRProject';

const FORMATS = [
  { n: '01', name: 'URL', line: 'Links that open instantly', detail: 'Validated addresses — https:// is added if you forget.', sample: 'https://glimpse01.vercel.app/' },
  { n: '02', name: 'Plain Text', line: 'Notes, codes, anything', detail: 'Up to 1,500 characters of raw text.', sample: 'Hello from Glimpse' },
  { n: '03', name: 'Email', line: 'A message, pre-written', detail: 'Recipient, subject and body in one scan.', sample: 'mailto:hello@example.com' },
  { n: '04', name: 'Phone', line: 'Tap to call', detail: 'International numbers with a leading +.', sample: 'tel:+15550100' },
  { n: '05', name: 'Wi-Fi', line: 'Join without typing', detail: 'WPA, WEP or open networks — hidden SSIDs too.', sample: 'WIFI:T:WPA;S:Studio;P:password123;;' },
];

export default function FormatsSection() {
  const previews = useMemo(() => FORMATS.map((f) => svgDataUrl(buildSVGString(
    generateMatrix(f.sample, 'M'),
    { ...defaultCustomization(), foregroundColor: '#1A73E8', backgroundColor: '#FFFFFF', margin: 1, moduleStyle: 'rounded' },
    160,
  ))), []);

  return (
    <section id="formats" className="relative border-b border-carbon py-28 md:py-40">
      <div className="relative z-10 mx-auto max-w-[1600px] px-6 md:px-10">
        <div className="grid gap-8 md:grid-cols-2 md:items-end">
          <Reveal>
            <p className="label-caps text-volt-text">01 — Formats</p>
            <h2 className="mt-6 font-wide text-[clamp(2.4rem,5.5vw,5.5rem)] font-black uppercase leading-[0.95] tracking-tight">
              Five formats.<br /><span className="text-outline">Nothing extra.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="md:justify-self-end">
            <p className="max-w-md text-lg leading-relaxed text-mute">Each one is validated as you type, so a code only exists when it will actually work.</p>
          </Reveal>
        </div>
        <ul className="mt-20 border-t border-carbon">
          {FORMATS.map((f, i) => (
            <motion.li
              key={f.n}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 0.8, delay: i * 0.06, ease: [0.2, 0.9, 0.1, 1] }}
              className="group relative overflow-hidden border-b border-carbon"
            >
              <span className="absolute inset-0 origin-bottom scale-y-0 bg-volt transition-transform duration-500 ease-&lsqb;cubic-bezier(.2,.9,.1,1)&rsqb; group-hover:scale-y-100" />
              <div className="relative grid grid-cols-[auto_1fr] items-center gap-x-6 gap-y-3 py-8 transition-colors duration-500 group-hover:text-on-volt md:grid-cols-[80px_1fr_1fr_110px] md:gap-10 md:py-10">
                <span className="label-caps text-mute group-hover:text-on-volt">{f.n}</span>
                <h3 className="font-wide text-[clamp(1.75rem,4vw,3.5rem)] font-black uppercase leading-none tracking-tight transition-transform duration-500 group-hover:translate-x-3">{f.name}</h3>
                <div className="col-span-2 md:col-span-1">
                  <p className="text-lg font-medium">{f.line}</p>
                  <p className="mt-1 text-mute group-hover:text-on-volt/70">{f.detail}</p>
                </div>
                <img src={previews[i]} alt="" className="hidden h-24 w-24 justify-self-end rotate-12 scale-50 opacity-0 transition-all duration-500 group-hover:rotate-0 group-hover:scale-100 group-hover:opacity-100 md:block" />
              </div>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}