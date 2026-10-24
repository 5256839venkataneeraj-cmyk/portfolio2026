import React from 'react';
import { Target, Trophy, Award, CheckCircle2, GraduationCap, ShieldCheck, ArrowUpRight } from 'lucide-react';
import { NumberTicker } from './magicui/number-ticker';

interface AchievementCardData {
  id: string;
  code: string;
  exam: string;
  value: number;
  prefix?: string;
  suffix?: string;
  label: string; // The exact label requested
  badge: string;
  details: string;
  accent: 'cyan' | 'sky' | 'indigo' | 'emerald';
  delay: number;
}

const academicData: AchievementCardData[] = [
  {
    id: 'jee-main',
    code: 'AIR BENCHMARK 01',
    exam: 'JEE Main',
    value: 97,
    suffix: ' %ile',
    label: 'JEE Main Percentile',
    badge: 'TOP 3% ALL-INDIA',
    details: 'Achieved 97th percentile in India\'s most competitive national engineering entrance exam, ranking among the top tier nationwide.',
    accent: 'cyan',
    delay: 0,
  },
  {
    id: 'viteee-rank',
    code: 'MERIT SEAT 02',
    exam: 'VITEEE',
    value: 1500,
    prefix: 'Rank ',
    label: 'VITEEE Rank - B.Tech CS at VIT Vellore',
    badge: 'FLAGSHIP CAMPUS',
    details: 'Secured an All-India Rank of 1500 in VITEEE, earning a direct merit admission for B.Tech Computer Science at VIT Vellore.',
    accent: 'sky',
    delay: 0.15,
  },
  {
    id: 'comedk-rank',
    code: 'STATE ENTRANCE 03',
    exam: 'COMEDK',
    value: 2500,
    prefix: 'Rank ',
    label: 'COMEDK Rank',
    badge: 'TOP 1.5% RANK',
    details: 'Secured Rank 2500 in the Consortium of Medical, Engineering and Dental Colleges of Karnataka competitive entrance examination.',
    accent: 'indigo',
    delay: 0.3,
  },
  {
    id: 'tenth-grade',
    code: 'BOARD CENTUM 04',
    exam: '10th Grade',
    value: 100,
    prefix: '2× ',
    suffix: '/100',
    label: '10th Grade Perfect Scores',
    badge: 'DOUBLE CENTUM',
    details: 'Attained two perfect 100/100 maximum scores in standardized board examinations, establishing early academic distinction.',
    accent: 'emerald',
    delay: 0.45,
  },
];

