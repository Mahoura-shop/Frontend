'use client';

import { useRevealChildren } from '@/hooks/useReveal';
import { CATEGORIES } from '@/lib/data';

// Background gradients per tone — keeps the mapping out of the data file
// so designers can tune colors here without touching content.
const TONE_BG: Record<string, string> = {
  rose:  'linear-gradient(160deg, #d4a5a5 0%, #b88787 100%)',
  plum:  'linear-gradient(160deg, #6b4e71 0%, #4a3550 100%)',
  gold:  'linear-gradient(160deg, #c9a875 0%, #a08856 100%)',
  cream: 'linear-gradient(160deg, #e8e6e3 0%, #c4c0bb 100%)',
  mauve: 'linear-gradient(160deg, #9b7d8a 0%, #6f5763 100%)',
};

export default function Categories() {
  const ref = useRevealChildren<HTMLDivElement>('.cat-card', 90);

  return (
    <section className="section" id="categories">
      <div className="section-inner">
        <div className="section-header-row">
          <div>
            <div className="section-eyebrow">دسته‌بندی محصولات</div>
            <h2 className="section-title-lg">
              همه چیز برای <span className="g">زیبایی شما</span>
            </h2>
          </div>
          <a href="#all" className="link-arrow">مشاهده همه ←</a>
        </div>

        <div className="cats-grid" ref={ref}>
          {CATEGORIES.map((cat) => (
            <div className="cat-card" key={cat.name}>
              <div className="cat-bg" style={{ background: TONE_BG[cat.tone], fontSize: 80 }}>
                {cat.emoji}
              </div>
              <div className="cat-overlay" />
              <div className="cat-info">
                <div className="cat-label">{cat.label}</div>
                <div className="cat-name">{cat.name}</div>
                <div className="cat-count">{cat.count}</div>
                <span className="cat-cta">مشاهده ←</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
