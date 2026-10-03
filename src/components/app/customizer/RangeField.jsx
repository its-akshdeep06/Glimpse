import React from 'react';

// Slider that previews live (transient) and records one history step on release.
export default function RangeField({ label, value, min, max, step = 1, format = (v) => v, onChange, onCommit, marker }) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <span className="label-caps text-mute">{label}</span>
        <span className="font-mono text-sm tabular-nums">{format(value)}</span>
      </div>
      <div className="relative mt-2">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          onPointerUp={onCommit}
          onKeyUp={onCommit}
          onBlur={onCommit}
          className="range"
          style={{ '--p': `${pct}%` }}
          aria-label={label}
        />
        {marker != null && (
          <span className="pointer-events-none absolute top-1 h-[20px] w-px bg-amber-500" style={{ left: `${((marker - min) / (max - min)) * 100}%` }} />
        )}
      </div>
      <div className="mt-1 flex justify-between" aria-hidden="true">
        {Array.from({ length: 11 }).map((_, i) => <span key={i} className={`w-px bg-carbon ${i % 5 === 0 ? 'h-2' : 'h-1'}`} />)}
      </div>
    </div>
  );
}