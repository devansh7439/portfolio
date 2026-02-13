'use client';

import { motion } from "framer-motion";
import { useTheme } from "./ThemeProvider";
import { useState } from "react";

const skills = [
  { category: "AI & Machine Learning", items: ["Python", "TensorFlow", "PyTorch", "Scikit-learn", "OpenAI API", "LangChain", "Computer Vision", "NLP"] },
  { category: "Frontend & Data Viz", items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "D3.js", "Plotly", "Streamlit", "Framer Motion"] },
  { category: "Backend & MLOps", items: ["Python", "FastAPI", "Node.js", "PostgreSQL", "Docker", "AWS", "MLflow", "Hugging Face"] },
];

export default function Skills() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <section className="min-h-[50vh] w-full py-20 px-5 md:px-10 flex items-center justify-center relative overflow-hidden">



      <div className="max-w-6xl mx-auto w-full">
        <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={`text-4xl md:text-5xl font-bold mb-16 text-center tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}
            id="skills"
        >
          Skills
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {skills.map((category, index) => (
            <SkillCard key={category.category} category={category} index={index} isDark={isDark} />
          ))}
        </div>
      </div>
    </section>
  );
}

function SkillCard({ category, index, isDark }: { category: { category: string; items: string[] }; index: number; isDark: boolean }) {
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  
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
      whileHover={{ y: -8 }}
      className="group relative h-full"
    >
      {/* Glow effect on hover */}
      <div className={`absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 blur-lg ${
        isDark 
          ? 'bg-gradient-to-r from-violet-500/25 via-amber-500/25 to-rose-500/25' 
          : 'bg-gradient-to-r from-violet-400/25 via-amber-400/25 to-rose-400/25'
      }`} />
      
      {/* Liquid Glass Card */}
      <div 
        onClick={addRipple}
        className={`relative h-full overflow-hidden rounded-2xl backdrop-blur-xl p-8 transition-all duration-500 flex flex-col cursor-pointer ${
          isDark 
            ? 'bg-white/[0.04] border border-white/[0.1] shadow-[0_8px_32px_rgba(0,0,0,0.36)] group-hover:border-cyan-500/30 group-hover:bg-white/[0.06]' 
            : 'bg-white/60 border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.1)] group-hover:border-cyan-500/30 group-hover:bg-white/70 group-hover:shadow-[0_12px_40px_rgba(0,0,0,0.15)]'
        }`}
      >
        {/* Ripple effects */}
        {ripples.map(ripple => (
          <span 
            key={ripple.id}
            className={`absolute rounded-full animate-ping pointer-events-none ${isDark ? 'bg-cyan-500/30' : 'bg-cyan-400/30'}`}
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
        
        {/* Inner gradient */}
        <div className={`absolute inset-0 pointer-events-none ${
          isDark 
            ? 'bg-gradient-to-br from-white/[0.05] via-transparent to-transparent' 
            : 'bg-gradient-to-br from-white/40 via-white/10 to-transparent'
        }`} />
        
        {/* Header with spinning number */}
        <div className={`flex items-center gap-3 mb-6 pb-3 border-b ${
          isDark ? 'border-white/[0.08]' : 'border-black/[0.08]'
        }`}>
          <motion.span 
            initial={{ rotate: -180, scale: 0 }}
            whileInView={{ rotate: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: index * 0.1 + 0.3 }}
            viewport={{ once: true }}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
              isDark 
                ? 'bg-gradient-to-br from-violet-500/40 to-amber-500/40 text-white border border-white/10' 
                : 'bg-gradient-to-br from-violet-400/40 to-amber-400/40 text-gray-900 border border-black/10'
            }`}
          >
            {index + 1}
          </motion.span>
          <h3 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {category.category}
          </h3>
        </div>
        
        <div className="flex flex-wrap gap-3 relative flex-grow content-start">
          {category.items.map((skill, skillIndex) => (
            <motion.span 
              key={skill} 
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 + skillIndex * 0.05 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.1, y: -2 }}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 border cursor-default backdrop-blur-sm ${
                isDark 
                  ? 'bg-white/[0.05] hover:bg-gradient-to-r hover:from-violet-500/25 hover:to-amber-500/25 text-white/70 hover:text-white border-white/[0.08] hover:border-violet-500/30' 
                  : 'bg-black/[0.05] hover:bg-gradient-to-r hover:from-violet-400/25 hover:to-amber-400/25 text-gray-700 hover:text-gray-900 border-black/[0.08] hover:border-violet-500/30'
              }`}
            >
              {skill}
            </motion.span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
