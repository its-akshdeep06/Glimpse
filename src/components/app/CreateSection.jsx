import React, { useMemo, useRef } from 'react';
import QRForm from '@/components/app/QRForm';
import QRPreview from '@/components/app/QRPreview';
import Customizer from '@/components/app/Customizer';
import CustomizerDrawer from '@/components/app/CustomizerDrawer';
import MobileSheet from '@/components/app/MobileSheet';
import useMediaQuery from '@/hooks/useMediaQuery';
import { generateMatrix } from '@/services/qrService';
import { assessScanRisks } from '@/utils/validation';
import { ErrorBoundary } from '@/components/ErrorBoundary';

export default function CreateSection({ qr, deck, setDeck, actions, isFavorite, notify }) {
  const { project } = qr;
  const c = project.customization;
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const previewRef = useRef(null);
  const formRef = useRef(null);

  const qrState = useMemo(() => {
    if (!project.encoded) return {};
    try {
      return { matrix: generateMatrix(project.encoded, c.errorCorrection) };
    } catch (e) {
      return { error: e.message };
    }
  }, [project.encoded, c.errorCorrection]);
  const risks = useMemo(() => assessScanRisks(c), [c]);

  const scrollTo = (ref) => setTimeout(() => ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60);
  const handleGenerate = () => {
    const err = qr.generate();
    if (err && err !== 'invalid') notify(err);
    else if (!err && !isDesktop) scrollTo(previewRef);
  };
  const editContent = () => { setDeck('content'); if (!isDesktop) scrollTo(formRef); };
  const customize = () => setDeck('customize');
  const closeCustomizer = () => { qr.commit(); setDeck('content'); };

  const customizer = <Customizer qr={qr} matrix={qrState.matrix} onDone={closeCustomizer} notify={notify} />;

  return (
    <div className="lg:flex lg:h-[calc(100svh-4rem)] lg:overflow-hidden">
      <aside ref={formRef} className="scroll-mt-16 border-b border-carbon lg:w-[420px] lg:shrink-0 lg:overflow-y-auto lg:border-b-0 lg:border-r">
        <QRForm qr={qr} onGenerate={handleGenerate} />
      </aside>
      <section ref={previewRef} className="scroll-mt-16 lg:flex-1 lg:overflow-hidden">
        <ErrorBoundary name="QRPreview">
          <QRPreview
            project={project}
            matrix={qrState.matrix}
            error={qrState.error}
            risks={risks}
            dirty={qr.dirty}
            isFavorite={isFavorite}
            history={{ canUndo: qr.canUndo, canRedo: qr.canRedo, onUndo: qr.undo, onRedo: qr.redo }}
            actions={actions}
            onEdit={editContent}
            onCustomize={customize}
          />
        </ErrorBoundary>
      </section>
      {isDesktop ? (
        <CustomizerDrawer open={deck === 'customize'} onClose={closeCustomizer}>
          <ErrorBoundary name="Customizer">
            {customizer}
          </ErrorBoundary>
        </CustomizerDrawer>
      ) : (
        <MobileSheet open={deck === 'customize'} onClose={closeCustomizer}>
          <ErrorBoundary name="Customizer">
            {customizer}
          </ErrorBoundary>
        </MobileSheet>
      )}
    </div>
  );
}