import { useCallback, useEffect, useState } from 'react';
import { listItems, saveItem, deleteItem, clearCollection } from '@/services/storageService';

const COLLECTIONS = ['recents', 'favorites', 'downloads'];

export default function useLibrary(reportError) {
  const [items, setItems] = useState({ recents: [], favorites: [], downloads: [] });

  const refresh = useCallback(async (collection) => {
    const cols = collection ? [collection] : COLLECTIONS;
    try {
      const lists = await Promise.all(cols.map(listItems));
      setItems((prev) => {
        const next = { ...prev };
        cols.forEach((c, i) => { next[c] = lists[i]; });
        return next;
      });
    } catch (e) {
      reportError(e);
    }
  }, [reportError]);

  useEffect(() => { refresh(); }, [refresh]);

  const save = useCallback(async (col, item) => { await saveItem(col, item); await refresh(col); }, [refresh]);
  const remove = useCallback(async (col, id) => { await deleteItem(col, id); await refresh(col); }, [refresh]);
  const clear = useCallback(async (col) => { await clearCollection(col); await refresh(col); }, [refresh]);

  return { ...items, refresh, save, remove, clear };
}