import React, { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import SectionHeader from '@/components/app/SectionHeader';
import Segmented from '@/components/app/Segmented';
import { getSettings, updateSettings } from '@/services/storageService';

const THEMES = [{ value: 'light', label: 'Light' }, { value: 'dark', label: 'Dark' }, { value: 'system', label: 'System' }];
const FORMATS = [{ value: 'png', label: 'PNG' }, { value: 'svg', label: 'SVG' }];
const DANGER = [
  { kind: 'recents', label: 'Clear Recents', text: 'Remove every saved project from Recents.' },
  { kind: 'favorites', label: 'Clear Favorites', text: 'Unpin every favorite project.' },
  { kind: 'downloads', label: 'Clear Downloads', text: 'Delete the stored download history.' },
  { kind: 'all', label: 'Clear all local data', text: 'Erase everything Glimpse stores in this browser.' },
];

function Row({ title, text, children }) {
  return (
    <div className="grid gap-4 border-t border-carbon py-8 md:grid-cols-[1fr_auto] md:items-center">
      <div>
        <h3 className="font-wide text-lg font-bold uppercase">{title}</h3>
        <p className="mt-1 text-mute">{text}</p>
      </div>
      <div className="md:min-w-[320px]">{children}</div>
    </div>
  );
}

export default function SettingsSection({ onClear }) {
  const [settings, setSettings] = useState(getSettings);
  useEffect(() => {
    const h = () => setSettings(getSettings());
    window.addEventListener('module:settings', h);
    return () => window.removeEventListener('module:settings', h);
  }, []);
  const set = (patch) => setSettings(updateSettings(patch));

  return (
    <div className="px-5 py-10 md:px-10 md:py-16">
      <SectionHeader index="06" title="Settings" meta="Stored in this browser" />
      <div className="mt-12 max-w-4xl">
        <Row title="Theme" text="Choose light, dark, or follow your system.">
          <Segmented options={THEMES} value={settings.theme} onChange={(v) => set({ theme: v })} />
        </Row>
        <Row title="Download format" text="PNG for everyday use, SVG for print and infinite scaling.">
          <Segmented options={FORMATS} value={settings.downloadFormat} onChange={(v) => set({ downloadFormat: v })} />
        </Row>
        <p className="mt-12 label-caps text-[#FF6B5B]">Danger zone</p>
        <div className="mt-4">
          {DANGER.map((d) => (
            <Row key={d.kind} title={d.label} text={d.text}>
              <button type="button" onClick={() => onClear(d.kind)} className="flex w-full items-center justify-center gap-2 rounded-full border border-[#FF5A4E]/50 px-5 py-3 label-caps text-[#FF6B5B] transition-colors hover:bg-[#FF5A4E] hover:text-white">
                <Trash2 className="h-4 w-4" /> {d.label}
              </button>
            </Row>
          ))}
        </div>
      </div>
    </div>
  );
}