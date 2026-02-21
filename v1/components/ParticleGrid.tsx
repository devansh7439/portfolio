'use client';

import { useRef, useEffect, useCallback } from 'react';
import { useTheme } from './ThemeProvider';

// ── Config ──────────────────────────────────────────────────
// ── Config ──────────────────────────────────────────────────
const GRID_SPACING = 40;          // px between particle origins
const GRID_SPACING_MOBILE = 60;   // wider spacing on mobile for better perf // px between particle origins (Increased for performance)
const PARTICLE_RADIUS = 1.4;      // dot size
const JITTER = 6;                 // max random offset from grid
const REPULSE_RADIUS = 120;       // cursor influence radius
const REPULSE_STRENGTH = 8;       // how hard particles push away
const PURPLE_HOVER_RADIUS = 190;  // purple glow influence radius
const PURPLE_RGB_DARK = '167,139,250';
const PURPLE_RGB_LIGHT = '109,40,217';
const PURPLE_HOVER_ALPHA_DARK = 0.46;
const PURPLE_HOVER_ALPHA_LIGHT = 0.28;
const RETURN_SPEED = 0.06;        // lerp speed back to origin (0–1)
const FRICTION = 0.88;            // velocity damping

// ── Types ───────────────────────────────────────────────────
interface Particle {
  ox: number;   // origin x
  oy: number;   // origin y
  x: number;    // current x
  y: number;    // current y
  vx: number;   // velocity x
  vy: number;   // velocity y
}

// ── Component ───────────────────────────────────────────────
export default function ParticleGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const rafRef = useRef<number>(0);
  const { theme } = useTheme();
  const themeRef = useRef(theme);

  // Keep theme ref in sync without re-running the main effect
  useEffect(() => { themeRef.current = theme; }, [theme]);

  // Build grid of particles for given dimensions
  const buildGrid = useCallback((w: number, h: number) => {
    const spacing = w < 768 ? GRID_SPACING_MOBILE : GRID_SPACING;
    const cols = Math.ceil(w / spacing) + 2;
    const rows = Math.ceil(h / spacing) + 2;
    const particles: Particle[] = [];

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const ox = c * spacing + (Math.random() - 0.5) * JITTER;
        const oy = r * spacing + (Math.random() - 0.5) * JITTER;
        particles.push({ ox, oy, x: ox, y: oy, vx: 0, vy: 0 });
      }
    }

    particlesRef.current = particles;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    // ── Sizing ────────────────────────────────────────────
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildGrid(w, h);
    };

    resize();
    window.addEventListener('resize', resize);

    // ── Mouse tracking ────────────────────────────────────
    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };

    const onMouseLeave = () => {
      mouseRef.current.x = -9999;
      mouseRef.current.y = -9999;
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);

    // Touch tracking (mobile)
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouseRef.current.x = e.touches[0].clientX;
        mouseRef.current.y = e.touches[0].clientY;
      }
    };
    const onTouchEnd = () => {
      mouseRef.current.x = -9999;
      mouseRef.current.y = -9999;
    };
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });

    // ── Render loop ───────────────────────────────────────
    const tick = () => {
      const w = canvas.width / (window.devicePixelRatio || 1);
      const h = canvas.height / (window.devicePixelRatio || 1);
      const isDark = themeRef.current === 'dark';
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const r2 = REPULSE_RADIUS * REPULSE_RADIUS;
      const purpleR2 = PURPLE_HOVER_RADIUS * PURPLE_HOVER_RADIUS;

      // Clear
      ctx.fillStyle = isDark ? '#0a0a0a' : '#ffffff';
      ctx.fillRect(0, 0, w, h);

      // Particle color
      ctx.fillStyle = isDark ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.9)';

      const particles = particlesRef.current;
      const len = particles.length;

      ctx.beginPath();

      for (let i = 0; i < len; i++) {
        const p = particles[i];

        // Repulsion from mouse
        const dx = p.x - mx;
        const dy = p.y - my;
        const dist2 = dx * dx + dy * dy;

        if (dist2 < r2 && dist2 > 0) {
          const dist = Math.sqrt(dist2);
          const force = (1 - dist / REPULSE_RADIUS) * REPULSE_STRENGTH;
          const nx = dx / dist;
          const ny = dy / dist;
          p.vx += nx * force;
          p.vy += ny * force;
        }

        // Spring back to origin
        p.vx += (p.ox - p.x) * RETURN_SPEED;
        p.vy += (p.oy - p.y) * RETURN_SPEED;

        // Damping
        p.vx *= FRICTION;
        p.vy *= FRICTION;

        // Integrate
        p.x += p.vx;
        p.y += p.vy;

        // Draw (batched path)
        ctx.moveTo(p.x + PARTICLE_RADIUS, p.y);
        ctx.arc(p.x, p.y, PARTICLE_RADIUS, 0, Math.PI * 2);
      }

      ctx.fill();

      // Subtle premium-purple accent around cursor
      if (mx > -1000 && my > -1000) {
        const purpleRGB = isDark ? PURPLE_RGB_DARK : PURPLE_RGB_LIGHT;
        const maxAlpha = isDark ? PURPLE_HOVER_ALPHA_DARK : PURPLE_HOVER_ALPHA_LIGHT;

        for (let i = 0; i < len; i++) {
          const p = particles[i];
          const dx = p.x - mx;
          const dy = p.y - my;
          const dist2 = dx * dx + dy * dy;

          if (dist2 >= purpleR2 || dist2 <= 0) continue;

          const dist = Math.sqrt(dist2);
          const intensity = 1 - dist / PURPLE_HOVER_RADIUS;
          const alpha = maxAlpha * intensity * intensity;
          if (alpha < 0.015) continue;

          ctx.fillStyle = `rgba(${purpleRGB},${alpha.toFixed(3)})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, PARTICLE_RADIUS + intensity * 0.65, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    // ── Cleanup ───────────────────────────────────────────
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [buildGrid]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ pointerEvents: 'none' }}
      aria-hidden="true"
    />
  );
}





