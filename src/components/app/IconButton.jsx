import React from 'react';

export default function IconButton({ label, onClick, children, danger = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`flex h-10 w-10 items-center justify-center rounded-full border border-carbon transition-colors [&_svg]:h-4 [&_svg]:w-4 ${danger ? 'hover:border-[#FF6B5B] hover:text-[#FF6B5B]' : 'hover:border-ink'}`}
    >
      {children}
    </button>
  );
}