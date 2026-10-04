// Visual presets only - they never contain or change QR content.
const g = (enabled, color, type = 'linear', angle = 135) => ({ enabled, type, color, angle });

export const TEMPLATES = [
  { id: 'monolith', name: 'Monolith', note: 'Pure contrast, zero noise', customization: { foregroundColor: '#0B0B0C', backgroundColor: '#FFFFFF', gradient: g(false, '#0B0B0C'), moduleStyle: 'square', margin: 4 } },
  { id: 'volt', name: 'Azure Signal', note: 'Electric azure on paper', customization: { foregroundColor: '#1A73E8', backgroundColor: '#F6FAFF', gradient: g(true, '#4285F4'), moduleStyle: 'rounded', margin: 3 } },
  { id: 'satin', name: 'Silver Satin', note: 'Graphite gradient, soft dots', customization: { foregroundColor: '#1A1A1D', backgroundColor: '#F0F0F2', gradient: g(true, '#5C5C66', 'linear', 90), moduleStyle: 'dot', margin: 4 } },
  { id: 'ember', name: 'Ember', note: 'Radial heat on paper', customization: { foregroundColor: '#5E1500', backgroundColor: '#FFF4EC', gradient: g(true, '#C2410C', 'radial'), moduleStyle: 'rounded', margin: 4 } },
  { id: 'tide', name: 'Deep Tide', note: 'Oceanic navy dots', customization: { foregroundColor: '#0B2545', backgroundColor: '#EEF4ED', gradient: g(true, '#1D5C96', 'linear', 45), moduleStyle: 'dot', margin: 4 } },
  { id: 'moss', name: 'Slate', note: 'Quiet graphite calm', customization: { foregroundColor: '#3C4043', backgroundColor: '#F1F3F4', gradient: g(false, '#3C4043'), moduleStyle: 'square', margin: 3 } },
  { id: 'aubergine', name: 'Aubergine', note: 'Plum to magenta sweep', customization: { foregroundColor: '#2E0839', backgroundColor: '#FBEFF6', gradient: g(true, '#8E2C6E', 'linear', 160), moduleStyle: 'rounded', margin: 4 } },
  { id: 'nocturne', name: 'Nocturne', note: 'Inverted azure on obsidian', customization: { foregroundColor: '#8AB4F8', backgroundColor: '#0A0A0A', gradient: g(false, '#8AB4F8'), moduleStyle: 'square', margin: 4 } },
];

// Replaces every visual setting the template represents; keeps size, logo and error correction.
export function applyTemplateTo(current, tpl) {
  return { ...current, ...tpl.customization, gradient: { ...tpl.customization.gradient }, templateId: tpl.id };
}