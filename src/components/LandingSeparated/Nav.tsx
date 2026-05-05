'use client';

import { useEffect, useState } from 'react';

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`nav${scrolled ? ' scrolled' : ''}`} data-nav>
      <a href="#" className="nav-logo">مهورا</a>

      <div className="nav-links">
        <a href="#categories">دسته‌بندی</a>
        <a href="#products">محصولات</a>
        <a href="#about">داستان ما</a>
        <a href="#brands">برندها</a>
        <a href="#blog">مجله</a>
      </div>

      <button className="nav-cta">
        ورود / ثبت‌نام
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginRight: 6 }}>
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
      </button>
    </nav>
  );
}
