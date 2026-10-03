import React from 'react';
import { motion } from 'framer-motion';

export default function Reveal({ children, delay = 0, className = '', y = 40 }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ duration: 0.9, delay, ease: [0.2, 0.9, 0.1, 1] }}
    >
      {children}
    </motion.div>
  );
}