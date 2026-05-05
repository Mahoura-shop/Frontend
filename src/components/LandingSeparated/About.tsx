'use client';

import { useReveal } from '@/hooks/useReveal';

export default function About() {
  const ref = useReveal<HTMLDivElement>();

  return (
    <section className="about-section" id="about">
      <div className="about-grid reveal" ref={ref}>
        <div className="about-text">
          <div className="about-eyebrow">داستان مهورا</div>
          <h2 className="about-h2">
            بیش از یک <span className="g">فروشگاه</span>
          </h2>
          <p className="about-body">
            مهورا با هدف معرفی محصولات با کیفیت و اصیل برندهای داخلی و خارجی به مشتریان ایرانی شکل گرفت. ما باور داریم زیبایی نباید پیچیده باشه — هر محصولی که می‌فروشیم، خودمون استفاده می‌کنیم.
          </p>

          <div className="about-pillars">
            <div className="about-pillar">
              <div className="about-pillar-num">۰۱</div>
              <div className="about-pillar-title">اصالت تضمینی</div>
              <div className="about-pillar-desc">مستقیم از نمایندگی‌های رسمی</div>
            </div>
            <div className="about-pillar">
              <div className="about-pillar-num">۰۲</div>
              <div className="about-pillar-title">انتخاب تخصصی</div>
              <div className="about-pillar-desc">دست‌چین شده توسط متخصص</div>
            </div>
            <div className="about-pillar">
              <div className="about-pillar-num">۰۳</div>
              <div className="about-pillar-title">مشاوره رایگان</div>
              <div className="about-pillar-desc">هر روز هفته در دسترس</div>
            </div>
            <div className="about-pillar">
              <div className="about-pillar-num">۰۴</div>
              <div className="about-pillar-title">ضمانت بازگشت</div>
              <div className="about-pillar-desc">۷ روز فرصت بازگشت</div>
            </div>
          </div>
        </div>

        <div className="about-bento">
          <div className="bento bento-1">
            <div className="bento-emoji">🌿</div>
            <div>
              <div className="bento-title">ترکیبات تمیز</div>
              <div className="bento-desc">بدون پارابن، سولفات و مواد آزاردهنده</div>
            </div>
          </div>
          <div className="bento bento-2">
            <div>
              <div className="bento-num">۸ سال</div>
              <div className="bento-label">تجربه</div>
            </div>
            <div className="bento-desc">در صنعت زیبایی ایران</div>
          </div>
          <div className="bento bento-3">
            <div>
              <div className="bento-num">۲۵۰+</div>
              <div className="bento-label">برند معتبر</div>
            </div>
            <div className="bento-desc">از سراسر دنیا</div>
          </div>
        </div>
      </div>
    </section>
  );
}
