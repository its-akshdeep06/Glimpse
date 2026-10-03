import { useEffect } from 'react';
import { getSettings } from '@/services/storageService';

export default function ThemeManager() {
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: light)');
    const apply = () => {
      const { theme } = getSettings();
      const light = theme === 'light' || (theme === 'system' && mq.matches);
      document.documentElement.classList.toggle('light', light);
    };
    apply();
    window.addEventListener('module:settings', apply);
    mq.addEventListener('change', apply);
    return () => {
      window.removeEventListener('module:settings', apply);
      mq.removeEventListener('change', apply);
    };
  }, []);
  return null;
}