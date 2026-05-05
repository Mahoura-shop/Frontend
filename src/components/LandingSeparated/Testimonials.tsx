'use client';

import { useRevealChildren } from '@/hooks/useReveal';
import { TESTIMONIALS } from '@/lib/data';

export default function Testimonials() {
  const ref = useRevealChildren<HTMLDivElement>('.testi-card', 100);

  return (
    <section className="testi-section">
      <div className="testi-inner">
        <div className="testi-header">
          <h2 className="testi-title">
            هزاران مشتری راضی،<br />
            <span className="g">داستان واقعی</span>
          </h2>
          <div className="testi-stats">
            <div>
              <div className="testi-stat-num">۴.۹</div>
              <div className="testi-stat-label">امتیاز کلی</div>
            </div>
            <div>
              <div className="testi-stat-num">۱۲k+</div>
              <div className="testi-stat-label">نظر تایید شده</div>
            </div>
          </div>
        </div>

        <div className="testi-grid" ref={ref}>
          {TESTIMONIALS.map((t) => (
            <div className="testi-card" key={t.id}>
              <div className="testi-stars">★★★★★</div>
              <p className="testi-quote">{t.quote}</p>
              <div className="testi-author">
                <div className="testi-avatar">{t.author.charAt(0)}</div>
                <div>
                  <div className="testi-name">{t.author}</div>
                  <div className="testi-role">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
