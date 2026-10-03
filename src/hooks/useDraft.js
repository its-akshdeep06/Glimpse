import { useCallback, useEffect, useState } from 'react';
import { getDraft, saveDraft, clearDraft } from '@/services/storageService';
import { hasContent } from '@/hooks/useQRProject';

// Keeps exactly one temporary draft in sync with unsaved work.
export default function useDraft(project, dirty, reportError) {
  const [exists, setExists] = useState(false);
  const content = hasContent(project);

  useEffect(() => {
    getDraft().then((d) => setExists(Boolean(d))).catch(reportError);
  }, [reportError]);

  useEffect(() => {
    if (!dirty || !content) return undefined;
    const t = setTimeout(() => {
      saveDraft(project).then(() => setExists(true)).catch(reportError);
    }, 400);
    return () => clearTimeout(t);
  }, [project, dirty, content, reportError]);

  const flush = useCallback(async () => {
    await saveDraft(project);
    setExists(true);
  }, [project]);

  const discard = useCallback(async () => {
    await clearDraft();
    setExists(false);
  }, []);

  return { exists, flush, discard };
}