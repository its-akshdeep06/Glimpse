import React from 'react';
import { motion } from 'framer-motion';

export default function BlueGlow({ className = '' }) {
  return (
    <div className={`pointer-events-none absolute inset-0 -z-10 overflow-hidden ${className}`}>
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        style={{ willChange: 'transform, opacity' }}
        className="absolute -right-[10%] top-[5%] h-[50vw] w-[50vw] rounded-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-600/50 dark:from-blue-600/20 to-transparent"
      />
      <motion.div
        animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        style={{ willChange: 'transform, opacity' }}
        className="absolute -left-[15%] top-[40%] h-[60vw] w-[60vw] rounded-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-500/50 dark:from-cyan-500/20 to-transparent"
      />
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 4 }}
        style={{ willChange: 'transform, opacity' }}
        className="absolute -bottom-[10%] right-[10%] h-[55vw] w-[55vw] rounded-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-600/50 dark:from-indigo-600/20 to-transparent"
      />
    </div>
  );
}
