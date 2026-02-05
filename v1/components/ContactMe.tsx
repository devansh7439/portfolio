'use client';

import { motion } from "framer-motion";
import { Mail, Linkedin, Github } from "lucide-react";

export default function ContactMe() {
  return (
    <section id="contact" className="min-h-[60vh] w-full py-20 px-5 md:px-10 flex flex-col items-center justify-center">
      <div className="max-w-4xl mx-auto text-center">
        <motion.span 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-gray-400 uppercase tracking-widest text-sm mb-4 block"
        >
          What's Next?
        </motion.span>
        
        <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-5xl md:text-6xl font-bold text-white mb-8 tracking-tight"
        >
          Get In Touch
        </motion.h2>

        <motion.p
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.6, delay: 0.2 }}
           viewport={{ once: true }}
           className="text-gray-300 text-lg md:text-xl leading-relaxed max-w-xl mx-auto mb-12"
        >
          I'm currently looking for new opportunities. Whether you have a question or just want to say hi, I'll try my best to get back to you!
        </motion.p>

        <motion.a 
           href="mailto:hello@example.com"
           initial={{ opacity: 0, scale: 0.9 }}
           whileInView={{ opacity: 1, scale: 1 }}
           whileHover={{ scale: 1.05 }}
           whileTap={{ scale: 0.95 }}
           transition={{ duration: 0.3 }}
           viewport={{ once: true }}
           className="inline-block border border-white/20 hover:border-white/50 bg-white/5 backdrop-blur-sm text-white px-10 py-4 rounded-full text-lg font-medium transition-colors mb-16"
        >
          Say Hello
        </motion.a>

        <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="flex gap-8 justify-center items-center"
        >
          <SocialLink href="https://github.com/devansh7439" icon={<Github size={24} />} label="GitHub" />
          <SocialLink href="https://www.linkedin.com/in/devansh-bagaria-167921300/" icon={<Linkedin size={24} />} label="LinkedIn" />
        </motion.div>
      </div>
    </section>
  );
}

function SocialLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer"
      className="text-gray-400 hover:text-white transition-colors duration-300 transform hover:-translate-y-1"
      aria-label={label}
    >
      {icon}
    </a>
  );
}
