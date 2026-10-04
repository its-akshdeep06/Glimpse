import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

// Informs only - never blocks Save, Download or Share, and never edits the design.
export default function RiskWarnings({ risks }) {
  return (
    <AnimatePresence initial={false}>
      {risks.length > 0 && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
          <div role="status" className="border border-amber-500/40 bg-amber-500/5 p-4">
            <p className="flex items-center gap-2 label-caps text-amber-500"><AlertTriangle className="h-4 w-4" /> Scan reliability</p>
            <ul className="mt-2 space-y-1.5 text-sm">
              {risks.map((r) => (
                <li key={r.id}><span className="font-medium">{r.title}</span> <span className="text-mute">- {r.tip}</span></li>
              ))}
            </ul>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}