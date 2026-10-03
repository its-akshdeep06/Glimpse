import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import LensCard from '@/components/fx/LensCard';
import Reveal from '@/components/fx/Reveal';
import Magnetic from '@/components/fx/Magnetic';
import { buildSVGString, generateMatrix, svgDataUrl } from '@/services/qrService';
import { TEMPLATES, applyTemplateTo } from '@/lib/templates';
import { defaultCustomization } from '@/hooks/useQRProject';

export default function TemplateBelt() {
  const items = useMemo(() => {
    const m = generateMatrix('https://glimpse01.vercel.app/', 'Q');
    return TEMPLATES.map((t) => ({ ...t, src: svgDataUrl(buildSVGString(m, applyTemplateTo(defaultCustomization(), t), 520)) }));
  }, []);

  return (
    <section id="gallery" className="relative border-b border-carbon py-28 md:py-40">
      <div className="relative z-10 mx-auto flex max-w-[1600px] flex-col gap-6 px-6 md:flex-row md:items-end md:justify-between md:px-10">
        <Reveal>
          <p className="label-caps text-volt-text">03 — Gallery</p>
          <h2 className="mt-6 font-wide text-[clamp(2.4rem,5.5vw,5.5rem)] font-black uppercase leading-[0.95] tracking-tight">
            Pattern<br /><span className="text-outline">gallery.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="max-w-sm text-lg leading-relaxed text-mute">Presets are purely visual — they restyle your code, never your content. Hover to inspect every module.</p>
        </Reveal>
      </div>
      <div className="belt-wrap mt-16 overflow-hidden">
        <div className="belt px-3">
          {[...items, ...items].map((t, i) => (
            <figure key={i} className="mr-6 w-[260px] shrink-0 md:w-[340px]">
              <LensCard src={t.src} alt={`${t.name} preset`} className="aspect-square rounded-[1.25rem]" />
              <figcaption className="mt-4 flex items-baseline justify-between">
                <span className="font-wide text-lg font-bold uppercase">{t.name}</span>
                <span className="label-caps text-steel">{String((i % items.length) + 1).padStart(2, '0')}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
      <div className="mt-16 flex justify-center">
        <Magnetic>
          <Link to="/app?section=templates" className="group flex items-center gap-3 rounded-full border border-carbon px-7 py-4 label-caps transition-colors hover:border-volt hover:bg-volt hover:text-on-volt">
            Explore all presets <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45" />
          </Link>
        </Magnetic>
      </div>
    </section>
  );
}