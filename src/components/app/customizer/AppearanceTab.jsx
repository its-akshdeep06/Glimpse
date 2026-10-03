import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import ColorField from '@/components/app/customizer/ColorField';
import RangeField from '@/components/app/customizer/RangeField';
import Segmented from '@/components/app/Segmented';
import Toggle from '@/components/app/Toggle';

const STYLES = [{ value: 'square', label: 'Square' }, { value: 'rounded', label: 'Rounded' }, { value: 'dot', label: 'Dot' }];
const GRADIENTS = [{ value: 'linear', label: 'Linear' }, { value: 'radial', label: 'Radial' }];

export default function AppearanceTab({ c, update, commit }) {
  const g = c.gradient;
  const setG = (patch, transient = false) => update({ gradient: { ...g, ...patch } }, transient);

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-2 gap-5">
        <ColorField label="Foreground" value={c.foregroundColor} onChange={(v) => update({ foregroundColor: v }, true)} onCommit={commit} />
        <ColorField label="Background" value={c.backgroundColor} onChange={(v) => update({ backgroundColor: v }, true)} onCommit={commit} />
      </div>
      <div>
        <div className="flex items-center justify-between">
          <span className="label-caps text-mute">Gradient</span>
          <Toggle checked={g.enabled} onChange={(v) => setG({ enabled: v })} label="Gradient" />
        </div>
        <AnimatePresence initial={false}>
          {g.enabled && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <div className="space-y-6 pt-6">
                <ColorField label="End colour" value={g.color} onChange={(v) => setG({ color: v }, true)} onCommit={commit} />
                <Segmented options={GRADIENTS} value={g.type} onChange={(v) => setG({ type: v })} />
                {g.type === 'linear' && (
                  <RangeField label="Angle" value={g.angle} min={0} max={360} step={5} format={(v) => `${v}°`} onChange={(v) => setG({ angle: v }, true)} onCommit={commit} />
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div>
        <span className="label-caps text-mute">Module shape</span>
        <div className="mt-3"><Segmented options={STYLES} value={c.moduleStyle} onChange={(v) => update({ moduleStyle: v })} /></div>
      </div>
    </div>
  );
}