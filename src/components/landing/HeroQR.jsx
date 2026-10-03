import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import QRArt from '@/components/qr/QRArt';
import TiltCard from '@/components/fx/TiltCard';
import CropMarks from '@/components/fx/CropMarks';
import { generateMatrix } from '@/services/qrService';
import { TEMPLATES, applyTemplateTo } from '@/lib/templates';
import { defaultCustomization } from '@/hooks/useQRProject';

function HeroQR() {
  const matrix = useMemo(() => generateMatrix('https://glimpse01.vercel.app/', 'Q'), []);
  const [i, setI] = useState(1);

  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % TEMPLATES.length), 3800);
    return () => clearInterval(t);
  }, []);

  const tpl = TEMPLATES[i];
  const c = applyTemplateTo(defaultCustomization(), tpl);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, rotate: -4 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{ duration: 1.4, delay: 0.4, ease: [0.2, 0.9, 0.1, 1] }}
      className="relative mx-auto w-full max-w-[440px]"
    >
      <CropMarks className="-inset-5" />
      <TiltCard max={12}>
        <div className="overflow-hidden rounded-[1.25rem] shadow-[0_60px_120px_-30px_rgba(66,133,244,0.25)]">
          <QRArt matrix={matrix} customization={c} assembleKey={tpl.id} className="block h-auto w-full" />
        </div>
      </TiltCard>
      <div className="mt-8 flex items-center justify-between label-caps text-mute">
        <span className="flex items-center gap-2">
          Preset /
          <AnimatePresence mode="wait">
            <motion.span key={tpl.id} className="text-ink" initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -10, opacity: 0 }}>
              {tpl.name}
            </motion.span>
          </AnimatePresence>
        </span>
        <span className="tabular-nums">{String(i + 1).padStart(2, '0')} / {String(TEMPLATES.length).padStart(2, '0')}</span>
      </div>
    </motion.div>
  );
}
export default HeroQR;