import React, { useState, useEffect, useRef, Suspense, lazy } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { content } from '../../content';
import { scrollTo } from '../../scroll';
import {
  Sparkles,
  ArrowUp,
  FileDown,
  Linkedin,
  Instagram,
  Send,
  Github,
  Check,
  Copy,
} from 'lucide-react';
import './outro.css';

// Lazy-load the heavy Canvas chunk
const OutroScene = lazy(() => import('./OutroScene'));

// ── WebGL Fallback Error Boundary ──
class OutroErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(err) {
    console.warn('Outro 3D WebGL error, using fallback:', err);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="absolute inset-0 outro-fallback-bg pointer-events-none z-0 overflow-hidden" aria-hidden="true">
          {[...Array(35)].map((_, i) => (
            <div
              key={i}
              className="outro-fallback-star"
              style={{
                top: `${(i * 17) % 100}%`,
                left: `${(i * 31) % 100}%`,
                width: `${(i % 3) + 2}px`,
                height: `${(i % 3) + 2}px`,
                animationDelay: `${(i * 0.15) % 2.5}s`,
              }}
            />
          ))}
        </div>
      );
    }
    return this.props.children;
  }
}

const SKILLS_LIST = [
  'REACT',
  'PYTHON',
  'AI / ML',
  'NODE.JS',
  'TYPESCRIPT',
  'DOCKER',
  'NEXT.JS',
  'TAILWIND CSS',
  'PYTORCH',
  'GIT',
  'FASTAPI',
  'THREE.JS',
  'POSTGRESQL',
  'LINUX',
];