export const Achievements: React.FC = () => {
  const getAccentConfig = (accent: AchievementCardData['accent']) => {
    switch (accent) {
      case 'cyan':
        return {
          glow: 'from-cyan-500/20 via-cyan-500/5 to-transparent',
          borderHover: 'hover:border-cyan-400/60',
          numberColor: 'text-transparent bg-clip-text bg-gradient-to-br from-white via-cyan-100 to-cyan-400',
          badgeStyle: 'border-cyan-500/40 bg-cyan-950/50 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.15)]',
          dot: 'bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]',
          iconBg: 'border-cyan-500/30 bg-cyan-950/40 text-cyan-300',
          shadowHover: 'hover:shadow-[0_20px_50px_rgba(6,182,212,0.12)]',
        };
      case 'sky':
        return {
          glow: 'from-sky-500/20 via-sky-500/5 to-transparent',
          borderHover: 'hover:border-sky-400/60',
          numberColor: 'text-transparent bg-clip-text bg-gradient-to-br from-white via-sky-100 to-sky-400',
          badgeStyle: 'border-sky-500/40 bg-sky-950/50 text-sky-300 shadow-[0_0_12px_rgba(14,165,233,0.15)]',
          dot: 'bg-sky-400 shadow-[0_0_8px_rgba(14,165,233,0.8)]',
          iconBg: 'border-sky-500/30 bg-sky-950/40 text-sky-300',
          shadowHover: 'hover:shadow-[0_20px_50px_rgba(14,165,233,0.12)]',
        };
      case 'indigo':
        return {
          glow: 'from-indigo-500/20 via-indigo-500/5 to-transparent',
          borderHover: 'hover:border-indigo-400/60',
          numberColor: 'text-transparent bg-clip-text bg-gradient-to-br from-white via-indigo-100 to-indigo-400',
          badgeStyle: 'border-indigo-500/40 bg-indigo-950/50 text-indigo-300 shadow-[0_0_12px_rgba(99,102,241,0.15)]',
          dot: 'bg-indigo-400 shadow-[0_0_8px_rgba(99,102,241,0.8)]',
          iconBg: 'border-indigo-500/30 bg-indigo-950/40 text-indigo-300',
          shadowHover: 'hover:shadow-[0_20px_50px_rgba(99,102,241,0.12)]',
        };
      case 'emerald':
        return {
          glow: 'from-emerald-500/20 via-emerald-500/5 to-transparent',
          borderHover: 'hover:border-emerald-400/60',
          numberColor: 'text-transparent bg-clip-text bg-gradient-to-br from-white via-emerald-100 to-emerald-400',
          badgeStyle: 'border-emerald-500/40 bg-emerald-950/50 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.15)]',
          dot: 'bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.8)]',
          iconBg: 'border-emerald-500/30 bg-emerald-950/40 text-emerald-300',
          shadowHover: 'hover:shadow-[0_20px_50px_rgba(16,185,129,0.12)]',
        };
    }
  };

  const getExamIcon = (exam: string) => {
    switch (exam) {
      case 'JEE Main':
        return <Target className="w-5 h-5" />;
      case 'VITEEE':
        return <Trophy className="w-5 h-5" />;
      case 'COMEDK':
        return <Award className="w-5 h-5" />;
      case '10th Grade':
        return <CheckCircle2 className="w-5 h-5" />;
      default:
        return <GraduationCap className="w-5 h-5" />;
    }
  };

  return (
    <section
      id="achievements"
      className="relative w-full py-28 bg-[#04060A] border-t border-white/10 overflow-hidden"
    >
      {/* Background Lighting & Grid Texture */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
      <div className="absolute inset-0 bg-radial-vignette pointer-events-none" />

      {/* Subtle Ambient Radial Halos */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-950/30 backdrop-blur-md text-cyan-300 font-mono text-xs tracking-widest uppercase mb-4 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
            <Trophy className="w-3.5 h-3.5 text-cyan-400" />
            <span>COMPETITIVE BENCHMARKS</span>
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-white">
            ACADEMIC ACHIEVEMENTS
          </h2>
          <p className="mt-3 font-sans text-sm sm:text-base text-slate-400 font-normal leading-relaxed max-w-2xl mx-auto">
            Rigorous national rankings and standardized examination percentiles — highlighted by a VITEEE Rank of 1500 securing admission for B.Tech Computer Science at VIT Vellore.
          </p>
        </div>

        {/* Responsive Grid of 4 Sleek Glassmorphism-Styled Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {academicData.map((item) => {
            const config = getAccentConfig(item.accent);

            return (
              <div
                key={item.id}
                className={`relative group rounded-2xl sm:rounded-3xl border border-white/10 bg-slate-900/30 backdrop-blur-xl p-6 sm:p-7 transition-all duration-500 flex flex-col justify-between overflow-hidden shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] ${config.borderHover} ${config.shadowHover} hover:-translate-y-1.5`}
              >
                {/* Specular Top Edge Light Refraction */}
                <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />

                {/* Interior Hover Ambient Glow */}
                <div
                  className={`absolute -top-24 -left-24 w-52 h-52 rounded-full bg-gradient-to-br ${config.glow} blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none`}
                />
                <div
                  className={`absolute -bottom-24 -right-24 w-52 h-52 rounded-full bg-gradient-to-tl ${config.glow} blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none`}
                />

                <div className="relative z-10">
                  {/* Card Telemetry / Metadata Bar */}
                  <div className="flex items-center justify-between font-mono text-[10px] text-slate-400 border-b border-white/10 pb-3 mb-5">
                    <span className="font-semibold tracking-wider text-slate-400 flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
                      {item.code}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full border ${config.badgeStyle} uppercase font-semibold text-[10px]`}>
                      {item.badge}
                    </span>
                  </div>

                  {/* Header Row: Exam Title & Frosted Icon */}
                  <div className="flex items-center gap-3.5 mb-5">
                    <div
                      className={`w-11 h-11 rounded-xl border backdrop-blur-md flex items-center justify-center ${config.iconBg} flex-shrink-0 transition-transform duration-300 group-hover:scale-105`}
                    >
                      {getExamIcon(item.exam)}
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                        EXAMINATION
                      </span>
                      <h3 className="font-display text-base sm:text-lg font-bold tracking-tight text-white">
                        {item.exam}
                      </h3>
                    </div>
                  </div>

                  {/* Number Ticker Display - Dynamic Counting Up From Zero When In Viewport */}
                  <div className="my-5 py-2">
                    <div className="flex items-baseline gap-1 font-display tracking-tight">
                      {item.prefix && (
                        <span className={`text-2xl sm:text-3xl font-bold ${config.numberColor}`}>
                          {item.prefix}
                        </span>
                      )}
                      
                      <NumberTicker
                        value={item.value}
                        delay={item.delay}
                        className={`text-5xl sm:text-6xl font-extrabold tracking-tight ${config.numberColor}`}
                      />

                      {item.suffix && (
                        <span className={`text-2xl sm:text-3xl font-bold ml-0.5 ${config.numberColor}`}>
                          {item.suffix}
                        </span>
                      )}
                    </div>

                    {/* Exact User-Specified Label */}
                    <div className="mt-2.5 flex items-center gap-2">
                      <span className="font-sans text-xs sm:text-sm font-semibold tracking-wide text-slate-200 uppercase">
                        {item.label}
                      </span>
                    </div>
                  </div>

                  {/* Context & Description */}
                  <p className="font-sans text-xs sm:text-sm text-slate-300 leading-relaxed font-normal mt-2">
                    {item.details}
                  </p>
                </div>

                {/* Card Footer: Verified Status Strip */}
                <div className="relative z-10 mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono text-slate-400">
                  <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                    <ShieldCheck className="w-3.5 h-3.5 text-cyan-400/80" />
                    <span>Verified Academic Merit</span>
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-300 transition-colors" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Highlight Banner: VIT Vellore Direct CS Admission */}
        <div className="rounded-2xl sm:rounded-3xl border border-white/10 bg-slate-900/40 p-6 sm:p-7 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] flex flex-col md:flex-row md:items-center justify-between gap-5 relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent pointer-events-none" />
          
          <div className="flex items-start sm:items-center gap-4 relative z-10">
            <div className="w-12 h-12 rounded-2xl border border-cyan-500/30 bg-cyan-950/40 text-cyan-300 flex items-center justify-center flex-shrink-0 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="font-mono text-xs text-cyan-400 uppercase tracking-widest font-semibold flex items-center gap-2">
                <span>ACADEMIC FOUNDATION</span>
                <span className="text-slate-600">•</span>
                <span className="text-slate-300">VIT VELLORE FLAGSHIP</span>
              </div>
              <p className="font-sans text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
                Secured admission into the flagship <span className="text-white font-medium">B.Tech Computer Science</span> program at <span className="text-white font-medium">Vellore Institute of Technology, Vellore</span> based directly on an All-India <span className="text-cyan-300 font-mono font-semibold">VITEEE Rank of 1500</span>.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-950/30 font-mono text-xs text-cyan-300 flex-shrink-0 self-start md:self-auto backdrop-blur-md shadow-[0_0_15px_rgba(6,182,212,0.15)]">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="tracking-wider">OFFICIALLY RECORDED</span>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Achievements;
