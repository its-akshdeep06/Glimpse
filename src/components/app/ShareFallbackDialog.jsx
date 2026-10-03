import React from 'react';
import { Copy, Download } from 'lucide-react';
import Modal from '@/components/app/Modal';
import useObjectUrl from '@/hooks/useObjectUrl';

export default function ShareFallbackDialog({ request, onClose, onDownload, onCopy }) {
  const url = useObjectUrl(request?.blob);
  return (
    <Modal open={Boolean(request)} onClose={onClose}>
      <p className="label-caps text-volt-text">Share image</p>
      <h2 className="mt-2 font-wide text-2xl font-extrabold uppercase">Share it your way</h2>
      <p className="mt-2 text-mute">This browser can't share image files directly. Download the image or copy it, then paste it anywhere.</p>
      {url && <img src={url} alt="Your customized QR code" className="mx-auto mt-6 w-48 rounded-lg ring-1 ring-carbon" />}
      <div className="mt-8 grid grid-cols-2 gap-3">
        <button type="button" onClick={onCopy} className="flex items-center justify-center gap-2 rounded-full border border-carbon px-5 py-3 label-caps hover:border-ink"><Copy className="h-4 w-4" /> Copy image</button>
        <button type="button" onClick={onDownload} className="flex items-center justify-center gap-2 rounded-full bg-volt px-5 py-3 label-caps font-semibold text-on-volt"><Download className="h-4 w-4" /> Download image</button>
      </div>
    </Modal>
  );
}