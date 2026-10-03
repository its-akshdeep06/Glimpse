import React from 'react';
import Field from '@/components/app/Field';
import Segmented from '@/components/app/Segmented';
import Toggle from '@/components/app/Toggle';

const SECURITY = [{ value: 'WPA', label: 'WPA/WPA2' }, { value: 'WEP', label: 'WEP' }, { value: 'nopass', label: 'Open' }];

export default function TypeFields({ type, values, error, onChange }) {
  const bind = (field) => ({ value: values[field], onChange: (e) => onChange(field, e.target.value), className: 'field', 'aria-invalid': Boolean(error(field)) });

  if (type === 'url') {
    return <Field label="Website address" error={error('url')}><input {...bind('url')} inputMode="url" autoComplete="url" placeholder="example.com/launch" /></Field>;
  }
  if (type === 'text') {
    return <Field label="Text" error={error('text')} hint={`${values.text.length} / 1500`}><textarea {...bind('text')} rows={5} placeholder="Anything you want people to read…" className="field resize-none" /></Field>;
  }
  if (type === 'email') {
    return (
      <div className="space-y-8">
        <Field label="Recipient" error={error('to')}><input {...bind('to')} type="email" inputMode="email" placeholder="hello@studio.com" /></Field>
        <Field label="Subject · optional" error={error('subject')}><input {...bind('subject')} placeholder="Project enquiry" /></Field>
        <Field label="Message · optional" error={error('body')}><textarea {...bind('body')} rows={3} placeholder="Hi there —" className="field resize-none" /></Field>
      </div>
    );
  }
  if (type === 'phone') {
    return <Field label="Phone number" error={error('phone')} hint="Include country code"><input {...bind('phone')} type="tel" inputMode="tel" placeholder="+1 555 010 0199" /></Field>;
  }
  const open = values.security === 'nopass';
  return (
    <div className="space-y-8">
      <Field label="Network name (SSID)" error={error('ssid')}><input {...bind('ssid')} placeholder="Studio-5G" autoComplete="off" /></Field>
      <Field label="Security" asDiv>
        <div className="mt-3"><Segmented options={SECURITY} value={values.security} onChange={(v) => onChange('security', v)} /></div>
      </Field>
      <Field label="Password" error={error('password')}>
        <input {...bind('password')} autoComplete="off" disabled={open && !values.password} placeholder={open ? 'Not needed for open networks' : 'Network password'} />
      </Field>
      <div className="flex items-center justify-between">
        <span className="label-caps text-mute">Hidden network</span>
        <Toggle checked={values.hidden} onChange={(v) => onChange('hidden', v)} label="Hidden network" />
      </div>
    </div>
  );
}