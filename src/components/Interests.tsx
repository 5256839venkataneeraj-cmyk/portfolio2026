import React from 'react';
import { content } from '../content';
import { ArcCarousel, ArcCardItem } from './ArcCarousel';
import {
  Sparkles,
  Layout,
  Gamepad2,
  Bike,
  Film,
  ArrowUpRight
} from 'lucide-react';

export const Interests: React.FC = () => {
  const interestCards: ArcCardItem[] = [
    {
      id: 'interest-tech',
      code: 'CREATIVE 01',
      title: 'Websites & UI Designing',
      subtitle: 'TECH & DESIGN',
      description: 'Passionate about creating fluid, modern web experiences and sleek user interfaces with high aesthetic standards, typography, and interactive micro-animations.',
      badge: 'FRONTEND & UI/UX',
      accentColor: 'cyan',
      highlight: 'Crafting fluid, modern web experiences',
      icon: <Layout className="w-6 h-6 text-cyan-300" />,
    },
    {
      id: 'interest-gaming',
      code: 'TACTICAL 02',
      title: 'Call of Duty (CoD)',
      subtitle: 'COMPETITIVE GAMING',
      description: 'Avid Call of Duty enthusiast who thrives in high-stakes tactical shooter engagements, quick decision-making under pressure, and strategic team coordination.',
      badge: 'TACTICAL FPS',
      accentColor: 'emerald',
      highlight: 'High-tempo tactical combat & strategy',
      icon: <Gamepad2 className="w-6 h-6 text-emerald-300" />,
    },
    {
      id: 'interest-active',
      code: 'VITALITY 03',
      title: 'Cycling & Endurance',
      subtitle: 'ACTIVE LIFESTYLE',
      description: 'Dedicated to regular cycling sessions to maintain high energy, sharpen physical stamina, and refresh mental focus for deep technical problem-solving.',
      badge: 'OUTDOOR FITNESS',
      accentColor: 'sky',
      highlight: 'Physical stamina, clarity & focus',
      icon: <Bike className="w-6 h-6 text-sky-300" />,
    },
    {
      id: 'interest-cinema',
      code: 'INSPIRATION 04',
      title: 'TFI Cinema & Pawan Kalyan',
      subtitle: 'CINEMA LOVER',
      description: 'Huge admirer of the Telugu Film Industry (TFI). Deeply inspired by Power Star Pawan Kalyan for his charismatic screen presence, unwavering principles, and visionary leadership.',
      badge: 'TFI ENTHUSIAST',
      accentColor: 'amber',
      highlight: 'Inspired by Power Star Pawan Kalyan',
      icon: <Film className="w-6 h-6 text-amber-300" />,
    },
  ];

  return (
    <section
      id="interests"
      className="relative w-full py-28 bg-[#05070B] border-t border-white/10 overflow-hidden"
    >
      {/* Decorative Grid & Vignette */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
      <div className="absolute inset-0 bg-radial-vignette pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="gsap-reveal text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-cyan-500/30 bg-cyan-950/20 text-cyan-300 font-mono text-xs tracking-widest uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>BEYOND THE TERMINAL</span>
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-white">
            INTERESTS & HOBBIES
          </h2>
          <p className="mt-3 font-sans text-sm sm:text-base text-slate-400 font-normal leading-relaxed max-w-xl mx-auto">
            Interactive 3D Arc Carousel exploring personal passions, tactical gaming, active lifestyle, and cinematic inspirations.
          </p>
        </div>

        {/* 3D Arc Carousel for Interests & Hobbies */}
        <div className="my-8">
          <ArcCarousel items={interestCards} carouselId="interests-hobbies" />
        </div>

        {/* Inspirational Quote / Personal Philosophy Banner */}
        <div className="gsap-reveal mt-12 rounded-3xl border border-white/10 bg-[#090F1E]/80 p-7 sm:p-9 backdrop-blur-md relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1.5 max-w-3xl">
              <div className="font-mono text-xs text-cyan-400 tracking-wider uppercase flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                <span>PERSONAL PHILOSOPHY</span>
              </div>
              <p className="font-sans text-sm sm:text-base text-slate-200 leading-relaxed font-normal">
                Combining rigorous computer science and clean UI engineering with the reflexes of tactical gaming, endurance from cycling, and the resilient leadership inspired by Pawan Kalyan.
              </p>
            </div>

            <div className="flex-shrink-0">
              <a
                href="#reserve"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-cyan-500/40 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 font-sans font-semibold text-xs tracking-wide transition-all"
              >
                <span>LET&apos;S CONNECT</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
