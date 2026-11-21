import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Database,
  BarChart3,
  LineChart,
  Workflow,
  PieChart,
  FileSpreadsheet,
  Activity,
  Layers,
  ArrowUpRight,
  TrendingUp,
} from 'lucide-react';

interface ParticleTrailPoint {
  x: number;
  y: number;
  alpha: number;
}

interface DepthParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseVx: number;
  baseVy: number;
  radius: number;
  depth: number; // 0.6 (distant background) to 1.8 (fast foreground)
  type: 'node' | 'diamond' | 'table_cell' | 'circle';
  pulseAngle: number;
  pulseSpeed: number;
  alpha: number;
  trail: ParticleTrailPoint[];
}

// Light-Colored SVG Tech Logos
const LinkedInIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`${className} text-[#0A66C2]`}>
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
  </svg>
);

const GithubIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" className={`${className} text-neutral-700 dark:text-neutral-300`}>
    <path
      fill="currentColor"
      fillRule="evenodd"
      clipRule="evenodd"
      d="M64 5.103c-33.347 0-60.388 27.035-60.388 60.388 0 26.682 17.303 49.317 41.297 57.303 3.017.56 4.125-1.31 4.125-2.905 0-1.44-.056-6.197-.082-11.243-16.8 3.653-20.345-7.125-20.345-7.125-2.747-6.98-6.705-8.836-6.705-8.836-5.48-3.748.413-3.67.413-3.67 6.063.425 9.257 6.223 9.257 6.223 5.386 9.23 14.127 6.562 17.573 5.02.542-3.903 2.107-6.568 3.834-8.076-13.413-1.525-27.514-6.704-27.514-29.843 0-6.593 2.36-11.98 6.223-16.21-.628-1.52-2.695-7.662.584-15.98 0 0 5.07-1.623 16.61 6.19C53.7 35 58.867 34.327 64 34.304c5.13.023 10.3.694 15.127 2.033 11.526-7.813 16.59-6.19 16.59-6.19 3.287 8.317 1.22 14.46.593 15.98 3.872 4.23 6.215 9.617 6.215 16.21 0 23.194-14.127 28.3-27.574 29.796 2.167 1.874 4.097 5.55 4.097 11.183 0 8.08-.07 14.583-.07 16.572 0 1.607 1.088 3.49 4.148 2.897 23.98-7.994 41.263-30.622 41.263-57.294C124.388 32.14 97.35 5.104 64 5.104z"
    />
  </svg>
);

const NumpyIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" className={className}>
    <path d="M54.32 27.164L33.304 16.559 10.226 28.071l21.594 10.84zM63.961 32.031L86 43.16 63.137 54.637 41.512 43.782zM93.398 16.715l22.645 11.355-20.254 10.168-22.082-11.141zM83.652 11.824L63.265 1.601 43.101 11.667l21.008 10.59zM67.715 99.605v27.816l24.695-12.324-.023-27.828zM92.375 77.555l-.027-27.535-24.633 12.246v27.547zM122.02 72.398v27.926l-21.066 10.508-.016-27.797zM122.02 62.633V35.266l-21.105 10.492.016 27.59z" fill="#4cabcf" />
    <path d="M58.996 62.266l-16.629-8.367v36.14S22.019 46.756 20.14 42.865c-.242-.504-1.242-1.051-1.496-1.188-3.668-1.914-14.355-7.324-14.355-7.324v63.871l14.785 7.926V72.75s20.129 38.676 20.336 39.102c.21.422 2.219 4.492 4.383 5.926 2.87 1.906 15.195 9.316 15.195 9.316z" fill="#4c75cf" />
  </svg>
);

const PandasIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" className={className}>
    <path d="M48.697 15.176h12.25v25.437h-12.25zm0 52.251h12.25v25.436h-12.25z" fill="#130754" className="dark:fill-white/80" />
    <path d="M48.697 48.037h12.25v12.001h-12.25z" fill="#ffca00" />
    <path d="M29.017 36.087h12.25v84.552h-12.25zM67.97 88.414h12.25v25.436H67.97zm0-52.297h12.25v25.437H67.97z" fill="#130754" className="dark:fill-white/80" />
    <path d="M67.97 68.983h12.25v12.001H67.97z" fill="#e70488" />
    <path d="M87.238 8.55h12.25v84.552h-12.25z" fill="#130754" className="dark:fill-white/80" />
  </svg>
);

