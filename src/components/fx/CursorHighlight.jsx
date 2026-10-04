import { useEffect, useRef } from 'react';

export default function CursorHighlight() {
  const cursorRef = useRef(null);

  useEffect(() => {
    const media = window.matchMedia('(hover: hover) and (pointer: fine)');
    if (!media.matches) return undefined;

    const cursor = cursorRef.current;
    const root = document.documentElement;
    const interactiveSelector = 'a, button, input, select, textarea, summary, [role="button"], [tabindex]:not([tabindex="-1"]), [contenteditable="true"]';
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let hasPosition = false;
    let frame = null;

    const animate = () => {
      currentX += (targetX - currentX) * 0.2;
      currentY += (targetY - currentY) * 0.2;
      cursor.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%)`;

      if (Math.abs(targetX - currentX) > 0.1 || Math.abs(targetY - currentY) > 0.1) {
        frame = window.requestAnimationFrame(animate);
      } else {
        frame = null;
      }
    };

    const onMove = (event) => {
      if (event.pointerType !== 'mouse') return;

      targetX = event.clientX;
      targetY = event.clientY;
      if (!hasPosition) {
        currentX = targetX;
        currentY = targetY;
        hasPosition = true;
        cursor.classList.add('is-visible');
      }

      const target = event.target instanceof Element ? event.target : null;
      cursor.classList.toggle('is-hovering', Boolean(target?.closest(interactiveSelector)));
      if (frame === null) frame = window.requestAnimationFrame(animate);
    };
    const onLeave = () => {
      hasPosition = false;
      cursor.classList.remove('is-visible', 'is-hovering');
    };

    root.classList.add('custom-cursor');
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerleave', onLeave);
    window.addEventListener('blur', onLeave);
    return () => {
      root.classList.remove('custom-cursor');
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('blur', onLeave);
      if (frame !== null) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={cursorRef} aria-hidden="true" className="cursor-highlight">
      <span className="cursor-highlight__center" />
    </div>
  );
}