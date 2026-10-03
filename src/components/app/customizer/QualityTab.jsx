import React from 'react';
import Segmented from '@/components/app/Segmented';
import LogoControl from '@/components/app/customizer/LogoControl';

const LEVELS = [{ value: 'L', label: 'L · 7%' }, { value: 'M', label: 'M · 15%' }, { value: 'Q', label: 'Q · 25%' }, { value: 'H', label: 'H · 30%' }];

export default function QualityTab({ c, update, commit, notify }) {
  return (
    <div className="space-y-10">
      <div>
        <span className="label-caps text-mute">Error correction</span>
        <div className="mt-3"><Segmented options={LEVELS} value={c.errorCorrection} onChange={(v) => update({ errorCorrection: v })} /></div>
        <p className="mt-3 text-sm leading-relaxed text-mute">Higher levels survive more damage and leave room for a logo, but make the pattern denser.</p>
      </div>
      <LogoControl c={c} update={update} commit={commit} notify={notify} />
    </div>
  );
}