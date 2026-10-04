import React from 'react';
import { AnimatePresence } from 'framer-motion';
import SectionHeader from '@/components/app/SectionHeader';
import ProjectCard from '@/components/app/ProjectCard';
import EmptyState from '@/components/app/EmptyState';

export default function LibrarySection({ index, title, meta, items, favoriteIds, onOpen, onToggleFavorite, onDelete = undefined, emptyTitle, emptyText, onCreate }) {
  return (
    <div className="px-5 py-10 md:px-10 md:py-16">
      <SectionHeader index={index} title={title} meta={meta} />
      {items.length ? (
        <div className="mt-12 grid grid-cols-1 border-l border-t border-carbon sm:grid-cols-2 xl:grid-cols-4">
          <AnimatePresence>
            {items.map((p, i) => (
              <ProjectCard key={p.id} index={i} project={p} isFavorite={favoriteIds.has(p.id)} onOpen={onOpen} onToggleFavorite={onToggleFavorite} onDelete={onDelete} />
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <EmptyState title={emptyTitle} text={emptyText} actionLabel="Create a QR" onAction={onCreate} />
      )}
    </div>
  );
}