'use client';

import { motion } from "framer-motion";
import { Github, Linkedin, Mail, Phone } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { useState, useEffect } from "react";

type ContactNode = {
  label: string;
  href: string;
  icon: typeof Phone;
  external?: boolean;
};

type ContactAccent = {
  rgb: string;
  textOnDark: string;
  textOnLight: string;
};

const emailAddress = "devanshbagaria07@gmail.com";

const contactAccents: Record<string, ContactAccent> = {
  default: {
    rgb: "34,211,238",
    textOnDark: "#a5f3fc",
    textOnLight: "#155e75",
  },
  Phone: {
    rgb: "52,211,153",
    textOnDark: "#86efac",
    textOnLight: "#065f46",
  },
  LinkedIn: {
    rgb: "59,130,246",
    textOnDark: "#bfdbfe",
    textOnLight: "#1e3a8a",
  },
  GitHub: {
    rgb: "15,23,42",
    textOnDark: "#e2e8f0",
    textOnLight: "#020617",
  },
  Mail: {
    rgb: "245,158,11",
    textOnDark: "#fde68a",
    textOnLight: "#78350f",
  },
};

function rgba(rgb: string, alpha: number): string {
  return `rgba(${rgb}, ${alpha})`;
}

function getContactVisuals(label: string, isDark: boolean, isActive: boolean) {
  const accent = contactAccents[label] ?? contactAccents.default;
  const neutralRgb = isDark ? "34,211,238" : "8,145,178";
  if (isDark) {
    if (!isActive) {
      return {
        beamFrom: rgba(neutralRgb, 0.56),
        tileBorder: rgba(neutralRgb, 0.34),
        tileBg: rgba(neutralRgb, 0.12),
        icon: rgba(neutralRgb, 0.78),
        labelText: rgba(neutralRgb, 0.82),
        labelBorder: rgba(neutralRgb, 0.26),
        labelBg: rgba(neutralRgb, 0.12),
      };
    }

    return {
      beamFrom: rgba(accent.rgb, 0.92),
      tileBorder: rgba(accent.rgb, 0.78),
      tileBg: rgba(accent.rgb, 0.32),
      icon: accent.textOnDark,
      labelText: accent.textOnDark,
      labelBorder: rgba(accent.rgb, 0.56),
      labelBg: rgba(accent.rgb, 0.24),
    };
  }

  if (!isActive) {
    return {
      beamFrom: rgba(neutralRgb, 0.44),
      tileBorder: rgba(neutralRgb, 0.3),
      tileBg: rgba(neutralRgb, 0.08),
      icon: rgba(neutralRgb, 0.8),
      labelText: rgba(neutralRgb, 0.82),
      labelBorder: rgba(neutralRgb, 0.22),
      labelBg: rgba(neutralRgb, 0.08),
    };
  }

  return {
    beamFrom: rgba(accent.rgb, 0.78),
    tileBorder: rgba(accent.rgb, 0.66),
    tileBg: rgba(accent.rgb, 0.22),
    icon: accent.textOnLight,
    labelText: accent.textOnLight,
    labelBorder: rgba(accent.rgb, 0.45),
    labelBg: rgba(accent.rgb, 0.18),
  };
}

const projectorContacts: ContactNode[] = [
  {
    label: "Phone",
    href: "tel:+917439234828",
    icon: Phone,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/devansh-bagaria-167921300/",
    icon: Linkedin,
    external: true,
  },
  {
    label: "GitHub",
    href: "https://github.com/devansh7439",
    icon: Github,
    external: true,
  },
  {
    label: "Mail",
    href: `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(emailAddress)}`,
    icon: Mail,
    external: true,
  },
];

