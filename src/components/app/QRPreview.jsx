import React from 'react';
import PreviewStage from '@/components/app/PreviewStage';
import EmptyCanvas from '@/components/app/EmptyCanvas';
import PreviewActions from '@/components/app/PreviewActions';
import HistoryControls from '@/components/app/HistoryControls';
import FavoriteButton from '@/components/app/FavoriteButton';
import RiskWarnings from '@/components/app/RiskWarnings';
import { QR_TYPES } from '@/utils/validation';

export default function QRPreview({ project, matrix, error, risks, dirty, isFavorite, history, actions, onEdit, onCustomize }) {
  const c = project.customization;
  const version = matrix ? (matrix.length - 17) / 4 : null;
  const typeLabel = QR_TYPES.find((t) => t.id === project.encodedType)?.label;
  const assembleKey = `${project.encoded}|${c.errorCorrection}|${c.templateId}|${c.moduleStyle}`;

  return (
    <div className="relative flex min-h-[70svh] flex-col p-4 md:p-6 lg:h-full lg:min-h-0">
      <div className="pointer-events-none absolute inset-0 grid-lines opacity-70 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_72%)]" />
      <div className="relative flex shrink-0 items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="label-caps text-mute">02 — Preview</p>
          <p className="mt-2 truncate font-wide text-xl font-bold">{project.name || 'Untitled'}</p>
          {project.encoded && (
            <p className="mt-1 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.1em] text-steel">
              <span className={`h-1.5 w-1.5 rounded-full ${dirty ? 'bg-amber-400' : 'bg-volt'}`} />
              {dirty ? 'Unsaved changes' : 'Saved'}
            </p>
          )}
        </div>
        {project.encoded && (
          <div className="flex items-center gap-2">
            <HistoryControls {...history} />
            <FavoriteButton active={isFavorite} onToggle={() => actions.toggleFavorite(project)} />
          </div>
        )}
      </div>
      <div className="relative flex min-h-0 flex-1 items-center justify-center py-3">
        {matrix && <PreviewStage matrix={matrix} customization={c} assembleKey={assembleKey} />}
        {!matrix && error && <p className="max-w-sm text-center text-[#FF6B5B]">{error} Try a lower error-correction level or shorter content.</p>}
        {!matrix && !error && <EmptyCanvas />}
      </div>
      {matrix && (
        <div className="relative mx-auto w-full max-w-3xl shrink-0 space-y-3">
          <p className="text-center font-mono text-[11px] uppercase tracking-[0.1em] text-steel">
            {c.size} × {c.size} px · EC {c.errorCorrection} · v{version} · {typeLabel}
          </p>
          <RiskWarnings risks={risks} />
          <PreviewActions onEdit={onEdit} onCustomize={onCustomize} onSave={actions.save} onDownload={actions.download} onShare={actions.share} />
        </div>
      )}
    </div>
  );
}