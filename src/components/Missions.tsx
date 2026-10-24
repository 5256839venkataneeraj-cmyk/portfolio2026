import React from 'react';
import { content } from '../content';
import { ArcCarousel, ArcCardItem } from './ArcCarousel';
import {
  Cpu,
  Bot,
  Terminal,
  Layout,
  Code2,
  Compass,
  Sparkles,
  Zap
} from 'lucide-react';

export const Missions: React.FC = () => {
  const skillCards: ArcCardItem[] = [
    {
      id: 'skill-ai',
      code: 'AI 01',
      title: 'AI Tools & Workflows',
      subtitle: 'CORE PASSION & ACCELERATION',
      description: 'Love leveraging AI tools to build things, solve problems, and optimize workflows.',
      badge: 'AI-FIRST FOCUS',
      accentColor: 'cyan',
      isSpecial: true,
      highlight: '10x Speed, Agentic Tools & Automation',
      icon: <Bot className="w-6 h-6 text-cyan-300" />,
    },
    {
      id: 'skill-python',
      code: 'DEV 02',
      title: 'Python Engineering',
      subtitle: 'CORE PROGRAMMING',
      description: 'Algorithmic problem solving, clean application logic, backend scripts, and scalable Python development.',
      badge: 'CORE LANGUAGE',
      accentColor: 'emerald',
      highlight: 'Algorithmic logic, scripting & automation',
      icon: <Terminal className="w-6 h-6 text-emerald-300" />,
    },
    {
      id: 'skill-web',
      code: 'UI 03',
      title: 'Modern Web & UI',
      subtitle: 'FRONTEND & DESIGN',
      description: 'Crafting responsive, fluid web applications with Apple-standard typography, reactive state, and tailored styling.',
      badge: 'FRONTEND TECH',
      accentColor: 'sky',
      highlight: 'Fluid layouts & micro-interactions',
      icon: <Layout className="w-6 h-6 text-sky-300" />,
    },
    {
      id: 'skill-cs',
      code: 'CS 04',
      title: 'Computer Science',
      subtitle: 'ACADEMIC FOUNDATION',
      description: 'Strong foundation in data structures, algorithms, object-oriented design, and computing principles at VIT Vellore.',
      badge: 'CORE CS RIGOR',
      accentColor: 'indigo',
      highlight: 'Data structures & computational logic',
      icon: <Code2 className="w-6 h-6 text-indigo-300" />,
    },
    {
      id: 'skill-strategy',
      code: 'LEAD 05',
      title: 'Strategic Planning',
      subtitle: 'TEAM COLLABORATION',
      description: 'Strategic project execution, structured roadmap planning, collaborative decomposition, and cross-functional leadership.',
      badge: 'VERIFIED SKILL',
      accentColor: 'amber',
      highlight: 'Project roadmaps & agile collaboration',
      icon: <Compass className="w-6 h-6 text-amber-300" />,
    },
  ];

  return (
    <section
      id="missions"
      className="relative w-full py-28 bg-[#060910] border-t border-white/10 overflow-hidden"
    >
      <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
      <div className="absolute inset-0 bg-radial-vignette pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="gsap-reveal text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-cyan-500/30 bg-cyan-950/20 text-cyan-300 font-mono text-xs tracking-widest uppercase mb-3">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span>TECHNICAL CAPABILITIES & AI</span>
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-white">
            TECHNICAL SKILLS
          </h2>
          <p className="mt-2 font-sans text-sm sm:text-base text-slate-400 font-normal leading-relaxed">
            Interactive 3D Arc Carousel featuring core software engineering, computer science foundations, and AI tooling.
          </p>
        </div>

        {/* 3D Arc Carousel for Technical Skills */}
        <div className="my-8">
          <ArcCarousel items={skillCards} carouselId="technical-skills" />
        </div>

        {/* AI Philosophy & Profile Summary Box */}
        <div className="gsap-reveal mt-12 rounded-3xl border border-white/10 bg-[#090F1E]/80 p-7 sm:p-9 backdrop-blur-xl relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8 space-y-2">
              <div className="flex items-center gap-2 font-mono text-xs text-cyan-400 tracking-wider uppercase">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>AI-FIRST DEVELOPMENT PHILOSOPHY</span>
              </div>
              <p className="font-sans text-sm sm:text-base text-slate-200 leading-relaxed font-normal">
                {content.aiIntegration.description}
              </p>
              <div className="pt-2 text-xs font-mono text-slate-400">
                {content.headline}
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-2">
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-white/10 bg-white/5 font-mono text-xs text-slate-300">
                <Zap className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <span>Autonomous Coding & Tooling</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-white/10 bg-white/5 font-mono text-xs text-slate-300">
                <Zap className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <span>End-to-End Workflow Optimization</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
