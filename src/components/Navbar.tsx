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
} from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { usePortfolioStore } from '../store/usePortfolioStore';
import { smoothScrollTo } from './SmoothScrollProvider';

const SECTION_IDS = ['home', 'about', 'skills', 'experience', 'work', 'contact'] as const;

export const Navbar: React.FC = () => {
  const { theme, toggleTheme, isLoading, isPageRevealed } = usePortfolioStore();
  const prefersReducedMotion = useReducedMotion();
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const location = useLocation();
  const navigate = useNavigate();

  const isHomePage = location.pathname === '/';
  const isAdminRoute = location.pathname.startsWith('/admin');

  const updateScrollState = useCallback(() => {
    setIsScrolled(window.scrollY > 20);
    if (!isHomePage) return;

    if (
      window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 40 &&
      document.getElementById('contact')
    ) {
      setActiveSection('contact');
      return;
    }

    let current: string = SECTION_IDS[0];
    for (const sectionId of SECTION_IDS) {
      const element = document.getElementById(sectionId);
      if (element && element.getBoundingClientRect().top <= 200) current = sectionId;
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

  const navLinks = [
    { label: 'Home', icon: Home, href: '/', sectionId: 'home' },
    { label: 'About', icon: User, href: '/about', sectionId: 'about' },
    { label: 'Skills', icon: Terminal, href: '/#skills', sectionId: 'skills' },
    { label: 'Experience', icon: History, href: '/experience', sectionId: 'experience' },
    { label: 'Projects', icon: Briefcase, href: '/work', sectionId: 'work' },
    { label: 'Contact', icon: Mail, href: '/contact', sectionId: 'contact' },
  ];

  const handleNavClick = (e: React.MouseEvent, link: typeof navLinks[number]) => {
    e.preventDefault();
    if (isHomePage) {
      smoothScrollTo(link.sectionId === 'home' ? 0 : `#${link.sectionId}`);
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

  const isLinkActive = (link: typeof navLinks[number]) => {
    if (isHomePage) return activeSection === link.sectionId;
    if (link.href === '/work' && location.pathname === '/projects') return true;
    return location.pathname === link.href;
  };

  return (
    <div className={isAdminRoute ? 'dark' : undefined}>
      <motion.header
        initial={prefersReducedMotion ? false : { opacity: 0, y: -18 }}
        animate={
          prefersReducedMotion || isPageRevealed
            ? { opacity: 1, y: 0 }
            : { opacity: 0, y: -18 }
        }
        transition={{ duration: 0.65, delay: prefersReducedMotion ? 0 : 0.25, ease: [0.76, 0, 0.24, 1] }}
        className={`fixed top-0 left-0 right-0 z-40 border-b transition-all duration-300 ${
          isScrolled
            ? 'py-3 bg-white/80 dark:bg-[#0D0D0D]/85 backdrop-blur-xl border-[#E2E2DE]/70 dark:border-[#262624]/70 shadow-[0_8px_32px_0_rgba(0,0,0,0.06)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]'
            : 'py-4 bg-white/70 dark:bg-[#0D0D0D]/70 backdrop-blur-md border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 xl:px-10 flex items-center justify-between gap-4">
          <Link
            to="/"
            onClick={handleBrandClick}
            className="flex items-center gap-2 group focus:outline-none select-none shrink-0"
            aria-label="Gowtham Pandiyan - Home"
          >
            <span className="font-black text-xl tracking-tighter text-[#111111] dark:text-[#EBEBE8] group-hover:text-[#E54835] transition-colors duration-300">
              GP
            </span>
            <span className="text-[10px] font-mono font-semibold tracking-widest text-[#6B6B67] dark:text-[#9E9E9A] uppercase hidden sm:inline-block whitespace-nowrap">
              / DATA ANALYST
            </span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              type="button"
              role="switch"
              aria-checked={theme === 'dark'}
              onClick={toggleTheme}
              className="relative inline-flex items-center justify-between w-[48px] h-[28px] px-1.5 rounded-full bg-[#E5E5E0] dark:bg-[#1E1E1C] border border-[#D9D9D5] dark:border-[#333330] cursor-pointer select-none transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E54835]"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle dark and light theme"
            >
              <Sun className={`w-3.5 h-3.5 pointer-events-none ${theme === 'dark' ? 'text-[#737373]' : 'text-[#111111]'}`} />
              <Moon className={`w-3.5 h-3.5 pointer-events-none ${theme === 'dark' ? 'text-[#EBEBE8]' : 'text-[#737373]'}`} />
              <motion.span
                className="absolute left-[3px] top-[3px] w-[20px] h-[20px] rounded-full bg-white dark:bg-[#0D0D0D] shadow-md border border-[#D9D9D5]/60 dark:border-[#333330] pointer-events-none"
                initial={false}
                animate={{ x: theme === 'dark' ? 20 : 0 }}
                transition={{ type: 'tween', duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
              />
            </button>

            <a
              href="#resume"
              onClick={handleResumeClick}
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-2 border border-[#111111] dark:border-[#EBEBE8] text-[9px] sm:text-[10px] font-mono uppercase text-[#111111] dark:text-[#EBEBE8] hover:bg-[#111111] hover:text-white dark:hover:bg-[#EBEBE8] dark:hover:text-[#111111] transition-all duration-300 shrink-0 font-bold rounded-md cursor-pointer"
              title="Download & View Resume"
            >
              <FileText className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Resume</span>
            </a>
          </div>
        </div>
      </motion.header>

      <nav
        aria-label="Main navigation"
        className="fixed right-3 sm:right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col items-end gap-2"
      >
        {navLinks.map((link) => {
          const Icon = link.icon;
          const isActive = isLinkActive(link);
          return (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => handleNavClick(e, link)}
              aria-label={link.label}
              aria-current={isActive ? 'page' : undefined}
              title={link.label}
              className={`group relative flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-full border backdrop-blur-md shadow-sm transition-all duration-300 hover:-translate-x-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E54835] ${
                isActive
                  ? 'bg-[#E54835] border-[#E54835] text-white shadow-[0_4px_18px_rgba(229,72,53,0.28)]'
                  : 'bg-white/85 dark:bg-[#111111]/85 border-[#E2E2DE] dark:border-[#333330] text-[#666660] dark:text-[#B7B7B1] hover:text-[#E54835] hover:border-[#E54835]'
              }`}
            >
              <Icon className="w-[17px] h-[17px]" />
              <span className="pointer-events-none absolute right-[calc(100%+10px)] whitespace-nowrap rounded-md bg-[#171717] px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-white opacity-0 translate-x-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0">
                {link.label}
              </span>
            </a>
          );
        })}
      </nav>
    </div>
  );
};
