'use client';

import { useRef, useEffect, useCallback } from 'react';
import { useTheme } from './ThemeProvider';

// ── Config ──────────────────────────────────────────────────
// ── Config ──────────────────────────────────────────────────
const GRID_SPACING = 40;          // px between particle origins (Increased for performance)
const PARTICLE_RADIUS = 1.4;      // dot size
const JITTER = 6;                 // max random offset from grid
const REPULSE_RADIUS = 120;       // cursor influence radius
const REPULSE_STRENGTH = 8;       // how hard particles push away
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
    const cols = Math.ceil(w / GRID_SPACING) + 2;
    const rows = Math.ceil(h / GRID_SPACING) + 2;
    const particles: Particle[] = [];

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const ox = c * GRID_SPACING + (Math.random() - 0.5) * JITTER;
        const oy = r * GRID_SPACING + (Math.random() - 0.5) * JITTER;
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

    // ── Render loop ───────────────────────────────────────
    const tick = () => {
      const w = canvas.width / (window.devicePixelRatio || 1);
      const h = canvas.height / (window.devicePixelRatio || 1);
      const isDark = themeRef.current === 'dark';
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const r2 = REPULSE_RADIUS * REPULSE_RADIUS;

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

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    // ── Cleanup ───────────────────────────────────────────
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
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





