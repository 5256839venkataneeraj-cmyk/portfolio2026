import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export interface ArcCardItem {
  id: string;
  code: string;
  title: string;
  subtitle?: string;
  description: string;
  badge: string;
  icon: React.ReactNode;
  accentColor?: 'cyan' | 'emerald' | 'amber' | 'sky' | 'indigo' | 'pink';
  highlight?: string;
  isSpecial?: boolean;
}

interface ArcCarouselProps {
  items: ArcCardItem[];
  carouselId: string;
}

// ─── Accent style map ────────────────────────────────────────────────────────
const accentMap = {
  emerald: {
    glow:        'from-emerald-500/20 via-transparent to-transparent',
    borderActive:'border-emerald-400/80 shadow-[0_0_40px_rgba(52,211,153,0.25)]',
    badge:       'border-emerald-500/40 bg-emerald-950/60 text-emerald-300',
    dot:         'bg-emerald-400',
    iconBg:      'border-emerald-500/30 bg-emerald-950/40 text-emerald-300',
  },
  amber: {
    glow:        'from-amber-500/20 via-transparent to-transparent',
    borderActive:'border-amber-400/80 shadow-[0_0_40px_rgba(245,158,11,0.25)]',
    badge:       'border-amber-500/40 bg-amber-950/60 text-amber-300',
    dot:         'bg-amber-400',
    iconBg:      'border-amber-500/30 bg-amber-950/40 text-amber-300',
  },
  sky: {
    glow:        'from-sky-500/20 via-transparent to-transparent',
    borderActive:'border-sky-400/80 shadow-[0_0_40px_rgba(56,189,248,0.25)]',
    badge:       'border-sky-500/40 bg-sky-950/60 text-sky-300',
    dot:         'bg-sky-400',
    iconBg:      'border-sky-500/30 bg-sky-950/40 text-sky-300',
  },
  indigo: {
    glow:        'from-indigo-500/20 via-transparent to-transparent',
    borderActive:'border-indigo-400/80 shadow-[0_0_40px_rgba(129,140,248,0.25)]',
    badge:       'border-indigo-500/40 bg-indigo-950/60 text-indigo-300',
    dot:         'bg-indigo-400',
    iconBg:      'border-indigo-500/30 bg-indigo-950/40 text-indigo-300',
  },
  pink: {
    glow:        'from-pink-500/20 via-transparent to-transparent',
    borderActive:'border-pink-400/80 shadow-[0_0_40px_rgba(244,114,182,0.25)]',
    badge:       'border-pink-500/40 bg-pink-950/60 text-pink-300',
    dot:         'bg-pink-400',
    iconBg:      'border-pink-500/30 bg-pink-950/40 text-pink-300',
  },
  cyan: {
    glow:        'from-cyan-500/20 via-transparent to-transparent',
    borderActive:'border-cyan-400/80 shadow-[0_0_40px_rgba(56,189,248,0.28)]',
    badge:       'border-cyan-500/40 bg-cyan-950/60 text-cyan-300',
    dot:         'bg-cyan-400',
    iconBg:      'border-cyan-500/30 bg-cyan-950/40 text-cyan-300',
  },
} as const;

const getAccent = (color: ArcCardItem['accentColor']) =>
  accentMap[color ?? 'cyan'];

