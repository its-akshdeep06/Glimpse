import React, { useMemo, useRef } from 'react';
import QRForm from '@/components/app/QRForm';
import QRPreview from '@/components/app/QRPreview';
import Customizer from '@/components/app/Customizer';
import CustomizerDrawer from '@/components/app/CustomizerDrawer';
import MobileSheet from '@/components/app/MobileSheet';
import useMediaQuery from '@/hooks/useMediaQuery';
import { generateMatrix } from '@/services/qrService';
import { assessScanRisks } from '@/utils/validation';

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
    <div className="lg:grid lg:min-h-[calc(100svh-4rem)] lg:grid-cols-[minmax(380px,460px)_1fr]">
      <aside ref={formRef} className="scroll-mt-16 border-b border-carbon lg:border-b-0 lg:border-r">
        <QRForm qr={qr} onGenerate={handleGenerate} />
      </aside>
      <section ref={previewRef} className="scroll-mt-16">
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
      </section>
      {isDesktop ? (
        <CustomizerDrawer open={deck === 'customize'} onClose={closeCustomizer}>{customizer}</CustomizerDrawer>
      ) : (
        <MobileSheet open={deck === 'customize'} onClose={closeCustomizer}>{customizer}</MobileSheet>
      )}
    </div>
  );
}