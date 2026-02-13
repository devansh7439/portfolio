'use client';

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useTheme } from "./ThemeProvider";
import { useRef } from "react";

export default function AboutMe() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  // 3D Card Tilt Effect
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springConfig = { damping: 30, stiffness: 200 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), springConfig);
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
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
            className={`text-4xl md:text-5xl font-bold mb-8 tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}
        >
          About Me
        </motion.h2>

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
            {/* Animated Gradient Border on Hover */}
            <div className={`absolute -inset-0.5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm ${
              isDark 
                ? 'bg-gradient-to-r from-emerald-500/50 via-amber-500/50 to-rose-500/50' 
                : 'bg-gradient-to-r from-emerald-400/40 via-amber-400/40 to-rose-400/40'
            }`} />
            
            {/* Liquid Glass Card */}
            <div className={`relative overflow-hidden rounded-2xl backdrop-blur-xl p-8 md:p-12 transition-all duration-500 ${
              isDark 
                ? 'bg-white/[0.04] border border-white/[0.1] shadow-[0_8px_32px_rgba(0,0,0,0.36)] group-hover:bg-white/[0.06] group-hover:border-white/[0.15]' 
                : 'bg-black/[0.03] border border-black/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.1)] group-hover:bg-black/[0.05] group-hover:border-black/[0.12]'
            }`}>
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
                isDark ? 'border-emerald-500/40 group-hover:border-emerald-400/60' : 'border-emerald-400/40 group-hover:border-emerald-500/60'
              }`} />
              <div className={`absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 rounded-br-md transition-colors duration-300 ${
                isDark ? 'border-rose-500/40 group-hover:border-rose-400/60' : 'border-rose-400/40 group-hover:border-rose-500/60'
              }`} />
              
              {/* Staggered text paragraphs */}
              <div className={`relative text-lg md:text-xl leading-relaxed max-w-2xl mx-auto ${isDark ? 'text-white/70' : 'text-gray-700'}`} style={{ transform: 'translateZ(30px)' }}>
                <motion.p 
                  className="mb-6"
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  viewport={{ once: true }}
                >
                  I&apos;m a passionate developer with expertise in building modern web applications. I specialize in creating clean, efficient, and user-friendly solutions that solve real-world problems. With a strong foundation in both frontend and backend technologies, I enjoy bringing ideas to life through code.
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  viewport={{ once: true }}
                >
                  When I&apos;m not coding, you can find me exploring new technologies, contributing to open-source projects, or continuously learning to stay up-to-date with the ever-evolving tech landscape. I believe in writing maintainable code and creating experiences that users love.
                </motion.p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
