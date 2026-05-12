'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

type SlowMoKey = 'float' | 'shimmer' | 'fadeInUp' | 'fadeInScale' | 'pulseGlow' | 'accordion' | 'card3d' | 'navbarSlide' | 'stagger' | 'buttons';

interface AnimationDemoProps {
  title: string;
  spec: string;
  children: React.ReactNode;
  slowMoKey: SlowMoKey;
  slowMo: Record<SlowMoKey, boolean>;
  onSlowMoChange: (key: SlowMoKey) => void;
  id?: string;
}

function AnimationDemo({ title, spec, children, slowMoKey, slowMo, onSlowMoChange, id }: AnimationDemoProps) {
  const [key, setKey] = useState(0);

  const handleReplay = () => {
    setKey((k) => k + 1);
  };

  return (
    <div id={id} data-section className="mb-12 p-6 border border-border rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold">{title}</h3>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleReplay}
            className="flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" /> Replay
          </Button>
          <label className="flex items-center gap-2 px-3 py-2 border border-border rounded cursor-pointer hover:bg-muted">
            <input
              type="checkbox"
              checked={slowMo[slowMoKey]}
              onChange={() => onSlowMoChange(slowMoKey)}
              className="w-4 h-4"
            />
            <span className="text-sm">0.3× slow-mo</span>
          </label>
        </div>
      </div>

      <div
        key={key}
        className="mb-6 p-8 bg-muted/30 rounded-lg border border-border min-h-[200px] flex items-center justify-center overflow-hidden"
      >
        {children}
      </div>

      <div className="bg-background border border-border rounded p-4 font-mono text-sm overflow-auto max-h-48">
        <pre>{spec}</pre>
      </div>
    </div>
  );
}

// Float Demo Component
function FloatDemo({ slowMo }: { slowMo: boolean }) {
  const style = slowMo ? { animationDuration: '10s' } : {};

  return (
    <div style={style} className="animate-float">
      <Card className="w-48 overflow-hidden hover:shadow-lg transition-shadow">
        <div className="aspect-square bg-gradient-to-br from-primary-rose/20 to-accent-gold/20" />
        <CardContent className="p-4">
          <p className="font-semibold text-sm">Product Name</p>
          <p className="text-xs text-muted-foreground mb-2">Premium Cosmetic</p>
          <span className="inline-block px-2 py-1 bg-accent-gold/20 text-accent-gold text-xs rounded">
            ۱۵۰,۰۰۰ تومان
          </span>
        </CardContent>
      </Card>
    </div>
  );
}

// Shimmer Demo Component
function ShimmerDemo({ slowMo }: { slowMo: boolean }) {
  const style = slowMo ? { animationDuration: '10s' } : {};

  return (
    <div className="grid grid-cols-2 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} style={style} className="animate-shimmer">
          <div className="w-full aspect-square rounded-lg bg-gradient-to-r from-muted via-background to-muted" />
          <div className="mt-2 h-4 bg-gradient-to-r from-muted via-background to-muted rounded w-3/4" />
          <div className="mt-2 h-3 bg-gradient-to-r from-muted via-background to-muted rounded w-1/2" />
        </div>
      ))}
    </div>
  );
}

