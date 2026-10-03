import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';
import Field from '@/components/app/Field';
import TypeSelector from '@/components/app/TypeSelector';
import TypeFields from '@/components/app/TypeFields';
import Magnetic from '@/components/fx/Magnetic';
import { peekNextAutoName } from '@/utils/naming';

export default function QRForm({ qr, onGenerate }) {
  const { project, validation, payload } = qr;
  const values = project.data[project.type];
  const [touched, setTouched] = useState({});
  const upToDate = Boolean(payload) && payload === project.encoded;
  const disabled = !validation.valid || upToDate;

  const error = (field) => (touched[`${project.type}.${field}`] ? validation.errors[field] : null);
  const change = (field, value) => {
    setTouched((t) => ({ ...t, [`${project.type}.${field}`]: true }));
    qr.updateField(field, value);
  };
  const submit = (e) => {
    e.preventDefault();
    if (!disabled) onGenerate();
  };
  const label = project.encoded ? (upToDate ? 'QR is up to date' : 'Update QR') : 'Generate QR';

  return (
    <form onSubmit={submit} className="space-y-10 p-6 md:p-10" noValidate>
      <div>
        <p className="label-caps text-mute">01 — Content</p>
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
      <Magnetic strength={0.12} className="w-full">
        <button type="submit" disabled={disabled} className="group relative flex w-full items-center justify-between overflow-hidden rounded-full bg-volt px-7 py-5 text-on-volt transition-colors disabled:cursor-not-allowed disabled:bg-carbon disabled:text-mute">
          <span className="relative z-10 label-caps font-semibold">{label}</span>
          {upToDate ? <Check className="relative z-10 h-5 w-5" /> : <ArrowRight className="relative z-10 h-5 w-5 transition-transform group-hover:translate-x-1" />}
          {!disabled && <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/60 to-transparent group-hover:animate-[sheen_0.9s_ease]" />}
        </button>
      </Magnetic>
    </form>
  );
}