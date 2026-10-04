// Pure validation for the five QR types and customization safety checks.

export const QR_TYPES = [
  { id: 'url', label: 'URL' },
  { id: 'text', label: 'Plain Text' },
  { id: 'email', label: 'Email' },
  { id: 'phone', label: 'Phone' },
  { id: 'wifi', label: 'Wi-Fi' },
];

export const emptyData = () => ({
  url: { url: '' },
  text: { text: '' },
  email: { to: '', subject: '', body: '' },
  phone: { phone: '' },
  wifi: { ssid: '', password: '', security: 'WPA', hidden: false },
});

const TYPE_FIELDS = { url: ['url'], text: ['text'], email: ['to', 'subject', 'body'], phone: ['phone'], wifi: ['ssid', 'password'] };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const URL_ERROR = 'Enter a valid web address, e.g. example.com';

const normalizeUrl = (v) => {
  const t = v.trim();
  return /^[a-z][a-z0-9+.-]*:\/\//i.test(t) ? t : `https://${t}`;
};

export function validateField(type, field, values) {
  const v = values[field] ?? '';
  switch (`${type}.${field}`) {
    case 'url.url': {
      if (!v.trim()) return 'Enter a URL.';
      if (/\s/.test(v.trim())) return URL_ERROR;
      try {
        const u = new URL(normalizeUrl(v));
        if (!['http:', 'https:'].includes(u.protocol) || !/\.[a-z]{2,}$/i.test(u.hostname)) return URL_ERROR;
      } catch {
        return URL_ERROR;
      }
      return null;
    }
    case 'text.text':
      if (!v.trim()) return 'Enter some text.';
      return v.length > 1500 ? 'Keep text under 1,500 characters.' : null;
    case 'email.to':
      if (!v.trim()) return 'Enter an email address.';
      return EMAIL_RE.test(v.trim()) ? null : 'That email address looks malformed.';
    case 'email.subject':
      return v.length > 200 ? 'Subject is too long (200 characters max).' : null;
    case 'email.body':
      return v.length > 1000 ? 'Message is too long (1,000 characters max).' : null;
    case 'phone.phone': {
      if (!v.trim()) return 'Enter a phone number.';
      const digits = v.replace(/\D/g, '');
      if (!/^\+?[\d\s\-().]+$/.test(v.trim()) || digits.length < 7 || digits.length > 15) return 'Use 7–15 digits, optionally starting with +.';
      return null;
    }
    case 'wifi.ssid':
      if (!v.trim()) return 'Enter the network name.';
      return new TextEncoder().encode(v).length > 32 ? 'Network names are at most 32 bytes.' : null;
    case 'wifi.password': {
      const sec = values.security;
      if (sec === 'nopass') return v ? "Open networks don't use a password - clear it or choose WPA/WEP." : null;
      if (!v) return 'This security type needs a password.';
      if (sec === 'WPA' && (v.length < 8 || v.length > 63)) return 'WPA passwords are 8–63 characters.';
      if (sec === 'WEP' && ![5, 13].includes(v.length) && !/^([0-9a-f]{10}|[0-9a-f]{26})$/i.test(v)) return 'WEP keys are 5 or 13 characters (or 10/26 hex digits).';
      return null;
    }
    default:
      return null;
  }
}

export function validateType(type, values) {
  const errors = {};
  TYPE_FIELDS[type].forEach((f) => {
    const e = validateField(type, f, values);
    if (e) errors[f] = e;
  });
  return { valid: Object.keys(errors).length === 0, errors };
}

const wifiEscape = (s) => s.replace(/([\\;,:"])/g, '\\$1');

export function buildPayload(type, v) {
  switch (type) {
    case 'url': return normalizeUrl(v.url);
    case 'text': return v.text;
    case 'email': {
      const params = [];
      if (v.subject.trim()) params.push(`subject=${encodeURIComponent(v.subject)}`);
      if (v.body.trim()) params.push(`body=${encodeURIComponent(v.body)}`);
      return `mailto:${v.to.trim()}${params.length ? `?${params.join('&')}` : ''}`;
    }
    case 'phone': return `tel:${v.phone.replace(/[^\d+]/g, '')}`;
    case 'wifi': {
      const pass = v.security !== 'nopass' ? `P:${wifiEscape(v.password)};` : '';
      return `WIFI:T:${v.security};S:${wifiEscape(v.ssid)};${pass}${v.hidden ? 'H:true;' : ''};`;
    }
    default: return '';
  }
}

export function summarize(type, data) {
  const v = data?.[type] || {};
  switch (type) {
    case 'url': return (v.url || '').replace(/^https?:\/\//, '');
    case 'text': return (v.text || '').slice(0, 60);
    case 'email': return v.to;
    case 'phone': return v.phone;
    case 'wifi': return v.ssid ? `Network · ${v.ssid}` : '';
    default: return '';
  }
}

// ---- Customization safety ----

export const SAFE_LOGO = { L: 0.16, M: 0.2, Q: 0.24, H: 0.3 };

function luminance(hex) {
  const raw = hex.replace('#', '');
  const full = raw.length === 3 ? raw.split('').map((c) => c + c).join('') : raw;
  const n = parseInt(full, 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((x) => {
    const s = x / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastRatio(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

export function assessScanRisks(c) {
  const risks = [];
  const ratio = contrastRatio(c.foregroundColor, c.backgroundColor);
  if (ratio < 3) {
    risks.push({ id: 'contrast', title: `Low contrast · ${ratio.toFixed(1)}:1`, tip: 'Darken the foreground or lighten the background - aim for at least 4:1.' });
  }
  if (luminance(c.foregroundColor) > luminance(c.backgroundColor)) {
    risks.push({ id: 'inverted', title: 'Inverted colours', tip: 'Some older scanners struggle with light modules on a dark background. Dark-on-light is safest.' });
  }
  if (c.gradient.enabled && contrastRatio(c.gradient.color, c.backgroundColor) < 3) {
    risks.push({ id: 'gradient', title: 'Aggressive gradient', tip: 'The gradient end colour fades into the background. Pick a darker end colour.' });
  }
  if (c.logo && c.logo.scale > SAFE_LOGO[c.errorCorrection]) {
    risks.push({ id: 'logo', title: 'Logo covers too much', tip: `Shrink the logo below ${Math.round(SAFE_LOGO[c.errorCorrection] * 100)}% or raise error correction to H.` });
  }
  if (c.margin < 2) {
    risks.push({ id: 'margin', title: 'Narrow quiet zone', tip: 'Use a margin of at least 2 modules (4 is the standard).' });
  }
  return risks;
}