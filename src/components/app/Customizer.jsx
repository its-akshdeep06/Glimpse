import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import HistoryControls from '@/components/app/HistoryControls';
import TemplateSelector from '@/components/app/TemplateSelector';
import AppearanceTab from '@/components/app/customizer/AppearanceTab';
import SizeTab from '@/components/app/customizer/SizeTab';
import QualityTab from '@/components/app/customizer/QualityTab';
import { sampleMatrix } from '@/services/qrService';

const TABS = [
  { id: 'templates', label: 'Templates' },
  { id: 'appearance', label: 'Appearance' },
  { id: 'size', label: 'Size' },
  { id: 'quality', label: 'Quality' },
];

export default function Customizer({ qr, matrix, onDone, notify }) {
  const [tab, setTab] = useState('appearance');
  const c = qr.project.customization;
  const tabProps = { c, update: qr.updateCustomization, commit: qr.commit, notify };
  const done = () => { qr.commit(); onDone(); };

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between gap-3 px-5 pt-1 md:px-8 lg:pt-10">
        <div>
          <p className="label-caps text-mute">03 - Customize</p>
          <h2 className="mt-1 font-wide text-2xl font-extrabold uppercase leading-none">Design lab</h2>
        </div>
        <div className="flex items-center gap-2">
          <HistoryControls canUndo={qr.canUndo} canRedo={qr.canRedo} onUndo={qr.undo} onRedo={qr.redo} />
          <button type="button" onClick={done} className="rounded-full bg-volt px-5 py-2.5 label-caps font-semibold text-on-volt">Done</button>
        </div>
      </div>
      <div className="mt-6 flex gap-1 overflow-x-auto border-b [scrollbar-width:none] [&::-webkit-scrollbar]:hidden border-carbon px-5 md:px-8">
        {TABS.map((t) => (
          <button key={t.id} type="button" onClick={() => setTab(t.id)} className={`relative whitespace-nowrap px-3 py-3 label-caps transition-colors ${tab === t.id ? 'text-ink' : 'text-mute hover:text-ink'}`}>
            {t.label}
            {tab === t.id && <motion.span layoutId="cust-tab" className="absolute inset-x-2 -bottom-px h-[2px] bg-volt" />}
          </button>
        ))}
      </div>
      <div className="px-5 py-8 md:px-8">
        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.22 }}>
            {tab === 'templates' && (
              <TemplateSelector matrix={matrix || sampleMatrix()} customization={c} onApply={(tpl) => { qr.applyTemplate(tpl); notify(`${tpl.name} applied`); }} />
            )}
            {tab === 'appearance' && <AppearanceTab {...tabProps} />}
            {tab === 'size' && <SizeTab {...tabProps} />}
            {tab === 'quality' && <QualityTab {...tabProps} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}