import React, { useId, useMemo } from 'react';
import { computeLayout, moduleShape, finderRects, gradientSpec } from '@/services/qrService';

// Live SVG rendering of a QR. Modules fly in from the centre whenever `assembleKey` changes;
// colour changes transition smoothly without re-assembling.
export default function QRArt({ matrix, customization: c, animate = true, assembleKey = 'static', className = '' }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const layout = useMemo(() => computeLayout(matrix, c.margin, c.logo), [matrix, c.margin, c.logo]);
  const fill = c.gradient.enabled ? `url(#g${uid})` : c.foregroundColor;
  const grad = c.gradient.enabled ? gradientSpec(c.gradient, layout.total) : null;
  const Grad = grad?.tag;

  const modules = useMemo(() => layout.modules.map((m) => {
    const { tag, attrs } = moduleShape(c.moduleStyle, m.x, m.y);
    const style = animate
      ? /** @type {import('react').CSSProperties & { '--d': string; '--tx': string; '--ty': string }} */ ({ '--d': `${m.delay}ms`, '--tx': `${m.tx}px`, '--ty': `${m.ty}px` })
      : undefined;
    return React.createElement(tag, {
      ...attrs,
      key: `${m.x}.${m.y}`,
      className: animate ? 'qm' : undefined,
      style,
    });
  }), [layout, c.moduleStyle, animate]);

  const L = layout.logo;
  return (
    <svg viewBox={`0 0 ${layout.total} ${layout.total}`} className={className} role="img" aria-label="QR code preview">
      {grad && (
        <defs>
          {React.createElement(grad.tag, { id: `g${uid}`, ...grad.attrs },
            <stop offset="0" stopColor={c.foregroundColor} className="qr-stop" />,
            <stop offset="1" stopColor={c.gradient.color} className="qr-stop" />,
          )}
        </defs>
      )}
      <rect width={layout.total} height={layout.total} fill={c.backgroundColor} className="qr-paint" />
      <g key={assembleKey} fill={fill} className="qr-paint">{modules}</g>
      <g key={`f-${assembleKey}`}>
        {layout.finders.map((f, i) => (
          <g key={i} className={animate ? 'qf' : undefined} style={animate ? /** @type {import('react').CSSProperties & { '--d': string }} */ ({ '--d': `${i * 90}ms` }) : undefined}>
            {finderRects(c.moduleStyle, f).map((r, j) => (
              <rect key={j} x={r.x} y={r.y} width={r.size} height={r.size} rx={r.rx} fill={r.layer === 'bg' ? c.backgroundColor : fill} className="qr-paint" />
            ))}
          </g>
        ))}
      </g>
      {L && (
        <g className={animate ? 'qf' : undefined} style={animate ? /** @type {import('react').CSSProperties & { '--d': string }} */ ({ '--d': '450ms' }) : undefined}>
          <rect x={L.x - L.pad} y={L.y - L.pad} width={L.size + L.pad * 2} height={L.size + L.pad * 2} rx={L.pad * 1.2} fill={c.backgroundColor} className="qr-paint" />
          <image href={c.logo.dataUrl} x={L.x} y={L.y} width={L.size} height={L.size} preserveAspectRatio="xMidYMid meet" />
        </g>
      )}
    </svg>
  );
}