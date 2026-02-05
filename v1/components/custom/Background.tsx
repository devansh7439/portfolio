'use client';

import { motion } from "framer-motion";

export default function Background() {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-[#1a1a1a]">
      {/* Soft ambient gradient - top left */}
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.15, 0.25, 0.15],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-[30%] -left-[20%] w-[80vw] h-[80vw] rounded-full bg-[#3a4a3a]/40 blur-[150px]"
      />

      {/* Soft ambient gradient - bottom right */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        className="absolute bottom-[-20%] right-[-10%] w-[70vw] h-[70vw] rounded-full bg-[#4a5a4a]/30 blur-[180px]"
      />

      {/* Subtle center glow */}
      <motion.div
        animate={{
          opacity: [0.05, 0.1, 0.05],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] rounded-full bg-[#5a6a5a]/20 blur-[200px]"
      />
      
      {/* Vignette overlay for depth */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, rgba(26,26,26,0.4) 100%)'
        }}
      />
      
      {/* Subtle noise texture overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay"
        style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}
