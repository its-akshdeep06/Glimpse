import React, { useEffect } from 'react';

// Desktop customizer surface: a wide right-hand drawer so presets and controls
// get real room instead of being squeezed into the form column.
export default function CustomizerDrawer({ open, onClose, children }) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <>
      {open && <div className="fixed inset-0 z-40 bg-void/50 backdrop-blur-[2px]" onClick={onClose} />}
      {open && (
        <aside className="fixed inset-y-0 right-0 z-50 flex w-full max-w-xl flex-col border-l border-carbon bg-panel shadow-[0_0_80px_-20px_rgba(60,64,67,0.25)]">
          <div className="overflow-y-auto overscroll-contain">{children}</div>
        </aside>
      )}
    </>
  );
}