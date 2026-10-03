import React, { useRef } from 'react';
import { ImagePlus } from 'lucide-react';
import RangeField from '@/components/app/customizer/RangeField';
import { prepareLogo } from '@/services/qrService';
import { SAFE_LOGO } from '@/utils/validation';

export default function LogoControl({ c, update, commit, notify }) {
  const inputRef = useRef(null);
  const safe = SAFE_LOGO[c.errorCorrection];

  const onFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) { notify('Please choose an image file.'); return; }
    try {
      const { dataUrl, downscaled } = await prepareLogo(file);
      update({ logo: { dataUrl, scale: Math.min(0.2, safe) } });
      if (downscaled) notify('Large logo scaled down to a safe size.');
    } catch {
      notify('That image could not be read.');
    }
  };

  return (
    <div>
      <span className="label-caps text-mute">Logo</span>
      {c.logo ? (
        <div className="mt-4 space-y-6">
          <div className="flex items-center gap-4">
            <img src={c.logo.dataUrl} alt="Uploaded logo" className="h-14 w-14 rounded-lg bg-white object-contain p-1 ring-1 ring-carbon" />
            <div className="flex gap-2">
              <button type="button" onClick={() => inputRef.current.click()} className="rounded-full border border-carbon px-4 py-2 label-caps hover:border-ink">Replace</button>
              <button type="button" onClick={() => update({ logo: null })} className="rounded-full border border-carbon px-4 py-2 label-caps text-[#FF6B5B] hover:border-[#FF6B5B]">Remove</button>
            </div>
          </div>
          <RangeField
            label="Logo size"
            value={Math.round(c.logo.scale * 100)}
            min={8}
            max={35}
            format={(v) => `${v}%`}
            marker={Math.round(safe * 100)}
            onChange={(v) => update({ logo: { ...c.logo, scale: v / 100 } }, true)}
            onCommit={commit}
          />
          <p className="text-sm text-mute">The amber line marks the safe maximum at error correction {c.errorCorrection}.</p>
        </div>
      ) : (
        <button type="button" onClick={() => inputRef.current.click()} className="group mt-4 flex w-full flex-col items-center justify-center gap-3 border border-dashed border-carbon py-10 transition-colors hover:border-volt-text">
          <ImagePlus className="h-6 w-6 text-mute transition-transform group-hover:scale-110 group-hover:text-volt-text" />
          <span className="label-caps">Upload logo</span>
          <span className="px-6 text-center text-sm text-mute">PNG, JPG or SVG — oversized images are scaled automatically</span>
        </button>
      )}
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={onFile} />
    </div>
  );
}