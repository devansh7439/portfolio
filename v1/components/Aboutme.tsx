'use client';

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useTheme } from "./ThemeProvider";
import { useRef, useState, useEffect } from "react";

export default function AboutMe() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  // Detect touch device to disable 3D tilt
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);
  
  // 3D Card Tilt Effect
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springConfig = { damping: 30, stiffness: 200 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), springConfig);
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isTouchDevice || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };
  
  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <section className="min-h-[50vh] w-full py-20 px-5 md:px-10 flex items-center justify-center relative overflow-hidden">
      <div className="max-w-4xl mx-auto text-center relative">
        <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            id="about"
            style={{ fontFamily: "var(--font-gravitas-one)" }}
            className={`text-4xl md:text-5xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}
        >
          <span className={`about-heading-aurora ${isDark ? "about-heading-aurora--dark" : "about-heading-aurora--light"}`}>
            <span className="about-heading-aurora__text">About Me</span>
          </span>
        </motion.h2>
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className={`w-16 h-px mx-auto mt-6 mb-8 ${isDark ? 'bg-white/30' : 'bg-black/30'}`}
        />

        <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.6, delay: 0.2 }}
           viewport={{ once: true }}
           className="relative perspective-1000"
           style={{ perspective: '1000px' }}
        >
          {/* 3D Tilt Card */}
          <motion.div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
            className="relative group"
          >
            {/* Animated Monochrome Border on Hover */}
            <div className={`absolute -inset-0.5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm ${
              isDark 
                ? 'bg-white/20' 
                : 'bg-black/12'
            }`} />
            
            {/* Liquid Glass Card */}
            <div className={`relative overflow-hidden rounded-2xl backdrop-blur-xl p-8 md:p-12 transition-all duration-500 ${
              isDark 
                ? 'bg-white/[0.04] border border-white/[0.1] shadow-[0_8px_32px_rgba(0,0,0,0.36)] group-hover:bg-white/[0.06] group-hover:border-white/[0.15]' 
                : 'bg-black/[0.03] border border-black/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.1)] group-hover:bg-black/[0.05] group-hover:border-black/[0.12]'
            }`}>
              {/* Silver tint in the box background */}
              <div
                className={`absolute inset-0 pointer-events-none transition-opacity duration-500 ${
                  isDark ? 'opacity-75 group-hover:opacity-90' : 'opacity-90 group-hover:opacity-100'
                }`}
                style={{
                  background: isDark
                    ? "linear-gradient(140deg, rgba(226,232,240,0.14) 0%, rgba(148,163,184,0.09) 42%, rgba(100,116,139,0.05) 100%)"
                    : "linear-gradient(140deg, rgba(255,255,255,0.96) 0%, rgba(226,232,240,0.86) 44%, rgba(203,213,225,0.74) 100%)",
                }}
              />

              {/* Shimmer effect */}
              <div className={`absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none ${
                isDark ? 'bg-gradient-to-r from-transparent via-white/5 to-transparent' : 'bg-gradient-to-r from-transparent via-black/5 to-transparent'
              }`} />
              
              {/* Inner gradient */}
              <div className={`absolute inset-0 pointer-events-none ${
                isDark 
                  ? 'bg-gradient-to-br from-white/[0.05] via-transparent to-white/[0.02]' 
                  : 'bg-gradient-to-br from-black/[0.03] via-transparent to-black/[0.02]'
              }`} />
              
              {/* Decorative corners */}
              <div className={`absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 rounded-tl-md transition-colors duration-300 ${
                isDark ? 'border-white/25 group-hover:border-white/45' : 'border-black/25 group-hover:border-black/45'
              }`} />
              <div className={`absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 rounded-br-md transition-colors duration-300 ${
                isDark ? 'border-white/25 group-hover:border-white/45' : 'border-black/25 group-hover:border-black/45'
              }`} />
              
              {/* Staggered text paragraphs */}
              <div
                className={`relative text-base md:text-xl leading-relaxed max-w-2xl mx-auto font-semibold tracking-tight ${isDark ? 'text-white/70' : 'text-gray-700'}`}
                style={{ transform: 'translateZ(30px)', fontFamily: "var(--font-poppins)" }}
              >
                <motion.p 
                  className="mb-6"
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  viewport={{ once: true }}
                >
                  I design and build AI systems that solve practical business problems. My core work includes end-to-end workflow automation, AI-first websites with embedded intelligence, custom LLM tools, and technical due diligence to validate correctness, security, and scalability.
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  viewport={{ once: true }}
                >
                  I also deliver AI chatbots and assistants, document and data processing pipelines, and content generation workflows. From PDF extraction and OCR to customer-support bots and marketing content systems, I focus on reliable execution, measurable outcomes, and maintainable architecture.
                </motion.p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
