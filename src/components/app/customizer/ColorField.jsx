import React, { useEffect, useRef, useState } from 'react';

const HEX = /^#[0-9a-fA-F]{6}$/;

export default function ColorField({ label, value, onChange, onCommit }) {
  const [text, setText] = useState(value);
  const pickerRef = useRef(null);
  useEffect(() => setText(value), [value]);

  // The native "change" event fires when the picker closes - one history step per pick.
  useEffect(() => {
    const el = pickerRef.current;
    el.addEventListener('change', onCommit);
    return () => el.removeEventListener('change', onCommit);
  }, [onCommit]);

  return (
    <div>
      <span className="label-caps text-mute">{label}</span>
      <div className="mt-3 flex items-center gap-3 border-b border-carbon pb-2 transition-colors focus-within:border-volt-text">
        <label className="relative h-9 w-9 shrink-0 cursor-pointer overflow-hidden rounded-full ring-1 ring-carbon transition-transform hover:scale-110" style={{ background: value }}>
          <input ref={pickerRef} type="color" value={value} onChange={(e) => onChange(e.target.value)} className="absolute inset-0 h-full w-full cursor-pointer opacity-0" aria-label={label} />
        </label>
        <input
          value={text}
          onChange={(e) => { setText(e.target.value); if (HEX.test(e.target.value)) onChange(e.target.value); }}
          onBlur={() => { setText(value); onCommit(); }}
          className="w-full min-w-0 bg-transparent font-mono text-base uppercase outline-none"
          maxLength={7}
          spellCheck={false}
          aria-label={`${label} hex value`}
        />
      </div>
    </div>
  );
}