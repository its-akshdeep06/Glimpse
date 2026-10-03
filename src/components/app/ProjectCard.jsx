import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { FolderOpen, Trash2 } from 'lucide-react';
import FavoriteButton from '@/components/app/FavoriteButton';
import IconButton from '@/components/app/IconButton';
import { projectThumbnail } from '@/services/qrService';
import { QR_TYPES, summarize } from '@/utils/validation';

export default function ProjectCard({ project, index, isFavorite, onOpen, onToggleFavorite, onDelete }) {
  const thumb = useMemo(() => projectThumbnail(project, 360), [project]);
  const type = QR_TYPES.find((t) => t.id === project.encodedType)?.label ?? 'Draft';

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0, transition: { delay: Math.min(index, 12) * 0.05 } }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      className="group relative border-b border-r border-carbon p-5"
    >
      <button type="button" onClick={() => onOpen(project)} className="relative block aspect-square w-full overflow-hidden bg-panel" aria-label={`Open ${project.name}`}>
        {thumb ? (
          <img src={thumb} alt="" className="h-full w-full object-contain p-6 transition-transform duration-700 ease-out group-hover:-rotate-2 group-hover:scale-[1.06]" />
        ) : (
          <span className="label-caps text-mute">No preview</span>
        )}
        <span className="absolute inset-x-0 bottom-0 flex translate-y-full items-center justify-center gap-2 bg-volt py-3 label-caps text-on-volt transition-transform duration-500 ease-out group-hover:translate-y-0">
          <FolderOpen className="h-4 w-4" /> Open
        </span>
      </button>
      <div className="mt-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="label-caps text-volt-text">{type}</p>
          <h3 className="mt-1 truncate font-wide text-lg font-bold">{project.name}</h3>
          <p className="truncate text-sm text-mute">{summarize(project.encodedType, project.data)}</p>
          <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.1em] text-steel">{format(project.updatedAt, 'dd MMM yyyy · HH:mm')}</p>
        </div>
        <div className="flex shrink-0 gap-2">
          <FavoriteButton active={isFavorite} onToggle={() => onToggleFavorite(project)} />
          {onDelete && <IconButton label="Delete" danger onClick={() => onDelete(project)}><Trash2 /></IconButton>}
        </div>
      </div>
    </motion.article>
  );
}