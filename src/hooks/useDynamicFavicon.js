import { useEffect } from 'react';
import { generateMatrix } from '@/services/qrService';

// The favicon is a tiny QR that shifts shape with the current page.
export default function useDynamicFavicon(seed) {
  useEffect(() => {
    const matrix = generateMatrix(`module/${seed}`, 'L');
    const scale = 2;
    const pad = 1;
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = (matrix.length + pad * 2) * scale;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#1A73E8';
    matrix.forEach((row, y) => row.forEach((on, x) => {
      if (on) ctx.fillRect((x + pad) * scale, (y + pad) * scale, scale, scale);
    }));
    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.href = canvas.toDataURL('image/png');
  }, [seed]);
}