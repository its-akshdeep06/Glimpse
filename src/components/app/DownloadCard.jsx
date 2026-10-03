import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Download, Eye, Trash2 } from 'lucide-react';
import IconButton from '@/components/app/IconButton';
import useObjectUrl from '@/hooks/useObjectUrl';
import { fileName, triggerDownload } from '@/services/qrService';
import { QR_TYPES } from '@/utils/validation';

export default function DownloadCard({ record, index, onPreview, onDelete }) {
  const url = useObjectUrl(record.imageBlob);
  const type = QR_TYPES.find((t) => t.id === record.type)?.label ?? 'QR';

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0, transition: { delay: Math.min(index, 12) * 0.04 } }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      className="group border-b border-r border-carbon p-5"
    >
      <button type="button" onClick={() => onPreview(record)} className="relative block aspect-square w-full overflow-hidden bg-panel" aria-label={`Preview ${record.name}`}>
        {url && <img src={url} alt={record.name} className="h-full w-full object-contain p-6 transition-transform duration-700 group-hover:scale-[1.05]" />}
        <span className="absolute left-3 top-3 rounded-full border border-carbon bg-void/70 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.1em] backdrop-blur">{record.format}</span>
      </button>
      <div className="mt-4 flex items-end justify-between gap-3">
        <div className="min-w-0">
          <p className="label-caps text-volt-text">{type}</p>
          <h3 className="mt-1 truncate font-wide text-lg font-bold">{record.name}</h3>
          <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.1em] text-steel">{format(record.createdAt, 'dd MMM yyyy · HH:mm')}</p>
        </div>
        <div className="flex shrink-0 gap-2">
          <IconButton label="Preview" onClick={() => onPreview(record)}><Eye /></IconButton>
          <IconButton label="Download again" onClick={() => triggerDownload(record.imageBlob, fileName(record.name, record.format))}><Download /></IconButton>
          <IconButton label="Delete" danger onClick={() => onDelete(record)}><Trash2 /></IconButton>
        </div>
      </div>
    </motion.article>
  );
}