import React, { useEffect, useRef, useState } from 'react';
import { content } from '../content';
import { scrollTo, onScroll } from '../scroll';
import { MapPin } from 'lucide-react';
import gsap from 'gsap';

export const Earthrise: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  // Initial load stagger-in animation
  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.fromTo(
      '.hero-astronaut-visual',
      { opacity: 0, scale: 0.92, y: 35 },
      { opacity: 1, scale: 1, y: 0, duration: 1.4 }
    )
    .fromTo(
      '.hero-kicker-anim',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8 },
      '-=1.0'
    )
    .fromTo(
      '.hero-name-anim',
      { opacity: 0, y: 40, filter: 'blur(10px)' },
      { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.2 },
      '-=0.7'
    )
    .fromTo(
      '.hero-bio-anim',
      { opacity: 0, y: 25 },
      { opacity: 1, y: 0, duration: 0.9 },
      '-=0.8'
    )
    .fromTo(
      '.hero-hud-anim',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.08 },
      '-=0.6'
    );

    return () => {
      tl.kill();
    };
  }, []);

  useEffect(() => {
    const unsub = onScroll(() => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const containerHeight = containerRef.current.offsetHeight;
      const windowHeight = window.innerHeight;
      
      const scrolled = -rect.top;
      const totalScrollable = containerHeight - windowHeight;
      const p = Math.max(0, Math.min(1, scrolled / (totalScrollable || 1)));
      setProgress(p);
    });

    return unsub;
  }, []);

  // Exact SELENE parallax math preserved
  const earthY = 32 - progress * 80;
  const earthScale = 0.95 + progress * 0.25;
  const earthOpacity = Math.min(1, 0.4 + progress * 0.9);

  const groundY = progress * -18;
  const moonscapeY = progress * -8;
  const astronautY = progress * -28;
  const astronautScale = 1 + progress * 0.04;

  const titleOpacity = Math.max(0, 1 - progress * 1.8);
  const titleY = progress * -70;
  const hudOpacity = Math.max(0, 1 - progress * 2.2);

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative w-full h-[220vh] bg-[#05070B]"
    >
      {/* Sticky viewport frame */}
      <div className="sticky top-0 h-screen w-full overflow-hidden select-none">
        
        {/* Layer 0: Sky */}
        <div className="absolute inset-0 z-0">
          <picture>
            <source media="(max-width: 768px)" srcSet="/layers/m/sky.webp" />
            <img
              src="/layers/d/sky.webp"
              alt="Starfield Deep Space"
              className="w-full h-full object-cover object-center"
            />
          </picture>
        </div>

        {/* Ambient glow */}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[70vw] max-w-[900px] max-h-[900px] rounded-full pointer-events-none transition-opacity duration-300"
          style={{
            background: 'radial-gradient(circle, rgba(56,189,248,0.18) 0%, rgba(30,58,138,0.08) 45%, transparent 70%)',
            transform: `translate(-50%, calc(-50% + ${earthY * 1.2}px)) scale(${earthScale})`,
            opacity: earthOpacity,
          }}
        />

        {/* Layer 1: Earth (The Earthrise Element) */}
        <div
          className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none transition-transform will-change-transform ease-out"
          style={{
            transform: `translate3d(0, ${earthY}%, 0) scale(${earthScale})`,
            opacity: earthOpacity,
          }}
        >
          <div className="relative w-full h-full max-w-7xl mx-auto flex items-center justify-center">
            <picture>
              <source media="(max-width: 768px)" srcSet="/layers/m/earth.webp" />
              <img
                src="/layers/d/earth.webp"
                alt="Earthrise"
                className="w-[78vw] md:w-[50vw] max-w-[760px] object-contain drop-shadow-[0_0_80px_rgba(56,189,248,0.35)]"
              />
            </picture>
          </div>
        </div>

        {/* Layer 2: Moonscape */}
        <div
          className="absolute inset-0 z-20 pointer-events-none will-change-transform"
          style={{
            transform: `translate3d(0, ${moonscapeY}px, 0)`,
          }}
        >
          <picture>
            <source media="(max-width: 768px)" srcSet="/layers/m/moonscape.webp" />
            <img
              src="/layers/d/moonscape.webp"
              alt="Moonscape Horizon"
              className="w-full h-full object-cover object-bottom"
            />
          </picture>
        </div>

        {/* Layer 3: Lunar Ground */}
        <div
          className="absolute inset-0 z-30 pointer-events-none will-change-transform"
          style={{
            transform: `translate3d(0, ${groundY}px, 0)`,
          }}
        >
          <picture>
            <source media="(max-width: 768px)" srcSet="/layers/m/ground.webp" />
            <img
              src="/layers/d/ground.webp"
              alt="Lunar Surface Ground"
              className="w-full h-full object-cover object-bottom"
            />
          </picture>
        </div>

        {/* Layer 4: Astronaut */}
        <div
          className="absolute inset-0 z-40 pointer-events-none will-change-transform hero-astronaut-visual"
          style={{
            transform: `translate3d(0, ${astronautY}px, 0) scale(${astronautScale})`,
          }}
        >
          <picture>
            <source media="(max-width: 768px)" srcSet="/layers/m/astronaut.webp" />
            <img
              src="/layers/d/astronaut.webp"
              alt="Lunar Explorer Astronaut"
              className="w-full h-full object-cover object-bottom"
            />
          </picture>
        </div>

        {/* Layer 5: Frame Overlay */}
        <div className="absolute inset-0 z-50 pointer-events-none mix-blend-screen opacity-90">
          <picture>
            <source media="(max-width: 768px)" srcSet="/layers/m/frame.webp" />
            <img
              src="/layers/d/frame.webp"
              alt="Telemetry Overlay Frame"
              className="w-full h-full object-cover object-center"
            />
          </picture>
        </div>

        {/* Gradient vignette */}
        <div className="absolute inset-0 z-45 pointer-events-none bg-gradient-to-t from-[#05070B] via-transparent to-black/40" />

        {/* Typography & HUD Overlay */}
        <div
          className="absolute inset-0 z-45 flex flex-col justify-between p-6 sm:p-10 md:p-16 pointer-events-none will-change-transform"
          style={{
            opacity: titleOpacity,
            transform: `translate3d(0, ${titleY}px, 0)`,
          }}
        >
          {/* Top HUD Row */}
          <div className="pt-16 sm:pt-20 flex justify-between items-start font-mono text-[11px] text-slate-300">
            <div className="hero-hud-anim flex items-center gap-2 px-3 py-1 rounded bg-black/60 border border-white/10 backdrop-blur-sm">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              <span>{content.location}</span>
            </div>

            <div className="hero-hud-anim flex items-center gap-2 px-3 py-1 rounded bg-black/60 border border-cyan-500/30 text-cyan-300 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              <span>{content.experience.institution}</span>
            </div>
          </div>

          {/* Center Title & Exact Resume Headline */}
          <div className="text-center my-auto flex flex-col items-center justify-center">
            {/* Kicker */}
            <div className="hero-kicker-anim inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-950/30 text-cyan-300 font-mono text-xs sm:text-sm tracking-widest uppercase mb-4 backdrop-blur-md">
              <span>{content.experience.role} • {content.experience.institution}</span>
            </div>

            {/* Massive Display Title */}
            <h1 className="hero-name-anim font-display text-5xl sm:text-7xl md:text-9xl lg:text-[10rem] font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-100 to-slate-400 uppercase drop-shadow-[0_10px_40px_rgba(0,0,0,0.9)]">
              {content.name}
            </h1>

            {/* Full Name & Exact Headline */}
            <div className="hero-bio-anim mt-4 max-w-2xl text-center px-4">
              <div className="text-white font-sans font-semibold text-sm sm:text-base tracking-tight mb-1.5">
                {content.fullName}
              </div>
              <div className="text-slate-300/90 font-sans text-xs sm:text-sm leading-relaxed font-normal">
                {content.headline}
              </div>
            </div>
          </div>

          {/* Bottom HUD: Exact Education & Experience Details from PDF */}
          <div className="pb-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 max-w-5xl mx-auto mb-6">
              <div className="hero-hud-anim p-3 rounded-xl border border-white/10 bg-black/60 backdrop-blur-md">
                <div className="text-[10px] font-mono tracking-wider text-slate-400 uppercase font-semibold">EXPERIENCE</div>
                <div className="text-white font-sans text-xs font-semibold mt-0.5 tracking-tight">{content.experience.institution}</div>
                <div className="text-[11px] font-mono text-cyan-400 mt-0.5">{content.experience.role} ({content.experience.period})</div>
              </div>

              <div className="hero-hud-anim p-3 rounded-xl border border-white/10 bg-black/60 backdrop-blur-md">
                <div className="text-[10px] font-mono tracking-wider text-slate-400 uppercase font-semibold">EDUCATION</div>
                <div className="text-white font-sans text-xs font-semibold mt-0.5 tracking-tight">Vellore Institute of Technology</div>
                <div className="text-[11px] font-mono text-cyan-400 mt-0.5">B.Tech, Computer Science (July 2026)</div>
              </div>

              <div className="hero-hud-anim p-3 rounded-xl border border-white/10 bg-black/60 backdrop-blur-md">
                <div className="text-[10px] font-mono tracking-wider text-slate-400 uppercase font-semibold">EDUCATION</div>
                <div className="text-white font-sans text-xs font-semibold mt-0.5 tracking-tight">Narayana Institute</div>
                <div className="text-[11px] font-mono text-cyan-400 mt-0.5">April 2024 - April 2026</div>
              </div>

              <div className="hero-hud-anim p-3 rounded-xl border border-white/10 bg-black/60 backdrop-blur-md">
                <div className="text-[10px] font-mono tracking-wider text-slate-400 uppercase font-semibold">EDUCATION</div>
                <div className="text-white font-sans text-xs font-semibold mt-0.5 tracking-tight">Narayana Institute</div>
                <div className="text-[11px] font-mono text-cyan-400 mt-0.5">April 2014 - March 2024</div>
              </div>
            </div>

            {/* Scroll Indicator */}
            <div
              className="flex justify-center pointer-events-auto"
              style={{ opacity: hudOpacity }}
            >
              <button
                onClick={() => scrollTo('#milestones')}
                className="group flex flex-col items-center gap-1.5 text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer"
                aria-label="Scroll to Milestones"
              >
                <span className="text-[10px] tracking-[0.25em] font-mono uppercase text-slate-400 group-hover:text-cyan-300">
                  SCROLL
                </span>
                <div className="w-5 h-8 rounded-full border border-white/20 group-hover:border-cyan-400/60 flex items-start justify-center p-1 transition-colors">
                  <div className="w-1 h-2 rounded-full bg-cyan-400 animate-bounce" />
                </div>
              </button>
            </div>
          </div>

        </div>

        {/* Scroll Progress Bar */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-white/5 z-50">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 via-sky-400 to-indigo-400 transition-all duration-75"
            style={{ width: `${progress * 100}%` }}
          />
        </div>

      </div>
    </section>
  );
};
