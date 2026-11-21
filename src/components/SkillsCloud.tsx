import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, Search, X, RotateCcw, Check, Sparkles, Layers, Cpu } from 'lucide-react';
import { usePortfolioStore } from '../store/usePortfolioStore';

export type SkillCategoryFilter = 'All' | 'Databases & SQL' | 'BI & Visualization' | 'Python & ETL' | 'Data Modeling & KPIs';

export interface SkillCloudItem {
  name: string;
  count: number;
  category: SkillCategoryFilter;
}

interface SkillsCloudProps {
  selectedSkill: string | null;
  onSelectSkill: (skill: string | null) => void;
  className?: string;
  embedded?: boolean;
}

export const SkillsCloud: React.FC<SkillsCloudProps> = ({
  selectedSkill,
  onSelectSkill,
  className = '',
  embedded = false,
}) => {
  const { experience, theme, setCursor, resetCursor } = usePortfolioStore();
  const isDark = theme === 'dark';

  const [activeCategory, setActiveCategory] = useState<SkillCategoryFilter>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Extract all distinct skills across experience entries and calculate occurrence count
  const { allSkills, categoryCounts } = useMemo(() => {
    const countsMap = new Map<string, number>();
    const categorizedSkills: SkillCloudItem[] = [];

    // Helper to categorize skills accurately
    const categorizeSkill = (name: string): SkillCategoryFilter => {
      const lower = name.toLowerCase();
      if (
        lower.includes('sql') ||
        lower.includes('postgres') ||
        lower.includes('mysql') ||
        lower.includes('database') ||
        lower.includes('warehouse') ||
        lower.includes('snowflake')
      ) {
        return 'Databases & SQL';
      }
      if (
        lower.includes('power bi') ||
        lower.includes('tableau') ||
        lower.includes('dashboard') ||
        lower.includes('visual') ||
        lower.includes('reporting')
      ) {
        return 'BI & Visualization';
      }
      if (
        lower.includes('python') ||
        lower.includes('pandas') ||
        lower.includes('etl') ||
        lower.includes('pipeline') ||
        lower.includes('query')
      ) {
        return 'Python & ETL';
      }
      if (
        lower.includes('dax') ||
        lower.includes('excel') ||
        lower.includes('model') ||
        lower.includes('kpi') ||
        lower.includes('star') ||
        lower.includes('schema')
      ) {
        return 'Data Modeling & KPIs';
      }
      return 'Databases & SQL';
    };

    experience.forEach((exp) => {
      if (exp.skills && Array.isArray(exp.skills)) {
        exp.skills.forEach((s) => {
          const trimmed = s.trim();
          if (trimmed) {
            countsMap.set(trimmed, (countsMap.get(trimmed) || 0) + 1);
          }
        });
      }
    });

    countsMap.forEach((count, name) => {
      categorizedSkills.push({
        name,
        count,
        category: categorizeSkill(name),
      });
    });

    // Sort by role frequency descending, then alphabetically
    categorizedSkills.sort((a, b) => {
      if (b.count !== a.count) return b.count - a.count;
      return a.name.localeCompare(b.name);
    });

    const catCounts: Record<string, number> = {
      All: categorizedSkills.length,
      'Databases & SQL': categorizedSkills.filter((s) => s.category === 'Databases & SQL').length,
      'BI & Visualization': categorizedSkills.filter((s) => s.category === 'BI & Visualization').length,
      'Python & ETL': categorizedSkills.filter((s) => s.category === 'Python & ETL').length,
      'Data Modeling & KPIs': categorizedSkills.filter((s) => s.category === 'Data Modeling & KPIs').length,
    };

    return { allSkills: categorizedSkills, categoryCounts: catCounts };
  }, [experience]);

  // Filter skills by category and search text
  const filteredSkills = useMemo(() => {
    return allSkills.filter((skill) => {
      const matchesCategory =
        activeCategory === 'All' || skill.category === activeCategory;
      const matchesSearch =
        searchQuery === '' ||
        skill.name.toLowerCase().includes(searchQuery.toLowerCase().trim());
      return matchesCategory && matchesSearch;
    });
  }, [allSkills, activeCategory, searchQuery]);

  // Compute matching experiences count for the selected skill
  const matchingExperiencesCount = useMemo(() => {
    if (!selectedSkill) return experience.length;
    return experience.filter((exp) =>
      exp.skills?.some(
        (s) => s.toLowerCase().trim() === selectedSkill.toLowerCase().trim()
      )
    ).length;
  }, [experience, selectedSkill]);

  const categories: SkillCategoryFilter[] = [
    'All',
    'Databases & SQL',
    'BI & Visualization',
    'Python & ETL',
    'Data Modeling & KPIs',
  ];

  const handleTagClick = (skillName: string) => {
    if (selectedSkill?.toLowerCase() === skillName.toLowerCase()) {
      onSelectSkill(null); // Toggle off
    } else {
      onSelectSkill(skillName);
      // Smooth scroll towards timeline cards on mobile or when embedded
      const timelineTarget = document.getElementById('experience-timeline-container');
      if (timelineTarget && !embedded) {
        timelineTarget.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  };

  const handleReset = () => {
    onSelectSkill(null);
    setSearchQuery('');
    setActiveCategory('All');
  };

  return (
    <div
      className={`bg-[#FFFFFF] dark:bg-[#151513] border border-[#E2E2DE] dark:border-[#262624] p-6 md:p-8 rounded-none transition-colors ${className}`}
    >
      {/* Cloud Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-[#E2E2DE] dark:border-[#262624]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-none bg-[#E54835]/10 border border-[#E54835]/30 flex items-center justify-center text-[#E54835]">
            <Filter className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold tracking-wider uppercase text-[#111111] dark:text-[#EBEBE8] font-mono">
                Interactive Skills Cloud
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 bg-[#F4F4F2] dark:bg-[#20201E] border border-[#E2E2DE] dark:border-[#262624] text-[#6B6B67] dark:text-[#9E9E9A]">
                {allSkills.length} Technologies
              </span>
            </div>
            <p className="text-xs font-mono text-[#6B6B67] dark:text-[#9E9E9A] mt-0.5">
              Click any technology to filter and highlight matching career engagements in the timeline below.
            </p>
          </div>
        </div>

        {/* Search Input & Reset Button */}
        <div className="flex items-center gap-2">
          <div className="relative min-w-[180px] sm:min-w-[220px]">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#6B6B67] dark:text-[#9E9E9A]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search stack..."
              className="w-full pl-8 pr-7 py-1.5 text-xs font-mono bg-[#F9F9F7] dark:bg-[#1A1A18] border border-[#E2E2DE] dark:border-[#262624] text-[#111111] dark:text-[#EBEBE8] placeholder-[#9E9E9A] focus:outline-none focus:border-[#E54835] rounded-none transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#9E9E9A] hover:text-[#111111] dark:hover:text-white"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {(selectedSkill || searchQuery || activeCategory !== 'All') && (
            <button
              type="button"
              onClick={handleReset}
              className="px-3 py-1.5 text-xs font-mono font-bold uppercase tracking-wider rounded-none border border-[#E2E2DE] dark:border-[#262624] bg-white dark:bg-[#1E1E1C] text-[#6B6B67] dark:text-[#9E9E9A] hover:text-[#E54835] hover:border-[#E54835] dark:hover:text-[#E54835] transition-colors flex items-center gap-1.5 shrink-0"
              title="Reset all filters"
            >
              <RotateCcw className="w-3 h-3" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Domain Category Filter Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 py-4 border-b border-[#E2E2DE] dark:border-[#262624]">
        {categories.map((cat) => {
          const isActive = activeCategory === cat;
          const count = categoryCounts[cat] || 0;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1 text-[11px] font-mono tracking-wider uppercase transition-all rounded-none flex items-center gap-1.5 border ${
                isActive
                  ? 'bg-[#111111] dark:bg-white text-white dark:text-[#111111] border-[#111111] dark:border-white font-bold'
                  : 'bg-transparent text-[#6B6B67] dark:text-[#9E9E9A] border-transparent hover:border-[#E2E2DE] dark:hover:border-[#262624] hover:text-[#111111] dark:hover:text-white'
              }`}
            >
              <span>{cat}</span>
              <span
                className={`text-[9px] px-1 py-0.2 rounded-none ${
                  isActive
                    ? 'bg-white/20 dark:bg-black/20 text-white dark:text-black'
                    : 'text-[#9E9E9A]'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Skills Cloud Tags Canvas */}
      <div className="pt-6">
        {filteredSkills.length === 0 ? (
          <div className="py-8 text-center text-xs font-mono text-[#6B6B67] dark:text-[#9E9E9A]">
            No skills match query "{searchQuery}" in category "{activeCategory}".
            <button
              type="button"
              onClick={handleReset}
              className="ml-2 text-[#E54835] underline hover:no-underline font-bold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-2 md:gap-2.5">
            {filteredSkills.map((skill) => {
              const isSelected =
                selectedSkill?.toLowerCase() === skill.name.toLowerCase();

              // Domain category subtle accent border/badge
              let categoryDot = 'bg-[#6B6B67]';
              if (skill.category === 'Databases & SQL') categoryDot = 'bg-blue-500';
              if (skill.category === 'BI & Visualization') categoryDot = 'bg-amber-500';
              if (skill.category === 'Python & ETL') categoryDot = 'bg-emerald-500';
              if (skill.category === 'Data Modeling & KPIs') categoryDot = 'bg-[#E54835]';

              // Visual weight based on frequency of roles using this skill
              const isMultiRole = skill.count > 1;

              return (
                <button
                  key={skill.name}
                  type="button"
                  onClick={() => handleTagClick(skill.name)}
                  onMouseEnter={() =>
                    setCursor({
                      label: isSelected ? 'CLEAR' : 'FILTER',
                      type: 'explore',
                    })
                  }
                  onMouseLeave={resetCursor}
                  className={`group relative inline-flex items-center gap-2 px-3.5 py-2 text-xs font-mono tracking-wider uppercase transition-all duration-200 rounded-none border select-none ${
                    isSelected
                      ? 'bg-[#E54835] text-white border-[#E54835] shadow-md shadow-[#E54835]/25 font-bold translate-y-[-1px]'
                      : isMultiRole
                      ? 'bg-[#F9F9F7] dark:bg-[#1A1A18] text-[#111111] dark:text-[#EBEBE8] border-[#D9D9D5] dark:border-[#333330] hover:border-[#E54835] dark:hover:border-[#E54835] font-semibold hover:-translate-y-0.5'
                      : 'bg-white dark:bg-[#161614] text-[#6B6B67] dark:text-[#9E9E9A] border-[#E2E2DE] dark:border-[#262624] hover:border-[#111111] dark:hover:border-white hover:text-[#111111] dark:hover:text-white hover:-translate-y-0.5'
                  }`}
                >
                  {/* Category Accent Indicator */}
                  <span
                    className={`w-1.5 h-1.5 rounded-none shrink-0 ${
                      isSelected ? 'bg-white' : categoryDot
                    }`}
                  />

                  {/* Skill Name */}
                  <span>{skill.name}</span>

                  {/* Occurrence badge: shows how many career roles apply this skill */}
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.2 rounded-none border ${
                      isSelected
                        ? 'bg-black/20 text-white border-white/30'
                        : isMultiRole
                        ? 'bg-white dark:bg-[#20201E] text-[#111111] dark:text-white border-[#E2E2DE] dark:border-[#262624]'
                        : 'bg-[#F4F4F2] dark:bg-[#1D1D1B] text-[#888884] dark:text-[#7A7A76] border-transparent'
                    }`}
                  >
                    {skill.count} {skill.count === 1 ? 'ROLE' : 'ROLES'}
                  </span>

                  {/* Active selection tick */}
                  {isSelected && (
                    <Check className="w-3 h-3 text-white ml-0.5" />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Active Filter State Banner */}
      <AnimatePresence>
        {selectedSkill && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: 'auto', marginTop: 20 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-3.5 bg-[#E54835]/10 dark:bg-[#E54835]/15 border border-[#E54835]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-none bg-[#E54835] animate-pulse" />
                <span className="text-[#111111] dark:text-white">
                  Active Filter: <strong className="text-[#E54835] uppercase font-bold tracking-wider">[{selectedSkill}]</strong>
                </span>
                <span className="text-[#6B6B67] dark:text-[#9E9E9A]">
                  — Highlighting <strong>{matchingExperiencesCount}</strong> of <strong>{experience.length}</strong> roles
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onSelectSkill(null)}
                  className="px-3 py-1 bg-white dark:bg-[#1E1E1C] border border-[#E54835]/50 text-[#E54835] hover:bg-[#E54835] hover:text-white text-xs font-bold uppercase rounded-none transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <X className="w-3 h-3" />
                  <span>Clear Filter</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
