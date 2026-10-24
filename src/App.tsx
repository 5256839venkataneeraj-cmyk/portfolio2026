import React, { useEffect, useState } from 'react';
import { initLenis, destroyLenis, gsap, ScrollTrigger } from './scroll';
import { Navbar } from './components/Navbar';
import { Earthrise } from './components/Earthrise';
import { MissionLog } from './components/MissionLog';
import { Achievements } from './components/Achievements';
import { Trajectory } from './components/Trajectory';
import { Missions } from './components/Missions';
import { Interests } from './components/Interests';
import { RoadAhead } from './components/RoadAhead';
import { Reserve } from './components/Reserve';
import { Footer } from './components/Footer';
import { LoadingScreen } from './components/loader/LoadingScreen';
import { ScrollOutro } from './components/outro/ScrollOutro';

export const App: React.FC = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Initialize Lenis smooth scroll with single rAF loop
    const lenis = initLenis();

    // Global Scroll Reveals: subtle fade-up animations (y translation + opacity) for major section containers
    const ctx = gsap.context(() => {
      const revealElements = gsap.utils.toArray<HTMLElement>('.gsap-reveal');
      revealElements.forEach((el) => {
        gsap.fromTo(
          el,
          {
            opacity: 0,
            y: 32,
          },
          {
            opacity: 1,
            y: 0,
            duration: 1.0,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 88%',
              once: true,
            },
          }
        );
      });
    });

    return () => {
      ctx.revert();
      destroyLenis();
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#05070B] text-slate-200 selection:bg-cyan-500/30 selection:text-cyan-200">
      {!loaded && (
        <LoadingScreen
          onComplete={() => {
            setLoaded(true);
            ScrollTrigger.refresh();
          }}
        />
      )}
      <Navbar />
      <main>
        <Earthrise />
        <MissionLog />
        <Achievements />
        <Trajectory />
        <Missions />
        <Interests />
        <RoadAhead />
        <Reserve />
      </main>
      <ScrollOutro />
    </div>
  );
};

export default App;