// FadeInUp Demo Component
function FadeInUpDemo({ slowMo }: { slowMo: boolean }) {
  const items = [1, 2, 3, 4, 5, 6];

  return (
    <div className="grid grid-cols-3 gap-3">
      {items.map((i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: slowMo ? 2 : 0.6,
            ease: [0.34, 1.56, 0.64, 1],
            delay: i * (slowMo ? 0.33 : 0.1),
          }}
        >
          <Card className="aspect-square flex items-center justify-center bg-gradient-to-br from-primary-rose/10 to-accent-gold/10">
            <span className="font-semibold text-muted-foreground">Item {i}</span>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}

// FadeInScale Demo Component
function FadeInScaleDemo({ slowMo }: { slowMo: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: slowMo ? 2.667 : 0.8,
        ease: [0.34, 1.56, 0.64, 1],
      }}
      className="w-80"
    >
      <Card className="p-6 bg-gradient-to-br from-primary-rose/5 to-secondary-plum/5">
        <h3 className="text-lg font-semibold mb-4">Modal Dialog</h3>
        <p className="text-muted-foreground mb-4">
          This modal appears with a scale + fade animation.
        </p>
        <div className="flex gap-2">
          <Button variant="primary" size="sm">
            Confirm
          </Button>
          <Button variant="outline" size="sm">
            Cancel
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}

// Pulse Glow Demo Component
function PulseGlowDemo({ slowMo }: { slowMo: boolean }) {
  const style = slowMo ? { animationDuration: '6.667s' } : {};

  return (
    <Card className="w-56 overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative aspect-square bg-gradient-to-br from-primary-rose/20 to-accent-gold/20 flex items-end justify-end p-4">
        <span
          style={style}
          className="absolute top-3 right-3 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-400/80 text-amber-950 text-xs font-semibold animate-pulse-glow"
        >
          ✦ New
        </span>
      </div>
      <CardContent className="p-4">
        <p className="font-semibold text-sm">New Arrival</p>
        <p className="text-xs text-muted-foreground">Limited Edition</p>
      </CardContent>
    </Card>
  );
}

// Accordion Demo Component
function AccordionDemo({ slowMo }: { slowMo: boolean }) {
  const [open, setOpen] = useState<number | null>(0);

  const items = [
    { title: 'What is a beauty profile?', answer: 'Your personalized beauty preferences and skin info.' },
    { title: 'How do we protect your data?', answer: 'We use industry-standard encryption for all data.' },
    { title: 'Can I update my profile?', answer: 'Yes, anytime from your dashboard settings.' },
  ];

  return (
    <div className="w-full max-w-md space-y-2">
      {items.map((item, i) => (
        <div key={i} className="border border-border rounded-lg overflow-hidden">
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full p-4 text-left font-medium hover:bg-muted transition-colors flex items-center justify-between"
          >
            {item.title}
            <span>{open === i ? '−' : '+'}</span>
          </button>
          {open === i && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              exit={{ height: 0 }}
              transition={{ duration: slowMo ? 0.667 : 0.2 }}
              className="overflow-hidden"
            >
              <div className="p-4 bg-muted/30 border-t border-border">{item.answer}</div>
            </motion.div>
          )}
        </div>
      ))}
    </div>
  );
}

// 3D Card Demo Component
function Card3dDemo({ slowMo }: { slowMo: boolean }) {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientY - rect.top - rect.height / 2;
    const y = e.clientX - rect.left - rect.width / 2;
    setRotate({
      x: (x / rect.height) * 8,
      y: -(y / rect.width) * 8,
    });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: '1000px',
        transformStyle: 'preserve-3d',
      }}
    >
      <motion.div
        animate={{
          rotateX: rotate.x,
          rotateY: rotate.y,
        }}
        transition={{ duration: 0.1 }}
        style={{
          transformStyle: 'preserve-3d',
        }}
      >
        <Card className="w-56 overflow-hidden hover:shadow-xl transition-shadow">
          <div className="aspect-square bg-gradient-to-br from-primary-rose/20 via-accent-gold/20 to-secondary-plum/20" />
          <CardContent className="p-4">
            <p className="font-semibold text-sm">3D Hover Card</p>
            <p className="text-xs text-muted-foreground">Move mouse for tilt effect</p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

// Navbar Slide Demo Component
function NavbarSlideDemo({ slowMo }: { slowMo: boolean }) {
  return (
    <motion.div
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{
        type: 'spring',
        stiffness: 100,
        damping: 25,
        duration: slowMo ? 2.667 : 0.8,
      }}
      className="w-full max-w-2xl bg-gradient-to-r from-primary-rose/10 to-accent-gold/10 border border-border rounded-lg p-4"
    >
      <div className="flex items-center justify-between">
        <span className="font-semibold">Mahoura</span>
        <div className="flex gap-4">
          <span className="text-sm text-muted-foreground">Home</span>
          <span className="text-sm text-muted-foreground">Shop</span>
          <span className="text-sm text-muted-foreground">About</span>
        </div>
      </div>
    </motion.div>
  );
}

// Stagger Demo Component
function StaggerDemo({ slowMo }: { slowMo: boolean }) {
  const items = ['Home', 'Products', 'About', 'Contact', 'Support'];

  return (
    <motion.div className="flex flex-wrap gap-4">
      {items.map((item, i) => (
        <motion.button
          key={item}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: slowMo ? 2 : 0.6,
            delay: slowMo ? 0.3 + i * 0.33 : 0.3 + i * 0.1,
            ease: [0.34, 1.56, 0.64, 1],
          }}
          className="px-4 py-2 bg-primary-rose/20 hover:bg-primary-rose/30 rounded-lg transition-colors"
        >
          {item}
        </motion.button>
      ))}
    </motion.div>
  );
}

