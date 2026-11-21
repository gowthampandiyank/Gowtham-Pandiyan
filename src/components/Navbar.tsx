import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Home,
  User,
  Terminal,
  History,
  Briefcase,
  Mail,
  Sun,
  Moon,
  FileText,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { usePortfolioStore } from '../store/usePortfolioStore';
import { smoothScrollTo } from './SmoothScrollProvider';

const SECTION_IDS = ['home', 'about', 'skills', 'experience', 'work', 'contact'] as const;

export const Navbar: React.FC = () => {
  const { theme, toggleTheme, isLoading, isPageRevealed } = usePortfolioStore();
  const prefersReducedMotion = useReducedMotion();
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isExpanded, setIsExpanded] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isHomePage = location.pathname === '/';
  const isAdminRoute = location.pathname.startsWith('/admin');

  // Accurate scroll-spy using getBoundingClientRect() (immune to Framer Motion transforms)
  const updateScrollState = useCallback(() => {
    const scrollY = window.scrollY;
    setIsScrolled(scrollY > 20);

    if (!isHomePage) return;

    // If scrolled right to the bottom of the document, highlight the final section
    if (
      window.innerHeight + scrollY >= document.documentElement.scrollHeight - 40 &&
      document.getElementById('contact')
    ) {
      setActiveSection('contact');
      return;
    }

    const triggerOffset = 240;
    let current: string = SECTION_IDS[0];

    for (const sectionId of SECTION_IDS) {
      const element = document.getElementById(sectionId);
      if (element) {
        const rect = element.getBoundingClientRect();
        if (rect.top <= triggerOffset) {
          current = sectionId;
        }
      }
    }

    setActiveSection(current);
  }, [isHomePage]);

  useEffect(() => {
    updateScrollState();
    window.addEventListener('scroll', updateScrollState, { passive: true });
    window.addEventListener('resize', updateScrollState, { passive: true });
    return () => {
      window.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', updateScrollState);
    };
  }, [updateScrollState, isLoading, location.hash]);

  // Section navigation links: Experience 4th, Projects 5th
  const navLinks = [
    { label: 'Home', icon: Home, num: '01', href: '/', sectionId: 'home' },
    { label: 'About', icon: User, num: '02', href: '/about', sectionId: 'about' },
    { label: 'Skills', icon: Terminal, num: '03', href: '/#skills', sectionId: 'skills' },
    { label: 'Experience', icon: History, num: '04', href: '/experience', sectionId: 'experience' },
    { label: 'Projects', icon: Briefcase, num: '05', href: '/work', sectionId: 'work' },
    { label: 'Contact', icon: Mail, num: '06', href: '/contact', sectionId: 'contact' },
  ];

  const handleNavClick = (e: React.MouseEvent, link: typeof navLinks[0]) => {
    e.preventDefault();

    if (isHomePage && link.sectionId) {
      if (link.sectionId === 'home') {
        smoothScrollTo(0);
      } else {
        smoothScrollTo(`#${link.sectionId}`);
      }
      setActiveSection(link.sectionId);
    } else {
      navigate(link.href);
    }
  };

  const handleBrandClick = (e: React.MouseEvent) => {
    if (isHomePage) {
      e.preventDefault();
      smoothScrollTo(0);
      setActiveSection('home');
    }
  };

  const handleResumeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.print();
  };

  const isLinkActive = (link: typeof navLinks[0]) => {
    if (isHomePage) {
      return activeSection === link.sectionId;
    }
    if (link.href === '/work' && location.pathname === '/projects') {
      return true;
    }
    return location.pathname === link.href;
  };

  const getNavColor = (_sId: string) => {
    return { text: 'text-[#E54835]', bg: 'bg-[#E54835]', hex: '#E54835' };
  };

  return (
    <div className={isAdminRoute ? 'dark' : undefined}>
      {/* ========================================================================= */}
      {/* 1. TOP HEADER BAR: Brand Logo on Left, Theme Toggle & Resume on Right */}
      {/* ========================================================================= */}
      <motion.header
        initial={prefersReducedMotion ? false : { opacity: 0, y: -18 }}
        animate={
          prefersReducedMotion || isPageRevealed
            ? { opacity: 1, y: 0 }
            : { opacity: 0, y: -18 }
        }
        transition={{
          duration: 0.65,
          delay: prefersReducedMotion ? 0 : 0.25,
          ease: [0.76, 0, 0.24, 1],
        }}
        className={`fixed top-0 left-0 right-0 z-40 transition-[background-color,border-color,padding,box-shadow] duration-300 ${
          isScrolled
            ? 'py-3.5 bg-white/75 dark:bg-[#0D0D0D]/85 backdrop-blur-xl border-b border-[#E2E2DE]/70 dark:border-[#262624]/70 shadow-[0_8px_32px_0_rgba(0,0,0,0.04)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.35)]'
            : 'py-5 bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          {/* Brand wordmark on Top-Left */}
          <Link
            to="/"
            onClick={handleBrandClick}
            className="flex items-center gap-2 group focus:outline-none select-none"
            aria-label="Gowtham Pandiyan - Home"
          >
            <span className="font-black text-xl tracking-tighter text-[#111111] dark:text-[#EBEBE8] group-hover:text-[#E54835] transition-colors">
              GP
            </span>
            <span className="text-[11px] font-mono font-semibold tracking-widest text-[#6B6B67] dark:text-[#9E9E9A] uppercase hidden sm:inline-block">
              / DATA ANALYST
            </span>
          </Link>

          {/* Primary Top-Right Actions: Theme Switcher & Resume */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Theme Toggle Button */}
            <button
              type="button"
              role="switch"
              aria-checked={theme === 'dark'}
              onClick={toggleTheme}
              className="relative inline-flex items-center justify-between w-[58px] h-[30px] px-2 rounded-none bg-[#E5E5E0] dark:bg-[#1E1E1C] border border-[#D9D9D5] dark:border-[#333330] cursor-pointer shrink-0 select-none transition-colors duration-300 focus:outline-none"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle dark and light theme"
            >
              <Sun className={`w-3.5 h-3.5 shrink-0 pointer-events-none ${theme === 'dark' ? 'text-[#737373]' : 'text-[#111111]'}`} />
              <Moon className={`w-3.5 h-3.5 shrink-0 pointer-events-none ${theme === 'dark' ? 'text-[#EBEBE8]' : 'text-[#737373]'}`} />

              <motion.div
                className="theme-toggle-knob absolute left-[3px] top-[3px] w-[22px] h-[22px] rounded-none bg-white dark:bg-[#0D0D0D] shadow-md flex items-center justify-center border border-[#D9D9D5]/60 dark:border-[#333330] pointer-events-none shrink-0"
                initial={false}
                animate={{
                  x: theme === 'dark' ? 28 : 0,
                }}
                transition={{
                  type: 'tween',
                  duration: 0.16,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                {theme === 'dark' ? (
                  <Moon className="w-3 h-3 text-[#EBEBE8]" />
                ) : (
                  <Sun className="w-3 h-3 text-[#111111]" />
                )}
              </motion.div>
            </button>

            {/* Resume Button in Header Nav */}
            <a
              href="#resume"
              onClick={handleResumeClick}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-[#111111] dark:border-[#EBEBE8] text-xs font-mono uppercase text-[#111111] dark:text-[#EBEBE8] hover:bg-[#111111] hover:text-white dark:hover:bg-[#EBEBE8] dark:hover:text-[#111111] transition-all shrink-0 font-bold rounded-none cursor-pointer"
              title="Download & View Resume"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Resume</span>
            </a>
          </div>
        </div>
      </motion.header>

      {/* ========================================================================= */}
      {/* 2. DESKTOP VIEW: EXPANDABLE & MINIMIZABLE LEFT-SIDE RAIL                  */}
      {/* Left side vertically centered, icon first and second name                 */}
      {/* ========================================================================= */}
      <nav
        aria-label="Desktop side navigation"
        className="fixed left-4 lg:left-8 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col items-start"
      >
        <motion.div
          animate={{ width: isExpanded ? 184 : 54 }}
          transition={{ type: 'spring', stiffness: 350, damping: 28 }}
          className="flex flex-col rounded-none bg-white/85 dark:bg-[#0D0D0D]/90 backdrop-blur-xl border border-[#E2E2DE] dark:border-[#262624] shadow-[0_8px_32px_0_rgba(0,0,0,0.08)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] overflow-visible"
        >
          {/* Minimize / Expand Toggle Header */}
          <div className="flex items-center justify-between px-3 py-2.5 border-b border-[#E2E2DE]/70 dark:border-[#262624]/70 bg-black/5 dark:bg-white/5 overflow-hidden">
            <AnimatePresence initial={false}>
              {isExpanded && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.15 }}
                  className="text-[9px] font-mono font-bold tracking-widest uppercase text-[#737373] dark:text-[#8E8E8A] overflow-hidden whitespace-nowrap"
                >
                  MENU
                </motion.span>
              )}
            </AnimatePresence>

            <button
              onClick={() => setIsExpanded((prev) => !prev)}
              type="button"
              className="p-1 hover:bg-[#E54835]/15 hover:text-[#E54835] text-[#737373] dark:text-[#8E8E8A] transition-colors ml-auto cursor-pointer"
              title={isExpanded ? 'Minimize Navigation' : 'Expand Navigation'}
              aria-label={isExpanded ? 'Minimize navigation' : 'Expand navigation'}
              aria-expanded={isExpanded}
            >
              {isExpanded ? (
                <ChevronLeft className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Navigation Links: Icon first and second name */}
          <div className="flex flex-col py-3 px-1.5 space-y-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = isLinkActive(link);
              const navColor = getNavColor(link.sectionId);

              return (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link)}
                  className={`relative group px-2 py-2 flex items-center cursor-pointer transition-colors rounded-none ${
                    isActive
                      ? `bg-black/5 dark:bg-white/5 ${navColor.text} font-bold`
                      : 'text-[#737373] dark:text-[#8E8E8A] hover:text-[#111111] dark:hover:text-[#FFFFFF] hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                  aria-label={link.label}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {/* Active Left Vertical Accent Line (| style) */}
                  {isActive && (
                    <motion.div
                      layoutId="desktopActiveVerticalLine"
                      className={`absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 ${navColor.bg}`}
                      style={{ boxShadow: `0 0 8px ${navColor.hex}` }}
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}

                  {/* First: Icon */}
                  <div className="w-6 flex items-center justify-center shrink-0">
                    <Icon
                      className={`w-4 h-4 transition-all duration-200 ${
                        isActive
                          ? `${navColor.text} scale-110`
                          : 'group-hover:text-[#111111] dark:group-hover:text-[#FFFFFF]'
                      }`}
                      style={isActive ? { filter: `drop-shadow(0 0 6px ${navColor.hex}88)` } : undefined}
                    />
                  </div>

                  {/* Second: Name (Shows when expanded) */}
                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 'auto' }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.18 }}
                        className="flex items-center whitespace-nowrap overflow-hidden text-xs font-mono uppercase tracking-wide"
                      >
                        <span className="ml-2.5 flex items-center gap-1.5">
                          <span className="text-[10px] text-neutral-400 font-normal">
                            {link.num}.
                          </span>
                          <span className={isActive ? `${navColor.text} font-bold` : ''}>
                            {link.label}
                          </span>
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Tooltip when in Minimized state */}
                  {!isExpanded && (
                    <div className="absolute left-full ml-3 px-2.5 py-1 bg-[#111111] dark:bg-white text-white dark:text-black text-[10px] font-mono uppercase tracking-wider font-bold whitespace-nowrap shadow-xl border border-[#262624] dark:border-[#D9D9D5] opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 translate-x-1 group-hover:translate-x-0 rounded-none z-50">
                      {link.num} // {link.label}
                    </div>
                  )}
                </a>
              );
            })}
          </div>
        </motion.div>
      </nav>

      {/* ========================================================================= */}
      {/* 3. MOBILE VIEW: BOTTOM DOCKED NAVIGATION BAR                              */}
      {/* First: Icon, Second: Name underneath with Experience 4th, Projects 5th    */}
      {/* ========================================================================= */}
      <nav
        aria-label="Mobile bottom navigation"
        className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white/95 dark:bg-[#0D0D0D]/95 backdrop-blur-xl border-t border-[#E2E2DE] dark:border-[#262624] px-1 py-1.5 grid grid-cols-6 items-center shadow-[0_-8px_24px_rgba(0,0,0,0.12)] safe-area-bottom"
      >
        {navLinks.map((link) => {
          const Icon = link.icon;
          const isActive = isLinkActive(link);
          const navColor = getNavColor(link.sectionId);

          return (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => handleNavClick(e, link)}
              className="relative px-1 py-1.5 flex flex-col items-center justify-center cursor-pointer select-none min-w-0"
              aria-label={link.label}
              aria-current={isActive ? 'page' : undefined}
            >
              {/* First: Icon */}
              <Icon
                className={`w-4 h-4 mb-0.5 transition-all duration-200 ${
                  isActive
                    ? navColor.text
                    : 'text-[#737373] dark:text-[#8E8E8A]'
                }`}
                style={isActive ? { filter: `drop-shadow(0 0 6px ${navColor.hex}66)` } : undefined}
              />

              {/* Second: Name */}
              <span
                className={`font-mono text-[9px] uppercase tracking-tight transition-colors truncate max-w-full ${
                  isActive
                    ? `font-bold ${navColor.text}`
                    : 'text-[#737373] dark:text-[#8E8E8A]'
                }`}
              >
                {link.label}
              </span>

              {/* Active Horizontal Underline Accent */}
              {isActive && (
                <motion.div
                  layoutId="mobileActiveUnderline"
                  className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-[2px] ${navColor.bg}`}
                  style={{ boxShadow: `0 0 8px ${navColor.hex}` }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </a>
          );
        })}
      </nav>
    </div>
  );
};
