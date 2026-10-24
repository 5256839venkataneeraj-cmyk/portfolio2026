import React, { useState, useEffect, useRef, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { content } from '../../content';
import { Sparkles, Terminal } from 'lucide-react';
import './loader.css';

// Lazy-load the heavy Three.js / R3F Canvas chunk
const LoaderScene = lazy(() => import('./LoaderScene'));

// ── WebGL Error Boundary Fallback ──
class WebGLErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.warn('WebGL/Canvas loading error, falling back to CSS galaxy:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="absolute inset-0 webgl-fallback-bg pointer-events-none z-0 overflow-hidden">
          {/* Procedural CSS stars */}
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="fallback-star"
              style={{
                top: `${(i * 19) % 100}%`,
                left: `${(i * 37) % 100}%`,
                width: `${(i % 3) + 2}px`,
                height: `${(i % 3) + 2}px`,
                animationDelay: `${(i * 0.2) % 2.5}s`,
              }}
            />
          ))}
        </div>
      );
    }
    return this.props.children;
  }
}

/**
 * LoadingScreen component
 * @param {{ progress?: number, minDuration?: number, onComplete?: () => void }} props
 */
export function LoadingScreen({
  progress: progressProp,
  minDuration = 4000,
  onComplete,
}) {
  const [showOverlay, setShowOverlay] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // Direct DOM refs for 60fps zero-react-render progress updates
  const percentTextRef = useRef(null);
  const progressBarRef = useRef(null);
  const titleRef = useRef(null);

  // Shared mutable state written by clock loop, read by 3D frame loop
  const sharedRef = useRef({
    introT: 0,
    progress: 0,
    warp: 0,
    warping: false,
    assets: 0,
  });

  // Check prefers-reduced-motion
  const isReducedMotion = useRef(
    typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ).current;

  useEffect(() => {
    if (isExiting || isCompleted) {
      document.body.style.overflow = '';
      return;
    }

    // Lock body scroll while loader is visible
    document.body.style.overflow = 'hidden';

    const startTime = performance.now();
    const introDuration = isReducedMotion ? 1200 : 3500;
    const effectiveMinDuration = isReducedMotion ? 1400 : minDuration;
    let animFrameId;
    let overlayRevealed = false;

    const clockLoop = (currentTime) => {
      const elapsed = currentTime - startTime;

      // 1. Advance introT from 0 to 1
      const introProgress = Math.min(1, elapsed / introDuration);
      sharedRef.current.introT = isReducedMotion ? 1 : introProgress;

      // Reveal HTML overlay stagger around introT > 0.4 (~1.4s)
      if (!overlayRevealed && introProgress >= 0.4) {
        overlayRevealed = true;
        setShowOverlay(true);
      }

      // 2. Calculate eased progress (starts rising after introT > 0.5)
      let targetP = 0;
      if (introProgress > 0.45) {
        if (typeof progressProp === 'number') {
          targetP = Math.min(100, Math.max(0, progressProp));
        } else {
          // Autonomous time-based progress capped by effectiveMinDuration
          const progressElapsed = Math.max(0, elapsed - (introDuration * 0.45));
          const availableDuration = effectiveMinDuration - (introDuration * 0.45);
          const ratio = Math.min(1, progressElapsed / availableDuration);

          // Organic S-curve progress acceleration
          targetP = ratio < 0.5
            ? 4 * ratio * ratio * ratio * 100
            : (1 - Math.pow(-2 * ratio + 2, 3) / 2) * 100;
        }
      }

      // Smooth damp progress into sharedRef
      const pDiff = targetP - sharedRef.current.progress;
      sharedRef.current.progress += pDiff * 0.085;
      if (Math.abs(100 - sharedRef.current.progress) < 0.2 && targetP >= 100) {
        sharedRef.current.progress = 100;
      }

      const displayPercent = Math.min(100, Math.floor(sharedRef.current.progress));

      // 3. Direct DOM mutation (no React setState per frame)
      if (percentTextRef.current) {
        percentTextRef.current.textContent = displayPercent.toString().padStart(3, '0') + '%';
      }
      if (progressBarRef.current) {
        progressBarRef.current.style.width = `${sharedRef.current.progress}%`;
      }

      // 4. Trigger Hyperspace Warp when progress reaches 100% and intro is completed
      if (sharedRef.current.progress >= 99.8 && elapsed >= effectiveMinDuration) {
        if (!sharedRef.current.warping) {
          sharedRef.current.warping = true;
          sharedRef.current.warpStartTime = currentTime;
        }

        const warpElapsed = currentTime - sharedRef.current.warpStartTime;
        const warpDuration = isReducedMotion ? 400 : 1300;
        const warpP = Math.min(1, warpElapsed / warpDuration);
        sharedRef.current.warp = warpP;

        // Title scale up slightly during warp
        if (titleRef.current) {
          titleRef.current.style.transform = `scale(${1 + warpP * 0.08})`;
        }

        // When warp concludes, trigger AnimatePresence exit
        if (warpP >= 1) {
          document.body.style.overflow = '';
          setIsExiting(true);
          return;
        }
      }

      animFrameId = requestAnimationFrame(clockLoop);
    };

    animFrameId = requestAnimationFrame(clockLoop);

    return () => {
      cancelAnimationFrame(animFrameId);
      document.body.style.overflow = '';
    };
  }, [progressProp, minDuration, isReducedMotion, isExiting, isCompleted]);

  // Safety fallback when exiting
  useEffect(() => {
    if (isExiting && !isCompleted) {
      const timer = setTimeout(() => {
        document.body.style.overflow = '';
        setIsCompleted(true);
        onComplete?.();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isExiting, isCompleted, onComplete]);

  // Click to skip for rapid access
  const handleFastSkip = () => {
    sharedRef.current.progress = 100;
    sharedRef.current.introT = 1;
    document.body.style.overflow = '';
    setIsExiting(true);
  };

  if (isCompleted) return null;

  return (
    <AnimatePresence
      onExitComplete={() => {
        document.body.style.overflow = '';
        setIsCompleted(true);
        onComplete?.();
      }}
    >
      {!isExiting && (
        <motion.div
          key="loader-container"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          onClick={handleFastSkip}
          className="fixed inset-0 z-[9999] bg-[#05070a] select-none overflow-hidden cursor-pointer"
          title="Click anywhere to skip loading"
        >
          {/* ── 3D Scene Layer (Sun in upper third, Canvas pointer-events none) ── */}
          <div className="absolute inset-0 pointer-events-none z-0">
            <WebGLErrorBoundary>
              <Suspense
                fallback={
                  <div className="absolute inset-0 webgl-fallback-bg pointer-events-none" />
                }
              >
                <LoaderScene sharedRef={sharedRef} />
              </Suspense>
            </WebGLErrorBoundary>
          </div>

          {/* ── Deep Radial Vignette Overlay ── */}
          <div className="absolute inset-0 bg-radial-vignette pointer-events-none z-[1] opacity-75" />

          {/* ── Thin Horizontal Gold Scanline (Sweeps once, rests at title) ── */}
          <div className="animate-loader-scanline" />

          {/* ── HTML Overlay (Positioned in Lower Half to Never Overlap 3D Sun) ── */}
          <div className="absolute inset-0 z-10 flex flex-col justify-between items-center px-4 py-8 pointer-events-none">
            {/* Top Minimal Telemetry HUD Header */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="w-full max-w-7xl mx-auto flex items-center justify-between font-mono text-[10px] text-slate-400 tracking-widest px-4"
            >
              <div className="flex items-center gap-2">
                <span className="text-[#e8b86d]">┌</span>
                <span>INITIALIZING ORBITAL RIG</span>
              </div>
              <div className="flex items-center gap-2">
                <span>SIMULATION ACTIVE</span>
                <span className="text-[#00d4ff]">┐</span>
              </div>
            </motion.div>

            {/* Centered Content Block (Shielded with dark glassmorphic backdrop for maximum contrast) */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="w-full max-w-2xl mx-auto text-center mt-auto mb-8 sm:mb-12 relative z-20 px-6 sm:px-10 py-6 sm:py-8 rounded-3xl bg-[#05070a]/90 backdrop-blur-xl border border-white/20 shadow-[0_16px_50px_rgba(0,0,0,0.95)]"
            >
              {/* 1. Pill Badge */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1, ease: 'easeOut' }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#e8b86d]/40 bg-[#e8b86d]/15 backdrop-blur-md font-mono text-[11px] sm:text-xs text-[#e8b86d] tracking-widest uppercase mb-4 shadow-[0_0_15px_rgba(232,184,109,0.2)] font-semibold"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#e8b86d]" />
                <span>✦ AI-POWERED DEVELOPER PORTFOLIO</span>
              </motion.div>

              {/* 2. Big Title: "NEERAJ BABU" (Solid bright white with high contrast shadow) */}
              <motion.h1
                ref={titleRef}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15, ease: 'easeOut' }}
                className="font-display font-black text-4xl sm:text-6xl lg:text-7xl uppercase text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)] drop-shadow-[0_0_30px_rgba(232,184,109,0.35)] transition-transform duration-300"
              >
                {content.name}
              </motion.h1>

              {/* 3. Cyan Status Line with Pulsing Dot */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2, ease: 'easeOut' }}
                className="mt-3.5 font-mono text-xs sm:text-sm text-[#00d4ff] tracking-[0.25em] uppercase flex items-center justify-center gap-2 font-semibold drop-shadow-md"
              >
                <span className="w-2 h-2 rounded-full bg-[#00d4ff] animate-ping" />
                <span>LOADING VIT VELLORE PORTFOLIO ASSETS...</span>
              </motion.p>

              {/* 4. Diagnostics & Precision Progress Bar */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.25, ease: 'easeOut' }}
                className="w-full max-w-sm sm:max-w-md mx-auto mt-8"
              >
                {/* Diagnostics label & live zero-padded gold percentage */}
                <div className="flex items-center justify-between font-mono text-xs text-slate-400 mb-2.5 px-1">
                  <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-[#e8b86d]" />
                    <span>&gt;_ DIAGNOSTICS</span>
                  </span>
                  <span
                    ref={percentTextRef}
                    className="text-sm sm:text-base font-bold text-[#e8b86d] tracking-widest tabular-nums drop-shadow-[0_0_8px_rgba(232,184,109,0.5)]"
                  >
                    000%
                  </span>
                </div>

                {/* Progress Bar Container with Cyan-to-Gold Gradient & Glowing Head */}
                <div className="relative w-full h-2 rounded-full bg-slate-950/80 border border-white/10 p-[1px] overflow-hidden shadow-[inset_0_1px_3px_rgba(0,0,0,0.8)] backdrop-blur-md">
                  <div
                    ref={progressBarRef}
                    className="h-full rounded-full bg-gradient-to-r from-[#00d4ff] via-[#e8b86d] to-[#f3dfc3] transition-all duration-75 relative shadow-[0_0_14px_rgba(232,184,109,0.8)]"
                    style={{ width: '0%' }}
                  >
                    {/* Glowing White Leading Edge Head */}
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white rounded-full blur-[2px] shadow-[0_0_12px_#ffffff]" />
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Bottom Footer Telemetry Row */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3, ease: 'easeOut' }}
              className="w-full max-w-7xl mx-auto flex items-center justify-between font-mono text-[10px] sm:text-[11px] text-slate-500 tracking-wider px-4"
            >
              <div className="flex items-center gap-2">
                <span className="text-[#00d4ff]">└</span>
                <span>MEM: 64 MB • HEAP OK</span>
              </div>
              <div className="flex items-center gap-2">
                <span>VIT VELLORE CS • 2026</span>
                <span className="text-[#e8b86d]">┘</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default LoadingScreen;
