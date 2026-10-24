import React, { useRef, useState, useEffect, Suspense, Component } from 'react';
import { Canvas } from '@react-three/fiber';
import { useScroll } from 'framer-motion';

// Lazy-load the 3D scene chunk
const PetalScene = React.lazy(() => import('./PetalScene'));

// ── Error Boundary for WebGL Fallback ──
class WebGLErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.warn('PetalField WebGL Error Boundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(circle at 50% 30%, rgba(180, 20, 40, 0.18) 0%, #05070a 70%)',
          }}
        />
      );
    }
    return this.props.children;
  }
}

export function PetalField({ sectionRef = null, debugP = undefined }) {
  const containerRef = useRef(null);
  const progressRef = useRef(0);
  const mouseRef = useRef({ x: 0, y: 0 });

  const [isInViewport, setIsInViewport] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showDebugSlider, setShowDebugSlider] = useState(false);
  const [sliderVal, setSliderVal] = useState(0);

  // 1. Framer-motion scroll listener
  const { scrollYProgress } = useScroll({
    target: sectionRef || containerRef,
    offset: ['start start', 'end end'],
  });

  // Check URL ?debug
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.has('debug')) {
        setShowDebugSlider(true);
      }
    }
  }, []);

  // Check mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile, { passive: true });
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Update progressRef from scroll or debug prop/slider
  useEffect(() => {
    if (typeof debugP === 'number') {
      progressRef.current = Math.min(1, Math.max(0, debugP));
      return;
    }

    if (showDebugSlider) {
      progressRef.current = sliderVal;
      return;
    }

    const unsubscribe = scrollYProgress.on('change', (latest) => {
      progressRef.current = latest;
    });

    return () => unsubscribe();
  }, [scrollYProgress, debugP, showDebugSlider, sliderVal]);

  // 2. Track mouse for subtle desktop parallax
  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      mouseRef.current.x = x;
      mouseRef.current.y = y;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // 3. IntersectionObserver: Mount / render only within ~100vh of viewport
  useEffect(() => {
    const target = sectionRef?.current || containerRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        setIsInViewport(entry.isIntersecting);
      },
      {
        rootMargin: '800px 0px',
        threshold: 0,
      }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [sectionRef]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none bg-[#05070a]"
      aria-hidden="true"
    >
      {/* Fallback solid background */}
      <div className="absolute inset-0 bg-[#05070a]" />

      {/* 4. Canvas Stage (Protected by Error Boundary) */}
      {isInViewport && (
        <WebGLErrorBoundary>
          <Suspense fallback={null}>
            <Canvas
              camera={{ fov: 40, position: [0, 0, 14], near: 0.1, far: 50 }}
              dpr={[1, 2]}
              gl={{
                antialias: true,
                alpha: false,
                powerPreference: 'high-performance',
              }}
              onCreated={({ gl, scene }) => {
                gl.setClearColor('#05070a', 1.0);
                scene.background = null;
              }}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
              }}
            >
              <PetalScene
                progressRef={progressRef}
                mouseRef={mouseRef}
                isMobile={isMobile}
              />
            </Canvas>
          </Suspense>
        </WebGLErrorBoundary>
      )}

      {/* 5. CSS Gradient Readability Layer: transparent top to rgba(5,7,10,0.75) behind text */}
      <div
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          background:
            'linear-gradient(to bottom, rgba(5,7,10,0.05) 0%, rgba(5,7,10,0.2) 25%, rgba(5,7,10,0.75) 60%, rgba(5,7,10,0.92) 100%)',
        }}
      />

      {/* 6. Dev Debug Slider (Shown only when ?debug in URL) */}
      {showDebugSlider && (
        <div className="fixed bottom-6 left-6 z-50 pointer-events-auto bg-[#0a0f1d]/90 border border-cyan-500/40 p-4 rounded-xl backdrop-blur-md font-mono text-xs text-white shadow-2xl flex flex-col gap-2 min-w-[240px]">
          <div className="flex justify-between items-center text-cyan-400 font-bold">
            <span>PETALS DEBUG P</span>
            <span>{sliderVal.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={sliderVal}
            onChange={(e) => setSliderVal(parseFloat(e.target.value))}
            className="w-full accent-cyan-400 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-400">
            <span>0.0 Bloom</span>
            <span>0.55 Scatter</span>
            <span>1.0 Rebuilt</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default PetalField;
