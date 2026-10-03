import React from 'react';
import { RotateCcw, Plus } from 'lucide-react';
import Modal from '@/components/app/Modal';

export default function DraftDialog({ open, onResume, onStartNew }) {
  return (
    <Modal open={open} onClose={onResume}>
      <p className="label-caps text-volt-text">Draft found</p>
      <h2 className="mt-2 font-wide text-2xl font-extrabold uppercase">Pick up where you left off?</h2>
      <p className="mt-2 text-mute">You have one unsaved draft. Resume it, or start fresh — starting new replaces the draft.</p>
      <div className="mt-8 grid grid-cols-2 gap-3">
        <button type="button" onClick={onStartNew} className="flex items-center justify-center gap-2 rounded-full border border-carbon px-5 py-3 label-caps hover:border-ink"><Plus className="h-4 w-4" /> Start new</button>
        <button type="button" onClick={onResume} className="flex items-center justify-center gap-2 rounded-full bg-volt px-5 py-3 label-caps font-semibold text-on-volt"><RotateCcw className="h-4 w-4" /> Resume draft</button>
      </div>
    </Modal>
  );
}