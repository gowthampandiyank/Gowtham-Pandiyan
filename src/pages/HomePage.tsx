import React, { useEffect } from 'react';
import { HeroSection } from '../components/HeroSection';
import { AboutSection } from '../components/AboutSection';
import { SkillsSection } from '../components/SkillsSection';
import { ExperienceSection } from '../components/ExperienceSection';
import { WorkSection } from '../components/WorkSection';
import { ContactSection } from '../components/ContactSection';
import { Reveal } from '../components/Reveal';
import { useLocation } from 'react-router-dom';
import { smoothScrollTo } from '../components/SmoothScrollProvider';

export const HomePage: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const timer = setTimeout(() => {
        if (document.getElementById(id)) {
          smoothScrollTo(`#${id}`);
        }
      }, 120);
      return () => clearTimeout(timer);
    }
  }, [location]);

  return (
    <main className="relative z-10">
      <HeroSection />
      <Reveal>
        <AboutSection />
      </Reveal>
      <Reveal delay={0.05}>
        <SkillsSection />
      </Reveal>
      <Reveal delay={0.05}>
        <ExperienceSection />
      </Reveal>
      <Reveal delay={0.05}>
        <WorkSection limit={3} showViewAll={true} />
      </Reveal>
      <Reveal delay={0.05}>
        <ContactSection />
      </Reveal>
    </main>
  );
};

