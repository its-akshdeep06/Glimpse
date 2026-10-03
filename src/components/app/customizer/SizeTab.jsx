import React from 'react';
import RangeField from '@/components/app/customizer/RangeField';

export default function SizeTab({ c, update, commit }) {
  return (
    <div className="space-y-10">
      <RangeField label="Export size" value={c.size} min={256} max={2048} step={64} format={(v) => `${v} px`} onChange={(v) => update({ size: v }, true)} onCommit={commit} />
      <RangeField label="Margin · quiet zone" value={c.margin} min={0} max={10} format={(v) => `${v} modules`} onChange={(v) => update({ margin: v }, true)} onCommit={commit} />
      <p className="text-sm leading-relaxed text-mute">Size sets the pixel dimensions of your download. Keep a margin of at least 2 modules so scanners can find the edges.</p>
    </div>
  );
}