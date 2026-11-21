import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail,
  Linkedin,
  Github,
  Send,
  CheckCircle2,
  ArrowUpRight,
  AlertCircle,
  Database,
  LineChart,
} from 'lucide-react';
import { usePortfolioStore } from '../store/usePortfolioStore';
import { ContactSkeleton } from './skeletons/ContactSkeleton';

export const ContactSection: React.FC = () => {
  const { settings, submitMessage, setCursor, resetCursor, isLoading, theme } = usePortfolioStore();
  const isDark = theme === 'dark';

  if (isLoading) {
    return <ContactSkeleton />;
  }

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [lastSubmitTime, setLastSubmitTime] = useState<number>(0);

  // XSS Defense Input Sanitizer
  const sanitizeText = (input: string): string => {
    return input
      .replace(/<[^>]*>?/gm, '') // Strip HTML tags
      .replace(/javascript:/gi, '')
      .replace(/on\w+=/gi, '')
      .trim();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Rate Limiting Defense (Minimum 10s cooldown between transmissions)
    const now = Date.now();
    if (now - lastSubmitTime < 10000) {
      setErrorMessage('Rate limit reached: Please wait 10 seconds before submitting another transmission.');
      setStatus('error');
      return;
    }

    const cleanName = sanitizeText(formData.name);
    const cleanEmail = sanitizeText(formData.email);
    const cleanSubject = sanitizeText(formData.subject);
    const cleanMessage = sanitizeText(formData.message);

    if (!cleanName || !cleanEmail || !cleanMessage) {
      setErrorMessage('Please provide valid name, email, and inquiry message.');
      setStatus('error');
      return;
    }

    // Strict RFC email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      setErrorMessage('Please provide a valid, RFC-compliant email address.');
      setStatus('error');
      return;
    }

    try {
      setStatus('submitting');
      setLastSubmitTime(now);
      await submitMessage({
        name: cleanName,
        email: cleanEmail,
        subject: cleanSubject || 'Data Analytics Inquiry',
        message: cleanMessage,
      });

      setStatus('success');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
      setTimeout(() => setStatus('idle'), 6000);
    } catch (err: any) {
      setStatus('error');
      setErrorMessage('Failed to send message. Please reach out directly to gowthampandiyan7@gmail.com.');
    }
  };

  // High-end spring physics configuration
  const springTransition = {
    type: 'spring',
    stiffness: 400,
    damping: 25,
  };

  const focusBorder = '#E54835';
  const focusShadow = isDark
    ? '0 0 0 1px rgba(229, 72, 53, 0.45), 0 8px 24px -4px rgba(229, 72, 53, 0.25)'
    : '0 0 0 1px rgba(229, 72, 53, 0.35), 0 8px 24px -4px rgba(229, 72, 53, 0.16)';
  const hoverShadow = isDark
    ? '0 4px 16px -4px rgba(229, 72, 53, 0.2)'
    : '0 6px 20px -4px rgba(229, 72, 53, 0.12)';

  return (
    <section
      id="contact"
      className="py-28 md:py-36 bg-[#F9F9F7] dark:bg-[#0D0D0D] border-b border-[#E2E2DE] dark:border-[#262624] relative z-10"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="mb-16 pb-8 border-b border-[#E2E2DE] dark:border-[#262624]">
          <span className="text-xs font-mono tracking-widest text-[#E54835] uppercase mb-2 block font-bold">
            05. Contact &amp; Collaboration
          </span>
          <h2
            className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-[#111111] dark:text-[#EBEBE8] uppercase leading-[1.05]"
            style={{ textWrap: 'balance' }}
          >
            LET'S WORK TOGETHER
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left Column: Direct Inquiries & Contact Details */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-8">
            <div>
              <p className="text-sm sm:text-base text-[#6B6B67] dark:text-[#9E9E9A] leading-relaxed mb-8">
                Have a data analytics initiative, business intelligence dashboard, or relational SQL modeling pipeline in mind? I'm always open to discussing new opportunities, collaborations, and quantitative projects.
              </p>

              <div className="space-y-6 text-sm">
                {/* Email Direct */}
                <div className="flex flex-col">
                  <span className="text-[11px] font-mono uppercase tracking-widest text-[#6B6B67] dark:text-[#9E9E9A] mb-1.5 font-bold">
                    Direct Email
                  </span>
                  <a
                    href={`mailto:${settings.email}`}
                    onMouseEnter={() => setCursor({ label: 'EMAIL', type: 'contact' })}
                    onMouseLeave={resetCursor}
                    className="text-lg sm:text-xl font-bold text-[#111111] dark:text-[#EBEBE8] hover:underline hover:text-[#E54835] transition-colors"
                  >
                    {settings.email || 'gowthampandiyan7@gmail.com'}
                  </a>
                </div>

                {/* Location */}
                <div className="flex flex-col">
                  <span className="text-[11px] font-mono uppercase tracking-widest text-[#6B6B67] dark:text-[#9E9E9A] mb-1.5 font-bold">
                    Base Location
                  </span>
                  <span className="text-sm text-[#111111] dark:text-[#EBEBE8] font-medium">
                    Chennai, Tamil Nadu, India (Open to Remote &amp; Relocation)
                  </span>
                </div>

                {/* Social Connects */}
                <div className="flex flex-col pt-2">
                  <span className="text-[11px] font-mono uppercase tracking-widest text-[#6B6B67] dark:text-[#9E9E9A] mb-3 font-bold">
                    Professional Profiles
                  </span>
                  <div className="flex flex-wrap gap-4">
                    <a
                      href={settings.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-semibold text-[#111111] dark:text-[#EBEBE8] hover:text-[#E54835] transition-colors group"
                    >
                      <div className="p-1.5 rounded-none bg-[#E54835]/10 border border-[#E54835]/25 text-[#E54835]">
                        <Linkedin className="w-4 h-4" />
                      </div>
                      <span>LinkedIn Profile</span>
                      <ArrowUpRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform group-hover:text-[#E54835]" />
                    </a>

                    <a
                      href={settings.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-semibold text-[#111111] dark:text-[#EBEBE8] hover:text-[#E54835] transition-colors group"
                    >
                      <div className="p-1.5 rounded-none bg-[#E54835]/10 border border-[#E54835]/25 text-[#E54835]">
                        <Github className="w-4 h-4" />
                      </div>
                      <span>GitHub Repositories</span>
                      <ArrowUpRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform group-hover:text-[#E54835]" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Response Time Guarantee */}
            <div className="pt-6 border-t border-[#E2E2DE] dark:border-[#262624] flex items-center gap-3 text-xs font-mono text-[#6B6B67] dark:text-[#9E9E9A]">
              <span className="w-2.5 h-2.5 rounded-none bg-[#E54835] animate-pulse shadow-sm shadow-[#E54835]/50" />
              <span className="text-[#E54835] font-semibold">Prompt response within 24 hours guaranteed</span>
            </div>
          </div>

          {/* Right Column: Clean Classic Contact Form with Zero-Radius */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="border border-[#E2E2DE] dark:border-[#262624] bg-white dark:bg-[#141412] p-8 md:p-10 rounded-none shadow-sm hover:border-[#E54835]/40 transition-colors"
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name & Email Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <motion.div
                    whileHover={{ scale: 1.01, y: -2 }}
                    transition={springTransition}
                    className="relative group"
                  >
                    <label
                      htmlFor="contact-name"
                      className="block text-xs font-mono uppercase tracking-wider text-[#6B6B67] dark:text-[#9E9E9A] group-hover:text-[#E54835] mb-2 font-bold transition-colors"
                    >
                      Your Name *
                    </label>
                    <motion.div
                      whileHover={{
                        borderColor: focusBorder,
                        boxShadow: hoverShadow,
                      }}
                      whileFocusWithin={{
                        borderColor: focusBorder,
                        boxShadow: focusShadow,
                      }}
                      transition={springTransition}
                      className="border border-[#E2E2DE] dark:border-[#262624] bg-[#F9F9F7] dark:bg-[#0D0D0D] rounded-none overflow-hidden"
                    >
                      <input
                        id="contact-name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Jane Doe"
                        className="w-full px-4 py-3 bg-transparent text-sm text-[#111111] dark:text-[#EBEBE8] focus:outline-none placeholder:text-neutral-400 dark:placeholder:text-neutral-600"
                      />
                    </motion.div>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.01, y: -2 }}
                    transition={springTransition}
                    className="relative group"
                  >
                    <label
                      htmlFor="contact-email"
                      className="block text-xs font-mono uppercase tracking-wider text-[#6B6B67] dark:text-[#9E9E9A] group-hover:text-[#E54835] mb-2 font-bold transition-colors"
                    >
                      Your Email *
                    </label>
                    <motion.div
                      whileHover={{
                        borderColor: focusBorder,
                        boxShadow: hoverShadow,
                      }}
                      whileFocusWithin={{
                        borderColor: focusBorder,
                        boxShadow: focusShadow,
                      }}
                      transition={springTransition}
                      className="border border-[#E2E2DE] dark:border-[#262624] bg-[#F9F9F7] dark:bg-[#0D0D0D] rounded-none overflow-hidden"
                    >
                      <input
                        id="contact-email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="jane@company.com"
                        className="w-full px-4 py-3 bg-transparent text-sm text-[#111111] dark:text-[#EBEBE8] focus:outline-none placeholder:text-neutral-400 dark:placeholder:text-neutral-600"
                      />
                    </motion.div>
                  </motion.div>
                </div>

                {/* Subject Field */}
                <motion.div
                  whileHover={{ scale: 1.01, y: -2 }}
                  transition={springTransition}
                  className="relative group"
                >
                  <label
                    htmlFor="contact-subject"
                    className="block text-xs font-mono uppercase tracking-wider text-[#6B6B67] dark:text-[#9E9E9A] group-hover:text-[#E54835] mb-2 font-bold transition-colors"
                  >
                    Subject
                  </label>
                  <motion.div
                    whileHover={{
                      borderColor: focusBorder,
                      boxShadow: hoverShadow,
                    }}
                    whileFocusWithin={{
                      borderColor: focusBorder,
                      boxShadow: focusShadow,
                    }}
                    transition={springTransition}
                    className="border border-[#E2E2DE] dark:border-[#262624] bg-[#F9F9F7] dark:bg-[#0D0D0D] rounded-none overflow-hidden"
                  >
                    <input
                      id="contact-subject"
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="e.g. Sales Analytics Dashboard or SQL Pipeline Architecture"
                      className="w-full px-4 py-3 bg-transparent text-sm text-[#111111] dark:text-[#EBEBE8] focus:outline-none placeholder:text-neutral-400 dark:placeholder:text-neutral-600"
                    />
                  </motion.div>
                </motion.div>

                {/* Message Field */}
                <motion.div
                  whileHover={{ scale: 1.01, y: -2 }}
                  transition={springTransition}
                  className="relative group"
                >
                  <label
                    htmlFor="contact-message"
                    className="block text-xs font-mono uppercase tracking-wider text-[#6B6B67] dark:text-[#9E9E9A] group-hover:text-[#E54835] mb-2 font-bold transition-colors"
                  >
                    Message *
                  </label>
                  <motion.div
                    whileHover={{
                      borderColor: focusBorder,
                      boxShadow: hoverShadow,
                    }}
                    whileFocusWithin={{
                      borderColor: focusBorder,
                      boxShadow: focusShadow,
                    }}
                    transition={springTransition}
                    className="border border-[#E2E2DE] dark:border-[#262624] bg-[#F9F9F7] dark:bg-[#0D0D0D] rounded-none overflow-hidden"
                  >
                    <textarea
                      id="contact-message"
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Share your analytical requirements, data sources, or project goals..."
                      className="w-full px-4 py-3 bg-transparent text-sm text-[#111111] dark:text-[#EBEBE8] focus:outline-none resize-y placeholder:text-neutral-400 dark:placeholder:text-neutral-600"
                    />
                  </motion.div>
                </motion.div>

                {/* Status Notification Alerts */}
                <AnimatePresence>
                  {status === 'error' && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="p-3.5 bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs font-mono flex items-center gap-2 rounded-none"
                    >
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{errorMessage}</span>
                    </motion.div>
                  )}

                  {status === 'success' && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="p-4 bg-[#E54835]/10 dark:bg-[#E54835]/10 border border-[#E54835]/30 dark:border-[#E54835]/25 text-[#E54835] dark:text-[#E54835] text-xs font-mono flex items-center gap-3 rounded-none"
                    >
                      <CheckCircle2 className="w-5 h-5 shrink-0 text-[#E54835] dark:text-[#E54835]" />
                      <div>
                        <div className="font-bold">Inquiry Transmitted Successfully</div>
                        <div>Thank you for reaching out. Gowtham will review your requirements and respond promptly.</div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submit Action Button with Spring Physics Micro-Interactions */}
                <motion.button
                  type="submit"
                  disabled={status === 'submitting'}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98, y: 0 }}
                  transition={springTransition}
                  onMouseEnter={() => setCursor({ label: 'SEND', type: 'contact' })}
                  onMouseLeave={resetCursor}
                  className="w-full py-4 bg-[#111111] dark:bg-[#E54835] text-white text-xs font-bold uppercase tracking-widest hover:bg-[#E54835] dark:hover:bg-[#d43d2b] transition-colors flex items-center justify-center gap-2 rounded-none shadow-sm hover:shadow-md disabled:opacity-50 cursor-pointer group"
                >
                  {status === 'submitting' ? (
                    <span>Transmitting Data...</span>
                  ) : (
                    <>
                      <span>Transmit Inquiry</span>
                      <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform" />
                    </>
                  )}
                </motion.button>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
