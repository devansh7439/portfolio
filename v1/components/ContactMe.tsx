'use client';

import { motion, useMotionValue, useSpring } from "framer-motion";
import { Linkedin, Github, Mail, Copy, Check } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { useState, useRef } from "react";

export default function ContactMe() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [emailCopied, setEmailCopied] = useState(false);
  const [showEmail, setShowEmail] = useState(false);
  
  const email = "devansh@example.com";

  const copyEmail = () => {
    navigator.clipboard.writeText(email);
    setEmailCopied(true);
    setTimeout(() => setEmailCopied(false), 2000);
  };

  return (
    <section id="contact" className="min-h-[60vh] w-full py-20 px-5 md:px-10 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Animated background grid */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute inset-0" style={{
          backgroundImage: isDark 
            ? 'radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px)'
            : 'radial-gradient(circle, rgba(0,0,0,0.06) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }} />
      </div>



      
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.span 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className={`uppercase tracking-widest text-sm mb-4 block ${isDark ? 'text-white/40' : 'text-gray-600'}`}
        >
          What&apos;s Next?
        </motion.span>
        
        {/* Heading with typing cursor */}
        <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className={`text-5xl md:text-6xl font-bold mb-8 tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}
        >
          Get In Touch
          <motion.span
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 1, repeat: Infinity, repeatDelay: 0.5 }}
            className={`ml-1 ${isDark ? 'text-violet-400' : 'text-violet-600'}`}
          >
            _
          </motion.span>
        </motion.h2>

        <motion.p
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.6, delay: 0.2 }}
           viewport={{ once: true }}
           className={`text-lg md:text-xl leading-relaxed max-w-xl mx-auto mb-8 ${isDark ? 'text-white/60' : 'text-gray-700'}`}
        >
          I&apos;m currently looking for new opportunities. Whether you have a question or just want to say hi, I&apos;ll try my best to get back to you!
        </motion.p>

        {/* Email reveal section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          {!showEmail ? (
            <button
              onClick={() => setShowEmail(true)}
              className={`inline-flex items-center gap-2 text-sm px-5 py-2.5 rounded-xl transition-all duration-300 ${
                isDark 
                  ? 'text-white/60 hover:text-white bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] hover:border-white/[0.2]' 
                  : 'text-gray-900 bg-white/60 hover:bg-white/80 border border-white/50 hover:border-white/80 shadow-md backdrop-blur-sm'
              }`}
            >
              <Mail className="w-4 h-4" />
              Reveal Email
            </button>
          ) : (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="inline-flex items-center gap-3"
            >
              <span className={`font-mono text-lg px-4 py-2 rounded-lg ${
                isDark ? 'text-white/80 bg-white/[0.05]' : 'text-gray-800 bg-black/[0.05]'
              }`}>
                {email}
              </span>
              <button
                onClick={copyEmail}
                className={`p-2.5 rounded-xl transition-all duration-300 ${
                  isDark 
                    ? 'hover:bg-white/[0.1] text-white/60 hover:text-white border border-white/[0.1]' 
                    : 'bg-white/60 hover:bg-white/80 text-gray-900 border border-white/50 hover:border-white/80 shadow-sm backdrop-blur-sm'
                }`}
              >
                {emailCopied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </motion.div>
          )}
        </motion.div>

        {/* Magnetic Button */}
        <MagneticButton isDark={isDark} />

        <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="flex gap-8 justify-center items-center mt-16"
        >
          <SocialLink href="https://github.com/devansh7439" icon={<Github size={24} />} label="GitHub" isDark={isDark} />
          <SocialLink href="https://www.linkedin.com/in/devansh-bagaria-167921300/" icon={<Linkedin size={24} />} label="LinkedIn" isDark={isDark} />
        </motion.div>
      </div>
    </section>
  );
}

function MagneticButton({ isDark }: { isDark: boolean }) {
  const buttonRef = useRef<HTMLAnchorElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springConfig = { damping: 20, stiffness: 300 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!buttonRef.current) return;
    
    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;
    
    const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
    const maxDistance = 150;
    
    if (distance < maxDistance) {
      const strength = (maxDistance - distance) / maxDistance;
      mouseX.set(distanceX * strength * 0.4);
      mouseY.set(distanceY * strength * 0.4);
    } else {
      mouseX.set(0);
      mouseY.set(0);
    }
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="inline-block p-8"
    >
      <motion.a 
        ref={buttonRef}
        href="mailto:devansh@example.com"
        style={{ x, y }}
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.3 }}
        viewport={{ once: true }}
        className="relative inline-block overflow-hidden group"
      >
        {/* Glow effect */}
        <div className={`absolute -inset-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl ${
          isDark 
            ? 'bg-gradient-to-r from-violet-600/50 via-rose-600/50 to-amber-600/50' 
            : 'bg-gradient-to-r from-violet-400/35 via-rose-400/35 to-amber-400/35'
        }`} />
        
        {/* Liquid Glass Button */}
        <div className={`relative px-12 py-5 rounded-full backdrop-blur-xl text-lg font-semibold transition-all duration-500 ${
          isDark 
            ? 'bg-white/[0.08] border border-white/[0.15] text-white group-hover:bg-white/[0.15] group-hover:border-white/[0.3] group-hover:shadow-[0_0_40px_rgba(255,255,255,0.15)]' 
            : 'bg-white/60 border border-white/50 text-gray-900 group-hover:bg-white/80 group-hover:border-white/80 shadow-[0_8px_32px_rgba(0,0,0,0.1)] group-hover:shadow-[0_12px_40px_rgba(0,0,0,0.15)]'
        }`}>
          {/* Shimmer effect */}
          <div className={`absolute inset-0 rounded-full -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out ${
            isDark ? 'bg-gradient-to-r from-transparent via-white/15 to-transparent' : 'bg-gradient-to-r from-transparent via-white/40 to-transparent'
          }`} />
          <span className="relative z-10">Say Hello</span>
        </div>
      </motion.a>
    </div>
  );
}

function SocialLink({ href, icon, label, isDark }: { href: string; icon: React.ReactNode; label: string; isDark: boolean }) {
  return (
    <motion.a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer"
      whileHover={{ y: -6, scale: 1.15, rotate: 5 }}
      whileTap={{ scale: 0.95 }}
      className={`relative p-4 rounded-full backdrop-blur-sm transition-all duration-300 group ${
        isDark 
          ? 'bg-white/[0.05] border border-white/[0.08] text-white/60 hover:text-white hover:bg-white/[0.12] hover:border-white/[0.2]' 
          : 'bg-white/60 border border-white/50 text-gray-800 hover:text-gray-900 hover:bg-white/80 hover:border-white/80 shadow-md backdrop-blur-sm'
      }`}
      aria-label={label}
    >
      {/* Glow on hover */}
      <div className={`absolute -inset-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md ${
        isDark ? 'bg-emerald-500/50' : 'bg-emerald-400/40'
      }`} />
      <div className="relative z-10">
        {icon}
      </div>
    </motion.a>
  );
}
