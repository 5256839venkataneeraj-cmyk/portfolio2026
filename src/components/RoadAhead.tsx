import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { scrollTo } from '../scroll';
import { Sparkles, GraduationCap, Bot, ArrowUpRight, ShieldCheck, ArrowUp, Crosshair } from 'lucide-react';

export const RoadAhead: React.FC = () => {
  const [activeWordId, setActiveWordId] = useState<string | null>(null);

  const line1Words = ['Master', 'the', 'fundamentals.'];
  const line2Words = ['Engineer', 'the', 'future', 'with', 'AI.'];

  const handleBackToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    scrollTo('#hero');
  };

  return (
    <section
      id="road-ahead"
      className="relative w-full py-28 bg-[#04060A] border-t border-white/10 overflow-hidden"
    >
      {/* Background Grid Pattern & Radial Vignette Matching Current UI */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
      <div className="absolute inset-0 bg-radial-vignette pointer-events-none" />

      {/* Subtle Ambient Radial Halos for Gold/Tan Accent Lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[360px] bg-[#C5A880]/[0.035] rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/[0.02] rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header: Centered Pill Badge & Typographic Hierarchy Aligned with Current UI */}
        <div className="gsap-reveal text-center max-w-4xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#C5A880]/30 bg-[#C5A880]/10 backdrop-blur-md text-[#C5A880] font-mono text-xs tracking-widest uppercase mb-4 shadow-[0_0_15px_rgba(197,168,128,0.15)]">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
            <span>06 • WHAT'S NEXT • THE ROAD AHEAD</span>
          </div>

          {/* Interactive Focus Lens HUD Hint */}
          <div className="flex items-center justify-center gap-2 font-mono text-[10px] text-[#C5A880]/80 uppercase tracking-widest mb-4">
            <Crosshair className="w-3.5 h-3.5 text-[#C5A880] animate-pulse" />
            <span>[ FOCUS LENS RETICLE • HOVER TO RESOLVE ]</span>
          </div>

          {/* Focus Lens Interactive Headline */}
          <div
            className="relative font-display text-3xl sm:text-5xl lg:text-[62px] font-bold tracking-tight leading-[1.25] sm:leading-[1.28] select-none py-2"
            onMouseLeave={() => setActiveWordId(null)}
          >
            {/* Line 1: Master the fundamentals. */}
            <div className="flex flex-wrap justify-center items-center gap-x-3 sm:gap-x-4 gap-y-2 mb-2 sm:mb-3">
              {line1Words.map((word, i) => {
                const id = `l1-${i}`;
                const isFocused = activeWordId === id;

                return (
                  <span
                    key={id}
                    onMouseEnter={() => setActiveWordId(id)}
                    onTouchStart={() => setActiveWordId(id)}
                    className={`relative inline-block px-2 sm:px-3 py-1 cursor-crosshair transition-all duration-300 will-change-[filter,opacity,transform] ${
                      isFocused
                        ? 'blur-none opacity-100 text-white drop-shadow-[0_0_28px_rgba(255,255,255,0.85)] scale-[1.03]'
                        : 'blur-[6px] opacity-25 text-slate-400 hover:opacity-75'
                    }`}
                  >
                    {word}

                    {/* Camera Viewfinder Frame: Corner Brackets ┌ ┐ └ ┘ */}
                    {isFocused && (
                      <motion.span
                        layoutId="focus-viewfinder"
                        className="absolute -inset-x-2 -inset-y-1.5 pointer-events-none z-20"
                        transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                      >
                        {/* ┌ Top-Left Bracket */}
                        <span className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-[#C5A880] shadow-[0_0_12px_rgba(197,168,128,0.9)]" />
                        {/* ┐ Top-Right Bracket */}
                        <span className="absolute top-0 right-0 w-2.5 h-2.5 border-t-2 border-r-2 border-[#C5A880] shadow-[0_0_12px_rgba(197,168,128,0.9)]" />
                        {/* └ Bottom-Left Bracket */}
                        <span className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b-2 border-l-2 border-[#C5A880] shadow-[0_0_12px_rgba(197,168,128,0.9)]" />
                        {/* ┘ Bottom-Right Bracket */}
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2 border-[#C5A880] shadow-[0_0_12px_rgba(197,168,128,0.9)]" />

                        {/* High-Tech Telemetry HUD Coordinates */}
                        <span className="absolute -top-3.5 left-0 font-mono text-[7px] tracking-wider text-[#C5A880] uppercase">
                          AF-ON
                        </span>
                        <span className="absolute -bottom-3.5 right-0 font-mono text-[7px] tracking-wider text-[#C5A880] uppercase">
                          OPT 1.0
                        </span>
                      </motion.span>
                    )}
                  </span>
                );
              })}
            </div>

            {/* Line 2: Engineer the future with AI. */}
            <div className="flex flex-wrap justify-center items-center gap-x-3 sm:gap-x-4 gap-y-2">
              {line2Words.map((word, i) => {
                const id = `l2-${i}`;
                const isFocused = activeWordId === id;

                return (
                  <span
                    key={id}
                    onMouseEnter={() => setActiveWordId(id)}
                    onTouchStart={() => setActiveWordId(id)}
                    className={`relative inline-block px-2 sm:px-3 py-1 cursor-crosshair transition-all duration-300 will-change-[filter,opacity,transform] ${
                      isFocused
                        ? 'blur-none opacity-100 text-transparent bg-clip-text bg-gradient-to-r from-[#F0DFC9] via-[#C5A880] to-[#E5C378] drop-shadow-[0_0_30px_rgba(197,168,128,0.9)] scale-[1.03]'
                        : 'blur-[6px] opacity-25 text-slate-400 hover:opacity-75'
                    }`}
                  >
                    {word}

                    {/* Camera Viewfinder Frame: Corner Brackets ┌ ┐ └ ┘ */}
                    {isFocused && (
                      <motion.span
                        layoutId="focus-viewfinder"
                        className="absolute -inset-x-2 -inset-y-1.5 pointer-events-none z-20"
                        transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                      >
                        {/* ┌ Top-Left Bracket */}
                        <span className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-[#C5A880] shadow-[0_0_12px_rgba(197,168,128,0.9)]" />
                        {/* ┐ Top-Right Bracket */}
                        <span className="absolute top-0 right-0 w-2.5 h-2.5 border-t-2 border-r-2 border-[#C5A880] shadow-[0_0_12px_rgba(197,168,128,0.9)]" />
                        {/* └ Bottom-Left Bracket */}
                        <span className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b-2 border-l-2 border-[#C5A880] shadow-[0_0_12px_rgba(197,168,128,0.9)]" />
                        {/* ┘ Bottom-Right Bracket */}
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2 border-[#C5A880] shadow-[0_0_12px_rgba(197,168,128,0.9)]" />

                        {/* High-Tech Telemetry HUD Coordinates */}
                        <span className="absolute -top-3.5 left-0 font-mono text-[7px] tracking-wider text-[#C5A880] uppercase">
                          AF-ON
                        </span>
                        <span className="absolute -bottom-3.5 right-0 font-mono text-[7px] tracking-wider text-[#C5A880] uppercase">
                          AI 1.0
                        </span>
                      </motion.span>
                    )}
                  </span>
                );
              })}
            </div>
          </div>

          <p className="mt-4 font-sans text-sm sm:text-base text-slate-400 font-normal leading-relaxed max-w-2xl mx-auto">
            Strategic progression roadmap bridging foundational computer science at VIT Vellore with scalable AI systems and full-stack cloud engineering.
          </p>
        </div>

        {/* Responsive Grid of 2 Sleek Glassmorphism Cards Aligned with Current UI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-12">
          
          {/* SHORT TERM CARD */}
          <div className="relative group rounded-2xl sm:rounded-3xl border border-white/10 bg-slate-900/30 backdrop-blur-xl p-7 sm:p-9 transition-all duration-500 flex flex-col justify-between overflow-hidden shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] hover:border-[#C5A880]/50 hover:shadow-[0_20px_50px_rgba(197,168,128,0.12)] hover:-translate-y-1.5">
            {/* Top Edge Specular Light Line */}
            <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />

            {/* Interior Hover Ambient Glow */}
            <div className="absolute -top-24 -left-24 w-52 h-52 rounded-full bg-gradient-to-br from-[#C5A880]/20 via-[#C5A880]/5 to-transparent blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

            <div className="relative z-10">
              {/* Telemetry Header Bar */}
              <div className="flex items-center justify-between font-mono text-[10px] text-slate-400 border-b border-white/10 pb-3 mb-6">
                <span className="font-semibold tracking-wider text-slate-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C5A880] shadow-[0_0_8px_rgba(197,168,128,0.8)]" />
                  PHASE 01
                </span>
                <span className="px-2.5 py-0.5 rounded-full border border-[#C5A880]/40 bg-[#C5A880]/10 text-[#C5A880] uppercase font-semibold text-[10px] tracking-wider">
                  SHORT TERM
                </span>
              </div>

              {/* Title & Icon Row */}
              <div className="flex items-center gap-3.5 mb-5">
                <div className="w-11 h-11 rounded-xl border border-[#C5A880]/30 bg-[#C5A880]/10 text-[#C5A880] backdrop-blur-md flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-105 shadow-[0_0_15px_rgba(197,168,128,0.12)]">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                    FOUNDATION & ACADEMICS
                  </span>
                  <h3 className="font-mono text-sm sm:text-base font-bold tracking-widest text-[#C5A880] uppercase">
                    SHORT TERM
                  </h3>
                </div>
              </div>

              {/* Upgraded Content Paragraph */}
              <p className="font-sans text-sm sm:text-base text-slate-300 leading-relaxed font-normal mt-3">
                Excel in my B.Tech Computer Science studies at VIT Vellore, master data structures, and build responsive, AI-integrated web applications.
              </p>
            </div>

            {/* Card Footer: Verified Trajectory Strip */}
            <div className="relative z-10 mt-8 pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono text-slate-400">
              <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C5A880]" />
                <span>Immediate Academic Milestone</span>
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-[#C5A880] transition-colors" />
            </div>
          </div>

          {/* LONG TERM CARD */}
          <div className="relative group rounded-2xl sm:rounded-3xl border border-white/10 bg-slate-900/30 backdrop-blur-xl p-7 sm:p-9 transition-all duration-500 flex flex-col justify-between overflow-hidden shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] hover:border-[#C5A880]/50 hover:shadow-[0_20px_50px_rgba(197,168,128,0.12)] hover:-translate-y-1.5">
            {/* Top Edge Specular Light Line */}
            <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />

            {/* Interior Hover Ambient Glow */}
            <div className="absolute -top-24 -left-24 w-52 h-52 rounded-full bg-gradient-to-br from-[#C5A880]/20 via-[#C5A880]/5 to-transparent blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

            <div className="relative z-10">
              {/* Telemetry Header Bar */}
              <div className="flex items-center justify-between font-mono text-[10px] text-slate-400 border-b border-white/10 pb-3 mb-6">
                <span className="font-semibold tracking-wider text-slate-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C5A880] shadow-[0_0_8px_rgba(197,168,128,0.8)]" />
                  PHASE 02
                </span>
                <span className="px-2.5 py-0.5 rounded-full border border-[#C5A880]/40 bg-[#C5A880]/10 text-[#C5A880] uppercase font-semibold text-[10px] tracking-wider">
                  LONG TERM
                </span>
              </div>

              {/* Title & Icon Row */}
              <div className="flex items-center gap-3.5 mb-5">
                <div className="w-11 h-11 rounded-xl border border-[#C5A880]/30 bg-[#C5A880]/10 text-[#C5A880] backdrop-blur-md flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-105 shadow-[0_0_15px_rgba(197,168,128,0.12)]">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                    SYSTEM ARCHITECTURE & AI
                  </span>
                  <h3 className="font-mono text-sm sm:text-base font-bold tracking-widest text-[#C5A880] uppercase">
                    LONG TERM
                  </h3>
                </div>
              </div>

              {/* Upgraded Content Paragraph */}
              <p className="font-sans text-sm sm:text-base text-slate-300 leading-relaxed font-normal mt-3">
                Architect scalable cloud solutions and become a specialized AI developer, creating intelligent tools that solve complex, real-world problems.
              </p>
            </div>

            {/* Card Footer: Verified Trajectory Strip */}
            <div className="relative z-10 mt-8 pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono text-slate-400">
              <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C5A880]" />
                <span>Vision & Future Impact</span>
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-[#C5A880] transition-colors" />
            </div>
          </div>

        </div>

        {/* Bottom Bar: Horizon Meta & BACK TO TOP Button Aligned with Current UI */}
        <div className="gsap-reveal rounded-2xl border border-white/10 bg-slate-900/40 p-5 sm:p-6 backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
            <span className="w-2 h-2 rounded-full bg-[#C5A880] animate-pulse" />
            <span className="text-slate-300 tracking-wider">STRATEGIC TRAJECTORY</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-400">VIT VELLORE & BEYOND</span>
          </div>

          <a
            href="#hero"
            onClick={handleBackToTop}
            className="group inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-[#C5A880]/30 bg-[#C5A880]/10 hover:bg-[#C5A880]/20 text-[#C5A880] hover:text-white transition-all font-mono text-xs tracking-widest uppercase cursor-pointer backdrop-blur-md shadow-[0_0_15px_rgba(197,168,128,0.1)]"
            aria-label="Back to top of page"
          >
            <span>BACK TO TOP</span>
            <ArrowUp className="w-3.5 h-3.5 transition-transform duration-300 group-hover:-translate-y-0.5" />
          </a>
        </div>

      </div>
    </section>
  );
};

export default RoadAhead;