const sections = [
  { id: 'hero', label: 'Hero', emoji: '✨' },
  { id: 'colors', label: 'Colors', emoji: '🎨' },
  { id: 'typography', label: 'Typography', emoji: 'Aa' },
  { id: 'buttons', label: 'Buttons', emoji: '▣' },
  { id: 'badges', label: 'Badges', emoji: '◉' },
  { id: 'motion', label: 'Motion Tokens', emoji: '⚡' },
  { id: 'float', label: 'Float', emoji: '↕️' },
  { id: 'shimmer', label: 'Shimmer', emoji: '✦' },
  { id: 'fadeInUp', label: 'Fade In Up', emoji: '⬆️' },
  { id: 'fadeInScale', label: 'Fade In Scale', emoji: '📦' },
  { id: 'pulseGlow', label: 'Pulse Glow', emoji: '💫' },
  { id: 'accordion', label: 'Accordion', emoji: '▼' },
  { id: 'card3d', label: 'Card 3D', emoji: '🎯' },
  { id: 'navbarSlide', label: 'Navbar Slide', emoji: '🔝' },
  { id: 'stagger', label: 'Stagger', emoji: '✶' },
];

function Sidebar({ activeSection, isDark, onDarkModeChange, open, onClose }: { activeSection: string; isDark: boolean; onDarkModeChange: () => void; open: boolean; onClose: () => void }) {
  const content = (
    <div className="flex flex-col h-full">
      <div className="px-6 mb-8 flex items-center justify-between">
        <h2 className="font-semibold text-lg">Design System</h2>
        <div className="flex items-center gap-1">
          <button
            onClick={onDarkModeChange}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
            aria-label="Toggle dark mode"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <button
            onClick={onClose}
            className="md:hidden p-2 hover:bg-muted rounded-lg transition-colors"
            aria-label="Close menu"
          >
            <span className="text-lg leading-none">×</span>
          </button>
        </div>
      </div>

      <nav className="px-4 flex-1 overflow-y-auto">
        {sections.map((section) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            onClick={onClose}
            className={`block px-3 py-2.5 rounded-lg text-sm transition-all mb-1 ${
              activeSection === section.id
                ? 'bg-primary-rose/20 text-primary-rose font-medium'
                : 'text-muted-foreground hover:bg-muted'
            }`}
          >
            <span className="mr-2">{section.emoji}</span>
            {section.label}
          </a>
        ))}
      </nav>

      <div className="px-4 mt-12 pt-8 border-t border-border">
        <p className="text-xs text-muted-foreground">
          Each animation is interactive. Hit Replay to restart, toggle slow-mo to observe easing.
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col fixed left-0 top-0 h-screen w-56 border-r border-border bg-background overflow-y-auto pt-8">
        {content}
      </aside>

      {/* Mobile overlay */}
      {open && (
        <>
          <div className="md:hidden fixed inset-0 z-40 bg-black/50" onClick={onClose} />
          <aside className="md:hidden fixed left-0 top-0 h-screen w-56 z-50 border-r border-border bg-background overflow-y-auto pt-8">
            {content}
          </aside>
        </>
      )}
    </>
  );
}