export default function ContactMe() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <section  className="min-h-[60vh] w-full py-20 px-5 md:px-10 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Animated background grid */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute inset-0" style={{
          backgroundImage: isDark
            ? 'radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px)'
            : 'radial-gradient(circle, rgba(0,0,0,0.06) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="max-w-5xl mx-auto text-center relative z-10">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          id="contact"
          viewport={{ once: true }}
          className={`uppercase tracking-widest text-sm mb-4 block ${isDark ? 'text-white/40' : 'text-gray-600'}`}
        >
          What&apos;s Next?
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          style={{ fontFamily: "var(--font-gravitas-one)" }}
          className={`text-5xl md:text-6xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}
        >
          <span className={`about-heading-aurora ${isDark ? "about-heading-aurora--dark" : "about-heading-aurora--light"}`}>
            <span className="about-heading-aurora__text">Get In Touch</span>
          </span>
          <motion.span
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 1, repeat: Infinity, repeatDelay: 0.5 }}
            className={`ml-1 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}
          >
            _
          </motion.span>
        </motion.h2>
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className={`w-16 h-px mx-auto mt-6 mb-8 ${isDark ? 'bg-white/30' : 'bg-black/30'}`}
        />

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          style={{ fontFamily: "var(--font-poppins)" }}
          className={`text-sm md:text-base leading-relaxed max-w-2xl mx-auto mb-10 ${isDark ? 'text-white/60' : 'text-gray-700'}`}
        >
          Hover the projector base to reveal phone, LinkedIn, GitHub, and mail channels. On mobile, tap the base to activate the hologram.
        </motion.p>

        <HolographicProjector isDark={isDark} />
      </div>
    </section>
  );
}

