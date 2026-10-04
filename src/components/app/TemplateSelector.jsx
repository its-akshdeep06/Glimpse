import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import LensCard from '@/components/fx/LensCard';
import { buildSVGString, svgDataUrl } from '@/services/qrService';
import { TEMPLATES, applyTemplateTo } from '@/lib/templates';

// Selecting only previews; nothing changes until Apply (one history step).
export default function TemplateSelector({ matrix, customization, onApply, variant = 'compact' }) {
  const [selected, setSelected] = useState(null);
  const gallery = variant === 'gallery';
  const previews = useMemo(() => TEMPLATES.map((t) => ({
    ...t, src: svgDataUrl(buildSVGString(matrix, applyTemplateTo(customization, t), gallery ? 520 : 280)),
  })), [matrix, customization, gallery]);
  const chosen = TEMPLATES.find((t) => t.id === selected);
  const toggle = (id) => setSelected((s) => (s === id ? null : id));

  return (
    <div>
      <div className={`grid ${gallery ? 'grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4' : 'grid-cols-2 gap-3'}`}>
        {previews.map((t, i) => {
          const isSel = selected === t.id;
          return (
            <motion.div
              key={t.id}
              role="button"
              tabIndex={0}
              aria-pressed={isSel}
              onClick={() => toggle(t.id)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(t.id); } }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0, transition: { delay: i * 0.04 } }}
              whileHover={{ y: -4 }}
              className={`relative cursor-pointer border p-3 transition-colors ${isSel ? 'border-volt-text bg-volt/5' : 'border-carbon hover:border-steel'}`}
            >
              {gallery ? <LensCard src={t.src} alt={`${t.name} preset`} className="aspect-square" /> : <img src={t.src} alt={`${t.name} preset`} className="aspect-square w-full" />}
              <div className="mt-3 flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className={`truncate font-wide font-bold uppercase ${gallery ? 'text-lg' : 'text-xs'}`}>{t.name}</p>
                  {gallery && <p className="text-sm text-mute">{t.note}</p>}
                </div>
                {isSel && <Check className="h-4 w-4 shrink-0 text-volt-text" />}
                {!isSel && customization.templateId === t.id && <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.1em] text-volt-text">Applied</span>}
              </div>
            </motion.div>
          );
        })}
      </div>
      <div className={`z-10 mt-6 flex items-center justify-between gap-4 border border-carbon bg-void/90 px-4 py-3 backdrop-blur-xl ${gallery ? 'lg:sticky lg:bottom-6' : 'sticky bottom-3'}`}>
        <p className="text-sm text-mute">{chosen ? <>Previewing <span className="text-ink">{chosen.name}</span></> : 'Select a preset to preview it.'}</p>
        <button type="button" disabled={!chosen} onClick={() => { onApply(chosen); setSelected(null); }} className="rounded-full bg-volt px-6 py-2.5 label-caps font-semibold text-on-volt transition-colors disabled:bg-carbon disabled:text-mute">
          Apply
        </button>
      </div>
    </div>
  );
}