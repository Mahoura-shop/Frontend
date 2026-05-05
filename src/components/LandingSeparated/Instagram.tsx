import { INSTA_TILES } from '@/lib/data';

const TILE_BG = [
  'linear-gradient(135deg,#d4a5a5,#b88787)',
  'linear-gradient(135deg,#c9a875,#a08856)',
  'linear-gradient(135deg,#6b4e71,#4a3550)',
  'linear-gradient(135deg,#e8d5d5,#c9a4a4)',
  'linear-gradient(135deg,#9b7d8a,#6f5763)',
  'linear-gradient(135deg,#3d2935,#1c1218)',
];

export default function Instagram() {
  return (
    <section className="insta-section">
      <div className="insta-header">
        <div>
          <div className="section-eyebrow">اینستاگرام مهورا</div>
          <h2 className="insta-h2">با ما همراه باشید</h2>
        </div>
        <a href="https://instagram.com" className="insta-handle">@mahoura.beauty ←</a>
      </div>

      <div className="insta-grid">
        {INSTA_TILES.map((emoji, i) => (
          <a className="insta-tile" key={i} href="#">
            <div className="insta-tile-bg" style={{ background: TILE_BG[i % TILE_BG.length] }}>
              {emoji.emoji}
            </div>
            <div className="insta-tile-overlay">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              ۲.۴k
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
