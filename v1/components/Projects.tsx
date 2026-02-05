'use client';

import { motion } from "framer-motion";

const projects = [
  {
    title: "Project Eidos",
    category: "Interactive Experience",
    description: "A WebGL-based exploration of digital consciousness.",
    featured: true,
  },
  {
    title: "Lumina Interface",
    category: "Design System",
    description: "Component library for next-gen dashboard applications.",
  },
  {
    title: "Apex Finance",
    category: "Fintech",
    description: "Real-time trading platform with sub-millisecond updates.",
  },
  {
    title: "Nebula Stream",
    category: "Media Platform",
    description: "High-performance video streaming architecture.",
  }
];

export default function Projects() {
  return (
    <section id="projects" className="min-h-screen w-full py-20 px-5 md:px-10">
      <div className="max-w-7xl mx-auto">
        <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold text-white mb-16 tracking-tight"
        >
          Projects
        </motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative rounded-xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-md hover:border-white/20 transition-all duration-300 aspect-[4/3]"
            >
              {/* Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 to-blue-900/20 group-hover:scale-105 transition-transform duration-500" />
              
              {/* Content */}
              <div className="relative h-full p-5 flex flex-col justify-end">
                <span className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">
                  {project.category}
                </span>

                <h3 className="text-white font-bold mb-1 text-lg md:text-xl">
                  {project.title}
                </h3>

                <p className="text-gray-300 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {project.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
