import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowDown, ArrowUpRight, FileText, Database } from 'lucide-react';
import { usePortfolioStore } from '../store/usePortfolioStore';
import { DataBackgroundAnimation } from './DataBackgroundAnimation';
import { resolvePortfolioImage } from '../utils/imageUtils';

export const HeroSection: React.FC = () => {
  const { settings, setCursor, resetCursor, isPageRevealed } = usePortfolioStore();
  const prefersReducedMotion = useReducedMotion();
  const shouldAnimateHero = prefersReducedMotion || isPageRevealed;

  const scrollToContact = () => {
    const el = document.getElementById('contact');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToWork = () => {
    const el = document.getElementById('work');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToAbout = () => {
    const el = document.getElementById('about');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Cinematic staggered container and item entrance animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.13,
        delayChildren: 0.1,
      },
    },
  };

  const kickerVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  const roleVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.65,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  // Main headline line variants with vertical slide & opacity fade-in
  const headlineLineVariants = {
    hidden: { opacity: 0, y: 45, filter: 'blur(3px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        duration: 0.85,
        ease: [0.16, 1, 0.3, 1], // Smooth cinematic curve
      },
    },
  };

  // Subheadline entrance with slight vertical slide and fade
  const subheadlineVariants = {
    hidden: { opacity: 0, y: 22 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.75,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  const ctaGroupVariants = {
    hidden: { opacity: 0, y: 18 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.65,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  const highlightsBarVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <section
      id="home"
      className="relative min-h-[86vh] flex flex-col justify-between pt-28 pb-12 md:pt-32 md:pb-16 overflow-hidden tech-grid-bg border-b border-white/40 dark:border-white/10"
    >
      {/* New DataBackgroundAnimation component strictly in the hero background (z-0) */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <DataBackgroundAnimation />
      </div>

      {/* Signature subtle aura across light & dark modes */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[380px] bg-[#E54835]/6 dark:bg-[#E54835]/8 blur-[160px] rounded-full pointer-events-none z-0" />

      {/* Main Content Area: Left Text, Right Image: strictly in foreground (relative z-30) */}
      <div className="relative z-30 max-w-7xl mx-auto px-6 md:px-12 w-full grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10 lg:gap-14 items-center my-auto">
        {/* Left Column: Massive Editorial Typography with Framer Motion Staggered Reveal */}
        <motion.div
          variants={containerVariants}
          initial={prefersReducedMotion ? 'visible' : 'hidden'}
          animate={shouldAnimateHero ? 'visible' : 'hidden'}
          className="md:col-span-7 flex flex-col justify-center"
        >
          {/* Eyebrow / Kicker */}
          <motion.div
            variants={kickerVariants}
            className="inline-flex items-center gap-2.5 px-3.5 py-1.5 w-fit mb-4 text-[11px] font-mono tracking-widest text-[#111111] dark:text-[#EBEBE8] uppercase bg-white/90 dark:bg-[#141412]/90 border border-[#E2E2DE] dark:border-white/10 rounded-none"
          >
            <span className="w-2 h-2 rounded-none bg-[#E54835] inline-block animate-pulse shrink-0" />
            <span className="truncate">
              {settings.status_badge || 'Actively Modeling & Delivering Projects | Open to Data Analyst Roles'}
            </span>
          </motion.div>

          {/* Role Headline */}
          <motion.div variants={roleVariants} className="overflow-hidden mb-2">
            <h2 className="text-xs sm:text-sm font-mono tracking-widest text-[#E54835] uppercase font-bold flex items-center gap-2">
              <span className="p-1 bg-[#E54835]/10 text-[#E54835] border border-[#E54835]/25">
                <Database className="w-3.5 h-3.5 text-[#E54835]" />
              </span>
              <span>DATA ANALYST &amp; BUSINESS INTELLIGENCE</span>
            </h2>
          </motion.div>

          {/* Main Headline with Staggered Vertical Slide & Opacity Fade-in */}
          <div className="overflow-hidden mb-5">
            <h1
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-[#111111] dark:text-[#EBEBE8] uppercase leading-[0.95]"
              style={{ textWrap: 'balance' }}
            >
              <div className="overflow-hidden">
                <motion.span variants={headlineLineVariants} className="block">
                  GOWTHAM
                </motion.span>
              </div>
              <div className="overflow-hidden mt-1 sm:mt-1.5">
                <motion.span variants={headlineLineVariants} className="block text-neutral-800 dark:text-neutral-200">
                  PANDIYAN
                </motion.span>
              </div>
            </h1>
          </div>

          {/* Subheadline with Staggered Entrance */}
          <motion.p
            variants={subheadlineVariants}
            className="text-sm sm:text-base text-[#6B6B67] dark:text-[#9E9E9A] max-w-xl font-normal leading-relaxed mb-8 tracking-normal"
          >
            Specializing in relational SQL data warehousing, business intelligence modeling, and executive Power BI dashboards.{' '}
            <span className="font-semibold text-[#111111] dark:text-neutral-300">
              SQL Pipelines / Star Schemas / Power BI / <span className="text-[#E54835]">Statistical Modeling</span>.
            </span>
          </motion.p>

          {/* Action CTAs - Staggered Buttons */}
          <motion.div variants={ctaGroupVariants} className="flex flex-wrap items-center gap-3.5">
            {/* Primary Action Button */}
            <button
              onClick={scrollToWork}
              onMouseEnter={() => setCursor({ label: 'WORK', type: 'explore' })}
              onMouseLeave={resetCursor}
              className="px-6 py-3.5 bg-[#111111] dark:bg-[#EBEBE8] text-[#FFFFFF] dark:text-[#111111] text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 dark:hover:bg-white transition-all duration-200 flex items-center gap-2 group rounded-none shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>Explore Projects</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>

            {/* Secondary Action: Contact */}
            <button
              onClick={scrollToContact}
              onMouseEnter={() => setCursor({ label: 'CONTACT', type: 'contact' })}
              onMouseLeave={resetCursor}
              className="glass-btn px-5 py-3.5 text-[#111111] dark:text-[#EBEBE8] text-xs font-bold uppercase tracking-wider flex items-center gap-2 rounded-none hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>Get in Touch</span>
            </button>

            {/* Tertiary Action: Resume */}
            <button
              onClick={() => window.print()}
              onMouseEnter={() => setCursor({ label: 'RESUME', type: 'open' })}
              onMouseLeave={resetCursor}
              className="glass-btn px-4.5 py-3.5 text-[#111111] dark:text-[#EBEBE8] text-xs font-bold uppercase tracking-wider flex items-center gap-2 rounded-none hover:-translate-y-0.5 active:translate-y-0"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Resume</span>
            </button>
          </motion.div>

          {/* Quick Technical Highlights - Unified standard palette */}
          <motion.div
            variants={highlightsBarVariants}
            className="mt-8 p-3.5 bg-white/90 dark:bg-black/40 backdrop-blur-md border border-[#E2E2DE] dark:border-white/10 rounded-none shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-mono"
          >
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-none bg-[#E54835] shrink-0" />
              <span className="font-semibold text-[#111111] dark:text-[#EBEBE8]">SQL Data Modeling</span>
            </span>
            <span aria-hidden="true" className="text-[#D9D9D5] dark:text-[#333330]">·</span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-none bg-[#E54835] shrink-0" />
              <span className="font-semibold text-[#111111] dark:text-[#EBEBE8]">Power BI Intelligence</span>
            </span>
            <span aria-hidden="true" className="text-[#D9D9D5] dark:text-[#333330]">·</span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-none bg-[#E54835] shrink-0" />
              <span className="font-semibold text-[#111111] dark:text-[#EBEBE8]">Python &amp; Pandas</span>
            </span>
            <span aria-hidden="true" className="text-[#D9D9D5] dark:text-[#333330]">·</span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-none bg-[#E54835] shrink-0" />
              <span className="font-semibold text-[#111111] dark:text-[#EBEBE8]">Advanced DAX</span>
            </span>
            <span aria-hidden="true" className="text-[#D9D9D5] dark:text-[#333330]">·</span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-none bg-[#E54835] shrink-0" />
              <span className="font-semibold text-[#111111] dark:text-[#EBEBE8]">ETL Pipelines</span>
            </span>
          </motion.div>
        </motion.div>

        {/* Right Column: Hero Section Portrait with Complementary Fade & Scale */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.94, y: 24 }}
          animate={
            shouldAnimateHero
              ? { opacity: 1, scale: 1, y: 0 }
              : { opacity: 0, scale: 0.94, y: 24 }
          }
          transition={{ duration: 0.85, delay: prefersReducedMotion ? 0 : 0.35, ease: [0.76, 0, 0.24, 1] }}
          className="md:col-span-5 relative w-full flex justify-center md:justify-end"
        >
          <div
            onMouseEnter={() => setCursor({ label: 'VIEW', type: 'view' })}
            onMouseLeave={resetCursor}
            className="relative group mx-auto md:ml-auto max-w-[290px] sm:max-w-[330px] md:max-w-[350px] lg:max-w-[390px] w-full overflow-hidden glass-panel-deep p-2.5 transition-all duration-500 rounded-none shadow-xl hover:border-[#E54835]/50"
          >
            {/* The Portrait Image */}
            <img
              src="/src/assets/images/gowtham_portrait_1790451073382.jpg"
              alt="Gowtham Pandiyan - Data Analyst"
              className="w-full aspect-[3/4] object-cover object-top grayscale contrast-105 group-hover:grayscale-0 transition-all duration-700 scale-100 group-hover:scale-105"
              loading="eager"
            />

            {/* Corner Technical Frame Markings - Frosted Glass */}
            <div className="absolute top-4 left-4 text-[9px] font-mono tracking-widest text-white/95 bg-black/60 backdrop-blur-md border border-white/20 px-2 py-0.5 pointer-events-none flex items-center gap-1.5 rounded-none shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E54835] group-hover:animate-ping" />
              <span>GP // DATA ANALYTICS</span>
            </div>
            <div className="absolute bottom-4 right-4 text-[9px] font-mono tracking-widest text-white/95 bg-black/60 backdrop-blur-md border border-white/20 px-2 py-0.5 pointer-events-none rounded-none shadow-xs">
              CHENNAI / TN
            </div>

            {/* Live Telemetry Reveal Tag */}
            <div className="absolute bottom-4 left-4 text-[8px] font-mono tracking-widest text-white bg-black/75 backdrop-blur-md border border-white/25 px-2 py-0.5 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-none shadow-xs">
              ANALYST // DATA &amp; BI MODELING
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Bar: Scroll Indicator */}
      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0 }}
        animate={shouldAnimateHero ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.7, delay: prefersReducedMotion ? 0 : 0.75 }}
        className="relative z-30 max-w-7xl mx-auto px-6 md:px-12 w-full pt-8 flex items-center justify-between text-xs text-[#6B6B67] dark:text-[#9E9E9A]"
      >
        <button
          onClick={scrollToAbout}
          className="flex items-center gap-2 hover:text-[#111111] dark:hover:text-[#EBEBE8] transition-colors focus:outline-none group"
        >
          <span className="font-mono uppercase tracking-widest text-[10px]">Scroll to explore</span>
          <ArrowDown className="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform text-[#111111] dark:text-[#EBEBE8]" />
        </button>

        <div className="font-mono text-[10px] tabular-nums">LOC: 13.0827° N, 80.2707° E</div>
      </motion.div>
    </section>
  );
};
