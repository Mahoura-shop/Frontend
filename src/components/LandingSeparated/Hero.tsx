'use client';

import { useEffect, useState } from 'react';

/**
 * Hero — headline + card stack + KPI strip.
 * All entrance animation kicks off via the `.visible` class which the CSS
 * transitions to translateY(0). We toggle it after a tick so the initial
 * paint shows the offset state, then animates in.
 */
export default function Hero() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const t = window.setTimeout(() => setShow(true), 100);
    return () => clearTimeout(t);
  }, []);

  const v = (cls: string) => `${cls}${show ? ' visible' : ''}`;

  return (
    <section className="hero">
      <div className="hero-mesh" aria-hidden />
      <div className="hero-noise" aria-hidden />
      <div className="orb orb-1" aria-hidden />
      <div className="orb orb-2" aria-hidden />
      <div className="orb orb-3" aria-hidden />

      <div className="hero-inner">
        <div className="hero-text">
          <div className={v('hero-eyebrow')}>
            <span className="hero-eyebrow-line" />
            مجموعه پاییز ۱۴۰۴
          </div>

          <h1 className="hero-title">
            <span className="word-wrap"><span className={v('word')}>زیبایی</span></span>{' '}
            <span className="word-wrap"><span className={v('word word-g')}>اصیل</span></span>
            <br />
            <span className="word-wrap"><span className={v('word')}>برای امروز</span></span>
          </h1>

          <p className={v('hero-sub')}>
            مجموعه‌ای از برندهای دست‌چین شده ایران و جهان. محصولات اصل، با ارسال سریع و مشاوره تخصصی برای هر نوع پوست.
          </p>

          <div className={v('hero-actions')}>
            <button className="btn-hero-primary">
              مشاهده محصولات
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </button>
            <button className="btn-hero-ghost">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
              تماشای ویدیو
            </button>
          </div>
        </div>

        <div className={`hero-visual${show ? ' visible' : ''}`}>
          <div className="card-stack">
            <div className="stack-card stack-card-3">
              <div className="card-inner">
                <div className="card-glow" />
                <div className="card-emoji" style={{ position: 'relative' }}>🌸</div>
                <div className="card-badge" style={{ position: 'relative' }}>عطر</div>
              </div>
            </div>
            <div className="stack-card stack-card-2">
              <div className="card-inner">
                <div className="card-glow" />
                <div className="card-emoji" style={{ position: 'relative' }}>💄</div>
                <div className="card-badge" style={{ position: 'relative' }}>رژ لب</div>
                <div className="card-name" style={{ position: 'relative' }}>مات مخملی</div>
              </div>
            </div>
            <div className="stack-card stack-card-1">
              <div className="card-inner">
                <div className="card-glow" />
                <div className="card-emoji" style={{ position: 'relative' }}>✨</div>
                <div className="card-badge" style={{ position: 'relative' }}>پرفروش</div>
                <div className="card-name" style={{ position: 'relative' }}>سرم ویتامین C</div>
                <div className="card-divider" style={{ position: 'relative' }} />
                <div className="card-price" style={{ position: 'relative' }}>۸۹۰</div>
              </div>
            </div>

            <div className="float-el float-el-1">
              <div className="pill"><span className="pill-dot" /> جدید این هفته</div>
            </div>
            <div className="float-el float-el-2">
              <div className="pill"><span className="pill-dot pill-dot-green" /> موجود</div>
            </div>
            <div className="float-el float-el-3">
              <div className="pill">⭐ ۴.۹ از ۵</div>
            </div>
          </div>
        </div>
      </div>

      <div className={v('hero-bottom')}>
        <div className="hero-stat">
          <div className="hero-stat-num">+۱۰۰k</div>
          <div className="hero-stat-label">مشتری راضی</div>
        </div>
        <div className="hero-stat">
          <div className="hero-stat-num">+۲۵۰</div>
          <div className="hero-stat-label">برند معتبر</div>
        </div>
        <div className="hero-stat">
          <div className="hero-stat-num">۹۸٪</div>
          <div className="hero-stat-label">رضایت مشتری</div>
        </div>
        <div className="hero-stat">
          <div className="hero-stat-num">۲۴h</div>
          <div className="hero-stat-label">ارسال در تهران</div>
        </div>
      </div>

      <div className="hero-scroll">
        <span className="hero-scroll-text">scroll</span>
        <span className="hero-scroll-line" />
      </div>
    </section>
  );
}
