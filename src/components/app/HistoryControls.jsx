import React from 'react';
import { Redo2, Undo2 } from 'lucide-react';

const btn = 'flex h-10 w-10 items-center justify-center rounded-full border border-carbon transition-colors hover:border-ink disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-carbon';

export default function HistoryControls({ canUndo, canRedo, onUndo, onRedo }) {
  return (
    <div className="flex gap-2">
      <button type="button" className={btn} onClick={onUndo} disabled={!canUndo} aria-label="Undo" title="Undo"><Undo2 className="h-4 w-4" /></button>
      <button type="button" className={btn} onClick={onRedo} disabled={!canRedo} aria-label="Redo" title="Redo"><Redo2 className="h-4 w-4" /></button>
    </div>
  );
}