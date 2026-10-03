import { getAutoNameCounter, setAutoNameCounter } from '@/services/storageService';

const formatName = (n) => `QR Code ${String(n).padStart(2, '0')}`;

export function peekNextAutoName() {
  return formatName(getAutoNameCounter() + 1);
}

// Increments the persisted counter, so deleted automatic names are never reused.
export function reserveAutoName() {
  const n = getAutoNameCounter() + 1;
  setAutoNameCounter(n);
  return formatName(n);
}

export function resolveName(input) {
  const trimmed = (input || '').trim();
  return trimmed || reserveAutoName();
}