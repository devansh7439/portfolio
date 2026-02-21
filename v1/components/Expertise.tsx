'use client';

import { motion } from "framer-motion";
import { useTheme } from "./ThemeProvider";
import { useState, useEffect } from "react";

const expertiseCategories = [
  {
    category: "AI Automations",
    items: [
      "End-to-End Workflow Automation",
      "Email Automation",
      "CRM Integration",
      "Smart Scheduling",
    ],
  },
  {
    category: "AI-First Websites",
    items: [
      "High-Performance Interfaces",
      "Dynamic AI Experiences",
      "Integrated AI Features",
      "Modern Frontend Architecture",
    ],
  },
  {
    category: "Custom AI Tools",
    items: [
      "Bespoke LLM Applications",
      "Internal AI Tooling",
      "AI Copywriting Workflows",
      "Image & Video Generation",
    ],
  },
  {
    category: "Technical Due Diligence",
    items: [
      "Correctness Audits",
      "Security Review",
      "Scalability Assessment",
      "Architecture Risk Analysis",
    ],
  },
  {
    category: "Chatbots & Assistants",
    items: [
      "Custom AI Chatbots",
      "Virtual Assistants",
      "Customer Support Bots",
      "Lead Qualification",
    ],
  },
  {
    category: "Document & Data Processing",
    items: [
      "PDF Data Extraction",
      "OCR & Text Recognition",
      "Automated Data Entry",
      "Report Generation",
    ],
  },
];

