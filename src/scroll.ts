import Lenis from 'lenis';
import { useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };

export type ScrollCallback = (data: {
  scroll: number;
  limit: number;
  velocity: number;
  progress: number;
}) => void;

let lenisInstance: Lenis | null = null;
const listeners = new Set<ScrollCallback>();

export function initLenis(): Lenis {
  if (typeof window === 'undefined') return {} as Lenis;

  if (lenisInstance) {
    return lenisInstance;
  }

  lenisInstance = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1.0,
    touchMultiplier: 1.5,
    infinite: false,
  });

  // Synchronize Lenis with ScrollTrigger
  lenisInstance.on('scroll', (e: { scroll: number; limit: number; velocity: number; progress: number }) => {
    ScrollTrigger.update();
    listeners.forEach((callback) => callback(e));
  });

  // GSAP ticker drives Lenis single RAF loop
  gsap.ticker.add((time: number) => {
    lenisInstance?.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  return lenisInstance;
}

export function getLenis(): Lenis | null {
  return lenisInstance;
}

export function destroyLenis(): void {
  if (lenisInstance) {
    lenisInstance.destroy();
    lenisInstance = null;
  }
  listeners.clear();
  ScrollTrigger.getAll().forEach((t) => t.kill());
}

export function scrollTo(target: string | number | HTMLElement, offset: number = 0): void {
  if (!lenisInstance) {
    if (typeof target === 'string') {
      const el = document.querySelector(target);
      el?.scrollIntoView({ behavior: 'smooth' });
    }
    return;
  }
  lenisInstance.scrollTo(target, { offset, duration: 1.4 });
}

export function onScroll(callback: ScrollCallback): () => void {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

/**
 * Hook to track global scroll position and progress
 */
export function useScroll() {
  const [scrollData, setScrollData] = useState({
    scroll: 0,
    limit: 0,
    velocity: 0,
    progress: 0,
  });

  useEffect(() => {
    const unsub = onScroll((data) => {
      setScrollData(data);
    });
    return unsub;
  }, []);

  return scrollData;
}
