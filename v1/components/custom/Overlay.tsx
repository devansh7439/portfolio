'use client';

import { motion, MotionValue, useTransform } from "framer-motion";

export default function Overlay({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  
  return (
     <>
        {/* Section 1: 0% scroll */}
        <Section opacity={useTransform(scrollYProgress, [0, 0.2], [1, 0])} y={useTransform(scrollYProgress, [0, 0.2], [0, -50])} className="justify-center">
            <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-center">
                Devansh Bagaria<br/><span className="text-gray-400">Creative Developer</span>
            </h1>
        </Section>

        {/* Section 2: 30% scroll */}
        <Section opacity={useTransform(scrollYProgress, [0.2, 0.35, 0.5], [0, 1, 0])} y={useTransform(scrollYProgress, [0.2, 0.5], [50, -50])} className="justify-start pl-10 md:pl-20">
             <h2 className="text-5xl md:text-7xl font-semibold">
                I build digital<br/>experiences
             </h2>
        </Section>

        {/* Section 3: 60% scroll */}
        <Section opacity={useTransform(scrollYProgress, [0.5, 0.65, 0.8], [0, 1, 0])} y={useTransform(scrollYProgress, [0.5, 0.8], [50, -50])} className="justify-end pr-10 md:pr-20">
             <h2 className="text-5xl md:text-7xl font-semibold text-right">
                Bridging design<br/>and engineering
             </h2>
        </Section>
     </>
  );
}

function Section({ children, opacity, y, className = "" }: any) {
    return (
        <motion.div 
            style={{ opacity, y }}
            className={`absolute inset-0 flex items-center pointer-events-none ${className} text-white`}
        >
            {children}
        </motion.div>
    );
}
