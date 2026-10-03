import React, { useState } from 'react';
import { Download, PenLine, Save, Share2, SlidersHorizontal } from 'lucide-react';

export default function PreviewActions({ onEdit, onCustomize, onSave, onDownload, onShare }) {
  const [busy, setBusy] = useState(null);
  const run = (key, fn) => async () => {
    setBusy(key);
    try { await fn(); } finally { setBusy(null); }
  };

  const items = [
    { key: 'edit', label: 'Edit content', icon: PenLine, onClick: onEdit },
    { key: 'customize', label: 'Customize', icon: SlidersHorizontal, onClick: onCustomize },
    { key: 'save', label: 'Save', icon: Save, onClick: run('save', onSave) },
    { key: 'share', label: 'Share', icon: Share2, onClick: run('share', onShare) },
  ];

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
      {items.map(({ key, label, icon: Icon, onClick }) => (
        <button key={key} type="button" onClick={onClick} disabled={busy === key} className="group relative flex items-center justify-center gap-2 overflow-hidden rounded-full border border-carbon px-3 py-3.5 label-caps transition-colors hover:border-ink disabled:opacity-50">
          <span className="absolute inset-0 origin-bottom scale-y-0 bg-ink transition-transform duration-300 ease-out group-hover:scale-y-100" />
          <Icon className="relative h-4 w-4 transition-colors group-hover:text-void" />
          <span className="relative transition-colors group-hover:text-void">{label}</span>
        </button>
      ))}
      <button type="button" onClick={run('download', onDownload)} disabled={busy === 'download'} className="group relative col-span-2 flex items-center justify-center gap-2 overflow-hidden rounded-full bg-volt px-3 py-3.5 label-caps font-semibold text-on-volt disabled:opacity-60 sm:col-span-1">
        <Download className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
        Download
        <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/60 to-transparent group-hover:animate-[sheen_0.9s_ease]" />
      </button>
    </div>
  );
}