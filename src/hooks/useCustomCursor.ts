import { useEffect, useRef } from 'react';

export function useCustomCursor() {
  useEffect(() => {
    const cursor = document.getElementById('cursor');
    const cursorRing = document.getElementById('cursor-ring');

    if (!cursor || !cursorRing) return;

    let frameId: number | null = null;
    let lastPos = { x: 0, y: 0 };

    const handleMouseMove = (e: MouseEvent) => {
      lastPos = { x: e.clientX, y: e.clientY };

      if (frameId) return;

      frameId = requestAnimationFrame(() => {
        cursor.style.transform = `translate(${lastPos.x}px, ${lastPos.y}px)`;
        cursorRing.style.transform = `translate(${lastPos.x}px, ${lastPos.y}px)`;
        frameId = null;
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, []);
}
