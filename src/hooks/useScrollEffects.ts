import { useEffect } from 'react';

export function useScrollEffects() {
  useEffect(() => {
    const progress = document.getElementById('progress');
    const nav = document.querySelector('[data-nav]');

    if (!progress && !nav) return;

    const handleScroll = () => {
      if (progress) {
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = window.scrollY;
        const scrollPercent = scrollHeight > 0 ? scrolled / scrollHeight : 0;
        progress.style.transform = `scaleX(${scrollPercent})`;
      }

      if (nav) {
        const isScrolled = window.scrollY > 30;
        if (isScrolled) {
          nav.classList.add('scrolled');
        } else {
          nav.classList.remove('scrolled');
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
}