export default function DesignSystemPage() {
  const [slowMo, setSloMo] = useState<Record<SlowMoKey, boolean>>({
    float: false,
    shimmer: false,
    fadeInUp: false,
    fadeInScale: false,
    pulseGlow: false,
    accordion: false,
    card3d: false,
    navbarSlide: false,
    stagger: false,
    buttons: false,
  });

  const [activeSection, setActiveSection] = useState('hero');
  const [isDark, setIsDark] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3 }
    );

    const sectionElements = document.querySelectorAll('[data-section]');
    sectionElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const handleSlowMoChange = (key: SlowMoKey) => {
    setSloMo((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar
        activeSection={activeSection}
        isDark={isDark}
        onDarkModeChange={() => setIsDark(!isDark)}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Mobile hamburger */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-background border border-border shadow"
        onClick={() => setSidebarOpen(true)}
        aria-label="Open menu"
      >
        <span className="block w-5 h-0.5 bg-foreground mb-1" />
        <span className="block w-5 h-0.5 bg-foreground mb-1" />
        <span className="block w-5 h-0.5 bg-foreground" />
      </button>

      <div className="md:ml-56">
        {/* Hero Section */}
        <div id="hero" data-section className="relative overflow-hidden">
          {/* Full-bleed background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary-rose/20 via-accent-gold/10 to-secondary-plum/20" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-primary-rose/10 via-transparent to-transparent" />

          <div className="relative px-8 py-24 md:py-32 text-center">
            {/* Logo / wordmark */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="mb-6"
            >
              <span className="text-7xl md:text-9xl font-bold gradient-text tracking-tight leading-none">
                ماهورا
              </span>
            </motion.div>

            {/* EN wordmark */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-sm font-mono tracking-[0.3em] text-muted-foreground uppercase mb-4"
            >
              Mahoura Cosmetics — Design System
            </motion.p>

            {/* Persian tagline */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.5 }}
              className="text-xl md:text-2xl text-muted-foreground mb-12 font-medium"
            >
              سیستم طراحی لوکس — ساخته‌شده برای زیبایی ایرانی
            </motion.p>

            {/* Tech badges */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              className="flex flex-wrap justify-center gap-3"
            >
              {[
                { label: 'Next.js 15', color: 'bg-foreground/10 text-foreground border-border' },
                { label: 'Go 1.23', color: 'bg-primary-rose/10 text-primary-rose border-primary-rose/30' },
                { label: 'Framer Motion', color: 'bg-accent-gold/10 text-accent-gold border-accent-gold/30' },
                { label: 'Tailwind CSS', color: 'bg-secondary-plum/10 text-secondary-plum border-secondary-plum/30' },
                { label: 'Vazirmatn', color: 'bg-primary-rose/10 text-primary-rose border-primary-rose/30' },
                { label: 'PostgreSQL', color: 'bg-accent-gold/10 text-accent-gold border-accent-gold/30' },
                { label: 'RTL-First', color: 'bg-secondary-plum/10 text-secondary-plum border-secondary-plum/30' },
              ].map((badge, i) => (
                <motion.span
                  key={badge.label}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.55 + i * 0.07, duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
                  className={`px-4 py-1.5 rounded-full border text-sm font-medium ${badge.color}`}
                >
                  {badge.label}
                </motion.span>
              ))}
            </motion.div>

            {/* Divider line */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 1.1, duration: 0.6, ease: 'easeOut' }}
              className="mt-16 h-px bg-gradient-to-r from-transparent via-border to-transparent origin-center"
            />
          </div>
        </div>

        {/* Color Tokens */}
        <div id="colors" data-section className="py-20 border-t border-border">
          <motion.div className="mx-auto px-8" style={{ maxWidth: '960px' }} initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, ease: 'easeOut' }}>
            <h2 className="text-3xl font-bold mb-2">Color Tokens</h2>
            <p className="text-muted-foreground mb-10">Brand palette defined as CSS custom properties in <code className="text-xs bg-muted px-1 py-0.5 rounded">globals.css</code>. Use these — never hardcode hex.</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
              {[
                { name: '--primary-rose', value: '#D4A5A5', label: 'Primary Rose', textClass: 'text-black' },
                { name: '--secondary-plum', value: '#6B4E71', label: 'Secondary Plum', textClass: 'text-white' },
                { name: '--accent-gold', value: '#C9A875', label: 'Accent Gold', textClass: 'text-black' },
              ].map((token) => (
                <div key={token.name} className="rounded-xl overflow-hidden border border-border">
                  <div className="h-24" style={{ backgroundColor: token.value }} />
                  <div className="p-4">
                    <p className="font-bold text-sm mb-1">{token.label}</p>
                    <p className="text-xs text-muted-foreground font-mono">{token.value}</p>
                    <p className="text-xs text-muted-foreground font-mono mt-0.5">{token.name}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { name: '--background', label: 'Background', class: 'bg-background border' },
                { name: '--foreground', label: 'Foreground', class: 'bg-foreground' },
                { name: '--muted', label: 'Muted', class: 'bg-muted' },
                { name: '--border', label: 'Border', class: 'bg-border' },
                { name: '--destructive', label: 'Destructive', class: 'bg-destructive' },
                { name: '--card', label: 'Card', class: 'bg-card border' },
                { name: '--secondary', label: 'Secondary', class: 'bg-secondary' },
                { name: '--accent', label: 'Accent', class: 'bg-accent border' },
              ].map((token) => (
                <div key={token.name} className="rounded-lg overflow-hidden border border-border">
                  <div className={`h-12 ${token.class}`} />
                  <div className="p-2">
                    <p className="text-xs font-medium">{token.label}</p>
                    <p className="text-[10px] text-muted-foreground font-mono">{token.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Typography */}
        <div id="typography" data-section className="py-20 border-t border-border">
          <motion.div className="mx-auto px-8" style={{ maxWidth: '960px' }} initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, ease: 'easeOut' }}>
            <h2 className="text-3xl font-bold mb-2">Typography</h2>
            <p className="text-muted-foreground mb-10">Vazirmatn at all weights. Tailwind size scale — no custom sizes.</p>
            <div className="space-y-6">
              {[
                { size: 'text-6xl', weight: 'font-bold', label: '6xl / Bold', sample: 'ماهورا' },
                { size: 'text-5xl', weight: 'font-bold', label: '5xl / Bold', sample: 'محصولات لوکس' },
                { size: 'text-4xl', weight: 'font-bold', label: '4xl / Bold', sample: 'عنوان صفحه' },
                { size: 'text-3xl', weight: 'font-semibold', label: '3xl / Semibold', sample: 'عنوان بخش' },
                { size: 'text-2xl', weight: 'font-semibold', label: '2xl / Semibold', sample: 'کارت محصول' },
                { size: 'text-xl', weight: 'font-medium', label: 'xl / Medium', sample: 'توضیحات کوتاه' },
                { size: 'text-base', weight: 'font-normal', label: 'base / Normal', sample: 'متن اصلی رابط کاربری. این یک نمونه از متن پایه است.' },
                { size: 'text-sm', weight: 'font-normal', label: 'sm / Normal', sample: 'برچسب، راهنما، توضیح فرم' },
                { size: 'text-xs', weight: 'font-medium', label: 'xs / Medium', sample: 'BADGE • LABEL • CAPTION' },
              ].map((t) => (
                <div key={t.label} className="flex items-baseline gap-6 pb-6 border-b border-border last:border-0">
                  <span className="text-xs text-muted-foreground font-mono w-32 shrink-0">{t.label}</span>
                  <span className={`${t.size} ${t.weight} leading-tight`}>{t.sample}</span>
                </div>
              ))}
            </div>
            <div className="mt-10 p-4 bg-muted/40 rounded-lg">
              <p className="text-xs font-mono text-muted-foreground">gradient-text utility: <span className="gradient-text font-bold">bg-gradient-to-r from-primary-rose via-accent-gold to-secondary-plum bg-clip-text text-transparent</span></p>
            </div>
          </motion.div>
        </div>

        {/* Buttons */}
        <div id="buttons" data-section className="py-20 border-t border-border">
          <motion.div className="mx-auto px-8" style={{ maxWidth: '960px' }} initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, ease: 'easeOut' }}>
            <div className="flex items-start justify-between mb-2 flex-wrap gap-4">
              <div>
                <h2 className="text-3xl font-bold">Buttons</h2>
                <p className="text-muted-foreground mt-1">
                  8 variants × 4 sizes. <code className="text-xs bg-muted px-1 py-0.5 rounded">luxury</code> = primary CTA.{' '}
                  Toggle slow-mo to observe hover transition easing at 0.3× speed.
                </p>
              </div>
              <label className="flex items-center gap-2 px-3 py-2 border border-border rounded cursor-pointer hover:bg-muted shrink-0">
                <input
                  type="checkbox"
                  checked={slowMo.buttons}
                  onChange={() => handleSlowMoChange('buttons')}
                  className="w-4 h-4"
                />
                <span className="text-sm">0.3× slow-mo</span>
              </label>
            </div>

            <div
              className="mt-10 p-8 rounded-xl border border-border bg-muted/20 space-y-10"
              style={slowMo.buttons ? { ['--btn-duration' as string]: '2000ms' } : { ['--btn-duration' as string]: '200ms' }}
            >
              {/* All variants */}
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-5">Variants</p>
                <div className="flex flex-wrap gap-3">
                  {([
                    { v: 'luxury', label: 'luxury' },
                    { v: 'default', label: 'default' },
                    { v: 'outline', label: 'outline' },
                    { v: 'ghost', label: 'ghost' },
                    { v: 'secondary', label: 'secondary' },
                    { v: 'destructive', label: 'destructive' },
                    { v: 'link', label: 'link' },
                    { v: 'primary', label: 'primary' },
                  ] as const).map(({ v, label }) => (
                    <div
                      key={v}
                      style={{ ['--tw-transition-duration' as string]: slowMo.buttons ? '2000ms' : '200ms' }}
                      className="[&_button]:transition-all"
                    >
                      <Button variant={v}>{label}</Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sizes */}
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-5">Sizes — luxury</p>
                <div className="flex flex-wrap items-center gap-4">
                  {([
                    { s: 'sm', label: 'sm' },
                    { s: 'default', label: 'default' },
                    { s: 'lg', label: 'lg' },
                  ] as const).map(({ s, label }) => (
                    <div
                      key={s}
                      style={{ ['--tw-transition-duration' as string]: slowMo.buttons ? '2000ms' : '200ms' }}
                      className="[&_button]:transition-all flex flex-col items-center gap-2"
                    >
                      <Button variant="luxury" size={s}>{label}</Button>
                      <span className="text-[10px] text-muted-foreground font-mono">{s}</span>
                    </div>
                  ))}
                  <div
                    style={{ ['--tw-transition-duration' as string]: slowMo.buttons ? '2000ms' : '200ms' }}
                    className="[&_button]:transition-all flex flex-col items-center gap-2"
                  >
                    <Button variant="luxury" size="icon">+</Button>
                    <span className="text-[10px] text-muted-foreground font-mono">icon</span>
                  </div>
                </div>
              </div>

              {/* States */}
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-5">States</p>
                <div className="flex flex-wrap gap-3">
                  <Button variant="luxury">Normal</Button>
                  <Button variant="luxury" disabled>Disabled</Button>
                  <Button variant="outline" disabled>Disabled outline</Button>
                  <Button variant="destructive">Destructive</Button>
                </div>
              </div>
            </div>

            <div className="mt-4 p-4 bg-muted/40 rounded-lg font-mono text-xs text-muted-foreground">
              {'<Button variant="luxury" size="lg">تکمیل خرید</Button>'}
            </div>
          </motion.div>
        </div>

        {/* Badges */}
        <div id="badges" data-section className="py-20 border-t border-border">
          <motion.div className="mx-auto px-8" style={{ maxWidth: '960px' }} initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, ease: 'easeOut' }}>
            <h2 className="text-3xl font-bold mb-2">Badges</h2>
            <p className="text-muted-foreground mb-10">6 variants. <code className="text-xs bg-muted px-1 py-0.5 rounded">new</code> pulses via <code className="text-xs bg-muted px-1 py-0.5 rounded">animate-pulse-glow</code>.</p>
            <div className="flex flex-wrap gap-4 mb-8">
              {([
                { v: 'default', label: 'default' },
                { v: 'secondary', label: 'secondary' },
                { v: 'outline', label: 'outline' },
                { v: 'destructive', label: 'destructive' },
                { v: 'new', label: 'new (animated)' },
                { v: 'available', label: 'available' },
                { v: 'outOfStock', label: 'outOfStock' },
              ] as const).map(({ v, label }) => (
                <Badge key={v} variant={v}>{label}</Badge>
              ))}
            </div>
            <div className="p-4 bg-muted/40 rounded-lg">
              <p className="text-xs font-mono text-muted-foreground">{'<Badge variant="new">جدید</Badge>'}</p>
            </div>
            <div className="mt-8">
              <p className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wider">Skeleton</p>
              <div className="space-y-3 max-w-sm">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-40 w-full rounded-xl" />
              </div>
              <p className="text-xs font-mono text-muted-foreground mt-3">{'<Skeleton className="h-6 w-full" />'}</p>
            </div>
          </motion.div>
        </div>

        {/* Motion Tokens */}
        <div id="motion" data-section className="py-20 border-t border-border">
          <motion.div className="mx-auto px-8" style={{ maxWidth: '960px' }} initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, ease: 'easeOut' }}>
            <h2 className="text-3xl font-bold mb-2">Motion Tokens</h2>
            <p className="text-muted-foreground mb-10">Named spring + ease presets from <code className="text-xs bg-muted px-1 py-0.5 rounded">lib/motion.ts</code>. Import and use — never write raw spring configs.</p>
            <div className="space-y-4 mb-10">
              {[
                { name: 'spring.default', config: '{ type: "spring", stiffness: 300, damping: 30 }', use: 'Standard UI — sidebar, cart items, page elements' },
                { name: 'spring.snappy', config: '{ type: "spring", stiffness: 400, damping: 35 }', use: 'Pill indicators, dot markers' },
                { name: 'spring.responsive', config: '{ type: "spring", stiffness: 400, damping: 25 }', use: 'Hover scale on nav items' },
                { name: 'spring.gentle', config: '{ type: "spring", stiffness: 200, damping: 25 }', use: 'Image entrance, modals' },
                { name: 'spring.slow', config: '{ type: "spring", stiffness: 50, damping: 20 }', use: 'Hero animations' },
                { name: 'spring.magnetic', config: '{ type: "spring", stiffness: 150, damping: 15 }', use: 'Magnetic button follow' },
                { name: 'spring.bottomNav', config: '{ type: "spring", stiffness: 260, damping: 28 }', use: 'Bottom nav entrance' },
              ].map((token) => (
                <div key={token.name} className="flex gap-4 p-4 rounded-lg border border-border bg-card">
                  <div className="flex-1 min-w-0">
                    <p className="font-mono text-sm font-bold text-primary-rose mb-1">{token.name}</p>
                    <p className="font-mono text-xs text-muted-foreground mb-1">{token.config}</p>
                    <p className="text-xs text-muted-foreground">{token.use}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-4">
              {[
                { name: 'ease.standard', config: '{ duration: 0.3, ease: "easeInOut" }', use: 'Page transitions' },
                { name: 'ease.fast', config: '{ duration: 0.2, ease: "easeOut" }', use: 'Hover effects' },
                { name: 'ease.enter', config: '{ duration: 0.6, ease: "easeOut" }', use: 'Scroll-triggered entrance' },
                { name: 'ease.slow', config: '{ duration: 0.9, ease: "easeOut" }', use: 'Hero dramatic reveals' },
              ].map((token) => (
                <div key={token.name} className="flex gap-4 p-4 rounded-lg border border-border bg-card">
                  <div className="flex-1 min-w-0">
                    <p className="font-mono text-sm font-bold text-accent-gold mb-1">{token.name}</p>
                    <p className="font-mono text-xs text-muted-foreground mb-1">{token.config}</p>
                    <p className="text-xs text-muted-foreground">{token.use}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 p-4 bg-muted/40 rounded-lg font-mono text-sm">
              <p className="text-muted-foreground text-xs mb-2">Usage:</p>
              <p>{"import { spring, ease } from '@/lib/motion';"}</p>
              <p className="mt-2 text-muted-foreground">{"<motion.div transition={spring.default} />"}</p>
              <p className="text-muted-foreground">{"<motion.div transition={{ ...spring.gentle, delay: 0.2 }} />"}</p>
            </div>
          </motion.div>
        </div>

        {/* Animation Demos */}
        <div id="animations" className="py-20">
          <motion.div className="mx-auto px-8" style={{ maxWidth: '960px' }} initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, ease: 'easeOut' }}>
        <AnimationDemo
            id="float"
            title="1. Float"
          spec={`// Product card bobbing
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}
.animate-float {
  animation: float 3s ease-in-out infinite;
}`}
          slowMoKey="float"
          slowMo={slowMo}
          onSlowMoChange={handleSlowMoChange}
        >
          <FloatDemo slowMo={slowMo.float} />
        </AnimationDemo>

        <AnimationDemo
          id="shimmer"
          title="2. Shimmer"
          spec={`// Skeleton grid shimmer overlay
@keyframes shimmer {
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
}
.animate-shimmer {
  animation: shimmer 3s linear infinite;
  background-size: 200% 100%;
}`}
          slowMoKey="shimmer"
          slowMo={slowMo}
          onSlowMoChange={handleSlowMoChange}
        >
          <ShimmerDemo slowMo={slowMo.shimmer} />
        </AnimationDemo>

        <AnimationDemo
          id="fadeInUp"
          title="3. Fade In Up"
          spec={`// Grid items entering with stagger
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}
// Applied with staggered delays (100ms increments)
transition={{
  duration: 0.6s,
  ease: cubic-bezier(0.34, 1.56, 0.64, 1),
  delay: index * 100ms
}}`}
          slowMoKey="fadeInUp"
          slowMo={slowMo}
          onSlowMoChange={handleSlowMoChange}
        >
          <FadeInUpDemo slowMo={slowMo.fadeInUp} />
        </AnimationDemo>

        <AnimationDemo
          id="fadeInScale"
          title="4. Fade In Scale"
          spec={`// Modal appearing with scale + fade
@keyframes fadeInScale {
  from { opacity: 0; transform: scale(0.8); }
  to { opacity: 1; transform: scale(1); }
}
transition={{
  duration: 0.8s,
  ease: cubic-bezier(0.34, 1.56, 0.64, 1)
}}`}
          slowMoKey="fadeInScale"
          slowMo={slowMo}
          onSlowMoChange={handleSlowMoChange}
        >
          <FadeInScaleDemo slowMo={slowMo.fadeInScale} />
        </AnimationDemo>

        <AnimationDemo
          id="pulseGlow"
          title="5. Pulse Glow"
          spec={`// Badge with pulsing glow
@keyframes pulse-glow {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}
.animate-pulse-glow {
  animation: pulse-glow 2s ease-in-out infinite;
}`}
          slowMoKey="pulseGlow"
          slowMo={slowMo}
          onSlowMoChange={handleSlowMoChange}
        >
          <PulseGlowDemo slowMo={slowMo.pulseGlow} />
        </AnimationDemo>

        <AnimationDemo
          id="accordion"
          title="6. Accordion Down/Up"
          spec={`// FAQ accordion with smooth height
@keyframes accordion-down {
  from { height: 0; }
  to { height: var(--radix-accordion-content-height); }
}
@keyframes accordion-up {
  from { height: var(--radix-accordion-content-height); }
  to { height: 0; }
}
animation: accordion-down 0.2s ease-out (on open)
animation: accordion-up 0.2s ease-out (on close)`}
          slowMoKey="accordion"
          slowMo={slowMo}
          onSlowMoChange={handleSlowMoChange}
        >
          <AccordionDemo slowMo={slowMo.accordion} />
        </AnimationDemo>

        <AnimationDemo
          id="card3d"
          title="7. Card 3D"
          spec={`// Product card with mouse-tracking 3D tilt
.card-3d {
  transform-style: preserve-3d;
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.card-3d:hover {
  transform: perspective(1000px)
             rotateX(2deg)
             rotateY(-2deg)
             scale(1.02);
}
// Calculate rotation from mouse position
rotateX = (mouseY - centerY) / height * 8
rotateY = -(mouseX - centerX) / width * 8`}
          slowMoKey="card3d"
          slowMo={slowMo}
          onSlowMoChange={handleSlowMoChange}
        >
          <Card3dDemo slowMo={slowMo.card3d} />
        </AnimationDemo>

        <AnimationDemo
          id="navbarSlide"
          title="8. Navbar Slide"
          spec={`// Top navbar sliding in with spring easing
<motion.div
  initial={{ y: -100 }}
  animate={{ y: 0 }}
  transition={{
    type: 'spring',
    stiffness: 100,
    damping: 25,
    duration: 0.8s
  }}
/>
// Spring creates slight overshoot effect`}
          slowMoKey="navbarSlide"
          slowMo={slowMo}
          onSlowMoChange={handleSlowMoChange}
        >
          <NavbarSlideDemo slowMo={slowMo.navbarSlide} />
        </AnimationDemo>

        <AnimationDemo
          id="stagger"
          title="9. Stagger"
          spec={`// Nav items animating in sequence
<motion.div>
  {items.map((item, i) => (
    <motion.button
      key={item}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.6s,
        delay: 0.3 + (i * 0.1),
        ease: cubic-bezier(0.34, 1.56, 0.64, 1)
      }}
    >
      {item}
    </motion.button>
  ))}
</motion.div>
// Each item starts 100ms after the previous`}
          slowMoKey="stagger"
          slowMo={slowMo}
          onSlowMoChange={handleSlowMoChange}
        >
          <StaggerDemo slowMo={slowMo.stagger} />
        </AnimationDemo>
          </motion.div>
        </div>

        {/* Footer */}
        <div className="border-t border-border py-12 bg-muted/20">
          <div className="mx-auto px-8 text-center" style={{ maxWidth: '960px' }}>
            <p className="text-muted-foreground mb-4">
              All animations use cubic-bezier(0.34, 1.56, 0.64, 1) for a subtle spring overshoot effect.
            </p>
            <p className="text-sm text-muted-foreground">
              Animations are implemented using CSS keyframes (Tailwind) and Framer Motion for interactive elements.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
