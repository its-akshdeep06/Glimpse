import React from 'react';
import { AlertTriangle } from 'lucide-react';
import Modal from '@/components/app/Modal';

export default function ConfirmDialog({ request, onClose }) {
  return (
    <Modal open={Boolean(request)} onClose={onClose}>
      {request && (
        <>
          <div className="flex gap-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FF5A4E]/15 text-[#FF6B5B]"><AlertTriangle className="h-5 w-5" /></span>
            <div>
              <h2 className="font-wide text-xl font-extrabold uppercase">{request.title}</h2>
              <p className="mt-2 text-mute">{request.message} This can't be undone.</p>
            </div>
          </div>
          <div className="mt-8 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="rounded-full border border-carbon px-5 py-3 label-caps hover:border-ink">Cancel</button>
            <button type="button" onClick={() => { onClose(); request.onConfirm(); }} className="rounded-full bg-[#FF5A4E] px-6 py-3 label-caps font-semibold text-white">Clear</button>
          </div>
        </>
      )}
    </Modal>
  );
}