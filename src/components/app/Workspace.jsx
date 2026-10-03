import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import useQRProject, { hasContent } from '@/hooks/useQRProject';
import useLibrary from '@/hooks/useLibrary';
import useDraft from '@/hooks/useDraft';
import useProjectActions from '@/hooks/useProjectActions';
import useDynamicFavicon from '@/hooks/useDynamicFavicon';
import { useToast } from '@/components/app/Toast';
import { SECTIONS } from '@/lib/sections';
import { getDraft, clearAllData } from '@/services/storageService';
import { copyImage } from '@/services/qrService';
import AppHeader from '@/components/app/AppHeader';
import OrbitNav from '@/components/app/OrbitNav';
import SectionView from '@/components/app/SectionView';
import WorkspaceDialogs from '@/components/app/WorkspaceDialogs';

const CLEAR_COPY = {
  recents: { title: 'Clear all Recents?', message: 'Every saved project in Recents will be removed. Favorites and Downloads stay untouched.' },
  favorites: { title: 'Clear all Favorites?', message: 'Every pinned project will be removed. Recents and Downloads stay untouched.' },
  downloads: { title: 'Clear download history?', message: 'All stored download images will be removed from this browser.' },
  all: { title: 'Clear all local data?', message: 'Recents, Favorites, Downloads, your draft, settings and the automatic-name counter will be erased from this browser.' },
};

const initialSection = () => {
  const s = new URLSearchParams(window.location.search).get('section');
  return SECTIONS.some((x) => x.id === s) ? s : 'create';
};

export default function Workspace() {
  const toast = useToast();
  const reportError = useCallback((e) => toast.show({ message: e?.message || 'Something went wrong.', tone: 'error' }), [toast]);
  const notify = useCallback((message) => toast.show({ message }), [toast]);
  const qr = useQRProject();
  const library = useLibrary(reportError);
  const draft = useDraft(qr.project, qr.dirty, reportError);
  const [section, setSection] = useState(initialSection);
  const [deck, setDeck] = useState('content');
  const [draftPrompt, setDraftPrompt] = useState(false);
  const [naming, setNaming] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [shareFallback, setShareFallback] = useState(null);
  const favoriteIds = useMemo(() => new Set(library.favorites.map((f) => f.id)), [library.favorites]);
  const actions = useProjectActions({ qr, library, toast, reportError, favoriteIds, discardDraft: draft.discard, openNaming: setNaming, openShareFallback: setShareFallback });
  const label = SECTIONS.find((s) => s.id === section).label;

  useDynamicFavicon(section);
  useEffect(() => { document.title = `${label} — Glimpse`; }, [label]);
  useEffect(() => {
    if (section === 'create') getDraft().then((d) => d && setDraftPrompt(true)).catch(reportError);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const openSection = async (id) => {
    if (id === 'create' && section === 'create') {
      if (qr.dirty && hasContent(qr.project)) {
        try { await draft.flush(); notify('Your previous work was kept as the draft'); } catch (e) { reportError(e); }
      }
      qr.reset();
      setDeck('content');
      return;
    }
    if (id === 'create' && draft.exists) setDraftPrompt(true);
    setSection(id);
  };

  const resumeDraft = async () => {
    setDraftPrompt(false);
    try { const d = await getDraft(); if (d) qr.load(d, true); } catch (e) { reportError(e); }
    setDeck('content');
  };
  const startNew = async () => {
    setDraftPrompt(false);
    try { await draft.discard(); } catch (e) { reportError(e); }
    qr.reset();
    setDeck('content');
  };

  const openProject = (p) => { qr.load(p, false); setDeck('content'); setSection('create'); };
  const removeWithUndo = async (col, item, noun) => {
    try {
      await library.remove(col, item.id);
      toast.show({ message: `${noun} removed`, actionLabel: 'Undo', onAction: () => library.save(col, item).catch(reportError) });
    } catch (e) { reportError(e); }
  };
  const applyTemplate = (tpl) => { qr.applyTemplate(tpl); setDeck('content'); setSection('create'); notify(`${tpl.name} applied`); };
  const requestClear = (kind) => setConfirm({
    ...CLEAR_COPY[kind],
    onConfirm: async () => {
      try {
        if (kind === 'all') { await clearAllData(); await draft.discard(); qr.reset(); await library.refresh(); } else await library.clear(kind);
        notify('Cleared');
      } catch (e) { reportError(e); }
    },
  });
  const copyShared = async () => {
    try { await copyImage(shareFallback.blob); notify('Image copied to clipboard'); } catch (e) { reportError(e); }
  };

  return (
    <div className="min-h-screen bg-void text-ink">
      <AppHeader section={section} onNavigate={openSection} />
      <main className="pb-32">
        <AnimatePresence mode="wait">
          <motion.div
            key={section}
            initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -20, filter: 'blur(6px)' }}
            transition={{ type: 'spring', stiffness: 260, damping: 26 }}
          >
            <SectionView
              section={section}
              qr={qr}
              deck={deck}
              setDeck={setDeck}
              actions={actions}
              library={library}
              favoriteIds={favoriteIds}
              notify={notify}
              onOpenProject={openProject}
              onRemove={removeWithUndo}
              onApplyTemplate={applyTemplate}
              onClear={requestClear}
              onCreate={() => openSection('create')}
            />
          </motion.div>
        </AnimatePresence>
      </main>
      <OrbitNav section={section} onNavigate={openSection} />
      <WorkspaceDialogs
        draftPrompt={draftPrompt}
        onResume={resumeDraft}
        onStartNew={startNew}
        naming={naming}
        onCloseNaming={() => setNaming(null)}
        confirm={confirm}
        onCloseConfirm={() => setConfirm(null)}
        shareFallback={shareFallback}
        onCloseShare={() => setShareFallback(null)}
        onShareDownload={() => { actions.downloadBlob(shareFallback.blob, shareFallback.project); setShareFallback(null); }}
        onShareCopy={copyShared}
      />
    </div>
  );
}