import React from 'react';
import { AnimatePresence, motion, useDragControls } from 'framer-motion';

export default function MobileSheet({ open, onClose, children }) {
  const controls = useDragControls();
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-x-0 bottom-0 z-50 flex max-h-[62svh] flex-col rounded-t-[1.75rem] border-t border-carbon bg-panel shadow-[0_-30px_60px_rgba(0,0,0,0.5)]"
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', stiffness: 320, damping: 34 }}
          drag="y"
          dragControls={controls}
          dragListener={false}
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={{ top: 0, bottom: 0.6 }}
          onDragEnd={(_, info) => { if (info.offset.y > 110) onClose(); }}
        >
          <div className="flex cursor-grab touch-none justify-center py-3" onPointerDown={(e) => controls.start(e)}>
            <span className="h-1 w-12 rounded-full bg-steel" />
          </div>
          <div className="overflow-y-auto overscroll-contain">{children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}