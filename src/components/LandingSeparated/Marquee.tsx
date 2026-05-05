import { MARQUEE_ITEMS } from '@/lib/data';

export default function Marquee() {
  // Doubled list so the CSS keyframes (translateX -50%) makes a seamless loop.
  const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];

  return (
    <>
      <div className="marquee-wrap">
        <div className="marquee-track">
          {items.map((text, i) => (
            <div className="marquee-item" key={i}>
              <span>★</span>
              {text}
              <span className="marquee-sep" />
            </div>
          ))}
        </div>
      </div>
      <div className="section-cap" />
    </>
  );
}
