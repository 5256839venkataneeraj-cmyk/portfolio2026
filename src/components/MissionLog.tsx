import React, { useRef, useEffect, useState } from 'react';
import { content } from '../content';
import { onScroll, scrollTo } from '../scroll';
import { Calendar, MapPin, ChevronRight } from 'lucide-react';

export const MissionLog: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const reelRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeCardIndex, setActiveCardIndex] = useState(0);

  useEffect(() => {
    const unsub = onScroll(() => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const sectionHeight = sectionRef.current.offsetHeight;
      const windowHeight = window.innerHeight;

      const scrolled = -rect.top;
      const totalScrollable = sectionHeight - windowHeight;
      const p = Math.max(0, Math.min(1, scrolled / (totalScrollable || 1)));
      setScrollProgress(p);

      const cardIdx = Math.min(
        content.milestones.length - 1,
        Math.floor(p * content.milestones.length)
      );
      setActiveCardIndex(cardIdx);
    });

    return unsub;
  }, []);

  const translateX = scrollProgress * -70;

  const handleCardClick = (index: number) => {
    setActiveCardIndex(index);
    if (!sectionRef.current) return;
    const targetScroll =
      sectionRef.current.offsetTop +
      (index / (content.milestones.length - 1)) *
        (sectionRef.current.offsetHeight - window.innerHeight);
    scrollTo(targetScroll);
  };

  return (
    <section
      id="milestones"
      ref={sectionRef}
      className="relative w-full h-[280vh] bg-[#05070B]"
    >
      {/* Pinned Viewport Container */}
      <div className="sticky top-0 h-screen w-full flex flex-col justify-between overflow-hidden px-4 sm:px-8 lg:px-14 py-20 bg-gradient-to-b from-[#05070B] via-[#070B12] to-[#05070B]">
        
        {/* Decorative Grid */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />

        {/* Section Header */}
        <div className="gsap-reveal relative z-10 max-w-7xl w-full mx-auto flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs tracking-widest uppercase mb-1">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span>EXPERIENCE & EDUCATION</span>
            </div>
            <h2 className="font-display text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
              MILESTONES
            </h2>
            <p className="mt-2 font-sans text-sm sm:text-base text-slate-400 font-normal leading-relaxed max-w-xl">
              Chronological records of education and experience directly from the resume.
            </p>
          </div>

          {/* Indicator */}
          <div className="flex items-center gap-3 font-mono text-xs">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-white/10 bg-white/5 text-slate-300">
              <span className="text-cyan-400 font-bold">0{activeCardIndex + 1}</span>
              <span className="text-slate-500">/</span>
              <span>0{content.milestones.length}</span>
            </div>

            <div className="hidden sm:flex gap-1.5">
              {content.milestones.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => handleCardClick(idx)}
                  className={`h-1.5 rounded-full transition-all cursor-pointer ${
                    activeCardIndex === idx
                      ? 'w-8 bg-cyan-400'
                      : 'w-3 bg-white/20 hover:bg-white/40'
                  }`}
                  aria-label={`Go to milestone ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Sideways Scrolling Reel */}
        <div className="relative z-10 w-full my-auto overflow-visible py-4">
          <div
            ref={reelRef}
            className="flex items-center gap-6 sm:gap-8 will-change-transform transition-transform ease-out duration-100"
            style={{
              transform: `translate3d(${translateX}%, 0, 0)`,
            }}
          >
            {content.milestones.map((milestone, idx) => {
              const isActive = activeCardIndex === idx;

              return (
                <div
                  key={milestone.id}
                  onClick={() => handleCardClick(idx)}
                  className={`relative flex-shrink-0 w-[85vw] sm:w-[420px] lg:w-[460px] rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden group ${
                    isActive
                      ? 'border-cyan-500/50 bg-[#0B101D]/90 shadow-2xl shadow-cyan-950/40 ring-1 ring-cyan-500/20'
                      : 'border-white/10 bg-[#080D17]/70 hover:border-white/30'
                  }`}
                >
                  {/* Card Media Preview Header */}
                  <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-black">
                    <img
                      src={milestone.image}
                      alt={milestone.title}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-85 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B101D] via-transparent to-black/30" />

                    {/* Mission Code Badge */}
                    <div className="absolute top-4 left-4">
                      <span className="px-2.5 py-1 rounded bg-black/70 backdrop-blur-md border border-white/15 text-[10px] font-mono tracking-wider text-cyan-300 font-semibold">
                        {milestone.code}
                      </span>
                    </div>

                    {/* Period badge */}
                    <div className="absolute bottom-3 left-4 flex items-center gap-2 text-xs font-mono text-slate-300">
                      <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{milestone.period}</span>
                    </div>
                  </div>

                  {/* Card Content Body */}
                  <div className="p-6 sm:p-7 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="text-xs font-mono text-cyan-400/90 mb-1 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{milestone.institution}</span>
                        {milestone.location && (
                          <>
                            <span>•</span>
                            <span className="text-slate-400">{milestone.location}</span>
                          </>
                        )}
                      </div>

                      <h3 className="font-display text-lg sm:text-xl font-bold tracking-tight text-white group-hover:text-cyan-200 transition-colors">
                        {milestone.title}
                      </h3>

                      {milestone.description && (
                        <p className="mt-2.5 font-sans text-xs sm:text-sm text-slate-300 leading-relaxed">
                          {milestone.description}
                        </p>
                      )}
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Status */}
        <div className="relative z-10 max-w-7xl w-full mx-auto flex items-center justify-between border-t border-white/10 pt-4 font-mono text-xs text-slate-400">
          <div>
            <span>SCROLL PROGRESS: {Math.round(scrollProgress * 100)}%</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-500 hidden sm:inline">
              SCROLL DOWN TO ADVANCE
            </span>
            <ChevronRight className="w-4 h-4 text-cyan-400 animate-pulse" />
          </div>
        </div>

      </div>
    </section>
  );
};
