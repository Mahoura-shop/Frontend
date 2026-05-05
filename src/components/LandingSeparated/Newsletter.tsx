'use client';

import { FormEvent, useState } from 'react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;
    // TODO: wire to your subscribe endpoint (e.g. /api/subscribe)
    setSent(true);
    setEmail('');
    window.setTimeout(() => setSent(false), 3500);
  };

  return (
    <section className="newsletter-section">
      <div className="newsletter-card">
        <div className="newsletter-deco newsletter-deco-1" aria-hidden>✦</div>
        <div className="newsletter-deco newsletter-deco-2" aria-hidden>✦</div>

        <div className="newsletter-grid">
          <div>
            <div className="newsletter-eyebrow">عضویت در خبرنامه</div>
            <h2 className="newsletter-h2">
              اولین نفر <span className="g">باشید</span>
            </h2>
            <p className="newsletter-desc">
              تخفیف‌های انحصاری، محصولات جدید و راهنمایی‌های زیبایی رو قبل از همه دریافت کنید.
            </p>
          </div>

          <form className="newsletter-form" onSubmit={onSubmit}>
            <div className="newsletter-input-wrap">
              <input
                type="email"
                className="newsletter-input"
                placeholder="ایمیل خود را وارد کنید"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit" className="newsletter-submit">
                {sent ? 'انجام شد ✓' : 'عضویت'}
              </button>
            </div>
            <div className="newsletter-perks">
              <span className="newsletter-perk">تخفیف ۲۰٪ خرید اول</span>
              <span className="newsletter-perk">بدون اسپم</span>
              <span className="newsletter-perk">لغو هر زمان</span>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
