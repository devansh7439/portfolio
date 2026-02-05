'use client';

import { motion } from "framer-motion";

export default function AboutMe() {
  return (
    <section id="about" className="min-h-[50vh] w-full py-20 px-5 md:px-10 flex items-center justify-center">
      <div className="max-w-4xl mx-auto text-center">
        <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold text-white mb-8 tracking-tight"
        >
          About Me
        </motion.h2>

        <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.6, delay: 0.2 }}
           viewport={{ once: true }}
           className="text-gray-300 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto"
        >
          <p className="mb-6">
            I once built an entire app at 3 AM because I couldn't sleep. The app? A random excuse generator for when you're late to meetings. The irony? It worked so well I used it on myself.
          </p>
          <p>
            I'm the kind of person who sees a bug at 2 AM and thinks "just five more minutes" — then suddenly it's sunrise and I've refactored the entire codebase. Coffee is my fuel, console.log is my therapist, and I genuinely believe dark mode is a personality trait.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
