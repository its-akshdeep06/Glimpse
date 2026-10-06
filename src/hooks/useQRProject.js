// Central owner of the active QR project and its shared Undo/Redo history.
import { useReducer, useCallback, useMemo } from 'react';
import { emptyData, validateType, buildPayload } from '@/utils/validation';
import { generateMatrix } from '@/services/qrService';
import { applyTemplateTo } from '@/lib/templates';

const HISTORY_LIMIT = 100;

export const defaultCustomization = () => ({
  foregroundColor: '#0B0B0C',
  backgroundColor: '#FFFFFF',
  gradient: { enabled: false, type: 'linear', color: '#1A73E8', angle: 45 },
  size: 1024,
  margin: 4,
  errorCorrection: 'M',
  moduleStyle: 'square',
  logo: null,
  templateId: null,
});

export function createBlankProject() {
  const now = Date.now();
  return { id: crypto.randomUUID(), name: '', type: 'url', data: emptyData(), encoded: '', encodedType: null, customization: defaultCustomization(), createdAt: now, updatedAt: now };
}

export const hasContent = (p) => Boolean(p.encoded) || Object.values(p.data).some((fields) =>
  Object.entries(fields).some(([k, v]) => k !== 'security' && typeof v === 'string' && v.trim()));

const init = (project, dirty = false) => ({ present: project, past: [], future: [], base: null, dirty });

// `base` holds the snapshot before a run of transient edits (typing, slider drags),
// so a whole drag becomes one logical history step once committed.
const committed = (s) => (s.base ? { ...s, past: [...s.past, s.base].slice(-HISTORY_LIMIT), future: [], base: null } : s);

const liveUrlPayload = (data, errorCorrection) => {
  if (!validateType('url', data.url).valid) return '';
  const payload = buildPayload('url', data.url);
  try {
    generateMatrix(payload, errorCorrection);
    return payload;
  } catch {
    return '';
  }
};

/**
 * @typedef {{ type: 'set', update: (project: any) => any, transient?: boolean }
 *   | { type: 'commit' | 'undo' | 'redo' }
 *   | { type: 'load', project: any, dirty?: boolean }
 *   | { type: 'patch', patch: any, dirty?: boolean }} ProjectAction
 */

/** @param {ReturnType<typeof init>} state @param {ProjectAction} a */
function reducer(state, a) {
  switch (a.type) {
    case 'set': {
      const present = { ...a.update(state.present), updatedAt: Date.now() };
      if (a.transient) return { ...state, present, base: state.base ?? state.present, dirty: true };
      return { present, past: [...state.past, state.base ?? state.present].slice(-HISTORY_LIMIT), future: [], base: null, dirty: true };
    }
    case 'commit':
      return committed(state);
    case 'undo': {
      const s = committed(state);
      if (!s.past.length) return s;
      const prev = s.past[s.past.length - 1];
      return { ...s, past: s.past.slice(0, -1), future: [s.present, ...s.future], present: { ...prev, name: s.present.name }, dirty: true };
    }
    case 'redo': {
      const s = committed(state);
      if (!s.future.length) return s;
      const [next, ...rest] = s.future;
      return { ...s, past: [...s.past, s.present], future: rest, present: { ...next, name: s.present.name }, dirty: true };
    }
    case 'load':
      return init(a.project, a.dirty);
    case 'patch':
      return { ...state, present: { ...state.present, ...a.patch }, dirty: a.dirty ?? state.dirty };
    default:
      return state;
  }
}

export default function useQRProject() {
  const [state, dispatch] = useReducer(reducer, undefined, () => init(createBlankProject()));
  const { present } = state;

  const set = useCallback((update, transient = false) => dispatch({ type: 'set', update, transient }), []);
  const commit = useCallback(() => dispatch({ type: 'commit' }), []);
  const undo = useCallback(() => dispatch({ type: 'undo' }), []);
  const redo = useCallback(() => dispatch({ type: 'redo' }), []);
  const load = useCallback((project, dirty = false) => dispatch({ type: 'load', project, dirty }), []);
  const reset = useCallback(() => dispatch({ type: 'load', project: createBlankProject() }), []);
  const rename = useCallback((name) => dispatch({ type: 'patch', patch: { name }, dirty: true }), []);
  const markSaved = useCallback((patch = {}) => dispatch({ type: 'patch', patch, dirty: false }), []);

  const setType = useCallback((type) => set((p) => {
    const next = { ...p, type };
    if (type !== 'url') return next;
    const encoded = liveUrlPayload(p.data, p.customization.errorCorrection);
    return { ...next, encoded, encodedType: encoded ? 'url' : null };
  }, true), [set]);
  const updateField = useCallback((field, value) => set((p) => {
    const data = { ...p.data, [p.type]: { ...p.data[p.type], [field]: value } };
    if (p.type !== 'url') return { ...p, data };
    const encoded = liveUrlPayload(data, p.customization.errorCorrection);
    return { ...p, data, encoded, encodedType: encoded ? 'url' : null };
  }, true), [set]);
  const updateCustomization = useCallback((patch, transient = false) => set((p) => ({
    ...p, customization: { ...p.customization, ...patch },
  }), transient), [set]);
  const applyTemplate = useCallback((tpl) => set((p) => ({ ...p, customization: applyTemplateTo(p.customization, tpl) })), [set]);

  const validation = useMemo(() => validateType(present.type, present.data[present.type]), [present.type, present.data]);
  const payload = useMemo(() => (validation.valid ? buildPayload(present.type, present.data[present.type]) : null), [validation, present.type, present.data]);

  // Returns null on success, or an error message.
  const generate = useCallback(() => {
    if (!payload) return 'invalid';
    try {
      generateMatrix(payload, present.customization.errorCorrection);
    } catch (e) {
      return e.message;
    }
    set((p) => ({ ...p, encoded: payload, encodedType: p.type }));
    return null;
  }, [payload, present.customization.errorCorrection, set]);

  return {
    project: present,
    dirty: state.dirty,
    canUndo: state.past.length > 0 || Boolean(state.base),
    canRedo: state.future.length > 0,
    validation,
    payload,
    setType,
    updateField,
    updateCustomization,
    applyTemplate,
    commit,
    generate,
    undo,
    redo,
    load,
    reset,
    rename,
    markSaved,
  };
}