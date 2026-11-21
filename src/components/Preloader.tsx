import React, { useEffect, useState, useRef } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { setSmoothScrollLocked } from './SmoothScrollProvider';

export const PRELOADER_STORAGE_KEY = 'gp_portfolio_intro_seen';

export function shouldShowPreloader(storageKey = PRELOADER_STORAGE_KEY): boolean {
  if (typeof window === 'undefined') return false;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return false;
  }
  try {
    return window.sessionStorage.getItem(storageKey) !== 'true';
  } catch {
    return false;
  }
}

export interface PreloaderProps {
  greeting?: string;
  tagline?: string;
  /** Total visible intro duration before curtain lift starts (ms). Default: 2500 */
  durationMs?: number;
  /** Curtain slide-up exit duration (seconds). Default: 0.85 */
  revealDurationSec?: number;
  /** Optional Tailwind classes to customize surface, text, or accent colors */
  bgClassName?: string;
  textClassName?: string;
  accentTextClassName?: string;
  accentBarClassName?: string;
  storageKey?: string;
  onRevealStart?: () => void;
  onComplete?: () => void;
}

const REVEAL_EASE = [0.76, 0, 0.24, 1] as const;

export const Preloader: React.FC<PreloaderProps> = ({
  greeting = "Hello, I'm Gowtham",
  tagline = 'The Analyst who codes',
  durationMs = 2500,
  revealDurationSec = 0.85,
  bgClassName = 'bg-[#0B0B0A]',
  textClassName = 'text-[#EBEBE8]',
  accentTextClassName = 'text-[#E54835]',
  accentBarClassName = 'bg-[#E54835]',
  storageKey = PRELOADER_STORAGE_KEY,
  onRevealStart,
  onComplete,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const [isVisible, setIsVisible] = useState<boolean>(() => shouldShowPreloader(storageKey));
  const [typedCount, setTypedCount] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);

  const onRevealStartRef = useRef(onRevealStart);
  const onCompleteRef = useRef(onComplete);
  onRevealStartRef.current = onRevealStart;
  onCompleteRef.current = onComplete;

  // If skipped on initial load (repeat session visit or reduced motion), notify immediately
  useEffect(() => {
    if (!isVisible) {
      onRevealStartRef.current?.();
      onCompleteRef.current?.();
    }
    // Run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Lock page scroll while intro is active and release cleanly on exit/unmount
  useEffect(() => {
    if (!isVisible) return;

    const prevBodyOverflow = document.body.style.overflow;
    const prevHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    setSmoothScrollLocked(true);

    return () => {
      document.body.style.overflow = prevBodyOverflow;
      document.documentElement.style.overflow = prevHtmlOverflow;
      setSmoothScrollLocked(false);
    };
  }, [isVisible]);

  // If user dynamically enables reduced motion mid-intro, reveal immediately
  useEffect(() => {
    if (prefersReducedMotion && isVisible) {
      try {
        window.sessionStorage.setItem(storageKey, 'true');
      } catch {
        // Ignore storage write restriction
      }
      setIsVisible(false);
      onRevealStartRef.current?.();
      onCompleteRef.current?.();
    }
  }, [prefersReducedMotion, isVisible, storageKey]);

  // Drive typed greeting + smooth 0 -> 100% counter and trigger exit after ~2.5s
  useEffect(() => {
    if (!isVisible || prefersReducedMotion) return;

    const startTime = performance.now();
    const typingDuration = Math.min(950, durationMs * 0.42);
    let rafId = 0;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const rawRatio = Math.min(1, elapsed / durationMs);
      // Smooth ease-out cubic curve for the counter
      const easedProgress = Math.round((1 - Math.pow(1 - rawRatio, 2.2)) * 100);
      setProgress(easedProgress);

      const typeRatio = Math.min(1, elapsed / typingDuration);
      setTypedCount(Math.round(typeRatio * greeting.length));

      if (elapsed < durationMs) {
        rafId = requestAnimationFrame(tick);
      } else {
        setProgress(100);
        setTypedCount(greeting.length);
      }
    };

    rafId = requestAnimationFrame(tick);

    const exitTimer = window.setTimeout(() => {
      try {
        window.sessionStorage.setItem(storageKey, 'true');
      } catch {
        // Ignore private browsing storage error
      }
      setIsVisible(false);
      onRevealStartRef.current?.();
    }, durationMs);

    return () => {
      cancelAnimationFrame(rafId);
      window.clearTimeout(exitTimer);
    };
  }, [isVisible, prefersReducedMotion, durationMs, greeting.length, storageKey]);

  const typedGreeting = greeting.slice(0, typedCount);
  const typingFinished = typedCount >= greeting.length;

  return (
    <AnimatePresence
      mode="wait"
      onExitComplete={() => {
        onCompleteRef.current?.();
      }}
    >
      {isVisible && (
        <motion.div
          key="portfolio-preloader"
          initial={{ y: 0 }}
          exit={{ y: '-100%' }}
          transition={{
            duration: revealDurationSec,
            ease: REVEAL_EASE,
          }}
          aria-modal="true"
          role="dialog"
          aria-label="Welcome intro"
          className={`fixed inset-0 z-[100] flex flex-col justify-between overflow-hidden select-none px-6 py-8 md:px-14 md:py-12 border-b border-white/15 ${bgClassName} ${textClassName}`}
        >
          {/* Top Subtle Header Row */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center justify-between text-[11px] font-mono uppercase tracking-[0.22em] text-white/50"
          >
            <span>Gowtham Pandiyan</span>
            <span className="tabular-nums">Portfolio</span>
          </motion.div>

          {/* Center Greeting & Tagline */}
          <div className="my-auto max-w-4xl">
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05]"
            >
              <span>{typedGreeting}</span>
              <motion.span
                aria-hidden="true"
                animate={{ opacity: typingFinished ? [1, 0, 1] : 1 }}
                transition={{
                  repeat: typingFinished ? Infinity : 0,
                  duration: 0.85,
                }}
                className={`inline-block w-[3px] h-[0.82em] ml-1.5 align-middle ${accentBarClassName}`}
              />
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{
                opacity: typingFinished ? 1 : 0,
                y: typingFinished ? 0 : 14,
              }}
              transition={{
                duration: 0.55,
                ease: REVEAL_EASE,
              }}
              className={`mt-4 sm:mt-5 text-base sm:text-xl md:text-2xl font-mono tracking-wide ${accentTextClassName}`}
            >
              {tagline}
            </motion.p>
          </div>

          {/* Bottom Animated Progress Line & 0 -> 100% Counter */}
          <div className="w-full space-y-3">
            <div className="flex items-end justify-between font-mono">
              <span className="text-[10px] uppercase tracking-[0.2em] text-white/45">
                Loading Experience
              </span>
              <span className="text-2xl sm:text-3xl font-bold tracking-tight tabular-nums">
                {String(progress).padStart(2, '0')}%
              </span>
            </div>

            <div className="w-full h-[2px] bg-white/15 overflow-hidden">
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{
                  duration: durationMs / 1000,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className={`h-full w-full origin-left ${accentBarClassName}`}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
