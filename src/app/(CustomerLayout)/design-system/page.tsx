'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

type SlowMoKey = 'float' | 'shimmer' | 'fadeInUp' | 'fadeInScale' | 'pulseGlow' | 'accordion' | 'card3d' | 'navbarSlide' | 'stagger';

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

function Sidebar({ activeSection, isDark, onDarkModeChange }: { activeSection: string; isDark: boolean; onDarkModeChange: () => void }) {
  return (
    <aside className="fixed left-0 top-0 h-screen w-56 border-r border-border bg-background overflow-y-auto pt-8">
      <div className="px-6 mb-8 flex items-center justify-between">
        <h2 className="font-semibold text-lg">Design System</h2>
        <button
          onClick={onDarkModeChange}
          className="p-2 hover:bg-muted rounded-lg transition-colors"
          aria-label="Toggle dark mode"
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>

      <nav className="px-4">
        {sections.map((section) => (
          <a
            key={section.id}
            href={`#${section.id}`}
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
    </aside>
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
  });

  const [activeSection, setActiveSection] = useState('hero');
  const [isDark, setIsDark] = useState(false);
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
      <Sidebar activeSection={activeSection} isDark={isDark} onDarkModeChange={() => setIsDark(!isDark)} />

      <div className="ml-56">
        {/* Hero Section */}
        <div id="hero" data-section className="bg-gradient-to-b from-primary-rose/10 via-accent-gold/5 to-transparent py-20">
          <div className="mx-auto px-8" style={{ maxWidth: '960px' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold gradient-text mb-6">
              Animation Showcase
            </h1>
            <p className="text-lg text-muted-foreground">
              Explore the 9 core animations that power the Mahoura design system.
              Each demo includes replay controls and a 0.3× slow-motion toggle to observe the easing curves.
            </p>
          </motion.div>
          </div>
        </div>

        {/* Animation Demos */}
        <div id="animations" className="py-20">
          <div className="mx-auto px-8" style={{ maxWidth: '960px' }}>
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
          </div>
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
