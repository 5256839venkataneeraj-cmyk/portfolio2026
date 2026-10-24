import React, { useRef, useEffect, useState } from 'react';
import { content } from '../content';
import { onScroll } from '../scroll';
import { CheckCircle2, Navigation } from 'lucide-react';
import { LightCove } from './LightCove';

export const Trajectory: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const [pathLength, setPathLength] = useState(1000);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (pathRef.current) {
      const length = pathRef.current.getTotalLength();
      setPathLength(length);
    }

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

  const strokeOffset = pathLength * (1 - progress);

  return (
    <section
      id="trajectory"
      ref={containerRef}
      className="relative w-full py-28 bg-[#05070B] overflow-hidden border-t border-white/10"
    >
      {/* Interactive 3D WebGL Light Cove Background */}
      <LightCove className="z-0 opacity-90" />

      {/* Atmospheric Top & Bottom Fade Overlays */}
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#05070B] via-[#05070B]/60 to-transparent pointer-events-none z-0" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#05070B] via-[#05070B]/60 to-transparent pointer-events-none z-0" />
      <div className="absolute inset-0 bg-radial-vignette pointer-events-none z-0 opacity-60" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="gsap-reveal text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-cyan-500/30 bg-cyan-950/20 text-cyan-300 font-mono text-xs tracking-widest uppercase mb-3">
            <Navigation className="w-3.5 h-3.5" />
            <span>CAREER & EDUCATION PATH</span>
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-white">
            MY JOURNEY
          </h2>
          <p className="mt-3 font-sans text-sm sm:text-base text-slate-400 font-normal leading-relaxed max-w-xl mx-auto">
            Interactive timeline tracing Narayana Institute to Vellore Institute of Technology.
          </p>
        </div>

        {/* Trajectory Main Display */}
        <div className="gsap-reveal relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Visual Track: SVG Curve with Dark Glassmorphism */}
          <div className="hidden lg:block lg:col-span-4 sticky top-28 h-[520px] rounded-2xl border border-white/15 bg-[#070B14]/85 p-6 backdrop-blur-xl shadow-2xl shadow-black/60 overflow-hidden">
            <div className="flex items-center justify-between font-mono text-[10px] text-slate-400 border-b border-white/10 pb-3 mb-4">
              <span className="text-cyan-400 font-bold">TIMELINE VISUALIZER</span>
              <span>PROGRESS: {Math.round(progress * 100)}%</span>
            </div>

            <div className="relative w-full h-[400px] flex items-center justify-center">
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-80 h-80 rounded-full border border-white/5" />
                <div className="w-56 h-56 rounded-full border border-cyan-500/10" />
                <div className="w-36 h-36 rounded-full border border-white/5" />
              </div>

              {/* The SVG Trajectory Path */}
              <svg
                viewBox="0 0 300 450"
                className="w-full h-full relative z-10 overflow-visible"
              >
                <defs>
                  <linearGradient id="orbitGlow" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
                    <stop offset="50%" stopColor="#818cf8" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#34d399" stopOpacity="1" />
                  </linearGradient>
                </defs>

                {/* Base Faint Path */}
                <path
                  d="M 50 30 C 180 50, 260 120, 220 200 C 180 280, 40 290, 80 370 C 110 430, 220 430, 250 420"
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.12)"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />

                {/* Animated Path */}
                <path
                  ref={pathRef}
                  d="M 50 30 C 180 50, 260 120, 220 200 C 180 280, 40 290, 80 370 C 110 430, 220 430, 250 420"
                  fill="none"
                  stroke="url(#orbitGlow)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  style={{
                    strokeDasharray: pathLength,
                    strokeDashoffset: strokeOffset,
                    transition: 'stroke-dashoffset 0.1s linear',
                  }}
                />

                {/* Station Checkpoints on SVG */}
                <circle cx="50" cy="30" r="5" fill="#38bdf8" />
                <text x="65" y="34" fill="#38bdf8" fontSize="10" fontFamily="-apple-system, BlinkMacSystemFont, 'SF Pro', 'Space Grotesk', sans-serif">01</text>

                <circle cx="220" cy="200" r="5" fill="#818cf8" />
                <text x="195" y="195" fill="#818cf8" fontSize="10" fontFamily="-apple-system, BlinkMacSystemFont, 'SF Pro', 'Space Grotesk', sans-serif">02</text>

                <circle cx="80" cy="370" r="5" fill="#34d399" />
                <text x="95" y="375" fill="#34d399" fontSize="10" fontFamily="-apple-system, BlinkMacSystemFont, 'SF Pro', 'Space Grotesk', sans-serif">03</text>

                <circle cx="250" cy="420" r="6" fill="#f59e0b" className="animate-pulse" />
                <text x="210" y="440" fill="#f59e0b" fontSize="10" fontFamily="-apple-system, BlinkMacSystemFont, 'SF Pro', 'Space Grotesk', sans-serif" fontWeight="bold">04</text>
              </svg>
            </div>
          </div>

          {/* Right Column: 4 Timeline Stations */}
          <div className="lg:col-span-8 space-y-6">
            {content.trajectory.map((leg, index) => {
              const threshold = index / (content.trajectory.length - 1);
              const isReached = progress >= threshold * 0.85;

              return (
                <div
                  key={leg.id}
                  className={`relative rounded-2xl border transition-all duration-300 overflow-hidden backdrop-blur-xl shadow-2xl ${
                    isReached
                      ? 'border-cyan-500/50 bg-[#0A101C]/90 shadow-cyan-950/40 ring-1 ring-cyan-500/20'
                      : 'border-white/15 bg-[#070B14]/85 hover:border-white/30'
                  }`}
                >
                  <div
                    className={`absolute top-0 left-0 bottom-0 w-1 transition-colors ${
                      isReached ? 'bg-cyan-400' : 'bg-white/10'
                    }`}
                  />

                  <div className="p-6 sm:p-7 pl-8">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3 mb-3 font-mono text-xs">
                      <span className="font-bold px-2.5 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/40 text-cyan-300">
                        STEP {leg.legNumber}
                      </span>
                      <span className="text-cyan-400 font-semibold">{leg.period}</span>
                    </div>

                    <h3 className="font-display text-xl font-bold tracking-tight text-white">
                      {leg.title}
                    </h3>
                    <div className="font-mono text-xs sm:text-sm text-cyan-400 mt-1">
                      {leg.institution}
                    </div>

                    {leg.details && (
                      <p className="mt-3 font-sans text-xs sm:text-sm text-slate-300 leading-relaxed">
                        {leg.details}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
};
