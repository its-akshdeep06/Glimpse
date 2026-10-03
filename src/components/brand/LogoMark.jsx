import React from 'react';

const CELLS = [1, 1, 0, 1, 0, 1, 0, 1, 1];
const COLORS = ['bg-g-red', 'bg-g-yellow', '', 'bg-g-green', '', 'bg-g-blue', '', 'bg-g-yellow', 'bg-g-red'];

export default function LogoMark() {
  return (
    <span className="grid h-6 w-6 grid-cols-3 gap-[2px]" aria-hidden="true">
      {CELLS.map((on, i) => {
        const cls = on ? COLORS[i] : i === 4 ? 'bg-volt' : 'bg-transparent';
        return <span key={i} className={cls} />;
      })}
    </span>
  );
}