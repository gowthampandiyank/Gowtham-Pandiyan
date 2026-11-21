import React from 'react';
import { ArrowDown, ArrowUpRight, FileText, Database } from 'lucide-react';
import { usePortfolioStore } from '../store/usePortfolioStore';
import { resolvePortfolioImage } from '../utils/imageUtils';

export const HeroSection: React.FC = () => {
  const { settings } = usePortfolioStore();

  const scrollTo = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="home"
      className="relative min-h-[86vh] flex flex-col justify-between pt-28 pb-12 md:pt-32 md:pb-16 overflow-hidden bg-white dark:bg-[#0D0D0D] border-b border-[#E2E2DE] dark:border-white/10"
    >
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10 lg:gap-14 items-center my-auto">
        <div className="md:col-span-7 flex flex-col justify-center">
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 w-fit mb-4 text-[11px] font-mono tracking-widest text-[#111111] dark:text-[#EBEBE8] uppercase bg-white dark:bg-[#141412] border border-[#E2E2DE] dark:border-white/10">
            <span className="w-2 h-2 bg-[#16A34A] inline-block shrink-0" />
            <span className="truncate">
              {settings.status_badge || 'Actively Modeling & Delivering Projects | Open to Data Analyst Roles'}
            </span>
          </div>

          <div className="mb-2">
            <h2 className="text-xs sm:text-sm font-mono tracking-widest text-[#16A34A] uppercase font-bold flex items-center gap-2">
              <span className="p-1 bg-[#16A34A]/10 text-[#16A34A] border border-[#16A34A]/25">
                <Database className="w-3.5 h-3.5" />
              </span>
              <span>DATA ANALYST &amp; BUSINESS INTELLIGENCE</span>
            </h2>
          </div>

          <div className="mb-5">
            <h1
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-[#111111] dark:text-[#EBEBE8] uppercase leading-[0.95]"
              style={{ textWrap: 'balance' }}
            >
              <span className="block">GOWTHAM</span>
              <span className="block mt-1 sm:mt-1.5 text-neutral-800 dark:text-neutral-200">PANDIYAN</span>
            </h1>
          </div>

          <p className="text-sm sm:text-base text-[#6B6B67] dark:text-[#9E9E9A] max-w-xl font-normal leading-relaxed mb-8 tracking-normal">
            Specializing in relational SQL data warehousing, business intelligence modeling, and executive Power BI dashboards.{' '}
            <span className="font-semibold text-[#111111] dark:text-neutral-300">
              SQL Pipelines / Star Schemas / Power BI / <span className="text-[#16A34A]">Statistical Modeling</span>.
            </span>
          </p>

          <div className="flex flex-wrap items-center gap-3.5">
            <button
              onClick={() => scrollTo('work')}
              className="px-6 py-3.5 bg-[#111111] dark:bg-[#EBEBE8] text-white dark:text-[#111111] text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 dark:hover:bg-white transition-colors duration-200 flex items-center gap-2 group"
            >
              <span>Explore Projects</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => scrollTo('contact')}
              className="px-5 py-3.5 border border-[#D9D9D5] dark:border-[#444440] text-[#111111] dark:text-[#EBEBE8] text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover:border-[#16A34A] hover:text-[#16A34A] transition-colors duration-200"
            >
              <span>Get in Touch</span>
            </button>

            <button
              onClick={() => window.print()}
              className="px-4 py-3.5 border border-[#D9D9D5] dark:border-[#444440] text-[#111111] dark:text-[#EBEBE8] text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover:border-[#16A34A] hover:text-[#16A34A] transition-colors duration-200"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Resume</span>
            </button>
          </div>

          <div className="mt-8 p-3.5 bg-white dark:bg-black/20 border border-[#E2E2DE] dark:border-white/10 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-mono">
            {['SQL Data Modeling', 'Power BI Intelligence', 'Python & Pandas', 'Advanced DAX', 'ETL Pipelines'].map((item) => (
              <span key={item} className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-[#16A34A] shrink-0" />
                <span className="font-semibold text-[#111111] dark:text-[#EBEBE8]">{item}</span>
              </span>
            ))}
          </div>
        </div>

        <div className="md:col-span-5 relative w-full flex justify-center md:justify-end">
          <div className="relative mx-auto md:ml-auto max-w-[290px] sm:max-w-[330px] md:max-w-[350px] lg:max-w-[390px] w-full border border-[#E2E2DE] dark:border-white/10 p-2.5 shadow-sm">
            <img
              src={resolvePortfolioImage('/src/assets/images/gowtham_portrait_1790451073382.jpg')}
              alt="Gowtham Pandiyan - Data Analyst"
              className="w-full aspect-[3/4] object-cover object-top grayscale contrast-105"
              loading="eager"
            />

            <div className="absolute top-4 left-4 text-[9px] font-mono tracking-widest text-white bg-black/70 border border-white/20 px-2 py-0.5 pointer-events-none">
              GP // DATA ANALYTICS
            </div>

            <div className="absolute bottom-4 right-4 text-[9px] font-mono tracking-widest text-white bg-black/70 border border-white/20 px-2 py-0.5 pointer-events-none">
              CHENNAI / TN
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full pt-8 flex items-center justify-between text-xs text-[#6B6B67] dark:text-[#9E9E9A]">
        <button
          onClick={() => scrollTo('about')}
          className="flex items-center gap-2 hover:text-[#16A34A] transition-colors focus:outline-none"
        >
          <span className="font-mono uppercase tracking-widest text-[10px]">Scroll to explore</span>
          <ArrowDown className="w-3.5 h-3.5 text-[#16A34A]" />
        </button>

        <div className="font-mono text-[10px] tabular-nums">LOC: 13.0827° N, 80.2707° E</div>
      </div>
    </section>
  );
};