/**
 * DataBackgroundAnimation:
 * Exclusively engineered for the Hero Section background.
 * Features:
 * 1. 3D Parallax Canvas: Deep background grid lines drift at a slow baseline velocity (0.2x),
 *    while foreground data particles move at a significantly higher velocity (1.5x) with particle trails.
 * 2. Framer Motion Floating Light Analytical Icons: Pure transparent, transferable SVG icons (charts,
 *    nodes, pipelines, queries, formulas) that float organically behind content without opaque boxes.
 */
export const DataBackgroundAnimation: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Mouse Parallax Offset
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const relX = (e.clientX - rect.left) / rect.width - 0.5;
      const relY = (e.clientY - rect.top) / rect.height - 0.5;
      setMouseOffset({
        x: relX * 22,
        y: relY * 22,
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // 3D Parallax Canvas Implementation
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

    // Multi-tier 3D Particle Network: Depth tiers (0.6, 1.1, 1.7)
    const particleCount = 34;
    const particles: DepthParticle[] = [];
    const types: ('node' | 'diamond' | 'table_cell' | 'circle')[] = [
      'node',
      'diamond',
      'table_cell',
      'circle',
    ];

    for (let i = 0; i < particleCount; i++) {
      const depthTier = i % 3;
      // Foreground particles (depth ~ 1.7) move significantly faster than background grid (depth ~ 0.6)
      const depth = depthTier === 0 ? 1.7 : depthTier === 1 ? 1.1 : 0.6;
      const speedScale = depthTier === 0 ? 0.5 : depthTier === 1 ? 0.3 : 0.18;

      const vx = (Math.random() - 0.5) * speedScale;
      const vy = (Math.random() - 0.5) * speedScale;

      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx,
        vy,
        baseVx: vx,
        baseVy: vy,
        radius: (Math.random() * 1.8 + 1.2) * (depthTier === 0 ? 1.4 : depthTier === 1 ? 1.0 : 0.75),
        depth,
        type: types[i % types.length],
        pulseAngle: Math.random() * Math.PI * 2,
        pulseSpeed: 0.015 + Math.random() * 0.02,
        alpha: (0.25 + Math.random() * 0.35) * (depthTier === 0 ? 1.1 : depthTier === 1 ? 0.85 : 0.6),
        trail: [],
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      const isDark = document.documentElement.classList.contains('dark');
      const nodeColor = isDark ? '235, 235, 232' : '85, 85, 80';
      const accentColor = isDark ? '229, 72, 53' : '229, 72, 53';

      // Multi-hue vibrant data palette for colorful light mode
      const lightDataColors = [
        '37, 99, 235',   // Sapphire / SQL Blue
        '229, 72, 53',   // Coral Red
        '16, 185, 129',  // Emerald KPI Green
        '217, 119, 6',   // Warm Amber / Power BI
        '99, 102, 241',  // Indigo / Python
        '13, 148, 136',  // Teal / Pipelines
      ];

      // =========================================================================
      // 1. DEEP BACKGROUND GRID LINES (Moves slowly at low baseline velocity: 0.2x)
      // =========================================================================
      const gridSize = 72;
      const gridParallaxX = ((mouseX > 0 ? (mouseX - width / 2) : 0) * 0.012 + scrollY * 0.01) % gridSize;
      const gridParallaxY = ((mouseY > 0 ? (mouseY - height / 2) : 0) * 0.012 + scrollY * 0.025) % gridSize;

      ctx.save();
      ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.035)' : 'rgba(37, 99, 235, 0.04)';
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

      // Small technical intersection markers
      ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(229, 72, 53, 0.08)';
      for (let x = -gridSize + gridParallaxX; x < width + gridSize; x += gridSize * 2) {
        for (let y = -gridSize + gridParallaxY; y < height + gridSize; y += gridSize * 2) {
          ctx.fillRect(x - 1, y - 1, 2, 2);
        }
      }
      ctx.restore();

      // =========================================================================
      // 2. CONNECTING CONDUIT LINES (Depth-weighted)
      // =========================================================================
      const maxDistance = 145;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            const proximity = 1 - dist / maxDistance;
            const avgDepth = (particles[i].depth + particles[j].depth) / 2;
            const lineAlpha = proximity * (isDark ? 0.16 : 0.12) * avgDepth;
            const lineColor = isDark 
              ? nodeColor 
              : (i % 2 === 0 ? '37, 99, 235' : '229, 72, 53');

            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(${lineColor}, ${lineAlpha})`;
            ctx.lineWidth = proximity > 0.7 ? 1 * avgDepth : 0.6 * avgDepth;
            ctx.stroke();
          }
        }
      }

      // =========================================================================
      // 3. CURSOR CONNECTION RETICLE
      // =========================================================================
      if (isMouseOver && mouseX > 0 && mouseY > 0) {
        const cursorMaxDist = 175;
        let connectedCount = 0;

        for (let i = 0; i < particles.length && connectedCount < 4; i++) {
          const dx = mouseX - particles[i].x;
          const dy = mouseY - particles[i].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < cursorMaxDist) {
            connectedCount++;
            const intensity = (1 - dist / cursorMaxDist) * particles[i].depth;

            ctx.beginPath();
            ctx.moveTo(mouseX, mouseY);
            ctx.lineTo(particles[i].x, particles[i].y);
            ctx.strokeStyle = `rgba(${accentColor}, ${intensity * 0.4})`;
            ctx.lineWidth = 1 * particles[i].depth;
            ctx.stroke();
          }
        }

        ctx.beginPath();
        ctx.arc(mouseX, mouseY, 4, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${accentColor}, 0.5)`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // =========================================================================
      // 4. PARTICLES (Foreground moves at high velocity, leaving trails)
      // =========================================================================
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (isMouseOver && mouseX > 0 && mouseY > 0) {
          const mdx = mouseX - p.x;
          const mdy = mouseY - p.y;
          const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
          if (mDist < 170 && mDist > 0) {
            const pullForce = ((170 - mDist) / 170) * 0.2 * p.depth;
            p.vx += (mdx / mDist) * pullForce;
            p.vy += (mdy / mDist) * pullForce;
          }
        }

        p.vx = p.vx * 0.98 + p.baseVx * 0.02;
        p.vy = p.vy * 0.98 + p.baseVy * 0.02;

        // Foreground particles move noticeably faster with different velocity than the background grid
        const mouseParallaxX = isMouseOver ? (mouseX - width / 2) * 0.00035 * p.depth : 0;
        const mouseParallaxY = isMouseOver ? (mouseY - height / 2) * 0.00035 * p.depth : 0;

        p.x += p.vx * p.depth + mouseParallaxX;
        p.y += p.vy * p.depth + mouseParallaxY;

        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20;
        if (p.y > height + 20) p.y = -20;

        p.pulseAngle += p.pulseSpeed;
        const pulse = Math.sin(p.pulseAngle) * 0.5 + 0.5;

        // Determine particle color (multi-hue in light mode, high-contrast in dark mode)
        const pColor = isDark
          ? (i % 4 === 0 ? accentColor : nodeColor)
          : lightDataColors[i % lightDataColors.length];

        // Fast foreground particles leave particle motion trails
        if (p.depth > 1.3) {
          p.trail.push({ x: p.x, y: p.y, alpha: 0.35 });
          if (p.trail.length > 5) p.trail.shift();

          for (let t = 0; t < p.trail.length; t++) {
            const tr = p.trail[t];
            tr.alpha *= 0.85;
            ctx.beginPath();
            ctx.arc(tr.x, tr.y, p.radius * 0.6, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${pColor}, ${tr.alpha * 0.5})`;
            ctx.fill();
          }
        }

        const currentAlpha = p.alpha * (0.8 + pulse * 0.4) * (isDark ? 0.75 : 0.85);

        if (p.type === 'diamond') {
          const size = p.radius * 2.2;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(Math.PI / 4);
          ctx.strokeStyle = `rgba(${pColor}, ${currentAlpha})`;
          ctx.lineWidth = 1.2;
          ctx.strokeRect(-size / 2, -size / 2, size, size);
          ctx.restore();
        } else if (p.type === 'table_cell') {
          const sizeW = p.radius * 3.4;
          const sizeH = p.radius * 1.8;
          ctx.strokeStyle = `rgba(${pColor}, ${currentAlpha})`;
          ctx.lineWidth = 1;
          ctx.strokeRect(p.x - sizeW / 2, p.y - sizeH / 2, sizeW, sizeH);
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${pColor}, ${currentAlpha})`;
          ctx.fill();

          if (p.depth > 1.3) {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius * 2.2, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(${pColor}, ${currentAlpha * 0.35})`;
            ctx.lineWidth = 0.9;
            ctx.stroke();
          }
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

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="absolute inset-0 overflow-hidden pointer-events-none z-0 select-none font-mono"
    >
      <style>{`
        /* Smooth continuous translation for data stream tickers */
        @keyframes tickerScrollLeft {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
        @keyframes tickerScrollRight {
          0% { transform: translate3d(-50%, 0, 0); }
          100% { transform: translate3d(0, 0, 0); }
        }
        @keyframes conduitDashPulse {
          0% { stroke-dashoffset: 80; }
          100% { stroke-dashoffset: 0; }
        }
        .anim-sql-ticker-left { animation: tickerScrollLeft 55s linear infinite; will-change: transform; }
        .anim-sql-ticker-right { animation: tickerScrollRight 58s linear infinite; will-change: transform; }
        .anim-conduit-pulse {
          stroke-dasharray: 6 12;
          animation: conduitDashPulse 2.4s linear infinite;
        }
      `}</style>

      {/* ========================================================================= */}
      {/* 1. 3D PARALLAX DEPTH CANVAS (Background grid + fast foreground particles) */}
      {/* ========================================================================= */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none opacity-65 dark:opacity-45"
      />

      {/* ========================================================================= */}
      {/* 2. SVG CONSTELLATION CONDUITS (Interconnected Nodes & Traveling Packets)  */}
      {/* ========================================================================= */}
      <svg
        className="absolute inset-0 w-full h-full opacity-40 dark:opacity-30 pointer-events-none"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="heroConduitGradOrange" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E54835" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#94A3B8" stopOpacity="0.08" />
          </linearGradient>
          <linearGradient id="heroConduitGradBlue" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0A66C2" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#94A3B8" stopOpacity="0.08" />
          </linearGradient>
        </defs>

        <g strokeWidth="1">
          <line x1="80" y1="120" x2="280" y2="160" stroke="url(#heroConduitGradOrange)" />
          <line x1="280" y1="160" x2="480" y2="90" stroke="rgba(148, 163, 184, 0.12)" />
          <line x1="280" y1="160" x2="380" y2="300" stroke="url(#heroConduitGradOrange)" />
          <line x1="940" y1="100" x2="1140" y2="140" stroke="url(#heroConduitGradBlue)" />
          <line x1="1140" y1="140" x2="1380" y2="80" stroke="rgba(148, 163, 184, 0.12)" />
          <line x1="1140" y1="140" x2="1100" y2="310" stroke="url(#heroConduitGradOrange)" />
          <line x1="140" y1="710" x2="340" y2="640" stroke="url(#heroConduitGradOrange)" />
          <line x1="980" y1="710" x2="1180" y2="640" stroke="url(#heroConduitGradBlue)" />

          {/* Active Data Pulse Lines */}
          <line x1="280" y1="160" x2="380" y2="300" stroke="#E54835" strokeWidth="1.5" strokeOpacity="0.6" className="anim-conduit-pulse" />
          <line x1="1140" y1="140" x2="1100" y2="310" stroke="#0A66C2" strokeWidth="1.5" strokeOpacity="0.6" className="anim-conduit-pulse" />
          <line x1="140" y1="710" x2="340" y2="640" stroke="#E54835" strokeWidth="1.5" strokeOpacity="0.6" className="anim-conduit-pulse" />
        </g>

        {/* Pulsing Nodes */}
        <g transform="translate(280, 160)">
          <circle cx="0" cy="0" r="10" fill="#E54835" fillOpacity="0.12" className="animate-ping" />
          <circle cx="0" cy="0" r="3.5" fill="#E54835" fillOpacity="0.8" />
        </g>
        <circle cx="80" cy="120" r="2.5" fill="#94A3B8" fillOpacity="0.5" />
        <circle cx="380" cy="300" r="3" fill="#E54835" fillOpacity="0.7" />

        <g transform="translate(1140, 140)">
          <circle cx="0" cy="0" r="10" fill="#0A66C2" fillOpacity="0.15" className="animate-ping" />
          <circle cx="0" cy="0" r="3.5" fill="#0A66C2" fillOpacity="0.8" />
        </g>
        <circle cx="1100" cy="310" r="3" fill="#0A66C2" fillOpacity="0.7" />
        <circle cx="1180" cy="640" r="3.5" fill="#0A66C2" fillOpacity="0.7" />
      </svg>

      {/* ========================================================================= */}
      {/* 3. FRAMER MOTION FLOATING LIGHT-COLORED ANALYTICAL ICONS (No white boxes) */}
      {/* ========================================================================= */}

      {/* A. CHARTS: Animated Donut Chart (Cohort Retention 78%) - Top Right */}
      <motion.div
        animate={{
          x: [0, 12, -8, 0],
          y: [0, -14, 8, 0],
          rotate: [0, 1.5, -1, 0],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          transform: `translate3d(${mouseOffset.x * 0.75}px, ${mouseOffset.y * 0.75}px, 0)`,
        }}
        className="absolute top-20 right-[5%] sm:right-[12%] lg:right-[16%] flex items-center gap-2.5 p-1 bg-transparent border-0 shadow-none text-neutral-700 dark:text-neutral-300 drop-shadow-xs z-0"
      >
        <div className="relative w-8 h-8 flex items-center justify-center shrink-0">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
            <circle cx="18" cy="18" r="14" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-neutral-300 dark:text-neutral-700 opacity-40" />
            <motion.circle
              cx="18"
              cy="18"
              r="14"
              fill="none"
              stroke="#E54835"
              strokeWidth="2.8"
              strokeDasharray={87.96}
              animate={{ strokeDashoffset: [87.96 * 0.32, 87.96 * 0.22, 87.96 * 0.28, 87.96 * 0.22] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              strokeLinecap="round"
            />
          </svg>
          <span className="absolute font-mono text-[8px] font-bold text-[#E54835]">78%</span>
        </div>
        <div className="flex flex-col">
          <span className="font-mono text-[9px] text-[#E54835] font-bold tracking-wider">CHART // COHORT</span>
          <span className="font-mono text-[8px] text-neutral-500">78% Retention Rate</span>
        </div>
      </motion.div>

      {/* B. CHARTS: Animated Trend Sparkline (7D Forecast) - Top Periphery */}
      <motion.div
        animate={{
          x: [0, -10, 8, 0],
          y: [0, 12, -8, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        style={{
          transform: `translate3d(${mouseOffset.x * 0.65}px, ${mouseOffset.y * 0.65}px, 0)`,
        }}
        className="absolute top-12 left-[48%] -translate-x-1/2 hidden lg:flex items-center gap-2 p-1 bg-transparent border-0 shadow-none text-neutral-700 dark:text-neutral-300 drop-shadow-xs z-0"
      >
        <LineChart className="w-4 h-4 text-[#E54835] shrink-0" />
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[9px] text-[#E54835] font-bold">TREND // 7D MA</span>
            <span className="text-[8px] font-mono text-emerald-600 font-bold">+18.4%</span>
          </div>
          <div className="w-24 h-4 relative">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 90 16">
              <motion.path
                d="M 2 14 L 16 10 L 32 12 L 48 5 L 64 7 L 78 2 L 88 3"
                fill="none"
                stroke="#E54835"
                strokeWidth="1.8"
                strokeLinecap="round"
                animate={{
                  d: [
                    "M 2 14 L 16 10 L 32 12 L 48 5 L 64 7 L 78 2 L 88 3",
                    "M 2 12 L 16 8 L 32 10 L 48 3 L 64 5 L 78 1 L 88 2",
                    "M 2 14 L 16 10 L 32 12 L 48 5 L 64 7 L 78 2 L 88 3",
                  ],
                }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              />
              <circle cx="88" cy="3" r="2" fill="#E54835" className="animate-ping" />
            </svg>
          </div>
        </div>
      </motion.div>

      {/* C. PIPELINES: Airflow DAG Pipeline Badge - Bottom Left Periphery */}
      <motion.div
        animate={{
          x: [0, -10, 10, 0],
          y: [0, -12, 8, 0],
          rotate: [0, -1, 1.5, 0],
        }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
        style={{
          transform: `translate3d(${mouseOffset.x * 0.7}px, ${mouseOffset.y * 0.7}px, 0)`,
        }}
        className="absolute bottom-28 left-[3%] sm:left-[6%] flex items-center gap-2 p-1 bg-transparent border-0 shadow-none text-neutral-700 dark:text-neutral-300 drop-shadow-xs z-0"
      >
        <Workflow className="w-4 h-4 text-cyan-600 shrink-0" />
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-cyan-600 font-mono">PIPELINE // DAG</span>
          <span className="text-[9px] font-mono text-neutral-500">
            etl_daily &gt;&gt; PASS [0ms]
          </span>
        </div>
      </motion.div>

      {/* D. NODES: Star Schema Relational Node - Mid Left */}
      <motion.div
        animate={{
          x: [0, 8, -10, 0],
          y: [0, -12, 10, 0],
        }}
        transition={{ duration: 21, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        style={{
          transform: `translate3d(${mouseOffset.x * 0.6}px, ${mouseOffset.y * 0.6}px, 0)`,
        }}
        className="absolute top-[50%] left-[2%] sm:left-[5%] hidden lg:flex items-center gap-2 p-1 bg-transparent border-0 shadow-none text-neutral-700 dark:text-neutral-300 drop-shadow-xs z-0"
      >
        <Database className="w-4 h-4 text-[#E54835] shrink-0" />
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-[#E54835] font-mono">NODE // POSTGRESQL</span>
          <span className="text-[9px] font-mono text-neutral-500">
            DENSE_RANK() OVER(PARTITION)
          </span>
        </div>
      </motion.div>

      {/* E. CHARTS: DAX Metric Fluctuating Bar Chart - Bottom Right Periphery */}
      <motion.div
        animate={{
          x: [0, 10, -12, 0],
          y: [0, 10, -14, 0],
        }}
        transition={{ duration: 19, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
        style={{
          transform: `translate3d(${mouseOffset.x * 0.8}px, ${mouseOffset.y * 0.8}px, 0)`,
        }}
        className="absolute bottom-24 right-[4%] sm:right-[8%] lg:right-[14%] flex items-center gap-2.5 p-1 bg-transparent border-0 shadow-none text-neutral-700 dark:text-neutral-300 drop-shadow-xs z-0"
      >
        <div className="flex items-end gap-1 h-5 w-9">
          <motion.div animate={{ height: ['35%', '85%', '50%', '35%'] }} transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }} className="w-1.5 bg-[#E54835] opacity-80" />
          <motion.div animate={{ height: ['65%', '45%', '90%', '65%'] }} transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }} className="w-1.5 bg-[#0A66C2] opacity-80" />
          <motion.div animate={{ height: ['30%', '95%', '60%', '30%'] }} transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }} className="w-1.5 bg-[#10B981] opacity-80" />
          <motion.div animate={{ height: ['75%', '55%', '80%', '75%'] }} transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }} className="w-1.5 bg-[#F59E0B] opacity-80" />
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-amber-600 font-mono">CHART // POWER BI</span>
          <span className="text-[9px] font-mono text-neutral-500">
            CALCULATE([Sales], SPLY)
          </span>
        </div>
      </motion.div>

      {/* F. TECH: LinkedIn Network Badge (Top Left Periphery) */}
      <motion.div
        animate={{
          x: [0, -10, 8, 0],
          y: [0, 12, -8, 0],
          rotate: [0, -1.5, 1, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          transform: `translate3d(${mouseOffset.x * 0.55}px, ${mouseOffset.y * 0.55}px, 0)`,
        }}
        className="absolute top-24 left-[3%] sm:left-[6%] flex items-center gap-2 p-1 bg-transparent border-0 shadow-none text-neutral-700 dark:text-neutral-300 drop-shadow-xs z-0"
      >
        <LinkedInIcon className="w-4 h-4 shrink-0" />
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-[#0A66C2] font-mono">LINKEDIN // NETWORK</span>
          <span className="text-[9px] font-mono text-neutral-500">
            Gowtham Pandiyan · Data Analyst
          </span>
        </div>
      </motion.div>

      {/* G. TECH: GitHub Repo Badge (Far Mid-Right) */}
      <motion.div
        animate={{
          x: [0, 12, -8, 0],
          y: [0, 10, -12, 0],
        }}
        transition={{ duration: 23, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        style={{
          transform: `translate3d(${mouseOffset.x * 0.7}px, ${mouseOffset.y * 0.7}px, 0)`,
        }}
        className="absolute top-[44%] right-[2%] sm:right-[5%] hidden sm:flex items-center gap-2 p-1 bg-transparent border-0 shadow-none text-neutral-700 dark:text-neutral-300 drop-shadow-xs z-0"
      >
        <GithubIcon className="w-4 h-4 shrink-0" />
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-neutral-800 dark:text-neutral-200 font-mono">GITHUB // REPO</span>
          <span className="text-[9px] font-mono text-neutral-500">
            gowthampandiyank / portfolio
          </span>
        </div>
      </motion.div>

      {/* H. TECH: NumPy & Pandas Data Arrays (Far Bottom Margins) */}
      <motion.div
        animate={{
          x: [0, 8, -10, 0],
          y: [0, -10, 10, 0],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut', delay: 2.5 }}
        style={{
          transform: `translate3d(${mouseOffset.x * 0.5}px, ${mouseOffset.y * 0.5}px, 0)`,
        }}
        className="absolute bottom-8 left-[32%] hidden xl:flex items-center gap-2 p-1 bg-transparent border-0 shadow-none text-neutral-700 dark:text-neutral-300 drop-shadow-xs z-0"
      >
        <NumpyIcon className="w-4 h-4 shrink-0" />
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-[#4c75cf] font-mono">NUMPY // ARRAY</span>
          <span className="text-[9px] font-mono text-neutral-500">
            np.ndarray · O(N log N)
          </span>
        </div>
      </motion.div>

      <motion.div
        animate={{
          x: [0, -8, 10, 0],
          y: [0, 10, -8, 0],
        }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut', delay: 1.8 }}
        style={{
          transform: `translate3d(${mouseOffset.x * 0.65}px, ${mouseOffset.y * 0.65}px, 0)`,
        }}
        className="absolute bottom-10 right-[35%] hidden xl:flex items-center gap-2 p-1 bg-transparent border-0 shadow-none text-neutral-700 dark:text-neutral-300 drop-shadow-xs z-0"
      >
        <PandasIcon className="w-4 h-4 shrink-0" />
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-[#e70488] font-mono">PANDAS // PIPELINE</span>
          <span className="text-[9px] font-mono text-neutral-500">
            df.groupby(&apos;cohort&apos;).agg()
          </span>
        </div>
      </motion.div>

      {/* ========================================================================= */}
      {/* 4. SUBTLE STREAMING SQL MARQUEE TICKERS (Light Subtle Ambience)            */}
      {/* ========================================================================= */}
      <div className="absolute top-28 inset-x-0 overflow-hidden opacity-25 pointer-events-none z-0">
        <div className="flex whitespace-nowrap anim-sql-ticker-left text-[11px] font-mono tracking-wider text-neutral-500">
          {[...Array(2)].map((_, loopIdx) => (
            <div key={loopIdx} className="flex items-center gap-12 pr-12">
              <span className="flex items-center gap-2">
                <span className="text-[#E54835] font-bold">&gt;</span>
                <span className="text-neutral-700 dark:text-neutral-300 font-semibold">SELECT</span>
                <span>customer_id, DENSE_RANK() OVER (PARTITION BY cohort ORDER BY clv DESC) FROM fact_orders;</span>
              </span>
              <span className="text-[#E54835]/30 font-mono">///</span>
              <span className="flex items-center gap-2">
                <span className="text-[#0A66C2] font-bold">&gt;</span>
                <span className="text-neutral-700 dark:text-neutral-300 font-semibold">WITH</span>
                <span>cohort_retention AS (SELECT user_id, DATE_TRUNC(&apos;month&apos;, first_date) FROM sales);</span>
              </span>
              <span className="text-[#0A66C2]/30 font-mono">///</span>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-16 inset-x-0 overflow-hidden opacity-25 pointer-events-none z-0">
        <div className="flex whitespace-nowrap anim-sql-ticker-right text-[11px] font-mono tracking-wider text-neutral-500">
          {[...Array(2)].map((_, loopIdx) => (
            <div key={loopIdx} className="flex items-center gap-12 pr-12">
              <span className="flex items-center gap-2">
                <span className="text-[#0A66C2] font-bold">&gt;&gt;</span>
                <span className="text-neutral-700 dark:text-neutral-300 font-semibold">CALCULATE</span>
                <span>([Total Revenue], SAMEPERIODLASTYEAR(&apos;Calendar&apos;[Date]));</span>
              </span>
              <span className="text-[#0A66C2]/30 font-mono">///</span>
              <span className="flex items-center gap-2">
                <span className="text-[#E54835] font-bold">&gt;&gt;</span>
                <span className="text-neutral-700 dark:text-neutral-300 font-semibold">EXPLAIN ANALYZE</span>
                <span>SELECT * FROM fact_transactions WHERE latency &lt; 14ms;</span>
              </span>
              <span className="text-[#E54835]/30 font-mono">///</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
