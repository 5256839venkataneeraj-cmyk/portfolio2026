import { useState, useEffect, useRef } from 'react';
import { useProgress } from '@react-three/drei';

/**
 * useSmoothProgress
 * Eases raw progress into a silky 0-100 integer value.
 * If progressProp is undefined, it monitors drei's useProgress()
 * while guaranteeing a smooth initial ramp-up.
 */
export function useSmoothProgress(progressProp, speed = 0.08) {
  const { progress: dreiProgress } = useProgress();
  const [smoothVal, setSmoothVal] = useState(0);

  const internalTargetRef = useRef(0);
  const currentValRef = useRef(0);

  useEffect(() => {
    // If progressProp is provided, use it as target
    if (typeof progressProp === 'number') {
      internalTargetRef.current = Math.min(100, Math.max(0, progressProp));
      return;
    }

    // Otherwise autonomous realistic progress curve blended with dreiProgress
    const startTime = performance.now();
    let timerId;

    const tick = () => {
      const elapsed = (performance.now() - startTime) / 1000;
      // Organic curve that reaches 100 in ~2.2s if assets load fast
      let autoTarget = 0;
      if (elapsed < 0.6) {
        autoTarget = (elapsed / 0.6) * 45;
      } else if (elapsed < 1.4) {
        autoTarget = 45 + ((elapsed - 0.6) / 0.8) * 40;
      } else if (elapsed < 2.0) {
        autoTarget = 85 + ((elapsed - 1.4) / 0.6) * 15;
      } else {
        autoTarget = 100;
      }

      // Max with actual dreiProgress
      internalTargetRef.current = Math.min(100, Math.max(autoTarget, dreiProgress));

      if (internalTargetRef.current < 100) {
        timerId = requestAnimationFrame(tick);
      }
    };

    timerId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(timerId);
  }, [progressProp, dreiProgress]);

  useEffect(() => {
    let animId;
    const update = () => {
      const diff = internalTargetRef.current - currentValRef.current;
      if (Math.abs(diff) > 0.04) {
        currentValRef.current += diff * speed;
        setSmoothVal(Math.min(100, Math.max(0, currentValRef.current)));
      } else if (currentValRef.current !== internalTargetRef.current) {
        currentValRef.current = internalTargetRef.current;
        setSmoothVal(internalTargetRef.current);
      }
      animId = requestAnimationFrame(update);
    };

    animId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animId);
  }, [speed]);

  return Math.round(smoothVal);
}

export default useSmoothProgress;
