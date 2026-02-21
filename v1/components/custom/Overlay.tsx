'use client';

import type { ReactNode } from "react";
import { motion, MotionValue, useTransform } from "framer-motion";

export default function Overlay({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  const headingStyle = { fontFamily: "var(--font-syne)" };
  const headlineClass = "font-bold max-w-[92vw] sm:max-w-[600px] leading-[0.94] tracking-tight text-[clamp(1.95rem,9vw,2.8rem)] sm:text-5xl md:text-7xl";
  const nameClass = "text-slate-300 text-[2.1rem] sm:text-[3.675rem] md:text-[5.88rem] lg:text-[7.84rem] font-bold tracking-tight sm:tracking-tighter leading-[0.9]";
  const mobileTextShell = "rounded-2xl bg-black/35 px-4 py-3 backdrop-blur-md sm:rounded-none sm:bg-transparent sm:px-0 sm:py-0 sm:backdrop-blur-none";
  
  return (
     <>
        {/* Phase 1: The Problem (Both Aligned to Right) */}
        <Section 
            opacity={useTransform(scrollYProgress, [0.1, 0.2, 0.3], [0, 1, 0])} 
            y={useTransform(scrollYProgress, [0.1, 0.3], [20, -20])} 
            className="flex-col items-center sm:items-end justify-center px-4 sm:px-12 md:px-20 pt-16 sm:pt-20"
        >
            <div className="text-center sm:text-right mb-2">
                <h2 className={`${headlineClass} text-white`} style={headingStyle}>
                    <span className={mobileTextShell}>
                      Building AI <span className="block sm:inline">systems</span>
                    </span>
                </h2>
            </div>

            <div className="text-center sm:text-right">
                <h2 className={headlineClass} style={headingStyle}>
                    <span className={`text-blue-200 ${mobileTextShell}`}>
                      for business <span className="block sm:inline">problems</span>
                    </span>
                </h2>
            </div>
        </Section>

        {/* Phase 2: The Solution (Left Side - Cheek/Neck Area) */}
        <Section 
            opacity={useTransform(scrollYProgress, [0.35, 0.45, 0.6], [0, 1, 0])} 
            y={useTransform(scrollYProgress, [0.35, 0.6], [20, -20])} 
            className="justify-center items-center px-4 sm:px-0 sm:justify-start sm:pl-8"
        >
             <h2 className={`${headlineClass} text-white text-center sm:text-left`} style={headingStyle}>
                <span className={mobileTextShell}>
                  Reliable automation
                  <span className="block text-blue-200">& custom LLMs</span>
                </span>
             </h2>
        </Section>

        {/* Phase 3: The Identity (Bottom - Collar Area) */}
        <Section 
            opacity={useTransform(scrollYProgress, [0.6, 0.8], [0, 1])} 
            y={useTransform(scrollYProgress, [0.6, 0.9], [30, 0])} 
            className="items-end justify-center pb-24 sm:pb-32 md:pb-40"
        >
            <div className="w-full max-w-[1600px] grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-10 md:gap-20 lg:gap-40 px-5 sm:px-4">
                <div className="text-center sm:text-right sm:pr-4 md:pr-12 lg:pr-32 xl:pr-40">
                    <h1 className={`${nameClass} drop-shadow-[0_8px_24px_rgba(0,0,0,0.4)]`} style={headingStyle}>
                        Devansh
                    </h1>
                </div>
                <div className="-mt-2 sm:mt-0 text-center sm:text-left sm:pl-0 md:pl-8 lg:pl-24 xl:pl-32">
                    <h1 className={`${nameClass} drop-shadow-[0_8px_24px_rgba(0,0,0,0.4)]`} style={headingStyle}>
                        Bagaria
                    </h1>
                </div>
            </div>
        </Section>

        {/* --- SCROLL INDICATOR --- */}
        <motion.div 
            style={{ opacity: useTransform(scrollYProgress, [0, 0.15], [1, 0]) }}
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-5 sm:bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
        >
            <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.22em] text-white/60">Scroll</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/50"><path d="m7 13 5 5 5-5"/><path d="m7 6 5 5 5-5"/></svg>
        </motion.div>
     </>
  );
}

interface SectionProps {
    children: ReactNode;
    opacity: MotionValue<number>;
    y: MotionValue<number>;
    className?: string;
}

function Section({ children, opacity, y, className = "" }: SectionProps) {
    return (
        <motion.div 
            style={{ opacity, y }}
            className={`absolute inset-0 flex pointer-events-none ${className}`}
        >
            {children}
        </motion.div>
    );
}