export function ScrollOutro() {
  const containerRef = useRef(null);
  const progressBarRef = useRef(null);

  const [isNearViewport, setIsNearViewport] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [copied, setCopied] = useState(false);

  // Shared mutable ref read by useFrame (no React setState per frame)
  const sharedRef = useRef({
    p: 0,
    reverseWarp: 0,
    easterEggPulse: 0,
  });

  const easterEggFired = useRef(false);

  // Scroll linkage: offset ["start end", "end end"] across 250vh
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end end'],
  });

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    sharedRef.current.p = latest;

    // Direct DOM progress bar update on bottom edge
    if (progressBarRef.current) {
      progressBarRef.current.style.width = `${latest * 100}%`;
    }

    // Reveal overlay content during p = 0.72 - 1.00
    if (latest >= 0.72 && !showOverlay) {
      setShowOverlay(true);
    } else if (latest < 0.68 && showOverlay) {
      setShowOverlay(false);
    }
  });

  // IntersectionObserver to only mount/render Canvas when near viewport
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsNearViewport(entry.isIntersecting);
      },
      { rootMargin: '600px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Easter egg: Overscroll past the bottom triggers sun shockwave
  useEffect(() => {
    let pulseAnim;
    const handleWheel = (e) => {
      if (sharedRef.current.p >= 0.98 && e.deltaY > 20 && !easterEggFired.current) {
        easterEggFired.current = true;
        let pulseVal = 0;
        const triggerPulse = () => {
          pulseVal += 0.04;
          sharedRef.current.easterEggPulse = Math.min(1, pulseVal);
          if (pulseVal < 1) {
            pulseAnim = requestAnimationFrame(triggerPulse);
          } else {
            sharedRef.current.easterEggPulse = 0;
            setTimeout(() => {
              easterEggFired.current = false;
            }, 1200);
          }
        };
        pulseAnim = requestAnimationFrame(triggerPulse);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    return () => {
      window.removeEventListener('wheel', handleWheel);
      cancelAnimationFrame(pulseAnim);
    };
  }, []);

  // Copy email with sun shockwave pulse
  const handleCopyEmail = (e) => {
    e.preventDefault();
    if (copied) return;
    navigator.clipboard?.writeText(content.contact.email).catch(() => {});
    setCopied(true);
    // Send shockwave ripple through the 3D sun
    sharedRef.current.easterEggPulse = 0.85;
    setTimeout(() => setCopied(false), 2200);
  };

  // Back to top with reverse warp
  const handleBackToTop = (e) => {
    e.preventDefault();
    let warpVal = 0;
    const startWarp = () => {
      warpVal += 0.05;
      sharedRef.current.reverseWarp = Math.min(1, warpVal);
      if (warpVal < 1) {
        requestAnimationFrame(startWarp);
      } else {
        scrollTo('#hero');
        setTimeout(() => {
          sharedRef.current.reverseWarp = 0;
        }, 800);
      }
    };
    requestAnimationFrame(startWarp);
  };

  return (
    <section
      ref={containerRef}
      className="relative w-full h-[250vh] bg-[#05070a] border-t border-white/10 overflow-visible"
      aria-label="Portfolio Outro & Transmission End"
    >
      {/* ── Sticky 100vh Inner Viewport Stage ── */}
      <div className="sticky top-0 h-screen w-full flex flex-col justify-between overflow-hidden select-none">
        
        {/* ── Fullscreen 3D Canvas Layer (Pointer-events none, Z-0) ── */}
        <div className="absolute inset-0 pointer-events-none z-0" aria-hidden="true">
          {isNearViewport && (
            <OutroErrorBoundary>
              <Suspense
                fallback={
                  <div className="absolute inset-0 outro-fallback-bg pointer-events-none" />
                }
              >
                <OutroScene sharedRef={sharedRef} />
              </Suspense>
            </OutroErrorBoundary>
          )}
        </div>

        {/* ── Ambient Radial Vignette & Scanline ── */}
        <div className="absolute inset-0 bg-radial-vignette pointer-events-none z-[1] opacity-65" />
        <div className="animate-outro-scanline" />

        {/* ── Dark Gradient Scrim behind the Text Block (Bottom 45%) ── */}
        <div className="absolute inset-x-0 bottom-0 h-[45%] bg-gradient-to-t from-[#05070a] via-[#05070a]/92 to-transparent pointer-events-none z-[2]" />

        {/* ── Top Header Telemetry (Minimal HUD, Z-10) ── */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={showOverlay ? { opacity: 1, y: 0 } : { opacity: 0.35, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 w-full max-w-7xl mx-auto flex items-center justify-between font-mono text-[10px] text-slate-500 tracking-widest px-4 sm:px-8 pt-5 pointer-events-auto"
        >
          <div className="flex items-center gap-2">
            <span className="text-[#e8b86d]">┌</span>
            <span>ORBITAL TRANSMISSION SEQUENCE</span>
          </div>
          <div className="flex items-center gap-2">
            <span>FINAL CODES • VIT VELLORE</span>
            <span className="text-[#00d4ff]">┐</span>
          </div>
        </motion.div>

        {/* ── Bottom Text Block Zone (Bottom 40% of Viewport, Z-10, Clean Centered) ── */}
        <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-auto mb-1 flex flex-col justify-end">
          
          <div
            className={`w-full transition-all duration-700 ${
              showOverlay ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6 pointer-events-none'
            }`}
          >
            {/* Centered Main Block: Badge, Title, Status, and CTA Buttons */}
            <div className="w-full max-w-3xl mx-auto flex flex-col items-center text-center mb-4 sm:mb-5">
              {/* 1. Pill Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#e8b86d]/30 bg-[#e8b86d]/10 backdrop-blur-md font-mono text-[10px] sm:text-[11px] text-[#e8b86d] tracking-widest uppercase mb-3 shadow-[0_0_12px_rgba(232,184,109,0.18)]">
                <Sparkles className="w-3 h-3 text-[#e8b86d]" />
                <span>✦ END OF TRANSMISSION</span>
              </div>

              {/* 2. Scaled Title: clamp(2.2rem, 5.5vw, 3.8rem) with drop-shadow */}
              <h2 className="font-display font-black text-[clamp(2.2rem,5.6vw,4.0rem)] uppercase leading-tight tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-100 to-[#f3dfc3] drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)] drop-shadow-[0_0_35px_rgba(232,184,109,0.3)]">
                LET'S BUILD SOMETHING
              </h2>

              {/* 3. Status Line with Pulsing Dot */}
              <p className="mt-2.5 font-mono text-xs sm:text-sm text-[#00d4ff] tracking-[0.25em] uppercase flex items-center justify-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#00d4ff] animate-ping" />
                <span>OPEN TO OPPORTUNITIES • 2026</span>
              </p>

              {/* 4. Two CTA Buttons */}
              <div className="mt-5 flex flex-wrap items-center justify-center gap-3.5 pointer-events-auto">
                <a
                  href={`mailto:${content.contact.email}?subject=Opportunity%20Inquiry`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#e8b86d]/40 bg-[#e8b86d] hover:bg-[#d8a85d] text-[#05070a] font-mono text-xs sm:text-sm font-bold tracking-wider uppercase transition-all duration-300 shadow-[0_0_18px_rgba(232,184,109,0.35)] hover:shadow-[0_0_28px_rgba(232,184,109,0.55)] hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#e8b86d]"
                >
                  <Send className="w-4 h-4" />
                  <span>Get in touch</span>
                </a>

                <a
                  href={content.contact.linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#00d4ff]/40 bg-[#00d4ff]/10 hover:bg-[#00d4ff]/20 text-[#00d4ff] font-mono text-xs sm:text-sm font-semibold tracking-wider uppercase transition-all duration-300 backdrop-blur-md shadow-[0_0_15px_rgba(0,212,255,0.15)] hover:shadow-[0_0_25px_rgba(0,212,255,0.35)] hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#00d4ff]"
                >
                  <FileDown className="w-4 h-4" />
                  <span>View LinkedIn</span>
                </a>
              </div>
            </div>

            {/* Social Icons + Interactive Email Chip Row */}
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-4 pointer-events-auto">
              
              {/* Copy Email Chip with Sun Shockwave Pulse */}
              <button
                onClick={handleCopyEmail}
                type="button"
                title="Click to copy email address"
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border font-mono text-xs transition-all duration-300 backdrop-blur-md cursor-pointer ${
                  copied
                    ? 'border-emerald-500/60 bg-emerald-500/20 text-emerald-300 shadow-[0_0_15px_rgba(52,211,153,0.35)]'
                    : 'border-[#e8b86d]/30 bg-slate-900/60 text-slate-300 hover:text-[#e8b86d] hover:border-[#e8b86d]/60 shadow-[0_0_12px_rgba(232,184,109,0.15)]'
                }`}
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-[#e8b86d]" />}
                <span>{copied ? 'COPIED ✓' : content.contact.email}</span>
              </button>

              {/* Social Link: LinkedIn */}
              <a
                href={content.contact.linkedinUrl}
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn Profile"
                className="p-2.5 rounded-xl border border-white/10 bg-slate-900/60 text-slate-400 hover:text-[#00d4ff] hover:border-[#00d4ff]/50 hover:shadow-[0_0_15px_rgba(0,212,255,0.3)] transition-all duration-300 backdrop-blur-md"
              >
                <Linkedin className="w-4 h-4" />
              </a>

              {/* Social Link: GitHub */}
              <a
                href="https://github.com/PotluriNeeraj"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub Profile"
                className="p-2.5 rounded-xl border border-white/10 bg-slate-900/60 text-slate-400 hover:text-white hover:border-white/40 hover:shadow-[0_0_15px_rgba(255,255,255,0.2)] transition-all duration-300 backdrop-blur-md"
              >
                <Github className="w-4 h-4" />
              </a>

              {/* Social Link: Instagram */}
              <a
                href={content.contact.instagramUrl}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram Profile"
                className="p-2.5 rounded-xl border border-white/10 bg-slate-900/60 text-slate-400 hover:text-pink-400 hover:border-pink-500/50 hover:shadow-[0_0_15px_rgba(244,114,182,0.3)] transition-all duration-300 backdrop-blur-md"
              >
                <Instagram className="w-4 h-4" />
              </a>

              {/* Back to Top Button */}
              <button
                onClick={handleBackToTop}
                aria-label="Back to Top with Warp Effect"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#e8b86d]/30 bg-[#e8b86d]/10 hover:bg-[#e8b86d]/20 text-[#e8b86d] hover:text-white font-mono text-xs tracking-wider uppercase transition-all duration-300 backdrop-blur-md shadow-[0_0_12px_rgba(232,184,109,0.15)] cursor-pointer"
              >
                <span>TOP</span>
                <ArrowUp className="w-3.5 h-3.5" />
              </button>

            </div>

          </div>

          {/* ── Skills Ticker Marquee along the Very Bottom ── */}
          <div className="w-full overflow-hidden border-t border-white/10 py-1.5 bg-[#05070a]/90 backdrop-blur-md pointer-events-auto">
            <div className="animate-skills-ticker flex items-center gap-6 font-mono text-[10px] sm:text-[11px] text-slate-400 tracking-wider">
              {[...SKILLS_LIST, ...SKILLS_LIST].map((skill, idx) => (
                <span key={idx} className="flex items-center gap-6 whitespace-nowrap">
                  <span className="text-[#00d4ff] hover:text-[#e8b86d] transition-colors">{skill}</span>
                  <span className="text-[#e8b86d]/50">•</span>
                </span>
              ))}
            </div>
          </div>

          {/* ── Bottom Line Footer & Status ── */}
          <div className="w-full flex items-center justify-between font-mono text-[9px] sm:text-[10px] text-slate-500 tracking-wider pt-1.5 pb-2 pointer-events-auto">
            <div className="flex items-center gap-1.5">
              <span className="text-[#00d4ff]">└</span>
              <span>DESIGNED &amp; BUILT BY NEERAJ BABU • VIT VELLORE CS • 2026</span>
            </div>
            <div className="hidden sm:flex items-center gap-1.5">
              <span>ALL SYSTEMS NOMINAL</span>
              <span className="text-[#e8b86d]">┘</span>
            </div>
          </div>

        </div>

        {/* ── Scroll Progress Line along Bottom Edge ── */}
        <div className="absolute inset-x-0 bottom-0 h-[2px] bg-white/5 pointer-events-none z-20">
          <div
            ref={progressBarRef}
            className="h-full bg-gradient-to-r from-[#00d4ff] via-[#e8b86d] to-[#fff6e5] shadow-[0_0_10px_rgba(232,184,109,0.8)] transition-all duration-75"
            style={{ width: '0%' }}
          />
        </div>

      </div>
    </section>
  );
}

export default ScrollOutro;