export default function Expertise() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <section className="min-h-[50vh] w-full py-20 px-5 md:px-10 flex items-center justify-center relative overflow-hidden">



      <div className="max-w-6xl mx-auto w-full" style={{ fontFamily: "var(--font-poppins)" }}>
        <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{ fontFamily: "var(--font-gravitas-one)" }}
            className={`text-4xl md:text-5xl font-bold text-center tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}
            id="expertise"
        >
          <span className={`about-heading-aurora ${isDark ? "about-heading-aurora--dark" : "about-heading-aurora--light"}`}>
            <span className="about-heading-aurora__text">Expertise</span>
          </span>
        </motion.h2>
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className={`w-16 h-px mx-auto mt-6 mb-16 ${isDark ? 'bg-white/30' : 'bg-black/30'}`}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 items-stretch">
          {expertiseCategories.map((category, index) => (
            <ExpertiseCard key={category.category} category={category} index={index} isDark={isDark} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ExpertiseCard({ category, index, isDark }: { category: { category: string; items: string[] }; index: number; isDark: boolean }) {
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);
  const accentRgb = "168,85,247";
  const accentOverlay = isDark
    ? "linear-gradient(145deg, rgba(168,85,247,0.10) 0%, rgba(196,181,253,0.06) 45%, rgba(255,255,255,0.02) 100%)"
    : "linear-gradient(145deg, rgba(168,85,247,0.07) 0%, rgba(196,181,253,0.04) 45%, rgba(255,255,255,0.2) 100%)";
  
  const addRipple = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();
    
    setRipples(prev => [...prev, { id, x, y }]);
    setTimeout(() => setRipples(prev => prev.filter(r => r.id !== id)), 600);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      viewport={{ once: true }}
      whileHover={isTouchDevice ? undefined : { y: -8 }}
      whileTap={{ scale: 0.98 }}
      className="group relative h-full"
    >
      {/* Glow effect on hover */}
      <div className={`absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 blur-lg ${
        isDark 
          ? 'bg-violet-300/16'
          : 'bg-violet-700/10'
      }`} />
      
      {/* Liquid Glass Card */}
      <div 
        onClick={addRipple}
        className={`relative h-full overflow-hidden rounded-2xl backdrop-blur-xl p-8 transition-all duration-500 flex flex-col cursor-pointer card-surface-pulse ${
          isDark 
            ? 'bg-white/[0.04] border border-white/[0.1] shadow-[0_8px_32px_rgba(0,0,0,0.36)] group-hover:border-violet-300/28 group-hover:bg-violet-500/[0.04]' 
            : 'bg-white/60 border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.1)] group-hover:border-violet-700/24 group-hover:bg-violet-500/[0.08] group-hover:shadow-[0_12px_40px_rgba(0,0,0,0.15)]'
        }`}
      >
        {/* Ripple effects */}
        {ripples.map(ripple => (
          <span 
            key={ripple.id}
            className={`absolute rounded-full animate-ping pointer-events-none ${isDark ? 'bg-violet-300/30' : 'bg-violet-700/22'}`}
            style={{
              left: ripple.x - 10,
              top: ripple.y - 10,
              width: 20,
              height: 20,
            }}
          />
        ))}
        
        {/* Shimmer effect */}
        <div className={`absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none ${
          isDark ? 'bg-gradient-to-r from-transparent via-white/5 to-transparent' : 'bg-gradient-to-r from-transparent via-black/5 to-transparent'
        }`} />
        <div className={`absolute inset-0 pointer-events-none card-sheen-loop ${
          isDark ? 'bg-gradient-to-r from-transparent via-white/[0.14] to-transparent' : 'bg-gradient-to-r from-transparent via-white/[0.34] to-transparent'
        }`} />
        
        {/* Inner gradient */}
        <div className={`absolute inset-0 pointer-events-none ${
          isDark 
            ? 'bg-gradient-to-br from-white/[0.05] via-transparent to-transparent' 
            : 'bg-gradient-to-br from-white/40 via-white/10 to-transparent'
        }`} />
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-500 opacity-35 group-hover:opacity-55"
          style={{ background: accentOverlay }}
        />
        
        {/* Header with spinning number */}
        <div className={`flex items-start gap-3 mb-6 pb-3 border-b min-h-[72px] ${
          isDark ? 'border-white/[0.08]' : 'border-black/[0.08]'
        }`}>
          <motion.span 
            initial={{ rotate: -180, scale: 0 }}
            whileInView={{ rotate: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: index * 0.1 + 0.3 }}
            viewport={{ once: true }}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
              isDark 
                ? 'bg-gradient-to-br from-violet-300/[0.22] to-fuchsia-300/[0.10] text-violet-100 border border-violet-300/18' 
                : 'bg-gradient-to-br from-violet-700/[0.14] to-violet-500/[0.06] text-violet-900 border border-violet-700/14'
            }`}
          >
            {index + 1}
          </motion.span>
          <h3
            className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              minHeight: "2.75rem",
            }}
          >
            {category.category}
          </h3>
        </div>
        
        <div className="grid grid-cols-1 gap-3 relative flex-grow content-start">
          {category.items.map((expertise, expertiseIndex) => (
            <motion.span 
              key={expertise} 
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 + expertiseIndex * 0.05 }}
              viewport={{ once: true }}
              whileHover={isTouchDevice ? undefined : { scale: 1.1, y: -2 }}
              className={`h-[3.25rem] w-full px-3 py-2 flex items-center justify-center rounded-xl text-xs sm:text-sm font-medium transition-all duration-300 border cursor-default backdrop-blur-sm card-chip-pulse ${
                isDark 
                  ? 'bg-violet-400/[0.10] hover:bg-violet-400/[0.14] text-white/80 hover:text-violet-100 border-violet-300/[0.16] hover:border-violet-300/[0.26]' 
                  : 'bg-violet-500/[0.08] hover:bg-violet-500/[0.12] text-violet-900/90 hover:text-violet-900 border-violet-700/[0.12] hover:border-violet-700/[0.2]'
              }`}
              style={{
                animationDelay: `${expertiseIndex * 140}ms`,
                boxShadow: `inset 0 0 0 1px rgba(${accentRgb}, ${isDark ? "0.07" : "0.06"})`,
              }}
            >
              <span
                className="block w-full text-center leading-snug overflow-hidden"
                style={{
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                }}
              >
                {expertise}
              </span>
            </motion.span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
