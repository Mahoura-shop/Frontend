'use client';

import { useRevealChildren } from '@/hooks/useReveal';
import { PROCESS_STEPS } from '@/lib/data';

export default function Process() {
  const ref = useRevealChildren<HTMLDivElement>('.process-step', 120);

  return (
    <section className="process-section">
      <div className="process-inner">
        <div className="process-header">
          <div className="section-eyebrow" style={{ justifyContent: 'center' }}>
            فرآیند ما
          </div>
          <h2 className="process-h2">
            از ایده تا <span className="g">دستان شما</span>
          </h2>
          <p className="process-sub">
            هر محصول مهورا مسیری دقیق رو طی می‌کنه تا با بالاترین کیفیت به دستتون برسه.
          </p>
        </div>

        <div className="process-grid" ref={ref}>
          {PROCESS_STEPS.map((step) => (
            <div className="process-step" key={step.id}>
              <div className="process-num">{step.id}</div>
              <div className="process-step-title">{step.title}</div>
              <div className="process-step-desc">{step.description}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
