import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Field from '@/components/app/Field';
import TypeSelector from '@/components/app/TypeSelector';
import TypeFields from '@/components/app/TypeFields';
import { peekNextAutoName } from '@/utils/naming';

export default function QRForm({ qr }) {
  const { project, validation } = qr;
  const values = project.data[project.type];
  const [touched, setTouched] = useState({});

  const error = (field) => (touched[`${project.type}.${field}`] ? validation.errors[field] : null);
  const change = (field, value) => {
    setTouched((t) => ({ ...t, [`${project.type}.${field}`]: true }));
    qr.updateField(field, value);
  };

  return (
    <form onSubmit={(e) => e.preventDefault()} className="space-y-10 p-6 md:p-10" noValidate>
      <div>
        <p className="label-caps text-mute">01 - Content</p>
        <h2 className="mt-2 font-wide text-3xl font-extrabold uppercase leading-none tracking-tight">What should it say?</h2>
      </div>
      <Field label="Name · optional" hint="Never encoded">
        <input value={project.name} onChange={(e) => qr.rename(e.target.value)} placeholder={peekNextAutoName()} className="field" maxLength={60} />
      </Field>
      <TypeSelector value={project.type} onChange={qr.setType} />
      <AnimatePresence mode="wait">
        <motion.div key={project.type} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }} transition={{ duration: 0.25 }}>
          <TypeFields type={project.type} values={values} error={error} onChange={change} />
        </motion.div>
      </AnimatePresence>
    </form>
  );
}