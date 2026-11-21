import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Database,
  LineChart,
  FileSpreadsheet,
  Workflow,
  Calculator,
  ArrowUpRight,
} from 'lucide-react';

// Exact Clean SVG Logos (Rendered on Light Cards)
const LinkedInLogo: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={`${className} text-[#0A66C2]`}
  >
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
  </svg>
);

const GithubLogo: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 128 128"
    className={`${className} text-neutral-800`}
  >
    <g fill="currentColor">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M64 5.103c-33.347 0-60.388 27.035-60.388 60.388 0 26.682 17.303 49.317 41.297 57.303 3.017.56 4.125-1.31 4.125-2.905 0-1.44-.056-6.197-.082-11.243-16.8 3.653-20.345-7.125-20.345-7.125-2.747-6.98-6.705-8.836-6.705-8.836-5.48-3.748.413-3.67.413-3.67 6.063.425 9.257 6.223 9.257 6.223 5.386 9.23 14.127 6.562 17.573 5.02.542-3.903 2.107-6.568 3.834-8.076-13.413-1.525-27.514-6.704-27.514-29.843 0-6.593 2.36-11.98 6.223-16.21-.628-1.52-2.695-7.662.584-15.98 0 0 5.07-1.623 16.61 6.19C53.7 35 58.867 34.327 64 34.304c5.13.023 10.3.694 15.127 2.033 11.526-7.813 16.59-6.19 16.59-6.19 3.287 8.317 1.22 14.46.593 15.98 3.872 4.23 6.215 9.617 6.215 16.21 0 23.194-14.127 28.3-27.574 29.796 2.167 1.874 4.097 5.55 4.097 11.183 0 8.08-.07 14.583-.07 16.572 0 1.607 1.088 3.49 4.148 2.897 23.98-7.994 41.263-30.622 41.263-57.294C124.388 32.14 97.35 5.104 64 5.104z"
      />
    </g>
  </svg>
);

const NumpyLogo: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" className={className}>
    <path
      d="M54.32 27.164L33.304 16.559 10.226 28.071l21.594 10.84zM63.961 32.031L86 43.16 63.137 54.637 41.512 43.782zM93.398 16.715l22.645 11.355-20.254 10.168-22.082-11.141zM83.652 11.824L63.265 1.601 43.101 11.667l21.008 10.59zM67.715 99.605v27.816l24.695-12.324-.023-27.828zM92.375 77.555l-.027-27.535-24.633 12.246v27.547zM122.02 72.398v27.926l-21.066 10.508-.016-27.797zM122.02 62.633V35.266l-21.105 10.492.016 27.59z"
      fill="#4cabcf"
    />
    <path
      d="M58.996 62.266l-16.629-8.367v36.14S22.019 46.756 20.14 42.865c-.242-.504-1.242-1.051-1.496-1.188-3.668-1.914-14.355-7.324-14.355-7.324v63.871l14.785 7.926V72.75s20.129 38.676 20.336 39.102c.21.422 2.219 4.492 4.383 5.926 2.87 1.906 15.195 9.316 15.195 9.316z"
      fill="#4c75cf"
    />
  </svg>
);

const PandasLogo: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" className={className}>
    <path
      d="M48.697 15.176h12.25v25.437h-12.25zm0 52.251h12.25v25.436h-12.25z"
      fill="#130754"
    />
    <path d="M48.697 48.037h12.25v12.001h-12.25z" fill="#ffca00" />
    <path
      d="M29.017 36.087h12.25v84.552h-12.25zM67.97 88.414h12.25v25.436H67.97zm0-52.297h12.25v25.437H67.97z"
      fill="#130754"
    />
    <path d="M67.97 68.983h12.25v12.001H67.97z" fill="#e70488" />
    <path
      d="M87.238 8.55h12.25v84.552h-12.25z"
      fill="#130754"
    />
  </svg>
);

const PowerBiLogo: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <div className={`${className} flex items-end gap-0.5 bg-amber-50 p-1 border border-amber-300/80 rounded-none shrink-0`}>
    <div className="w-1 h-2 bg-amber-400" />
    <div className="w-1 h-3.5 bg-amber-500" />
    <div className="w-1 h-5 bg-amber-600" />
  </div>
);

// Pure Transparent / Transferable Object Styling (No white boxes, transparent backdrop)
const transparentObjectStyle =
  'p-1 bg-transparent border-0 shadow-none text-neutral-700 dark:text-neutral-300 transition-all drop-shadow-xs';