function HolographicProjector({ isDark }: { isDark: boolean }) {
  const [isProjecting, setIsProjecting] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.3 }}
      viewport={{ once: true }}
      onMouseEnter={() => { if (!isTouchDevice) setIsProjecting(true); }}
      onMouseLeave={() => { if (!isTouchDevice) setIsProjecting(false); }}
      onFocusCapture={() => setIsProjecting(true)}
      onBlurCapture={() => setIsProjecting(false)}
      className="relative mx-auto w-[min(760px,97vw)] h-[320px] sm:h-[360px] select-none"
    >
      {/* Status indicator */}
      <motion.div
        className={`absolute top-2 left-1/2 -translate-x-1/2 rounded-full px-4 py-1 text-[10px] tracking-[0.2em] uppercase border ${
          isDark
            ? 'border-cyan-200/30 bg-cyan-400/10 text-cyan-100/90'
            : 'border-cyan-700/20 bg-cyan-500/10 text-cyan-800/80'
        }`}
        animate={{
          opacity: isProjecting ? [0.72, 1, 0.82] : 0.62,
        }}
        transition={{ duration: 1.1, repeat: isProjecting ? Infinity : 0 }}
      >
        {isTouchDevice ? (isProjecting ? "Tap base to hide" : "Tap base to reveal") : (isProjecting ? "Projector Online" : "Hover to activate")}
      </motion.div>

      {/* Floor reflection */}
      <motion.div
        className={`absolute bottom-3 left-1/2 h-14 w-[330px] md:w-[420px] -translate-x-1/2 rounded-full blur-2xl ${
          isDark ? 'bg-cyan-400/30' : 'bg-cyan-500/20'
        }`}
        animate={{
          opacity: isProjecting ? 0.7 : 0.28,
          scale: isProjecting ? 1.15 : 1,
        }}
        transition={{ duration: 0.28, ease: "easeOut" }}
      />

      {/* Ambient hologram aura */}
      <motion.div
        className="absolute left-1/2 bottom-[92px] h-[180px] w-[320px] md:w-[420px] -translate-x-1/2 rounded-full pointer-events-none blur-3xl"
        style={{
          background: isDark
            ? "radial-gradient(circle at 50% 60%, rgba(56,189,248,0.42) 0%, rgba(34,211,238,0.18) 45%, rgba(34,211,238,0) 80%)"
            : "radial-gradient(circle at 50% 60%, rgba(8,145,178,0.32) 0%, rgba(6,182,212,0.12) 45%, rgba(6,182,212,0) 80%)",
        }}
        animate={{
          opacity: isProjecting ? [0.25, 0.68, 0.34] : 0.12,
          scale: isProjecting ? [0.94, 1.06, 0.98] : 0.9,
        }}
        transition={{ duration: 2.2, repeat: isProjecting ? Infinity : 0, ease: "easeInOut" }}
      />

      {/* Orbital hologram ring */}
      <motion.div
        className={`absolute bottom-[122px] left-1/2 h-24 w-24 -translate-x-1/2 rounded-full border pointer-events-none ${
          isDark ? 'border-cyan-200/40' : 'border-cyan-700/25'
        }`}
        animate={
          isProjecting
            ? {
                rotate: [0, 360],
                opacity: [0.2, 0.8, 0.3],
                scale: [0.92, 1.06, 0.95],
              }
            : { rotate: 0, opacity: 0, scale: 0.9 }
        }
        transition={{ duration: 2.6, repeat: isProjecting ? Infinity : 0, ease: "linear" }}
      />
      <motion.div
        className={`absolute bottom-[116px] left-1/2 h-36 w-36 -translate-x-1/2 rounded-full border border-dashed pointer-events-none ${
          isDark ? 'border-cyan-200/25' : 'border-cyan-700/20'
        }`}
        animate={
          isProjecting
            ? {
                rotate: [360, 0],
                opacity: [0.14, 0.44, 0.2],
                scale: [0.96, 1.1, 0.98],
              }
            : { rotate: 0, opacity: 0, scale: 0.9 }
        }
        transition={{ duration: 3.4, repeat: isProjecting ? Infinity : 0, ease: "linear" }}
      />

      {/* Emission pulse from projector lens */}
      <motion.div
        className={`absolute bottom-[82px] left-1/2 h-20 w-20 -translate-x-1/2 rounded-full border pointer-events-none ${
          isDark ? 'border-cyan-200/45' : 'border-cyan-700/30'
        }`}
        animate={
          isProjecting
            ? { opacity: [0.7, 0, 0], scale: [0.4, 1.55, 1.8] }
            : { opacity: 0, scale: 0.4 }
        }
        transition={{ duration: 1.1, repeat: isProjecting ? Infinity : 0, ease: "easeOut" }}
      />

      {/* Hologram beam */}
      <motion.div
        className="absolute bottom-16 left-1/2 h-[170px] w-[230px] -translate-x-1/2 pointer-events-none"
        style={{
          clipPath: "polygon(46% 0%, 54% 0%, 100% 100%, 0% 100%)",
          background: isDark
            ? "linear-gradient(180deg, rgba(56,189,248,0.5) 0%, rgba(34,211,238,0.18) 45%, rgba(56,189,248,0.02) 100%)"
            : "linear-gradient(180deg, rgba(8,145,178,0.35) 0%, rgba(6,182,212,0.12) 45%, rgba(8,145,178,0.02) 100%)",
          filter: "blur(1px)",
        }}
        animate={{
          opacity: isProjecting ? 1 : 0,
          scaleY: isProjecting ? 1 : 0.62,
        }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        >
          <motion.div
            className="absolute inset-0"
            style={{
              backgroundImage: "repeating-linear-gradient(to bottom, rgba(255,255,255,0.38) 0px, rgba(255,255,255,0.38) 1px, transparent 3px, transparent 6px)",
              mixBlendMode: "screen",
            }}
            animate={isProjecting ? { backgroundPositionY: ["0px", "18px"] } : { backgroundPositionY: "0px" }}
            transition={{ duration: 0.22, repeat: isProjecting ? Infinity : 0, ease: "linear" }}
          />
        <motion.div
          className="absolute left-1/2 top-0 h-full w-[3px] -translate-x-1/2"
          style={{
            background: isDark
              ? "linear-gradient(180deg, rgba(186,230,253,0.9) 0%, rgba(56,189,248,0.48) 55%, rgba(56,189,248,0.02) 100%)"
              : "linear-gradient(180deg, rgba(14,116,144,0.75) 0%, rgba(6,182,212,0.32) 55%, rgba(6,182,212,0.02) 100%)",
            filter: "blur(0.4px)",
          }}
          animate={isProjecting ? { opacity: [0.45, 0.9, 0.55] } : { opacity: 0 }}
          transition={{ duration: 0.5, repeat: isProjecting ? Infinity : 0, ease: "easeInOut" }}
        />
      </motion.div>

      {/* Hologram nodes */}
      <motion.div
        className="absolute left-1/2 bottom-[128px] -translate-x-1/2 flex items-end justify-center gap-3 sm:gap-5 md:gap-7"
        animate={{
          opacity: isProjecting ? 1 : 0,
          y: isProjecting ? 0 : 20,
        }}
        transition={{ duration: 0.22, ease: "easeOut" }}
      >
        {projectorContacts.map((contact, index) => (
          <HologramContactNode
            key={contact.label}
            contact={contact}
            index={index}
            isProjecting={isProjecting}
            isDark={isDark}
          />
        ))}
      </motion.div>

      {/* Projector base */}
      <button
        type="button"
        aria-label="Toggle contact projector"
        aria-pressed={isProjecting}
        onClick={() => setIsProjecting((prev) => !prev)}
        className="group/projector absolute bottom-0 left-1/2 h-[98px] w-[min(330px,90vw)] md:w-[410px] -translate-x-1/2 rounded-[36px] focus:outline-none focus-visible:outline-none"
      >
        <div
          className={`absolute inset-0 rounded-[36px] border backdrop-blur-xl ${
            isDark
              ? 'border-white/20 bg-gradient-to-b from-white/[0.2] via-white/[0.08] to-white/[0.02] shadow-[0_28px_60px_rgba(0,0,0,0.55)]'
              : 'border-black/15 bg-gradient-to-b from-white/90 via-white/70 to-white/45 shadow-[0_18px_44px_rgba(0,0,0,0.22)]'
          }`}
          style={{ transform: "perspective(1200px) rotateX(58deg)", transformOrigin: "center bottom" }}
        />
        <motion.div
          className={`absolute inset-x-10 top-[26px] h-px pointer-events-none ${
            isDark ? 'bg-cyan-100/55' : 'bg-cyan-700/45'
          }`}
          animate={isProjecting ? { opacity: [0.2, 0.85, 0.35], scaleX: [0.86, 1.05, 0.92] } : { opacity: 0.22, scaleX: 0.9 }}
          transition={{ duration: 1, repeat: isProjecting ? Infinity : 0, ease: "easeInOut" }}
        />

        <motion.div
          className={`absolute left-1/2 top-[42px] h-7 w-16 -translate-x-1/2 rounded-full border ${
            isDark ? 'border-cyan-200/50 bg-cyan-300/30' : 'border-cyan-700/35 bg-cyan-500/30'
          }`}
          animate={{
            opacity: isProjecting ? [0.45, 0.95, 0.55] : 0.35,
            boxShadow: isProjecting
              ? [
                  "0 0 0 0 rgba(34,211,238,0.24)",
                  "0 0 20px 3px rgba(34,211,238,0.42)",
                  "0 0 6px 1px rgba(34,211,238,0.2)",
                ]
              : "0 0 0 0 rgba(34,211,238,0)",
          }}
          transition={{ duration: 1.3, repeat: isProjecting ? Infinity : 0 }}
        />

        <span className="sr-only">
          {isProjecting ? "Deactivate hologram" : "Activate hologram"}
        </span>
      </button>
    </motion.div>
  );
}

