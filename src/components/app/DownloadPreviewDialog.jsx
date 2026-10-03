import React from 'react';
import { format } from 'date-fns';
import { Download } from 'lucide-react';
import Modal from '@/components/app/Modal';
import useObjectUrl from '@/hooks/useObjectUrl';
import { fileName, triggerDownload } from '@/services/qrService';

export default function DownloadPreviewDialog({ record, onClose }) {
  const url = useObjectUrl(record?.imageBlob);
  return (
    <Modal open={Boolean(record)} onClose={onClose} className="max-w-lg">
      {record && (
        <>
          <div className="bg-[repeating-conic-gradient(rgb(var(--carbon))_0%_25%,transparent_0%_50%)] bg-[length:20px_20px] p-4">
            {url && <img src={url} alt={record.name} className="mx-auto w-full max-w-sm" />}
          </div>
          <div className="mt-6 flex items-end justify-between gap-4">
            <div className="min-w-0">
              <h2 className="truncate font-wide text-xl font-extrabold">{record.name}</h2>
              <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.1em] text-steel">{record.format} · {format(record.createdAt, 'dd MMM yyyy · HH:mm')}</p>
            </div>
            <button type="button" onClick={() => triggerDownload(record.imageBlob, fileName(record.name, record.format))} className="flex shrink-0 items-center gap-2 rounded-full bg-volt px-5 py-3 label-caps font-semibold text-on-volt">
              <Download className="h-4 w-4" /> Download again
            </button>
          </div>
        </>
      )}
    </Modal>
  );
}