import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ScrollProgress } from './components/ScrollProgress';
import { SmoothScrollProvider } from './components/SmoothScrollProvider';
import { SectionReveal } from './components/SectionReveal';

// Pages
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { WorkPage } from './pages/WorkPage';
import { ExperiencePage } from './pages/ExperiencePage';
import { ContactPage } from './pages/ContactPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsPage } from './pages/TermsPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { AdminPortal } from './components/AdminPortal';
import { SecurityAuthModal } from './components/SecurityAuthModal';
import { PortfolioChatWidget } from './components/PortfolioChatWidget';
import { Preloader } from './components/Preloader';

import { usePortfolioStore } from './store/usePortfolioStore';

export default function App() {
  const { theme, fetchData, checkSupabaseAuth, setPageRevealed } = usePortfolioStore();
  const location = useLocation();

  // Scroll to top on route change (unless hash link)
  useEffect(() => {
    if (!location.hash) {
      window.scrollTo(0, 0);
    }
  }, [location.pathname]);

  // Sync theme class with DOM root
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }, [theme]);

  // Initial data sync and auth check
  useEffect(() => {
    fetchData();
    checkSupabaseAuth();
  }, []);

  return (
    <>
      <SmoothScrollProvider>
        {/* First-load Welcome Intro & Page Reveal Curtain */}
        <Preloader onRevealStart={() => setPageRevealed(true)} />

        <div className="min-h-screen flex flex-col justify-between selection:bg-[#111111] selection:text-white dark:selection:bg-white dark:selection:text-[#111111] relative pb-16 md:pb-0">
        {/* Global Scroll Progress Bar */}
        <ScrollProgress />

        {/* Floating / Sticky Navigation Bar */}
        <Navbar />

        {/* Global Security & Auth Modal */}
        <SecurityAuthModal />

        {/* Route views with smooth reveal wrapper (strictly in foreground at z-10) */}
        <SectionReveal className="flex-1 relative z-10">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/work" element={<WorkPage />} />
            <Route path="/projects" element={<WorkPage />} />
            <Route path="/experience" element={<ExperiencePage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/admin" element={<AdminPortal />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </SectionReveal>

        {/* Footer */}
        <Footer />
      </div>

      {/* Persistent Portfolio AI Chat Widget */}
      <PortfolioChatWidget />
    </SmoothScrollProvider>
    </>
  );
}