function HologramContactNode({
  contact,
  index,
  isProjecting,
  isDark,
}: {
  contact: ContactNode;
  index: number;
  isProjecting: boolean;
  isDark: boolean;
}) {
  const Icon = contact.icon;
  const [isHovered, setIsHovered] = useState(false);
  const isActive = isProjecting && isHovered;
  const accent = contactAccents[contact.label] ?? contactAccents.default;
  const visuals = getContactVisuals(contact.label, isDark, isActive);
  const neutralGlowRgb = isDark ? "34,211,238" : "8,145,178";
  const glowRgb = isActive ? accent.rgb : neutralGlowRgb;
  const softGlow = `0 0 8px ${rgba(glowRgb, isDark ? (isActive ? 0.28 : 0.16) : isActive ? 0.18 : 0.12)}`;
  const midGlow = `0 0 16px ${rgba(glowRgb, isDark ? (isActive ? 0.42 : 0.24) : isActive ? 0.3 : 0.18)}`;
  const strongGlow = `0 0 28px ${rgba(glowRgb, isDark ? (isActive ? 0.62 : 0.32) : isActive ? 0.45 : 0.24)}`;

  return (
    <motion.a
      href={contact.href}
      target={contact.external ? "_blank" : undefined}
      rel={contact.external ? "noopener noreferrer" : undefined}
      aria-label={contact.label}
      className="relative flex flex-col items-center gap-2 focus:outline-none focus-visible:outline-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
      animate={{
        opacity: isProjecting ? 1 : 0,
        y: isProjecting ? 0 : 14,
      }}
      transition={{ duration: 0.2, delay: index * 0.08 }}
      whileHover={isProjecting ? { y: -4, scale: 1.03 } : undefined}
      whileTap={{ scale: 0.96 }}
      style={{ pointerEvents: isProjecting ? "auto" : "none" }}
    >
      <motion.div
        className="absolute left-1/2 top-[calc(100%-10px)] h-12 w-px -translate-x-1/2 pointer-events-none"
        style={{
          background: `linear-gradient(to bottom, ${visuals.beamFrom} 0%, rgba(0,0,0,0) 88%)`,
        }}
        animate={isProjecting ? { opacity: isActive ? [0.36, 1, 0.56] : [0.2, 0.72, 0.34] } : { opacity: 0 }}
        transition={{ duration: 0.6, repeat: isProjecting ? Infinity : 0, delay: index * 0.1 }}
      />

      <motion.div
        className="relative h-16 w-16 md:h-20 md:w-20 rounded-2xl border overflow-hidden"
        style={{
          borderColor: visuals.tileBorder,
          backgroundColor: visuals.tileBg,
        }}
        animate={
          isProjecting
            ? {
                x: [0, isActive ? -1.6 : -0.9, isActive ? 1.3 : 0.8, 0],
                y: [0, isActive ? -2.2 : -1.4, isActive ? 1.1 : 0.7, 0],
                opacity: isActive ? [0.86, 1, 0.92] : [0.68, 0.94, 0.8],
                boxShadow: isActive ? [softGlow, strongGlow, midGlow] : [softGlow, midGlow, softGlow],
              }
            : { x: 0, y: 0, opacity: 0.2 }
        }
        transition={{
          duration: isActive ? 0.2 : 0.26,
          repeat: isProjecting ? Infinity : 0,
          repeatType: "mirror",
          ease: "linear",
        }}
      >
        <motion.div
          className="absolute inset-0"
          style={{
            backgroundImage: "repeating-linear-gradient(to bottom, rgba(255,255,255,0.32) 0px, rgba(255,255,255,0.32) 1px, transparent 3px, transparent 7px)",
          }}
          animate={isProjecting ? { backgroundPositionY: ["0px", "14px"] } : { backgroundPositionY: "0px" }}
          transition={{ duration: 0.2, repeat: isProjecting ? Infinity : 0, ease: "linear" }}
        />

        <div className="absolute inset-0 flex items-center justify-center">
          <Icon className="h-7 w-7 md:h-8 md:w-8 transition-colors duration-200" style={{ color: visuals.icon }} />
        </div>
      </motion.div>

      <span
        className="px-2.5 py-1 rounded-full text-[10px] md:text-xs tracking-[0.16em] uppercase border transition-colors duration-200"
        style={{
          color: visuals.labelText,
          borderColor: visuals.labelBorder,
          backgroundColor: visuals.labelBg,
        }}
      >
        {contact.label}
      </span>
    </motion.a>
  );
}
