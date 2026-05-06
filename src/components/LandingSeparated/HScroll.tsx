'use client';

import { useEffect, useRef } from 'react';
import { HSCROLL_PRODUCTS } from '@/lib/data';

/**
 * Drag-to-scroll horizontal product strip.
 * Ports the original mousedown / mousemove drag logic to React refs.
 */
export default function HScroll() {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;
    let frameId: number | null = null;
    let lastX = 0;

    const down = (e: MouseEvent) => {
      isDown = true;
      track.style.cursor = 'grabbing';
      startX = e.pageX - track.offsetLeft;
      scrollLeft = track.scrollLeft;
    };
    const up = () => {
      isDown = false;
      track.style.cursor = 'grab';
    };
    const move = (e: MouseEvent) => {
      if (!isDown) return;
      lastX = e.pageX - track.offsetLeft;

      if (frameId) return;

      frameId = requestAnimationFrame(() => {
        const x = lastX;
        track.scrollLeft = scrollLeft - (x - startX) * 2;
        frameId = null;
      });
    };

    track.addEventListener('mousedown', down);
    track.addEventListener('mouseleave', up);
    track.addEventListener('mouseup', up);
    track.addEventListener('mousemove', move, { passive: true });

    return () => {
      track.removeEventListener('mousedown', down);
      track.removeEventListener('mouseleave', up);
      track.removeEventListener('mouseup', up);
      track.removeEventListener('mousemove', move);
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <section className="hscroll-section">
      <div className="hscroll-header">
        <div>
          <div className="section-eyebrow">جدیدترین‌ها</div>
          <h2 className="section-title-lg">
            تازه <span className="g">رسیده‌ها</span>
          </h2>
        </div>
        <a href="#new" className="link-arrow">همه جدیدها ←</a>
      </div>

      <div className="hscroll-track" ref={trackRef}>
        {HSCROLL_PRODUCTS.map((p) => (
          <div className="hscroll-card" key={p.name}>
            <div className="hscroll-img">{p.emoji}</div>
            <div className="hscroll-body">
              <div className="hscroll-brand">{p.brand}</div>
              <div className="hscroll-name">{p.name}</div>
              <div className="hscroll-footer">
                <div className="hscroll-price">{p.price} هزار</div>
                {p.isNew && <span className="hscroll-badge">جدید</span>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
