import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';

const ToastContext = createContext(null);

function ToastItem({ toast, onDismiss }) {
  const error = toast.tone === 'error';
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: -40, transition: { duration: 0.2 } }}
      transition={{ type: 'spring', stiffness: 420, damping: 32 }}
      className={`relative overflow-hidden border bg-panel/95 shadow-2xl backdrop-blur-xl ${error ? 'border-[#FF5A4E]/60' : 'border-carbon'}`}
      role="status"
    >
      <div className="flex items-center gap-4 px-4 py-3.5">
        <span className={`h-2 w-2 shrink-0 ${error ? 'bg-[#FF5A4E]' : 'bg-volt'}`} />
        <p className="flex-1 text-sm">{toast.message}</p>
        {toast.actionLabel && (
          <button onClick={() => { toast.onAction(); onDismiss(); }} className="label-caps text-volt-text hover:underline">{toast.actionLabel}</button>
        )}
        <button onClick={onDismiss} aria-label="Dismiss" className="text-mute hover:text-ink"><X className="h-4 w-4" /></button>
      </div>
      <motion.span className="absolute bottom-0 left-0 h-[2px] w-full origin-left bg-volt-text" initial={{ scaleX: 1 }} animate={{ scaleX: 0 }} transition={{ duration: toast.duration / 1000, ease: 'linear' }} />
    </motion.div>
  );
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const dismiss = useCallback((id) => setToasts((t) => t.filter((x) => x.id !== id)), []);
  const show = useCallback((opts) => {
    const id = Math.random().toString(36).slice(2);
    const duration = opts.duration ?? 5000;
    setToasts((t) => [...t.slice(-2), { id, duration, ...opts }]);
    setTimeout(() => dismiss(id), duration);
    return id;
  }, [dismiss]);
  const value = useMemo(() => ({ show, dismiss }), [show, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed bottom-28 left-4 right-4 z-[70] flex flex-col gap-2 sm:bottom-6 sm:left-6 sm:right-auto sm:w-[380px]">
        <AnimatePresence>
          {toasts.map((t) => <ToastItem key={t.id} toast={t} onDismiss={() => dismiss(t.id)} />)}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);