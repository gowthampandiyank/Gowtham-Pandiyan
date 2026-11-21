import React, { useEffect, useRef } from 'react';
import Lenis from 'lenis';

interface SmoothScrollProps {
  children: React.ReactNode;
}

let activeLenis: Lenis | null = null;

export const setSmoothScrollLocked = (locked: boolean) => {
  if (!activeLenis) return;
  if (locked) {
    activeLenis.stop();
  } else {
    activeLenis.start();
  }
};

export const smoothScrollTo = (target: number | string | HTMLElement, offset = 0) => {
  if (activeLenis) {
    activeLenis.scrollTo(target, { offset });
    return;
  }

  let top = 0;
  if (typeof target === 'number') {
    top = target + offset;
  } else {
    const el =
      typeof target === 'string'
        ? document.getElementById(target.replace(/^#/, '')) || document.querySelector(target)
        : target;
    if (!el) return;
    top = el.getBoundingClientRect().top + window.scrollY + offset;
  }

  window.scrollTo({
    top: Math.max(0, top),
    behavior: 'smooth',
  });
};

export const SmoothScrollProvider: React.FC<SmoothScrollProps> = ({ children }) => {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      activeLenis = null;
      return;
    }

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      touchMultiplier: 1.5,
    });

    lenisRef.current = lenis;
    activeLenis = lenis;

    let animId = 0;
    function raf(time: number) {
      lenis.raf(time);
      animId = requestAnimationFrame(raf);
    }

    animId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(animId);
      if (activeLenis === lenis) {
        activeLenis = null;
      }
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
};
