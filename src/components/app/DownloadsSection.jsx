import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import SectionHeader from '@/components/app/SectionHeader';
import DownloadCard from '@/components/app/DownloadCard';
import DownloadPreviewDialog from '@/components/app/DownloadPreviewDialog';
import EmptyState from '@/components/app/EmptyState';

export default function DownloadsSection({ items, onDelete, onCreate }) {
  const [preview, setPreview] = useState(null);
  return (
    <div className="px-5 py-10 md:px-10 md:py-16">
      <SectionHeader index="05" title="Downloads" meta={`${items.length} ${items.length === 1 ? 'export' : 'exports'}`} />
      {items.length ? (
        <div className="mt-12 grid grid-cols-1 border-l border-t border-carbon sm:grid-cols-2 xl:grid-cols-4">
          <AnimatePresence>
            {items.map((r, i) => <DownloadCard key={r.id} record={r} index={i} onPreview={setPreview} onDelete={onDelete} />)}
          </AnimatePresence>
        </div>
      ) : (
        <EmptyState title="No downloads yet" text="Every image you download is kept here, exactly as it looked so you can grab it again." actionLabel="Create a QR" onAction={onCreate} />
      )}
      <DownloadPreviewDialog record={preview} onClose={() => setPreview(null)} />
    </div>
  );
}