// ─── Component ───────────────────────────────────────────────────────────────
export const ArcCarousel: React.FC<ArcCarouselProps> = ({ items, carouselId }) => {
  const n = items.length;

  // Active index — JS responsibility starts and ends here.
  const [activeIndex, setActiveIndex] = useState(0);

  // Drag state
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef<number | null>(null);
  const dragLive   = useRef(0);

  // DOM refs
  const sceneRef = useRef<HTMLDivElement>(null);
  const wheelRef = useRef<HTMLDivElement>(null);

  // ── GSAP ScrollTrigger entrance ───────────────────────────────────────────
  // Animates the scene wrapper opacity/scale from 0.88 → 1.
  // The wheel --rot CSS variable is NOT touched here.
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;
    gsap.set(scene, { opacity: 0, scale: 0.88 });
    const trigger = ScrollTrigger.create({
      trigger: scene,
      start:   'top 80%',
      once:    true,
      onEnter: () => {
        gsap.to(scene, { opacity: 1, scale: 1, duration: 1.2, ease: 'power3.out' });
      },
    });
    return () => { trigger.kill(); };
  }, []);

  // ── Write --rot to .wheel whenever activeIndex changes ────────────────────
  // This is the ONLY place JS communicates rotation to CSS.
  // CSS @property transition handles the smooth easing.
  useEffect(() => {
    const wheel = wheelRef.current;
    if (!wheel) return;
    const stepDeg = 360 / n;
    wheel.style.setProperty('--rot', `${-activeIndex * stepDeg}deg`);
  }, [activeIndex, n]);

  // ── Navigation ────────────────────────────────────────────────────────────
  const prevCard = useCallback(() => setActiveIndex(prev => (prev - 1 + n) % n), [n]);
  const nextCard = useCallback(() => setActiveIndex(prev => (prev + 1) % n), [n]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowLeft')  prevCard();
      if (e.key === 'ArrowRight') nextCard();
    },
    [prevCard, nextCard]
  );

  // ── Pointer drag-to-snap ──────────────────────────────────────────────────
  const handlePointerDown = (e: React.PointerEvent) => {
    dragStartX.current = e.clientX;
    dragLive.current   = 0;
    setIsDragging(true);
    sceneRef.current?.setPointerCapture(e.pointerId);
    // Disable CSS transition so drag feels instant
    if (wheelRef.current) wheelRef.current.style.transition = '--rot 0s';
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || dragStartX.current === null) return;
    dragLive.current = e.clientX - dragStartX.current;
    const wheel = wheelRef.current;
    if (!wheel) return;
    // Provide live visual feedback: drag 90° across full viewport width
    const stepDeg = 360 / n;
    const liveRot = -activeIndex * stepDeg + (dragLive.current / window.innerWidth) * 90;
    wheel.style.setProperty('--rot', `${liveRot}deg`);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    sceneRef.current?.releasePointerCapture(e.pointerId);
    // Re-enable CSS @property transition for smooth snap
    if (wheelRef.current) wheelRef.current.style.transition = '';

    const threshold = 60; // px
    if      (dragLive.current >  threshold) prevCard();
    else if (dragLive.current < -threshold) nextCard();
    else {
      // Snap back without index change
      const stepDeg = 360 / n;
      wheelRef.current?.style.setProperty('--rot', `${-activeIndex * stepDeg}deg`);
    }
    dragStartX.current = null;
    dragLive.current   = 0;
  };

  const handlePointerCancel = () => {
    setIsDragging(false);
    dragStartX.current = null;
    dragLive.current   = 0;
    if (wheelRef.current) wheelRef.current.style.transition = '';
    const stepDeg = 360 / n;
    wheelRef.current?.style.setProperty('--rot', `${-activeIndex * stepDeg}deg`);
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className="relative w-full outline-none select-none py-6"
      aria-label={`Arc Wheel Carousel — ${carouselId}`}
    >
      {/* HUD telemetry top row */}
      <div className="flex items-center justify-between mb-6 max-w-5xl mx-auto px-4 font-mono text-xs">
        <div className="flex items-center gap-2 text-cyan-400 font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span className="tracking-widest uppercase">ARC // WHEEL</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 px-3 py-1 rounded-full border border-white/10 bg-black/40 backdrop-blur-md text-slate-300 text-[11px]">
            <span className="text-cyan-400 font-bold">
              {String(activeIndex + 1).padStart(2, '0')}
            </span>
            <span className="text-slate-600">/</span>
            <span>{String(n).padStart(2, '0')}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={prevCard}
              className="p-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all cursor-pointer"
              aria-label="Previous card"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextCard}
              className="p-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all cursor-pointer"
              aria-label="Next card"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ── 3-D Wheel Scene ─────────────────────────────────────────────────
          .wheel-scene  → 3-D perspective context (GSAP entrance animates this)
          .wheel        → single element; JS sets --rot here only
          .wheel-card   → CSS positions via rotate(calc(var(--rot)+var(--i)*var(--step)))
          Zero JS geometry math. All transitions from @property --rot in CSS.
      ─────────────────────────────────────────────────────────────────────── */}
      <div
        ref={sceneRef}
        className="wheel-scene"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
      >
        {/* The single .wheel element JS mutates via --rot */}
        <div
          ref={wheelRef}
          className="wheel"
          style={{ '--n': n } as React.CSSProperties}
        >
          {items.map((item, index) => {
            const accent   = getAccent(item.accentColor);
            const isActive = index === activeIndex;

            return (
              <div
                key={item.id}
                className={`wheel-card rounded-3xl border overflow-hidden cursor-pointer ${
                  isActive
                    ? `${accent.borderActive} bg-[#090F1E]/95`
                    : 'border-white/10 bg-[#070B16]/80 hover:border-white/25'
                }`}
                style={{ '--i': index } as React.CSSProperties}
                onClick={() => { if (!isDragging) setActiveIndex(index); }}
                role="button"
                tabIndex={-1}
                aria-label={`Select: ${item.title}`}
              >
                {/* Radial glow overlay */}
                <div
                  className={`absolute top-0 left-0 right-0 h-40 bg-gradient-to-b ${accent.glow} opacity-90 pointer-events-none`}
                />

                <div className="relative z-10 p-7 sm:p-8 flex flex-col justify-between h-[380px] sm:h-[400px]">
                  <div>
                    {/* Telemetry bar */}
                    <div className="flex items-center justify-between font-mono text-[10px] text-slate-400 border-b border-white/10 pb-3 mb-5">
                      <span className="font-bold tracking-wider text-cyan-400">
                        {item.code}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full border ${accent.badge} uppercase font-semibold text-[10px]`}>
                        {item.badge}
                      </span>
                    </div>

                    {/* Icon + title */}
                    <div className="flex items-center gap-3.5 mb-4">
                      <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center ${accent.iconBg} flex-shrink-0`}>
                        {item.icon}
                      </div>
                      <div>
                        {item.subtitle && (
                          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block">
                            {item.subtitle}
                          </span>
                        )}
                        <h3 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-white">
                          {item.title}
                        </h3>
                      </div>
                    </div>

                    {/* Description / special spotlight */}
                    {item.isSpecial ? (
                      <div className="my-3 p-4 rounded-2xl border border-cyan-500/30 bg-cyan-950/20 backdrop-blur-sm">
                        <div className="flex items-center gap-2 text-cyan-300 font-mono text-[10px] uppercase font-bold tracking-wider mb-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                          <span>AI PHILOSOPHY</span>
                        </div>
                        <p className="font-sans text-sm sm:text-base font-semibold text-white leading-snug">
                          &ldquo;{item.description}&rdquo;
                        </p>
                      </div>
                    ) : (
                      <p className="mt-3 font-sans text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                        {item.description}
                      </p>
                    )}
                  </div>

                  {/* Bottom highlight row */}
                  <div className="pt-4 border-t border-white/10 flex items-center justify-between font-mono text-xs">
                    <div className="flex items-center gap-2 truncate">
                      <span className={`w-2 h-2 rounded-full ${accent.dot}`} />
                      <span className="text-[11px] text-slate-300 truncate">
                        {item.highlight ?? 'Interactive Arc Focus'}
                      </span>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-slate-500" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pagination dot rail */}
      <div className="flex items-center justify-center gap-2 mt-6">
        {items.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setActiveIndex(idx)}
            className={`h-2 rounded-full transition-all cursor-pointer ${
              activeIndex === idx
                ? 'w-8 bg-cyan-400 shadow-[0_0_12px_rgba(56,189,248,0.5)]'
                : 'w-2 bg-white/20 hover:bg-white/40'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
