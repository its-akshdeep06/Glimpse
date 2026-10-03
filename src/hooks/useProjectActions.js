import { getSettings } from '@/services/storageService';
import { exportImage, triggerDownload, fileName, shareImage } from '@/services/qrService';
import { peekNextAutoName, resolveName } from '@/utils/naming';

export default function useProjectActions({ qr, library, toast, reportError, favoriteIds, discardDraft, openNaming, openShareFallback }) {
  // Runs the action once the project has a name (asking first if needed).
  const withName = (project, action) => {
    if (project.name.trim()) return action(project);
    openNaming({
      suggestion: peekNextAutoName(),
      onResolve: (input) => {
        const name = resolveName(input);
        openNaming(null);
        if (project.id === qr.project.id) qr.rename(name);
        return action({ ...project, name });
      },
    });
    return undefined;
  };

  const recordDownload = async (project, blob, format) => {
    triggerDownload(blob, fileName(project.name, format));
    await library.save('downloads', { id: crypto.randomUUID(), name: project.name, type: project.encodedType, imageBlob: blob, format, createdAt: Date.now() });
    toast.show({ message: `${format.toUpperCase()} downloaded · added to history` });
  };

  const save = () => withName(qr.project, async (p) => {
    try {
      const record = { ...p, updatedAt: Date.now() };
      await library.save('recents', record);
      if (favoriteIds.has(p.id)) await library.save('favorites', record);
      await discardDraft();
      qr.markSaved({ name: p.name });
      toast.show({ message: `“${p.name}” saved to Recents` });
    } catch (e) {
      reportError(e);
    }
  });

  const download = () => withName(qr.project, async (p) => {
    try {
      const format = getSettings().downloadFormat;
      const blob = await exportImage(p, format);
      await recordDownload(p, blob, format);
    } catch (e) {
      reportError(e);
    }
  });

  const downloadBlob = (blob, project) => withName(project, async (p) => {
    try {
      await recordDownload(p, blob, 'png');
    } catch (e) {
      reportError(e);
    }
  });

  const share = async () => {
    try {
      const p = qr.project;
      const blob = await exportImage(p, 'png');
      const result = await shareImage(blob, p.name || 'QR code');
      if (result === 'unsupported') openShareFallback({ blob, project: p });
    } catch (e) {
      reportError(e);
    }
  };

  const toggleFavorite = (project) => {
    if (favoriteIds.has(project.id)) {
      library.remove('favorites', project.id).then(() => toast.show({ message: 'Removed from Favorites' })).catch(reportError);
      return;
    }
    withName(project, (p) => library.save('favorites', { ...p, updatedAt: Date.now() })
      .then(() => toast.show({ message: 'Added to Favorites' }))
      .catch(reportError));
  };

  return { save, download, downloadBlob, share, toggleFavorite };
}