'use client';

import { useRevealChildren } from '@/hooks/useReveal';
import { PRODUCTS } from '@/lib/data';

export default function Products() {
  const ref = useRevealChildren<HTMLDivElement>('.product-card', 90);

  return (
    <section className="section" id="products" style={{ paddingTop: 0 }}>
      <div className="section-inner">
        <div className="section-header-row">
          <div>
            <div className="section-eyebrow">پیشنهاد ویژه این هفته</div>
            <h2 className="section-title-lg">
              پرفروش‌ترین <span className="g">محصولات</span>
            </h2>
          </div>
          <a href="#all-products" className="link-arrow">همه پرفروش‌ها ←</a>
        </div>

        <div className="products-grid" ref={ref}>
          {PRODUCTS.map((p) => (
            <div className="product-card" key={p.name}>
              <div className="product-img-wrap">
                <div className="product-img">{p.emoji}</div>
                <div className="product-badges">
                  {p.isNew && <span className="pbadge pbadge-new">جدید</span>}
                  {p.available && <span className="pbadge pbadge-avail">موجود</span>}
                </div>
                <div className="product-overlay">
                  <button className="product-add-btn">
                    افزودن به سبد
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <circle cx="9" cy="21" r="1" />
                      <circle cx="20" cy="21" r="1" />
                      <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="product-body">
                <div className="product-brand">{p.brand}</div>
                <div className="product-name">{p.name}</div>
                <div className="product-footer">
                  <span className="product-cat">{p.cat}</span>
                  <div className="product-price">
                    {p.price}
                    <span className="product-price-unit"> هزار تومان</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
