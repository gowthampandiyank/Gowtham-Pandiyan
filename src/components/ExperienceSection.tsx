import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  FileText,
  Download,
  Eye,
  X,
  Check,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Database,
  BarChart2,
  Workflow
} from 'lucide-react';
import { usePortfolioStore } from '../store/usePortfolioStore';
import { ExperienceItem, ExperienceWorkHighlight, AttachedFile } from '../types';
import expBiAnalystBg from '../assets/images/exp_bi_analyst_bg_1795281654732.jpg';
import expEtlPipelineBg from '../assets/images/exp_etl_pipeline_bg_1795281656584.jpg';
import expWarehouseOpsBg from '../assets/images/exp_warehouse_ops_bg_1795281655493.jpg';

interface ExperienceSectionProps {
  initialSkillFilter?: string | null;
}

const BUILTIN_BG_MAP: Record<string, string> = {
  '/src/assets/images/exp_bi_analyst_bg_1795281654732.jpg': expBiAnalystBg,
  '/src/assets/images/exp_etl_pipeline_bg_1795281656584.jpg': expEtlPipelineBg,
  '/src/assets/images/exp_warehouse_ops_bg_1795281655493.jpg': expWarehouseOpsBg,
};

const FALLBACK_BACKGROUNDS = [expBiAnalystBg, expEtlPipelineBg, expWarehouseOpsBg];

function resolveExperienceBackground(exp: ExperienceItem, index: number): string {
  if (exp.background_image) {
    if (BUILTIN_BG_MAP[exp.background_image]) {
      return BUILTIN_BG_MAP[exp.background_image];
    }
    if (exp.background_image.startsWith('data:') || exp.background_image.startsWith('http') || exp.background_image.startsWith('/')) {
      return exp.background_image;
    }
  }

  const text = `${exp.job_title} ${exp.company} ${exp.skills?.join(' ') || ''}`.toLowerCase();
  if (text.includes('junior') || text.includes('etl') || text.includes('python') || text.includes('eda')) {
    return expEtlPipelineBg;
  }
  if (text.includes('warehouse') || text.includes('infrastructure') || text.includes('architect')) {
    return expWarehouseOpsBg;
  }
  return FALLBACK_BACKGROUNDS[index % FALLBACK_BACKGROUNDS.length];
}

function resolveExperienceHeadline(exp: ExperienceItem): string {
  if (exp.summary_headline && exp.summary_headline.trim().length > 0) {
    return exp.summary_headline;
  }
  const text = `${exp.job_title} ${exp.description}`.toLowerCase();
  if (exp.id === 'exp-1' || text.includes('star-schema') || text.includes('forte')) {
    return 'Building PostgreSQL star-schema warehouses & executive Power BI dashboards.';
  }
  if (exp.id === 'exp-2' || text.includes('multi-million') || text.includes('power query')) {
    return 'Automating multi-million record ETL workflows, EDA, and KPI scorecards.';
  }
  const firstSentence = exp.description.split(/[.!?]/)[0]?.trim();
  return firstSentence ? `${firstSentence}.` : `${exp.job_title} at ${exp.company}`;
}

function resolveExperienceHighlights(exp: ExperienceItem): ExperienceWorkHighlight[] {
  if (exp.work_highlights && exp.work_highlights.length > 0) {
    return exp.work_highlights.slice(0, 3);
  }

  const text = `${exp.job_title} ${exp.description}`.toLowerCase();
  if (exp.id === 'exp-1' || text.includes('star-schema') || text.includes('forte')) {
    return [
      { area: 'SQL Data Modeling', outcome: 'Star-schema PostgreSQL warehouses' },
      { area: 'Power BI & DAX', outcome: 'Executive KPI dashboards & measures' },
      { area: 'Automated Reporting', outcome: 'Decision-ready recurring pipelines' },
    ];
  }
  if (exp.id === 'exp-2' || text.includes('multi-million') || text.includes('power query')) {
    return [
      { area: 'Large-Scale EDA', outcome: 'Multi-million record SQL & Python analysis' },
      { area: 'Excel & Power Query', outcome: 'Automated data ingestion pipelines' },
      { area: 'Performance Scorecards', outcome: 'Executive visual reporting suites' },
    ];
  }

  const topSkills = exp.skills && exp.skills.length > 0 ? exp.skills : ['SQL Analytics', 'BI Dashboards', 'Data Pipelines'];
  return [
    { area: topSkills[0] || 'Data Engineering', outcome: 'Core analytical workflows' },
    { area: topSkills[1] || 'BI Reporting', outcome: 'Executive visual insights' },
    { area: topSkills[2] || 'Automation', outcome: 'Verified KPI delivery' },
  ];
}

