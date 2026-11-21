import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MessageSquare, X, ArrowUp, RotateCcw, Sparkles, AlertCircle } from 'lucide-react';
import { usePortfolioStore } from '../store/usePortfolioStore';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const STARTER_PROMPTS = [
  'What are Gowtham’s top analytics projects?',
  'Summarize his work experience',
  'Which SQL & Power BI skills does he use?',
  'Tell me about the Supply Chain project',
];

const INITIAL_GREETING: ChatMessage = {
  id: 'welcome-msg',
  role: 'assistant',
  content:
    'Ask me about Gowtham’s data analytics projects, SQL & Power BI stack, measurable project outcomes, or work experience.',
};

export const PortfolioChatWidget: React.FC = () => {
  const { projects, experience, skills, settings } = usePortfolioStore();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_GREETING]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [lastFailedPrompt, setLastFailedPrompt] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      const timer = window.setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
      return () => window.clearTimeout(timer);
    }
  }, [isOpen, messages.length, isLoading]);

  const buildPortfolioContext = () => ({
    owner: {
      name: settings.name,
      title: settings.professional_title,
      bio: settings.bio,
      secondaryBio: settings.secondary_bio,
      location: settings.location,
      email: settings.email,
      linkedin: settings.linkedin,
      github: settings.github,
      status: settings.status_badge,
    },
    projects: projects.map((p) => ({
      title: p.title,
      category: p.category,
      description: p.description,
      longDescription: p.long_description,
      technologies: p.technologies,
      architecture: p.architecture,
      metrics: p.metrics,
      keyFeatures: p.key_features,
    })),
    experience: experience.map((e) => ({
      company: e.company,
      jobTitle: e.job_title,
      startDate: e.start_date,
      endDate: e.end_date,
      description: e.description,
      skills: e.skills,
    })),
    skills: skills.map((s) => ({
      name: s.name,
      category: s.category,
      proficiencyLevel: s.proficiency_level,
    })),
  });

  const sendMessage = async (rawText: string, isRetry = false) => {
    const trimmed = rawText.trim();
    if (!trimmed || isLoading) return;

    setErrorMsg(null);
    setLastFailedPrompt(null);

    let updatedHistory = messages;
    if (!isRetry) {
      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: trimmed,
      };
      updatedHistory = [...messages, userMsg];
      setMessages(updatedHistory);
      setInput('');
    }

    setIsLoading(true);

    try {
      const apiMessages = updatedHistory
        .filter((m) => m.id !== INITIAL_GREETING.id)
        .map((m) => ({
          role: m.role,
          content: m.content,
        }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: apiMessages,
          portfolioContext: buildPortfolioContext(),
        }),
      });

      const contentType = res.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        throw new Error(
          'AI backend (/api/chat) is not responding with JSON on this host. Ensure the full-stack Node/Express server is running.'
        );
      }

      const data = (await res.json().catch(() => ({}))) as {
        reply?: string;
        error?: string;
      };

      if (!res.ok || !data.reply) {
        throw new Error(data.error || `Request failed with status ${res.status}`);
      }

      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.reply,
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: unknown) {
      const message =
        err instanceof Error && err.message
          ? err.message
          : 'Unable to reach the portfolio assistant right now.';
      setErrorMsg(message);
      setLastFailedPrompt(trimmed);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void sendMessage(input);
  };

  const handleReset = () => {
    setMessages([INITIAL_GREETING]);
    setErrorMsg(null);
    setLastFailedPrompt(null);
    setInput('');
    inputRef.current?.focus();
  };

  const hasUserMessages = messages.some((m) => m.role === 'user');

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-50 flex flex-col items-end">
      <AnimatePresence mode="wait">
        {isOpen ? (
          <motion.div
            key="chat-panel"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            role="dialog"
            aria-label="Portfolio AI Assistant"
            className="w-[calc(100vw-2rem)] sm:w-[370px] h-[470px] max-h-[calc(100dvh-7.5rem)] flex flex-col bg-[#FBFBFA] dark:bg-[#111110] text-[#121212] dark:text-[#EBEBE8] border border-[#121212]/25 dark:border-[#333330] shadow-[0_24px_60px_rgba(0,0,0,0.16)] dark:shadow-[0_24px_60px_rgba(0,0,0,0.65)]"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#E2E2DE] dark:border-[#262624] bg-white dark:bg-[#161614]">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="w-2 h-2 bg-[#E54835] shrink-0" />
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[#121212] dark:text-white truncate">
                      Portfolio AI
                    </span>
                    <Sparkles className="w-3 h-3 text-[#E54835] shrink-0" />
                  </div>
                  <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#575752] dark:text-[#8A8A84] truncate">
                    Projects &amp; Experience Q&amp;A
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {hasUserMessages && (
                  <button
                    type="button"
                    onClick={handleReset}
                    title="Reset conversation"
                    aria-label="Reset conversation"
                    className="p-1.5 text-[#575752] dark:text-[#8A8A84] hover:text-[#121212] dark:hover:text-white hover:bg-[#F3F3F0] dark:hover:bg-[#222220] transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  title="Close assistant"
                  aria-label="Close assistant"
                  className="p-1.5 text-[#575752] dark:text-[#8A8A84] hover:text-[#E54835] dark:hover:text-[#E54835] hover:bg-[#F3F3F0] dark:hover:bg-[#222220] transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages Scroll Area */}
            <div
              data-lenis-prevent
              className="flex-1 overflow-y-auto px-4 py-3.5 space-y-3 bg-[#FBFBFA] dark:bg-[#111110]"
            >
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[88%] px-3 py-2.5 text-[12.5px] leading-relaxed whitespace-pre-wrap ${
                      msg.role === 'user'
                        ? 'bg-[#121212] text-white dark:bg-[#EBEBE8] dark:text-[#111111]'
                        : 'bg-white dark:bg-[#181816] text-[#121212] dark:text-[#EBEBE8] border border-[#E2E2DE] dark:border-[#262624] border-l-2 border-l-[#E54835]'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}

              {/* Starter suggestions before first user message */}
              {!hasUserMessages && !isLoading && (
                <div className="pt-1 space-y-1.5">
                  <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#575752] dark:text-[#8A8A84]">
                    Suggested Questions
                  </div>
                  <div className="flex flex-col gap-1.5">
                    {STARTER_PROMPTS.map((prompt) => (
                      <button
                        key={prompt}
                        type="button"
                        onClick={() => void sendMessage(prompt)}
                        className="text-left px-2.5 py-2 text-[11.5px] bg-white dark:bg-[#161614] border border-[#E2E2DE] dark:border-[#262624] hover:border-[#E54835] dark:hover:border-[#E54835] text-[#121212] dark:text-[#D9D9D5] transition-colors cursor-pointer"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Loading indicator */}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="px-3 py-2.5 bg-white dark:bg-[#181816] border border-[#E2E2DE] dark:border-[#262624] border-l-2 border-l-[#E54835] flex items-center gap-2">
                    <span className="flex gap-1">
                      <span className="w-1.5 h-1.5 bg-[#E54835] animate-pulse" />
                      <span className="w-1.5 h-1.5 bg-[#E54835] animate-pulse [animation-delay:150ms]" />
                      <span className="w-1.5 h-1.5 bg-[#E54835] animate-pulse [animation-delay:300ms]" />
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#575752] dark:text-[#8A8A84]">
                      Analyzing portfolio...
                    </span>
                  </div>
                </div>
              )}

              {/* Error State */}
              {errorMsg && (
                <div className="p-2.5 bg-[#E54835]/8 border border-[#E54835]/40 text-[11.5px] text-[#B91C1C] dark:text-[#FCA5A5] space-y-2">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-[#E54835]" />
                    <span>{errorMsg}</span>
                  </div>
                  {lastFailedPrompt && (
                    <button
                      type="button"
                      onClick={() => void sendMessage(lastFailedPrompt, true)}
                      className="font-mono text-[10px] uppercase tracking-[0.16em] underline hover:text-[#E54835] cursor-pointer"
                    >
                      Retry question
                    </button>
                  )}
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form
              onSubmit={handleSubmit}
              className="p-2.5 border-t border-[#E2E2DE] dark:border-[#262624] bg-white dark:bg-[#161614] flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about SQL, Power BI, projects..."
                disabled={isLoading}
                maxLength={500}
                className="flex-1 min-w-0 px-3 py-2 text-[12.5px] bg-[#FBFBFA] dark:bg-[#111110] text-[#121212] dark:text-[#EBEBE8] placeholder:text-[#8A8A84] border border-[#E2E2DE] dark:border-[#2A2A27] focus:outline-none focus:border-[#121212] dark:focus:border-[#EBEBE8] disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                aria-label="Send message"
                className="px-3 py-2 bg-[#121212] dark:bg-[#EBEBE8] text-white dark:text-[#111111] hover:bg-[#E54835] dark:hover:bg-[#E54835] dark:hover:text-white disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer shrink-0"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        ) : (
          <motion.button
            key="chat-launcher"
            type="button"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.18 }}
            onClick={() => setIsOpen(true)}
            aria-label="Open Portfolio AI Assistant"
            className="group flex items-center gap-2.5 px-3.5 py-2.5 bg-white dark:bg-[#161614] text-[#121212] dark:text-[#EBEBE8] border border-[#121212]/25 dark:border-[#333330] hover:border-[#E54835] dark:hover:border-[#E54835] shadow-[0_12px_32px_rgba(0,0,0,0.12)] dark:shadow-[0_12px_32px_rgba(0,0,0,0.55)] cursor-pointer transition-colors"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full bg-[#E54835] opacity-75" />
              <span className="relative inline-flex h-2 w-2 bg-[#E54835]" />
            </span>
            <MessageSquare className="w-3.5 h-3.5 text-[#121212] dark:text-[#EBEBE8] group-hover:text-[#E54835] transition-colors" />
            <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em]">
              Ask AI
            </span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};
