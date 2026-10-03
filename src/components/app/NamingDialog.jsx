import React, { useEffect, useState } from 'react';
import Modal from '@/components/app/Modal';

export default function NamingDialog({ request, onClose }) {
  const [value, setValue] = useState('');
  useEffect(() => { if (request) setValue(''); }, [request]);

  const submit = (e) => {
    e.preventDefault();
    if (value.trim()) request.onResolve(value);
  };

  return (
    <Modal open={Boolean(request)} onClose={onClose}>
      {request && (
        <form onSubmit={submit}>
          <p className="label-caps text-volt-text">Name this code</p>
          <h2 className="mt-2 font-wide text-2xl font-extrabold uppercase">Give it a name?</h2>
          <p className="mt-2 text-mute">Names only help you find it later — they're never encoded.</p>
          <input autoFocus value={value} onChange={(e) => setValue(e.target.value)} className="field mt-6" placeholder={request.suggestion} maxLength={60} />
          <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button type="button" onClick={() => request.onResolve('')} className="rounded-full border border-carbon px-5 py-3 label-caps hover:border-ink">Skip · use {request.suggestion}</button>
            <button type="submit" disabled={!value.trim()} className="rounded-full bg-volt px-6 py-3 label-caps font-semibold text-on-volt disabled:bg-carbon disabled:text-mute">Save name</button>
          </div>
        </form>
      )}
    </Modal>
  );
}