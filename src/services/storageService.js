// Single storage abstraction: IndexedDB for projects/blobs, localStorage for small settings.

const DB_NAME = 'module-qr';
const DB_VERSION = 1;
const STORES = ['recents', 'favorites', 'downloads', 'meta'];
const MAX_RECENTS = 20;
const SETTINGS_KEY = 'module.settings';
const COUNTER_KEY = 'module.autoNameCounter';
const DEFAULT_SETTINGS = { theme: 'light', downloadFormat: 'png' };

let dbPromise = null;

function friendly(err) {
  if (err?.name === 'QuotaExceededError') return new Error('Browser storage is full. Delete some downloads or recents to free up space.');
  return new Error(`Couldn't access local storage${err?.message ? `: ${err.message}` : '.'}`);
}

function openDB() {
  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = () => {
        STORES.forEach((s) => {
          if (!req.result.objectStoreNames.contains(s)) req.result.createObjectStore(s, { keyPath: 'id' });
        });
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => { dbPromise = null; reject(friendly(req.error)); };
    });
  }
  return dbPromise;
}

async function run(store, mode, op) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    let req;
    try {
      const tx = db.transaction(store, mode);
      req = op(tx.objectStore(store));
      tx.oncomplete = () => resolve(req?.result);
      tx.onerror = () => reject(friendly(tx.error));
      tx.onabort = () => reject(friendly(tx.error));
    } catch (e) {
      reject(friendly(e));
    }
  });
}

// ---- Collections: recents, favorites, downloads ----

export async function listItems(collection) {
  const items = (await run(collection, 'readonly', (s) => s.getAll())) || [];
  const key = collection === 'downloads' ? 'createdAt' : 'updatedAt';
  return items.sort((a, b) => (b[key] || 0) - (a[key] || 0));
}

export async function deleteItem(collection, id) {
  await run(collection, 'readwrite', (s) => s.delete(id));
}

export async function saveItem(collection, item) {
  await run(collection, 'readwrite', (s) => s.put(item));
  if (collection === 'recents') {
    const all = await listItems('recents');
    await Promise.all(all.slice(MAX_RECENTS).map((r) => deleteItem('recents', r.id)));
  }
}

export async function clearCollection(collection) {
  await run(collection, 'readwrite', (s) => s.clear());
}

// ---- Single temporary draft ----

export async function getDraft() {
  const rec = await run('meta', 'readonly', (s) => s.get('draft'));
  return rec?.project || null;
}

export async function saveDraft(project) {
  await run('meta', 'readwrite', (s) => s.put({ id: 'draft', project }));
}

export async function clearDraft() {
  await run('meta', 'readwrite', (s) => s.delete('draft'));
}

// ---- Settings (localStorage) ----

export function getSettings() {
  try {
    return { ...DEFAULT_SETTINGS, ...JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}') };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export function updateSettings(patch) {
  const next = { ...getSettings(), ...patch };
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event('module:settings'));
  return next;
}

// ---- Automatic naming counter (persisted, never reused) ----

export function getAutoNameCounter() {
  return Number(localStorage.getItem(COUNTER_KEY) || 0);
}

export function setAutoNameCounter(n) {
  localStorage.setItem(COUNTER_KEY, String(n));
}

export async function clearAllData() {
  await Promise.all(STORES.map(clearCollection));
  localStorage.removeItem(SETTINGS_KEY);
  localStorage.removeItem(COUNTER_KEY);
  window.dispatchEvent(new Event('module:settings'));
}