'use client';

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import Link from "next/link";
import { Menu, X, Sun, Moon } from "lucide-react";
import Lenis from "lenis";
import { useTheme } from "./ThemeProvider";

const navLinks = [
  { name: "About", href: "#about" },
  { name: "Skills", href: "#skills" },
  { name: "Projects", href: "#projects" },
  { name: "Contact", href: "#contact" },
];

declare global {
  interface Window {
    lenis?: Lenis;
  }
}

// Rolling text component — text flips on hover like an airport departures board
function RollingText({ children, className }: { children: string; className?: string }) {
  return (
    <span className={`relative block overflow-hidden group/text ${className || ''}`}>
      <span className="block transition-transform duration-300 ease-out group-hover/text:-translate-y-full">
        {children}
      </span>
      <span className="absolute top-full left-0 block transition-transform duration-300 ease-out group-hover/text:-translate-y-full" aria-hidden>
        {children}
      </span>
    </span>
  );
}

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const [activeSection, setActiveSection] = useState<string>("");
  const [scrolled, setScrolled] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  const navRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  // Magnetic button effect for theme toggle
  const magneticX = useMotionValue(0);
  const magneticY = useMotionValue(0);
  const springX = useSpring(magneticX, { damping: 20, stiffness: 300 });
  const springY = useSpring(magneticY, { damping: 20, stiffness: 300 });

  const handleMagneticMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    magneticX.set((e.clientX - centerX) * 0.3);
    magneticY.set((e.clientY - centerY) * 0.3);
  };

  const handleMagneticLeave = () => {
    magneticX.set(0);
    magneticY.set(0);
  };

  // Get Lenis instance from window (set by SmoothScroll component)
  useEffect(() => {
    const checkForLenis = () => {
      if (window.lenis) {
        setLenis(window.lenis);
      }
    };
    
    checkForLenis();
    const interval = setInterval(checkForLenis, 100);
    
    return () => clearInterval(interval);
  }, []);

  // Scroll detection for navbar background + active section tracking
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      
      // Find active section
      const sections = navLinks.map(link => ({
        id: link.href.slice(1),
        el: document.querySelector(link.href)
      }));
      
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section.el) {
          const rect = section.el.getBoundingClientRect();
          if (rect.top <= 150) {
            setActiveSection(section.id);
            return;
          }
        }
      }
      setActiveSection("");
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const target = document.querySelector(href);
    
    if (target && lenis) {
      lenis.scrollTo(target as HTMLElement, {
        offset: -100,
        duration: 1.5,
      });
    } else if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
    
    setIsMobileMenuOpen(false);
  }, [lenis]);

  const handleLogoClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.5 });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [lenis]);

  // Calculate hover indicator position
  const getIndicatorStyle = () => {
    const idx = hoveredIndex !== null ? hoveredIndex : navLinks.findIndex(l => l.href === `#${activeSection}`);
    if (idx < 0 || !navRefs.current[idx]) return { opacity: 0, left: 0, width: 0 };
    const el = navRefs.current[idx];
    const parent = el?.parentElement;
    if (!el || !parent) return { opacity: 0, left: 0, width: 0 };
    const parentRect = parent.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    return {
      opacity: 1,
      left: elRect.left - parentRect.left,
      width: elRect.width,
    };
  };

  const indicatorStyle = getIndicatorStyle();

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="fixed top-0 left-0 right-0 z-[100] bg-transparent"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative">
        <div className="relative flex items-center justify-center h-20 md:h-24">
          {/* Logo with animated dot */}
          <Link 
            href="/" 
            onClick={handleLogoClick}
            className="absolute left-0 z-50 group"
          >
            <motion.span 
              className={`text-sm font-bold tracking-[0.2em] uppercase transition-colors duration-300 flex items-center gap-1.5 ${
                isDark ? 'text-white/70 group-hover:text-white' : 'text-black group-hover:text-gray-900'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <RollingText>Devansh</RollingText>
            </motion.span>
          </Link>

          {/* Desktop Navigation - Liquid Glass Pill with sliding indicator */}
          <div className="hidden md:flex items-center">
            <motion.div 
              className={`relative flex items-center rounded-full px-2 py-1.5 backdrop-blur-xl transition-all duration-500 ${
                isDark 
                  ? `${scrolled ? 'bg-white/[0.08]' : 'bg-white/[0.05]'} shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-white/[0.1]` 
                  : `${scrolled ? 'bg-white/80' : 'bg-white/60'} shadow-[0_8px_32px_rgba(0,0,0,0.1)] border border-white/50 backdrop-blur-xl`
              }`}
              layout
            >
              {/* Sliding highlight indicator */}
              <motion.div
                className={`absolute top-1.5 bottom-1.5 rounded-full ${
                  isDark ? 'bg-white/[0.1]' : 'bg-black/[0.08]'
                }`}
                animate={{
                  left: indicatorStyle.left,
                  width: indicatorStyle.width,
                  opacity: indicatorStyle.opacity,
                }}
                transition={{ type: "spring", stiffness: 350, damping: 30 }}
                style={{ height: 'calc(100% - 12px)' }}
              />

              {navLinks.map((link, index) => (
                <motion.a
                  key={link.name}
                  ref={(el) => { navRefs.current[index] = el; }}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  // Staggered entrance for each pill link
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 + index * 0.08 }}
                  className={`relative px-5 py-2 text-xs font-bold tracking-wider rounded-full cursor-pointer transition-colors duration-200 z-10 ${
                    activeSection === link.href.slice(1)
                      ? isDark ? 'text-white' : 'text-black'
                      : isDark 
                        ? 'text-white/50 hover:text-white' 
                        : 'text-black/50 hover:text-black'
                  }`}
                  whileTap={{ scale: 0.92 }}
                >
                  <RollingText>{link.name}</RollingText>
                </motion.a>
              ))}
            </motion.div>
          </div>

          {/* Theme Toggle (magnetic) + Mobile Menu Button - Right */}
          <div className="absolute right-0 flex items-center gap-2">
            {/* Theme Toggle with magnetic effect */}
            <motion.button
              onClick={toggleTheme}
              onMouseMove={handleMagneticMove}
              onMouseLeave={handleMagneticLeave}
              style={{ x: springX, y: springY }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`p-2.5 rounded-full backdrop-blur-xl border transition-all duration-300 ${
                isDark 
                  ? `${scrolled ? 'bg-white/[0.08]' : 'bg-white/[0.05]'} border-white/[0.1] hover:border-white/[0.2]` 
                : `${scrolled ? 'bg-white/80' : 'bg-white/60'} border-white/50 hover:border-white/80 shadow-[0_8px_32px_rgba(0,0,0,0.1)]`
              }`}
              aria-label="Toggle theme"
            >
              <AnimatePresence mode="wait">
                {isDark ? (
                  <motion.div
                    key="sun"
                    initial={{ rotate: -90, scale: 0, opacity: 0 }}
                    animate={{ rotate: 0, scale: 1, opacity: 1 }}
                    exit={{ rotate: 90, scale: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <Sun size={18} className="text-white" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="moon"
                    initial={{ rotate: 90, scale: 0, opacity: 0 }}
                    animate={{ rotate: 0, scale: 1, opacity: 1 }}
                    exit={{ rotate: -90, scale: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <Moon size={18} className="text-gray-900" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Mobile Menu Button with morphing animation */}
            <motion.button
              className={`md:hidden z-50 p-2 ${isDark ? 'text-[#b8c5b9]' : 'text-black font-bold'}`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <AnimatePresence mode="wait">
                {isMobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X size={24} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu size={24} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Overlay - Liquid Glass */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className={`absolute top-20 left-4 right-4 rounded-2xl md:hidden overflow-hidden backdrop-blur-xl ${
              isDark 
                ? 'bg-white/[0.05] shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/[0.1]' 
                : 'bg-white/60 shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-black/[0.15]'
            }`}
          >
            <div className="flex flex-col p-4 space-y-2">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.08, ease: "easeOut" }}
                >
                  <a
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className={`block px-4 py-3 text-sm font-bold tracking-wider rounded-xl transition-all duration-300 cursor-pointer ${
                      activeSection === link.href.slice(1)
                        ? isDark ? 'text-white bg-white/[0.08]' : 'text-black bg-black/[0.08]'
                        : isDark 
                          ? 'text-white/60 hover:text-white hover:bg-white/[0.08]' 
                          : 'text-black hover:text-black hover:bg-black/[0.1]'
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      {/* Active dot indicator */}
                      {activeSection === link.href.slice(1) && (
                        <motion.span
                          layoutId="mobile-active-dot"
                          className={`w-1.5 h-1.5 rounded-full ${isDark ? 'bg-emerald-400' : 'bg-emerald-500'}`}
                        />
                      )}
                      {link.name}
                    </span>
                  </a>
                </motion.div>
              ))}
              
              {/* Mobile Theme Toggle */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: navLinks.length * 0.08, ease: "easeOut" }}
                className={`pt-3 mt-2 border-t ${isDark ? 'border-white/[0.08]' : 'border-black/[0.08]'}`}
              >
                <button
                  onClick={() => {
                    toggleTheme();
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex items-center justify-center gap-3 w-full px-4 py-3 text-sm font-medium tracking-wider rounded-xl transition-all duration-300 ${
                    isDark 
                      ? 'text-white bg-white/[0.1] hover:bg-white/[0.15]' 
                      : 'text-gray-900 bg-black/[0.05] hover:bg-black/[0.08]'
                  }`}
                >
                  {isDark ? (
                    <>
                      <Sun size={18} className="text-yellow-400" />
                      <span>Switch to Light</span>
                    </>
                  ) : (
                    <>
                      <Moon size={18} className="text-blue-600" />
                      <span>Switch to Dark</span>
                    </>
                  )}
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
