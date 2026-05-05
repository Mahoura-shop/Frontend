'use client';

import { useReveal } from '@/hooks/useReveal';

export default function Statement() {
  const ref = useReveal<HTMLDivElement>();

  return (
    <section className="statement-section">
      <div className="statement-mesh" aria-hidden />
      <div className="statement-inner" ref={ref}>
        <div className="statement-pretitle">آنچه ما را متمایز می‌کند</div>
        <h2 className="statement-title">
          ساخته شده<br />با عشق
        </h2>
        <p className="statement-body">
          هر محصول مهورا با دقت انتخاب می‌شه. ما با متخصصین زیبایی و آزمایشگاه‌های معتبر همکاری می‌کنیم تا مطمئن بشیم چیزی که به دستت می‌رسه، بهترین نسخه ممکنه.
        </p>
        <button className="btn-statement">
          آشنایی بیشتر با مهورا
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
      </div>
    </section>
  );
}