interface HeroParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseVx: number;
  baseVy: number;
  radius: number;
  depth: number;
  pulseAngle: number;
  pulseSpeed: number;
  alpha: number;
}

export const DataStreamBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Cycle / shift waypoint offsets periodically so objects gently explore fresh coordinates
  const [cycleIndex, setCycleIndex] = useState(0);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      setCycleIndex((prev) => (prev + 1) % 4);
    }, 28000);
    return () => clearInterval(interval);
  }, []);

  // Subtle interactive mouse parallax
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const relX = (e.clientX - rect.left) / rect.width - 0.5;
      const relY = (e.clientY - rect.top) / rect.height - 0.5;
      setMouseOffset({
        x: relX * 18,
        y: relY * 18,
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // 3D Parallax Depth Canvas Layer for Hero Section Only
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    let mouseX = -1000;
    let mouseY = -1000;
    let isMouseOver = false;
    let scrollY = window.scrollY;

    const handleCanvasMouseMove = (e: MouseEvent) => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
      isMouseOver = true;
    };
    const handleCanvasMouseLeave = () => {
      mouseX = -1000;
      mouseY = -1000;
      isMouseOver = false;
    };
    const handleCanvasScroll = () => {
      scrollY = window.scrollY;
    };

    window.addEventListener('mousemove', handleCanvasMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleCanvasMouseLeave);
    window.addEventListener('scroll', handleCanvasScroll, { passive: true });

    // Initialize depth-distributed particles
    const particleCount = 28;
    const particles: HeroParticle[] = [];
    for (let i = 0; i < particleCount; i++) {
      const depthTier = i % 3;
      const depth = depthTier === 0 ? 1.6 : depthTier === 1 ? 1.1 : 0.65;
      const speedScale = depthTier === 0 ? 0.45 : depthTier === 1 ? 0.3 : 0.18;
      const vx = (Math.random() - 0.5) * speedScale;
      const vy = (Math.random() - 0.5) * speedScale;

      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx,
        vy,
        baseVx: vx,
        baseVy: vy,
        radius: (Math.random() * 1.6 + 1.2) * (depthTier === 0 ? 1.35 : depthTier === 1 ? 1.0 : 0.8),
        depth,
        pulseAngle: Math.random() * Math.PI * 2,
        pulseSpeed: 0.015 + Math.random() * 0.02,
        alpha: (0.25 + Math.random() * 0.35) * (depthTier === 0 ? 1.1 : depthTier === 1 ? 0.85 : 0.6),
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      const isDark = document.documentElement.classList.contains('dark');
      const nodeColor = isDark ? '235, 235, 232' : '85, 85, 80';
      const accentColor = isDark ? '229, 72, 53' : '200, 50, 35';

      // 1. Background Grid Lines Layer (Moves slowly with parallax)
      const gridSize = 72;
      const gridParallaxX = ((mouseX > 0 ? (mouseX - width / 2) : 0) * 0.015 + scrollY * 0.01) % gridSize;
      const gridParallaxY = ((mouseY > 0 ? (mouseY - height / 2) : 0) * 0.015 + scrollY * 0.035) % gridSize;

      ctx.save();
      ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.035)' : 'rgba(0, 0, 0, 0.028)';
      ctx.lineWidth = 0.8;
      for (let x = -gridSize + gridParallaxX; x < width + gridSize; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = -gridSize + gridParallaxY; y < height + gridSize; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
      ctx.restore();

      // 2. Parallax Particles (Foreground moves faster than background grid)
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (isMouseOver && mouseX > 0 && mouseY > 0) {
          const mdx = mouseX - p.x;
          const mdy = mouseY - p.y;
          const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
          if (mDist < 160 && mDist > 0) {
            const pullForce = ((160 - mDist) / 160) * 0.18 * p.depth;
            p.vx += (mdx / mDist) * pullForce;
            p.vy += (mdy / mDist) * pullForce;
          }
        }

        p.vx = p.vx * 0.98 + p.baseVx * 0.02;
        p.vy = p.vy * 0.98 + p.baseVy * 0.02;

        const mouseParallaxX = isMouseOver ? (mouseX - width / 2) * 0.0003 * p.depth : 0;
        const mouseParallaxY = isMouseOver ? (mouseY - height / 2) * 0.0003 * p.depth : 0;

        p.x += p.vx * p.depth + mouseParallaxX;
        p.y += p.vy * p.depth + mouseParallaxY;

        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20;
        if (p.y > height + 20) p.y = -20;

        p.pulseAngle += p.pulseSpeed;
        const pulse = Math.sin(p.pulseAngle) * 0.5 + 0.5;

        const pColor = i % 4 === 0 ? accentColor : nodeColor;
        const currentAlpha = p.alpha * (0.8 + pulse * 0.4) * (isDark ? 0.75 : 0.6);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${pColor}, ${currentAlpha})`;
        ctx.fill();

        if (p.depth > 1.3) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * 2.2, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(${pColor}, ${currentAlpha * 0.25})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleCanvasMouseMove);
      window.removeEventListener('mouseleave', handleCanvasMouseLeave);
      window.removeEventListener('scroll', handleCanvasScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Waypoint offsets for periodic drift (kept subtle so objects always remain in the background)
  const phaseOffsets = [
    { x: 0, y: 0 },
    { x: 12, y: -14 },
    { x: -10, y: 12 },
    { x: 8, y: 10 },
  ];
  const curPhase = phaseOffsets[cycleIndex];

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="absolute inset-0 overflow-hidden pointer-events-none z-0 select-none font-mono"
    >
      <style>{`
        /* Smooth continuous translation for data marquee streams */
        @keyframes sqlScrollLeft {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
        @keyframes sqlScrollRight {
          0% { transform: translate3d(-50%, 0, 0); }
          100% { transform: translate3d(0, 0, 0); }
        }
        @keyframes conduitDash {
          0% { stroke-dashoffset: 80; }
          100% { stroke-dashoffset: 0; }
        }
        .anim-scroll-sql-left { animation: sqlScrollLeft 55s linear infinite; will-change: transform; }
        .anim-scroll-sql-right { animation: sqlScrollRight 58s linear infinite; will-change: transform; }
        .anim-dash-flow {
          stroke-dasharray: 6 12;
          animation: conduitDash 2.4s linear infinite;
        }
      `}</style>

      {/* 0. 3D Parallax Depth Canvas Layer (Background grid + fast foreground particles) */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none opacity-60 dark:opacity-40"
      />

      {/* ========================================================================= */}
      {/* 1. LIGHT SVG CONSTELLATION CONDUITS & ACTIVE TRAVELING DATA PACKETS       */}
      {/* ========================================================================= */}
      <svg
        className="absolute inset-0 w-full h-full opacity-45 dark:opacity-35"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="heroLineGradLightOrange" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E54835" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#CBD5E1" stopOpacity="0.1" />
          </linearGradient>
          <linearGradient id="heroLineGradLightBlue" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0A66C2" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#CBD5E1" stopOpacity="0.1" />
          </linearGradient>
          <linearGradient id="heroLineGradLightNeutral" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E2E8F0" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#CBD5E1" stopOpacity="0.08" />
          </linearGradient>
        </defs>

        <g strokeWidth="1">
          {/* Top Network */}
          <line x1="80" y1="120" x2="280" y2="160" stroke="url(#heroLineGradLightOrange)" />
          <line x1="280" y1="160" x2="480" y2="90" stroke="url(#heroLineGradLightNeutral)" />
          <line x1="280" y1="160" x2="380" y2="300" stroke="url(#heroLineGradLightOrange)" />
          <line x1="380" y1="300" x2="160" y2="420" stroke="url(#heroLineGradLightNeutral)" />

          {/* Right Network */}
          <line x1="940" y1="100" x2="1140" y2="140" stroke="url(#heroLineGradLightBlue)" />
          <line x1="1140" y1="140" x2="1380" y2="80" stroke="url(#heroLineGradLightNeutral)" />
          <line x1="1140" y1="140" x2="1100" y2="310" stroke="url(#heroLineGradLightOrange)" />
          <line x1="1100" y1="310" x2="1340" y2="380" stroke="url(#heroLineGradLightNeutral)" />

          {/* Bottom Network */}
          <line x1="140" y1="710" x2="340" y2="640" stroke="url(#heroLineGradLightOrange)" />
          <line x1="340" y1="640" x2="540" y2="740" stroke="url(#heroLineGradLightNeutral)" />
          <line x1="980" y1="710" x2="1180" y2="640" stroke="url(#heroLineGradLightBlue)" />
          <line x1="1180" y1="640" x2="1400" y2="720" stroke="url(#heroLineGradLightOrange)" />

          {/* Active Data Packet Flow Line */}
          <line x1="280" y1="160" x2="380" y2="300" stroke="#E54835" strokeWidth="1.5" strokeOpacity="0.6" className="anim-dash-flow" />
          <line x1="1140" y1="140" x2="1100" y2="310" stroke="#0A66C2" strokeWidth="1.5" strokeOpacity="0.6" className="anim-dash-flow" />
          <line x1="140" y1="710" x2="340" y2="640" stroke="#E54835" strokeWidth="1.5" strokeOpacity="0.6" className="anim-dash-flow" />
        </g>

        {/* Constellation Nodes (Light translucent accents) */}
        <g transform="translate(280, 160)">
          <circle cx="0" cy="0" r="10" fill="#E54835" fillOpacity="0.12" className="animate-ping" />
          <circle cx="0" cy="0" r="4" fill="#E54835" fillOpacity="0.8" />
        </g>
        <circle cx="80" cy="120" r="3" fill="#94A3B8" fillOpacity="0.5" />
        <circle cx="480" cy="90" r="3" fill="#94A3B8" fillOpacity="0.5" />
        <circle cx="380" cy="300" r="3.5" fill="#E54835" fillOpacity="0.7" />
        <circle cx="160" cy="420" r="2.5" fill="#94A3B8" fillOpacity="0.4" />

        <g transform="translate(1140, 140)">
          <circle cx="0" cy="0" r="10" fill="#0A66C2" fillOpacity="0.15" className="animate-ping" />
          <circle cx="0" cy="0" r="4" fill="#0A66C2" fillOpacity="0.8" />
        </g>
        <circle cx="940" cy="100" r="3" fill="#94A3B8" fillOpacity="0.5" />
        <circle cx="1380" cy="80" r="3" fill="#94A3B8" fillOpacity="0.5" />
        <circle cx="1100" cy="310" r="3.5" fill="#0A66C2" fillOpacity="0.7" />
        <circle cx="1340" cy="380" r="2.5" fill="#94A3B8" fillOpacity="0.4" />

        <circle cx="140" cy="710" r="3" fill="#94A3B8" fillOpacity="0.5" />
        <g transform="translate(340, 640)">
          <circle cx="0" cy="0" r="4" fill="#E54835" fillOpacity="0.7" />
          <circle cx="0" cy="0" r="7" stroke="#E54835" strokeWidth="0.8" strokeOpacity="0.5" fill="none" />
        </g>
        <circle cx="540" cy="740" r="2.5" fill="#94A3B8" fillOpacity="0.4" />
        <circle cx="980" cy="710" r="3" fill="#94A3B8" fillOpacity="0.5" />
        <circle cx="1180" cy="640" r="4" fill="#0A66C2" fillOpacity="0.7" />
        <circle cx="1400" cy="720" r="2.5" fill="#94A3B8" fillOpacity="0.4" />
      </svg>

      {/* ========================================================================= */}
      {/* 2. DYNAMIC MOVING LIGHT OBJECTS (Strictly In Background, Light Colors)     */}
      {/* ========================================================================= */}

      {/* ========================================================================= */}
      {/* OBJECT 1: LINKEDIN MOVING OBJECT (Top Right Periphery)                    */}
      {/* ========================================================================= */}
      <motion.div
        animate={{
          x: [0 + curPhase.x, 10 + curPhase.x, -6 + curPhase.x, 0 + curPhase.x],
          y: [0 + curPhase.y, -12 + curPhase.y, 6 + curPhase.y, 0 + curPhase.y],
          rotate: [0, 1.5, -1, 0],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          transform: `translate3d(${mouseOffset.x * 0.7}px, ${mouseOffset.y * 0.7}px, 0)`,
        }}
        className="absolute top-20 right-[4%] sm:right-[10%] lg:right-[14%] pointer-events-auto z-0"
      >
        <motion.a
          href="https://www.linkedin.com/in/gowtham-pandiyan-kannan-a7474b304?utm_source=share_via&utm_content=profile&utm_medium=member_android"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.05, y: -3 }}
          whileTap={{ scale: 0.97 }}
          className={`group block ${transparentObjectStyle}`}
        >
          <div className="flex items-center gap-2.5">
            <LinkedInLogo className="w-5 h-5 shrink-0 group-hover:scale-105 transition-transform" />
            <div className="flex flex-col">
              <div className="flex items-center gap-1 text-[10px] font-bold text-[#0A66C2]">
                <span>LINKEDIN // NETWORK</span>
                <ArrowUpRight className="w-3 h-3 opacity-60 group-hover:opacity-100 transition-opacity" />
              </div>
              <span className="text-[9px] font-mono text-neutral-600">
                Gowtham Pandiyan · Data Analyst
              </span>
            </div>
            <span className="w-2 h-2 rounded-full bg-[#0A66C2] animate-pulse shrink-0 ml-1" />
          </div>
        </motion.a>
      </motion.div>

      {/* ========================================================================= */}
      {/* OBJECT 2: NUMPY ARRAY MATRIX BADGE (Top Left Periphery)                  */}
      {/* ========================================================================= */}
      <motion.div
        animate={{
          x: [0 + curPhase.x * 0.8, -10 + curPhase.x * 0.8, 8 + curPhase.x * 0.8, 0 + curPhase.x * 0.8],
          y: [0 + curPhase.y * 0.8, 12 + curPhase.y * 0.8, -8 + curPhase.y * 0.8, 0 + curPhase.y * 0.8],
          rotate: [0, -1.5, 1, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          transform: `translate3d(${mouseOffset.x * 0.5}px, ${mouseOffset.y * 0.5}px, 0)`,
        }}
        className="absolute top-24 left-[3%] sm:left-[6%] pointer-events-auto z-0"
      >
        <motion.div whileHover={{ scale: 1.05, y: -2 }} className={transparentObjectStyle}>
          <div className="flex items-center gap-2">
            <NumpyLogo className="w-5 h-5 shrink-0" />
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-[#4c75cf]">NUMPY // MATRIX</span>
              <span className="text-[9px] font-mono text-neutral-600">
                np.ndarray · O(N log N)
              </span>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* ========================================================================= */}
      {/* OBJECT 3: PANDAS DATAFRAME PIPELINE BADGE (Far Mid-Right Edge)            */}
      {/* ========================================================================= */}
      <motion.div
        animate={{
          x: [0 - curPhase.x, 12 - curPhase.x, -8 - curPhase.x, 0 - curPhase.x],
          y: [0 - curPhase.y, 10 - curPhase.y, -12 - curPhase.y, 0 - curPhase.y],
          rotate: [0, 1.8, -1.2, 0],
        }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        style={{
          transform: `translate3d(${mouseOffset.x * 0.8}px, ${mouseOffset.y * 0.8}px, 0)`,
        }}
        className="absolute top-[42%] right-[2%] sm:right-[4%] pointer-events-auto z-0 hidden sm:block"
      >
        <motion.div whileHover={{ scale: 1.05, y: -2 }} className={transparentObjectStyle}>
          <div className="flex items-center gap-2">
            <PandasLogo className="w-5 h-5 shrink-0" />
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-[#e70488]">PANDAS // PIPELINE</span>
              <span className="text-[9px] font-mono text-neutral-600">
                df.groupby(&apos;cohort&apos;).agg()
              </span>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* ========================================================================= */}
      {/* OBJECT 4: GITHUB REPO BADGE (Bottom Left Periphery)                       */}
      {/* ========================================================================= */}
      <motion.div
        animate={{
          x: [0 + curPhase.y, -10 + curPhase.y, 10 + curPhase.y, 0 + curPhase.y],
          y: [0 + curPhase.x, -12 + curPhase.x, 8 + curPhase.x, 0 + curPhase.x],
          rotate: [0, -1, 1.5, 0],
        }}
        transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
        style={{
          transform: `translate3d(${mouseOffset.x * 0.6}px, ${mouseOffset.y * 0.6}px, 0)`,
        }}
        className="absolute bottom-28 left-[3%] sm:left-[6%] pointer-events-auto z-0"
      >
        <motion.a
          href="https://github.com/gowthampandiyank"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.05, y: -3 }}
          whileTap={{ scale: 0.97 }}
          className={`group block ${transparentObjectStyle}`}
        >
          <div className="flex items-center gap-2.5">
            <GithubLogo className="w-4 h-4 shrink-0 group-hover:scale-105 transition-transform" />
            <div className="flex flex-col">
              <div className="flex items-center gap-1 text-[10px] font-bold text-neutral-800">
                <span>GITHUB // REPO</span>
                <ArrowUpRight className="w-3 h-3 opacity-60 group-hover:opacity-100 transition-opacity" />
              </div>
              <span className="text-[9px] font-mono text-neutral-600">
                gowthampandiyank / portfolio
              </span>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping shrink-0 ml-1" />
          </div>
        </motion.a>
      </motion.div>

      {/* ========================================================================= */}
      {/* OBJECT 5: POWER BI DAX MEASURE CARD (Bottom Right Periphery)              */}
      {/* ========================================================================= */}
      <motion.div
        animate={{
          x: [0 - curPhase.y, 10 - curPhase.y, -12 - curPhase.y, 0 - curPhase.y],
          y: [0 + curPhase.x, 10 + curPhase.x, -14 + curPhase.x, 0 + curPhase.x],
          rotate: [0, 1.5, -1.2, 0],
        }}
        transition={{ duration: 21, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
        style={{
          transform: `translate3d(${mouseOffset.x * 0.85}px, ${mouseOffset.y * 0.85}px, 0)`,
        }}
        className="absolute bottom-24 right-[4%] sm:right-[8%] lg:right-[12%] pointer-events-auto z-0"
      >
        <motion.div whileHover={{ scale: 1.05, y: -3 }} className={transparentObjectStyle}>
          <div className="flex items-center gap-2.5">
            <PowerBiLogo className="w-5 h-5 shrink-0" />
            <div className="flex flex-col">
              <div className="flex items-center justify-between gap-2.5 text-[10px] font-bold text-amber-600">
                <span>POWER BI // DAX</span>
                <span className="bg-amber-100 text-amber-800 px-1 py-0.2 text-[8px] font-mono font-medium">
                  TABULAR
                </span>
              </div>
              <span className="text-[9px] font-mono text-neutral-600">
                CALCULATE([Sales], SPLY(&apos;Date&apos;))
              </span>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* ========================================================================= */}
      {/* OBJECT 6: POSTGRESQL ENGINE CARD (Far Left Margin)                        */}
      {/* ========================================================================= */}
      <motion.div
        animate={{
          x: [0 + curPhase.x, 8 + curPhase.x, -10 + curPhase.x, 0 + curPhase.x],
          y: [0 - curPhase.y * 0.8, -12 - curPhase.y * 0.8, 10 - curPhase.y * 0.8, 0 - curPhase.y * 0.8],
        }}
        transition={{ duration: 23, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        style={{
          transform: `translate3d(${mouseOffset.x * 0.55}px, ${mouseOffset.y * 0.55}px, 0)`,
        }}
        className="absolute top-[52%] left-[2%] sm:left-[4%] pointer-events-auto z-0 hidden lg:block"
      >
        <motion.div whileHover={{ scale: 1.05, y: -2 }} className={transparentObjectStyle}>
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-[#E54835] shrink-0" />
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-[#E54835]">POSTGRESQL // 14ms</span>
              <span className="text-[9px] font-mono text-neutral-600">
                DENSE_RANK() OVER(PARTITION)
              </span>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* ========================================================================= */}
      {/* OBJECT 7: REVENUE FORECAST SPARKLINE (Top Periphery)                      */}
      {/* ========================================================================= */}
      <motion.div
        animate={{
          x: [0 - curPhase.x * 0.6, -8 - curPhase.x * 0.6, 10 - curPhase.x * 0.6, 0 - curPhase.x * 0.6],
          y: [0 + curPhase.y * 0.6, 10 + curPhase.y * 0.6, -8 + curPhase.y * 0.6, 0 + curPhase.y * 0.6],
        }}
        transition={{ duration: 19, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
        style={{
          transform: `translate3d(${mouseOffset.x * 0.7}px, ${mouseOffset.y * 0.7}px, 0)`,
        }}
        className="absolute top-10 right-[32%] pointer-events-auto z-0 hidden xl:block"
      >
        <motion.div whileHover={{ scale: 1.05, y: -2 }} className={transparentObjectStyle}>
          <div className="flex items-center justify-between gap-3 text-[10px] mb-1">
            <span className="text-[#E54835] font-bold flex items-center gap-1">
              <LineChart className="w-3.5 h-3.5 text-[#E54835]" />
              TREND // 7D FORECAST
            </span>
            <span className="bg-[#E54835]/10 text-[#E54835] font-bold px-1 py-0.2 text-[8px] font-mono">
              +18.4% YoY
            </span>
          </div>
          <div className="w-24 h-5 relative">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 90 20">
              <motion.path
                d="M 2 16 L 16 12 L 32 14 L 48 6 L 64 9 L 78 3 L 88 4"
                fill="none"
                stroke="#E54835"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                animate={{
                  d: [
                    "M 2 16 L 16 12 L 32 14 L 48 6 L 64 9 L 78 3 L 88 4",
                    "M 2 14 L 16 10 L 32 12 L 48 5 L 64 7 L 78 2 L 88 3",
                    "M 2 16 L 16 12 L 32 14 L 48 6 L 64 9 L 78 3 L 88 4",
                  ],
                }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              />
              <circle cx="88" cy="4" r="2.5" fill="#E54835" className="animate-ping" />
              <circle cx="88" cy="4" r="2" fill="#E54835" />
            </svg>
          </div>
        </motion.div>
      </motion.div>

      {/* ========================================================================= */}
      {/* OBJECT 8: EXCEL ADVANCED XLOOKUP BADGE (Far Bottom Edge)                  */}
      {/* ========================================================================= */}
      <motion.div
        animate={{
          x: [0 + curPhase.x * 0.6, 8 + curPhase.x * 0.6, -10 + curPhase.x * 0.6, 0 + curPhase.x * 0.6],
          y: [0 - curPhase.y * 0.5, -10 - curPhase.y * 0.5, 10 - curPhase.y * 0.5, 0 - curPhase.y * 0.5],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut', delay: 2.5 }}
        style={{
          transform: `translate3d(${mouseOffset.x * 0.5}px, ${mouseOffset.y * 0.5}px, 0)`,
        }}
        className="absolute bottom-8 left-[35%] pointer-events-auto z-0 hidden xl:block"
      >
        <motion.div whileHover={{ scale: 1.05, y: -2 }} className={transparentObjectStyle}>
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-emerald-600 shrink-0" />
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-emerald-600">EXCEL // XLOOKUP</span>
              <span className="text-[9px] font-mono text-neutral-600">
                =XLOOKUP(A2, Dim_Cust, Rev)
              </span>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* ========================================================================= */}
      {/* OBJECT 9: APACHE AIRFLOW DAG BADGE (Lower Left Margin)                    */}
      {/* ========================================================================= */}
      <motion.div
        animate={{
          x: [0 - curPhase.y * 0.7, -10 - curPhase.y * 0.7, 10 - curPhase.y * 0.7, 0 - curPhase.y * 0.7],
          y: [0 + curPhase.x * 0.7, 12 + curPhase.x * 0.7, -10 + curPhase.x * 0.7, 0 + curPhase.x * 0.7],
        }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut', delay: 1.7 }}
        style={{
          transform: `translate3d(${mouseOffset.x * 0.65}px, ${mouseOffset.y * 0.65}px, 0)`,
        }}
        className="absolute top-[72%] left-[6%] pointer-events-auto z-0 hidden 2xl:block"
      >
        <motion.div whileHover={{ scale: 1.05, y: -2 }} className={transparentObjectStyle}>
          <div className="flex items-center gap-2">
            <Workflow className="w-4 h-4 text-cyan-600 shrink-0" />
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-cyan-600">AIRFLOW // DAG</span>
              <span className="text-[9px] font-mono text-neutral-600">
                etl_daily &gt;&gt; PASS
              </span>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* ========================================================================= */}
      {/* OBJECT 10: STATISTICAL REGRESSION HYPOTHESIS BADGE (Far Mid-Right)        */}
      {/* ========================================================================= */}
      <motion.div
        animate={{
          x: [0 + curPhase.y * 0.6, 10 + curPhase.y * 0.6, -8 + curPhase.y * 0.6, 0 + curPhase.y * 0.6],
          y: [0 - curPhase.x * 0.7, -10 - curPhase.x * 0.7, 12 - curPhase.x * 0.7, 0 - curPhase.x * 0.7],
        }}
        transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        style={{
          transform: `translate3d(${mouseOffset.x * 0.6}px, ${mouseOffset.y * 0.6}px, 0)`,
        }}
        className="absolute top-[68%] right-[4%] sm:right-[6%] pointer-events-auto z-0 hidden lg:block"
      >
        <motion.div whileHover={{ scale: 1.05, y: -2 }} className={transparentObjectStyle}>
          <div className="flex items-center gap-2">
            <Calculator className="w-4 h-4 text-amber-600 shrink-0" />
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-amber-600">REGRESSION // STATS</span>
              <span className="text-[9px] font-mono text-neutral-600">
                R²=0.984 · p &lt; 0.001
              </span>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* ========================================================================= */}
      {/* 3. LIGHT SUBTLE STREAMING SQL MARQUEE TICKERS                             */}
      {/* ========================================================================= */}
      <div className="absolute top-28 inset-x-0 overflow-hidden opacity-30 dark:opacity-25 pointer-events-none z-0">
        <div className="flex whitespace-nowrap anim-scroll-sql-left text-[11px] font-mono tracking-wider text-neutral-500">
          {[...Array(2)].map((_, loopIdx) => (
            <div key={loopIdx} className="flex items-center gap-12 pr-12">
              <span className="flex items-center gap-2">
                <span className="text-[#E54835] font-bold">&gt;</span>
                <span className="text-neutral-700 font-semibold">SELECT</span>
                <span>customer_id, DENSE_RANK() OVER (PARTITION BY cohort ORDER BY clv DESC) FROM fact_orders;</span>
              </span>
              <span className="text-[#E54835]/30 font-mono">///</span>
              <span className="flex items-center gap-2">
                <span className="text-[#0A66C2] font-bold">&gt;</span>
                <span className="text-neutral-700 font-semibold">WITH</span>
                <span>cohort_retention AS (SELECT user_id, DATE_TRUNC(&apos;month&apos;, first_date) FROM sales);</span>
              </span>
              <span className="text-[#0A66C2]/30 font-mono">///</span>
              <span className="flex items-center gap-2">
                <span className="text-[#E54835] font-bold">&gt;</span>
                <span className="text-neutral-700 font-semibold">GROUP BY</span>
                <span>DATE_TRUNC(&apos;month&apos;, order_date) HAVING COUNT(*) &gt; 100 ORDER BY 1 DESC;</span>
              </span>
              <span className="text-[#E54835]/30 font-mono">///</span>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-14 inset-x-0 overflow-hidden opacity-30 dark:opacity-25 pointer-events-none z-0">
        <div className="flex whitespace-nowrap anim-scroll-sql-right text-[11px] font-mono tracking-wider text-neutral-500">
          {[...Array(2)].map((_, loopIdx) => (
            <div key={loopIdx} className="flex items-center gap-12 pr-12">
              <span className="flex items-center gap-2">
                <span className="text-[#0A66C2] font-bold">&gt;&gt;</span>
                <span className="text-neutral-700 font-semibold">CALCULATE</span>
                <span>([Total Revenue], SAMEPERIODLASTYEAR(&apos;Calendar&apos;[Date]));</span>
              </span>
              <span className="text-[#0A66C2]/30 font-mono">///</span>
              <span className="flex items-center gap-2">
                <span className="text-[#E54835] font-bold">&gt;&gt;</span>
                <span className="text-neutral-700 font-semibold">EXPLAIN ANALYZE</span>
                <span>SELECT * FROM fact_transactions WHERE latency &lt; 14ms;</span>
              </span>
              <span className="text-[#E54835]/30 font-mono">///</span>
              <span className="flex items-center gap-2">
                <span className="text-emerald-600 font-bold">&gt;&gt;</span>
                <span className="text-neutral-700 font-semibold">XLOOKUP</span>
                <span>(fact_orders[cust_id], dim_customers[id], dim_customers[region]);</span>
              </span>
              <span className="text-emerald-600/30 font-mono">///</span>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. LIGHT TELEMETRY STATUS PILLS (Fixed Corners, Light Styling)            */}
      {/* ========================================================================= */}
      <div className="absolute top-20 right-6 hidden xl:flex items-center gap-2 px-2 py-1 bg-transparent border-0 text-[10px] text-neutral-600 dark:text-neutral-400 font-mono shadow-none z-0">
        <span className="w-1.5 h-1.5 rounded-full bg-[#E54835] animate-ping" />
        <span className="font-bold text-neutral-900">STREAM:</span>
        <span className="text-[#E54835] font-mono">ACTIVE (14ms)</span>
      </div>

      <div className="absolute bottom-24 left-8 hidden xl:flex items-center gap-2 px-2 py-1 bg-transparent border-0 text-[10px] text-neutral-600 dark:text-neutral-400 font-mono shadow-none z-0">
        <span className="text-[#0A66C2] font-bold">TELEMETRY:</span>
        <span className="text-neutral-600 font-mono">LINKEDIN // GITHUB SYNC 100%</span>
      </div>
    </div>
  );
};
