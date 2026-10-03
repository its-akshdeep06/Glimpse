import React from 'react';

export default function CropMarks({ className = '-inset-4' }) {
  const mark = 'absolute h-5 w-5 border-volt-text';
  return (
    <div className={`pointer-events-none absolute ${className}`} aria-hidden="true">
      <span className={`${mark} left-0 top-0 border-l border-t`} />
      <span className={`${mark} right-0 top-0 border-r border-t`} />
      <span className={`${mark} bottom-0 left-0 border-b border-l`} />
      <span className={`${mark} bottom-0 right-0 border-b border-r`} />
    </div>
  );
}