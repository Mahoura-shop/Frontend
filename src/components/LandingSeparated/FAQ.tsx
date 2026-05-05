'use client';

import { useState } from 'react';
import { FAQ_ITEMS } from '@/lib/data';

export default function FAQ() {
  // Collapsible behavior: click toggles the same item, clicking another closes the previous.
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section className="faq-section">
      <div className="faq-inner">
        <aside className="faq-aside">
          <div className="faq-eyebrow">سوالات متداول</div>
          <h2 className="faq-h2">پاسخ سوالات شما</h2>
          <p className="faq-aside-text">
            هر سوالی درباره محصولات، ارسال یا مرجوعی دارید، احتمالاً جوابش اینجاست. اگه پیدا نکردید، با ما تماس بگیرید.
          </p>
          <a href="#contact" className="faq-aside-cta">
            تماس با پشتیبانی
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </a>
        </aside>

        <div className="faq-list">
          {FAQ_ITEMS.map((item, i) => {
            const open = openIdx === i;
            return (
              <div className={`faq-item${open ? ' open' : ''}`} key={i}>
                <button
                  className="faq-q"
                  onClick={() => setOpenIdx(open ? null : i)}
                  aria-expanded={open}
                >
                  <span className="faq-q-text">{item.q}</span>
                  <span className="faq-toggle">+</span>
                </button>
                <div className="faq-a">
                  <p className="faq-a-text">{item.a}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