export const ExperienceSection: React.FC<ExperienceSectionProps> = ({
  initialSkillFilter = null,
}) => {
  const { experience, setCursor, resetCursor, theme } = usePortfolioStore();
  const isDark = theme === 'dark';
  const [selectedExpFiles, setSelectedExpFiles] = useState<ExperienceItem | null>(null);
  const [previewFile, setPreviewFile] = useState<AttachedFile | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<string | null>(initialSkillFilter);
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});
  const [failedBgIds, setFailedBgIds] = useState<Record<string, boolean>>({});
  const shouldReduceMotion = useReducedMotion();

  const handleDownload = (file: AttachedFile) => {
    if (file.url.startsWith('data:')) {
      const a = document.createElement('a');
      a.href = file.url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      const blob = new Blob([`${file.name}\nType: ${file.type}\nSize: ${file.size}`], {
        type: 'text/plain;charset=utf-8;',
      });
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = `${file.name}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    }
  };

  const handleSkillToggle = (skillName: string) => {
    if (selectedSkill?.toLowerCase().trim() === skillName.toLowerCase().trim()) {
      setSelectedSkill(null);
    } else {
      setSelectedSkill(skillName.trim());
      const timelineEl = document.getElementById('experience-timeline-container');
      if (timelineEl) {
        timelineEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  };

  const toggleExpandDetails = (id: string) => {
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const matchingExperiences = experience.filter((exp) => {
    if (!selectedSkill) return true;
    return exp.skills?.some(
      (s) => s.toLowerCase().trim() === selectedSkill.toLowerCase().trim()
    );
  });

  const highlightIcons = [Database, BarChart2, Workflow];

  return (
    <section
      id="experience"
      className="py-28 md:py-36 bg-[#FFFFFF] dark:bg-[#111111] border-b border-[#E2E2DE] dark:border-[#262624] relative z-10"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-8 border-b border-[#E2E2DE] dark:border-[#262624]">
          <div>
            <span className="text-xs font-mono tracking-widest text-[#E54835] uppercase mb-2 block font-bold">
              03. Career Timeline
            </span>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-[#111111] dark:text-[#EBEBE8] uppercase">
              Experience
            </h2>
          </div>
          <p className="mt-4 md:mt-0 text-xs sm:text-sm font-mono text-[#6B6B67] dark:text-[#9E9E9A] max-w-sm md:text-right">
            At-a-glance overview of data modeling, BI dashboards, and SQL pipeline engagements.
          </p>
        </div>

        {/* Active Filter Notification Bar */}
        <div id="experience-timeline-container" className="pt-2">
          {selectedSkill && (
            <div className="mb-8 p-4 bg-[#F9F9F7] dark:bg-[#181816] border border-[#E54835]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-[#111111] dark:text-[#EBEBE8]">
                  Filtering Timeline by Skill: <strong className="text-[#E54835] uppercase tracking-wider font-bold">{selectedSkill}</strong>
                  <span className="text-[#6B6B67] dark:text-[#9E9E9A] ml-2">
                    ({matchingExperiences.length} of {experience.length} roles match)
                  </span>
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedSkill(null)}
                className="self-start sm:self-auto px-3 py-1.5 text-xs font-mono font-bold uppercase rounded-none border border-[#E2E2DE] dark:border-[#262624] bg-white dark:bg-[#20201E] text-[#111111] dark:text-white hover:text-[#E54835] dark:hover:text-[#E54835] hover:border-[#E54835] transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Show All Roles</span>
              </button>
            </div>
          )}
        </div>

        {/* Experience Timeline */}
        <div className="relative border-l border-[#E2E2DE] dark:border-[#262624] ml-3 md:ml-6 pl-8 md:pl-14 space-y-10">
          {experience.map((exp, index) => {
            const hasFiles = exp.files && exp.files.length > 0;
            const isMatch =
              !selectedSkill ||
              exp.skills?.some(
                (s) => s.toLowerCase().trim() === selectedSkill.toLowerCase().trim()
              );
            const isFilterActive = Boolean(selectedSkill);
            const isExpanded = Boolean(expandedIds[exp.id]);
            const bgSrc = resolveExperienceBackground(exp, index);
            const bgFailed = Boolean(failedBgIds[exp.id]);
            const headline = resolveExperienceHeadline(exp);
            const highlights = resolveExperienceHighlights(exp);
            const hoverGlow = isDark ? 'rgba(229, 72, 53, 0.22)' : 'rgba(229, 72, 53, 0.14)';

            return (
              <motion.article
                key={exp.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                whileHover={
                  shouldReduceMotion
                    ? undefined
                    : {
                        y: isFilterActive && !isMatch ? 0 : -3,
                        boxShadow: `0 14px 30px -8px ${hoverGlow}, 0 0 14px 2px ${hoverGlow}`,
                        transition: { type: 'spring', stiffness: 350, damping: 25 },
                      }
                }
                onMouseEnter={() =>
                  setCursor({
                    label: isFilterActive ? (isMatch ? 'MATCH' : 'ROLE') : 'ROLE',
                    type: 'explore',
                  })
                }
                onMouseLeave={resetCursor}
                className={`relative group rounded-none overflow-hidden transition-all duration-300 ${
                  isFilterActive && !isMatch
                    ? 'opacity-35 grayscale-[60%] scale-[0.99] border border-[#E2E2DE] dark:border-[#222220]'
                    : isFilterActive && isMatch
                    ? 'opacity-100 border-2 border-[#E54835] shadow-lg shadow-[#E54835]/10 ring-2 ring-[#E54835]/30'
                    : 'border border-[#E2E2DE] dark:border-[#262624] shadow-xs hover:border-[#E54835]/50 dark:hover:border-[#E54835]/50'
                }`}
              >
                {/* Timeline Square Node */}
                <div
                  className={`absolute -left-[45px] md:-left-[69px] top-8 w-3.5 h-3.5 rounded-none transition-all z-20 ${
                    isFilterActive && isMatch
                      ? 'bg-[#E54835] border-2 border-[#E54835] ring-4 ring-[#E54835]/35 scale-125'
                      : isFilterActive && !isMatch
                      ? 'bg-transparent border-2 border-[#888884] dark:border-[#444440] opacity-40'
                      : 'bg-white dark:bg-[#0D0D0D] border-2 border-[#E54835] group-hover:bg-[#E54835]'
                  }`}
                />

                {/* Full-Bleed Relevant Blurred Background Image Layer */}
                <div className="absolute inset-0 z-0 overflow-hidden bg-[#F2F2EE] dark:bg-[#161614]">
                  {!bgFailed ? (
                    <img
                      src={bgSrc}
                      alt={`${exp.job_title} workspace backdrop`}
                      referrerPolicy="no-referrer"
                      onError={() =>
                        setFailedBgIds((prev) => ({ ...prev, [exp.id]: true }))
                      }
                      className="w-full h-full object-cover object-center blur-[3px] scale-105 opacity-45 dark:opacity-55 transition-all duration-500 group-hover:blur-[1.5px] group-hover:scale-[1.03] group-hover:opacity-60 dark:group-hover:opacity-70"
                    />
                  ) : (
                    <div
                      className="w-full h-full"
                      style={{
                        background: isDark
                          ? 'radial-gradient(circle at 80% 20%, rgba(229,72,53,0.16), transparent 60%), linear-gradient(135deg, #181816 0%, #10100E 100%)'
                          : 'radial-gradient(circle at 80% 20%, rgba(229,72,53,0.10), transparent 60%), linear-gradient(135deg, #F5F5F2 0%, #EAEAE4 100%)',
                      }}
                    />
                  )}

                  {/* Measured Contrast Scrim for 7:1+ Legibility */}
                  <div
                    className="absolute inset-0 bg-gradient-to-br from-[#FBFBFA]/92 via-[#F9F9F7]/84 to-[#F2F2EE]/76 dark:from-[#121210]/90 dark:via-[#151513]/82 dark:to-[#0E0E0C]/74 backdrop-blur-[2px]"
                  />
                </div>

                {/* Foreground Content */}
                <div className="relative z-10 p-6 md:p-8">
                  {/* Match Banner when filter active */}
                  {isFilterActive && (
                    <div className="mb-3 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5">
                      {isMatch ? (
                        <span className="text-[#E54835] flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5" />
                          <span>Matches Skill: {selectedSkill}</span>
                        </span>
                      ) : (
                        <span className="text-[#6B6B67] dark:text-[#9E9E9A]">
                          Not tagged with {selectedSkill}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Role Header */}
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-3 mb-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs font-mono text-[#6B6B67] dark:text-[#A5A5A0] mb-1.5">
                        <span className="font-bold text-[#E54835]">{exp.company}</span>
                        <span aria-hidden="true">·</span>
                        <span className="tabular-nums font-semibold text-[#111111] dark:text-[#D5D5D0]">
                          {exp.start_date} – {exp.end_date}
                        </span>
                      </div>
                      <h3 className="text-xl md:text-2xl font-black tracking-tight text-[#111111] dark:text-[#EBEBE8] group-hover:text-[#E54835] transition-colors">
                        {exp.job_title}
                      </h3>
                    </div>

                    {hasFiles && (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedExpFiles(exp);
                          setPreviewFile(null);
                        }}
                        className="self-start inline-flex items-center gap-2 px-3 py-1.5 text-xs font-mono font-bold uppercase rounded-none border border-[#D4D4CE] dark:border-[#32322E] bg-white/85 dark:bg-[#1A1A18]/85 text-[#111111] dark:text-white hover:bg-[#111111] hover:text-white dark:hover:bg-white dark:hover:text-[#111111] transition-colors shrink-0 cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>{exp.files!.length} Deliverables</span>
                      </button>
                    )}
                  </div>

                  {/* Instant 1-Line Focus Summary */}
                  <p className="text-sm md:text-base font-medium text-[#2A2A27] dark:text-[#D5D5D0] mb-6 max-w-3xl">
                    {headline}
                  </p>

                  {/* Visual "What I Do" 3-Block Scannable Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
                    {highlights.map((item, hIdx) => {
                      const IconComp = highlightIcons[hIdx % highlightIcons.length];
                      return (
                        <div
                          key={hIdx}
                          className="p-4 bg-white/80 dark:bg-[#181816]/85 border border-[#D9D9D3] dark:border-[#2C2C28] backdrop-blur-sm flex items-start gap-3"
                        >
                          <div className="p-2 bg-[#F5F5F2] dark:bg-[#22221F] border border-[#E2E2DE] dark:border-[#30302C] text-[#E54835] shrink-0">
                            <IconComp className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-mono font-bold text-[#111111] dark:text-[#EBEBE8] uppercase tracking-wide">
                              {item.area}
                            </div>
                            <div className="text-xs text-[#555551] dark:text-[#A5A5A0] mt-0.5 leading-snug">
                              {item.outcome}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Optional Expandable Full Description */}
                  {isExpanded && (
                    <div className="mb-5 p-4 bg-white/75 dark:bg-[#181816]/80 border border-[#E2E2DE] dark:border-[#262624] text-xs sm:text-sm text-[#4A4A46] dark:text-[#B5B5B0] leading-relaxed max-w-3xl">
                      {exp.description}
                    </div>
                  )}

                  {/* Footer Row: Clickable Stack Filters + Optional Details Toggle */}
                  <div className="pt-4 border-t border-[#D9D9D3]/80 dark:border-[#2A2A26] flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {exp.skills && exp.skills.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[11px] font-mono font-bold text-[#E54835] mr-1.5 whitespace-nowrap">
                          Stack:
                        </span>
                        {exp.skills.map((skill) => {
                          const isThisSkillSelected =
                            selectedSkill?.toLowerCase().trim() ===
                            skill.toLowerCase().trim();

                          return (
                            <button
                              key={skill}
                              type="button"
                              onClick={() => handleSkillToggle(skill)}
                              className={`px-2.5 py-1 text-[11px] font-mono tracking-wider uppercase transition-all duration-150 rounded-none border select-none whitespace-nowrap shrink-0 cursor-pointer ${
                                isThisSkillSelected
                                  ? 'bg-[#E54835] text-white border-[#E54835] font-bold shadow-xs'
                                  : 'bg-white/85 dark:bg-[#1E1E1B]/90 text-[#444440] dark:text-[#B5B5B0] border-[#D9D9D3] dark:border-[#2C2C28] hover:border-[#E54835] hover:text-[#E54835] dark:hover:border-[#E54835] dark:hover:text-[#E54835]'
                              }`}
                              title={`Filter timeline by ${skill}`}
                            >
                              <span>{skill}</span>
                              {isThisSkillSelected && (
                                <Check className="w-3 h-3 inline-block ml-1" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => toggleExpandDetails(exp.id)}
                      className="self-start lg:self-auto inline-flex items-center gap-1.5 text-[11px] font-mono font-bold uppercase tracking-wider text-[#555551] dark:text-[#9E9E9A] hover:text-[#E54835] dark:hover:text-[#E54835] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      <span>{isExpanded ? 'Hide Full Details' : 'Read Full Details'}</span>
                      {isExpanded ? (
                        <ChevronUp className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>

      {/* Deliverables Modal */}
      {selectedExpFiles && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div
            data-lenis-prevent
            className="w-full max-w-xl bg-white dark:bg-[#141412] p-6 md:p-8 shadow-2xl rounded-none max-h-[85vh] overflow-y-auto border border-[#D9D9D5] dark:border-[#262624]"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E2DE] dark:border-[#262624] mb-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#E54835] font-bold">
                  Experience Deliverables &amp; Records
                </span>
                <h4 className="font-bold text-base uppercase text-[#111111] dark:text-[#EBEBE8]">
                  {selectedExpFiles.job_title} at {selectedExpFiles.company}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedExpFiles(null);
                  setPreviewFile(null);
                }}
                className="p-1 text-[#737373] hover:text-[#111111] dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {previewFile && (
              <div className="mb-4 border border-[#E54835]/50 bg-[#F9F9F7] dark:bg-[#0D0D0D] p-4">
                <div className="flex items-center justify-between gap-2 pb-2 mb-3 border-b border-[#E2E2DE] dark:border-[#262624]">
                  <span className="text-xs font-mono font-bold text-[#111111] dark:text-[#EBEBE8] truncate">
                    {previewFile.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => setPreviewFile(null)}
                    className="text-xs font-mono uppercase text-[#E54835] hover:underline cursor-pointer"
                  >
                    Close Preview
                  </button>
                </div>
                {previewFile.url.startsWith('data:image/') ? (
                  <img
                    src={previewFile.url}
                    alt={previewFile.name}
                    referrerPolicy="no-referrer"
                    className="max-h-60 mx-auto object-contain"
                  />
                ) : previewFile.url.startsWith('data:application/pdf') ? (
                  <iframe
                    src={previewFile.url}
                    title={previewFile.name}
                    className="w-full h-60 border-0"
                  />
                ) : (
                  <div className="text-xs font-mono text-[#555551] dark:text-[#A5A5A0]">
                    File: {previewFile.name} ({previewFile.type.toUpperCase()} · {previewFile.size})
                  </div>
                )}
              </div>
            )}

            <div className="space-y-3">
              {selectedExpFiles.files?.map((file, idx) => (
                <div
                  key={file.id || `exp-file-${file.name}-${idx}`}
                  className="p-3.5 bg-[#F5F5F3] dark:bg-[#181816] border border-[#E2E2DE] dark:border-[#262624] rounded-none flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-none bg-[#E54835]/10 border border-[#E54835]/30 flex items-center justify-center shrink-0 text-[#E54835]">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold font-mono text-[#111111] dark:text-[#EBEBE8] truncate">
                        {file.name}
                      </div>
                      <div className="text-[10px] font-mono text-[#6B6B67] dark:text-[#9E9E9A]">
                        {file.type.toUpperCase()} · {file.size}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => setPreviewFile(file)}
                      className="px-3 py-1.5 border border-[#111111] dark:border-[#EBEBE8] text-[#111111] dark:text-[#EBEBE8] hover:border-[#E54835] hover:text-[#E54835] text-xs font-mono font-bold uppercase rounded-none flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDownload(file)}
                      className="px-3 py-1.5 bg-[#111111] dark:bg-[#EBEBE8] text-white dark:text-[#111111] hover:bg-[#E54835] dark:hover:bg-[#E54835] dark:hover:text-white text-xs font-mono font-bold uppercase rounded-none flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-[#E2E2DE] dark:border-[#262624] flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setSelectedExpFiles(null);
                  setPreviewFile(null);
                }}
                className="px-5 py-2 text-xs font-bold uppercase rounded-none border border-[#D9D9D5] dark:border-[#262624] bg-[#F5F5F3] dark:bg-[#181816] text-[#111111] dark:text-white hover:bg-[#111111] hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
