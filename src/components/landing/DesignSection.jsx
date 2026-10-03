import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw } from 'lucide-react';
import QRArt from '@/components/qr/QRArt';
import TiltCard from '@/components/fx/TiltCard';
import CropMarks from '@/components/fx/CropMarks';
import Reveal from '@/components/fx/Reveal';
import Magnetic from '@/components/fx/Magnetic';
import { generateMatrix } from '@/services/qrService';
import { defaultCustomization } from '@/hooks/useQRProject';

const PALETTES = [
  { name: 'Obsidian', fg: '#202124', bg: '#F8F9FB', g: '#5F6368' },
  { name: 'Azure', fg: '#1A73E8', bg: '#F6FAFF', g: '#4285F4' },
  { name: 'Coral', fg: '#C5221F', bg: '#FFF1EF', g: '#EA4335' },
  { name: 'Saffron', fg: '#B45309', bg: '#FFF8E7', g: '#F9AB00' },
  { name: 'Slate', fg: '#3C4043', bg: '#F1F3F4', g: '#5F6368' },
];
const STYLES = ['square', 'rounded', 'dot'];

export default function DesignSection() {
  const matrix = useMemo(() => generateMatrix('https://glimpse01.vercel.app/', 'Q'), []);
  const [p, setP] = useState(1);
  const [style, setStyle] = useState('rounded');
  const [grad, setGrad] = useState(true);
  const [k, setK] = useState(0);
  const pal = PALETTES[p];
  const c = { ...defaultCustomization(), foregroundColor: pal.fg, backgroundColor: pal.bg, gradient: { enabled: grad, type: 'linear', color: pal.g, angle: 135 }, moduleStyle: style, margin: 3 };

  return (
    <section id="design" className="relative border-b border-carbon py-28 md:py-40">
      <div className="relative z-10 mx-auto grid max-w-[1600px] items-center gap-16 px-6 md:px-10 lg:grid-cols-2">
        <div>
          <Reveal>
            <p className="label-caps text-volt-text">02 — Design</p>
            <h2 className="mt-6 font-wide text-[clamp(2.4rem,5.5vw,5.5rem)] font-black uppercase leading-[0.95] tracking-tight">
              Every module,<br /><span className="text-outline">yours.</span>
            </h2>
            <p className="mt-8 max-w-lg text-lg leading-relaxed text-mute">Colour, gradient, geometry, margin, logo and error correction. Change anything and watch the code re-assemble itself, module by module.</p>
          </Reveal>
          <Reveal delay={0.15} className="mt-12 space-y-8">
            <div>
              <p className="label-caps text-mute">Palette</p>
              <div className="mt-3 flex flex-wrap gap-3">
                {PALETTES.map((x, i) => (
                  <button key={x.name} onClick={() => setP(i)} className={`flex items-center gap-3 rounded-full border px-4 py-2 transition-colors ${p === i ? 'border-volt' : 'border-carbon hover:border-steel'}`}>
                    <span className="flex">
                      <span className="h-4 w-4 rounded-full ring-1 ring-carbon" style={{ background: x.bg }} />
                      <span className="-ml-1.5 h-4 w-4 rounded-full ring-1 ring-carbon" style={{ background: x.fg }} />
                    </span>
                    <span className="label-caps">{x.name}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-wrap items-end gap-8">
              <div>
                <p className="label-caps text-mute">Shape</p>
                <div className="mt-3 flex rounded-full border border-carbon p-1">
                  {STYLES.map((s) => (
                    <button key={s} onClick={() => setStyle(s)} className={`relative rounded-full px-4 py-2 label-caps ${style === s ? 'text-on-volt' : 'text-mute hover:text-ink'}`}>
                      {style === s && <motion.span layoutId="demo-shape" className="absolute inset-0 rounded-full bg-volt" transition={{ type: 'spring', stiffness: 500, damping: 35 }} />}
                      <span className="relative">{s}</span>
                    </button>
                  ))}
                </div>
              </div>
              <button onClick={() => setGrad((g) => !g)} className={`rounded-full border px-5 py-3 label-caps transition-colors ${grad ? 'border-volt text-volt-text' : 'border-carbon text-mute'}`}>
                Gradient {grad ? 'on' : 'off'}
              </button>
              <Magnetic>
                <button onClick={() => setK((v) => v + 1)} className="flex items-center gap-2 rounded-full bg-ink px-5 py-3 label-caps text-void">
                  <RotateCcw className="h-4 w-4" /> Reassemble
                </button>
              </Magnetic>
            </div>
          </Reveal>
        </div>
        <Reveal delay={0.1} className="relative mx-auto w-full max-w-[520px]">
          <CropMarks className="-inset-5" />
          <TiltCard>
            <div className="overflow-hidden rounded-[1.25rem]">
              <QRArt matrix={matrix} customization={c} assembleKey={`${style}-${k}`} className="block h-auto w-full" />
            </div>
          </TiltCard>
        </Reveal>
      </div>
    </section>
  );
}