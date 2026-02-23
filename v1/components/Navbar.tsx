'use client';

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import Lenis from "lenis";
import { useTheme } from "./ThemeProvider";

const navLinks = [
  { name: "About", href: "#about" },
  { name: "Expertise", href: "#expertise" },
  { name: "Projects", href: "#projects" },
];
const contactLink = { name: "Contact", href: "#contact" };
const allNavLinks = [...navLinks, contactLink];

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
  const [pendingNavHref, setPendingNavHref] = useState<string | null>(null);
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const [activeSection, setActiveSection] = useState<string>("");
  const [scrolled, setScrolled] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

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
      const sections = allNavLinks.map(link => ({
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

  const scrollToHref = useCallback((href: string) => {
    const target = document.querySelector(href);
    if (!target) return;

    if (lenis) {
      lenis.scrollTo(target as HTMLElement, {
        offset: -100,
        duration: 1.5,
      });
      return;
    }

    target.scrollIntoView({ behavior: 'smooth' });
  }, [lenis]);

  const handleNavClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();

    if (isMobileMenuOpen) {
      setPendingNavHref(href);
      setIsMobileMenuOpen(false);
      return;
    }

    scrollToHref(href);
  }, [isMobileMenuOpen, scrollToHref]);

  // Body scroll lock + Lenis pause when mobile menu is open
  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    if (typeof window !== 'undefined') {
      window.lenis?.stop();
    }
    return () => {
      document.body.style.overflow = prevOverflow;
      if (typeof window !== 'undefined') {
        window.lenis?.start();
      }
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    if (!pendingNavHref || isMobileMenuOpen) return;

    const rafId = window.requestAnimationFrame(() => {
      scrollToHref(pendingNavHref);
      setPendingNavHref(null);
    });

    return () => window.cancelAnimationFrame(rafId);
  }, [pendingNavHref, isMobileMenuOpen, scrollToHref]);

  const handleLogoClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.5 });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [lenis]);

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{ fontFamily: "var(--font-poppins)" }}
      className="fixed top-0 left-0 right-0 z-[120] bg-transparent"
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
                isDark ? 'text-white/90 group-hover:text-white' : 'text-black group-hover:text-gray-900'
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
                  ? `${scrolled ? 'bg-white/[0.14]' : 'bg-white/[0.1]'} shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-white/[0.2]` 
                  : `${scrolled ? 'bg-white/80' : 'bg-white/60'} shadow-[0_8px_32px_rgba(0,0,0,0.1)] border border-white/50 backdrop-blur-xl`
              }`}
              layout
            >
              {navLinks.map((link, index) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  // Staggered entrance for each pill link
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 + index * 0.08 }}
                  className={`relative px-5 py-2 text-xs font-bold tracking-wider rounded-full cursor-pointer transition-colors duration-200 ${
                    (hoveredIndex === index || (hoveredIndex === null && activeSection === link.href.slice(1)))
                      ? isDark ? 'text-white' : 'text-black'
                      : isDark 
                        ? 'text-white/75 hover:text-white' 
                        : 'text-black/50 hover:text-black'
                  }`}
                  whileTap={{ scale: 0.92 }}
                >
                  {(hoveredIndex === index || (hoveredIndex === null && activeSection === link.href.slice(1))) && (
                    <motion.span
                      layoutId="desktop-nav-highlight"
                      className={`absolute top-1.5 bottom-1.5 left-1 right-1 rounded-full ${
                        isDark ? 'bg-white/[0.2]' : 'bg-black/[0.08]'
                      }`}
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">
                    <RollingText>{link.name}</RollingText>
                  </span>
                </motion.a>
              ))}
            </motion.div>
          </div>

          {/* Contact Button + Mobile Menu Button - Right */}
          <div className="absolute right-0 flex items-center gap-2">
            <motion.a
              href={contactLink.href}
              onClick={(e) => handleNavClick(e, contactLink.href)}
              className={`hidden md:inline-flex items-center justify-center px-4 py-2.5 text-xs font-bold tracking-wider rounded-full backdrop-blur-xl transition-all duration-300 ${
                activeSection === contactLink.href.slice(1)
                  ? isDark
                    ? 'text-white bg-white/[0.18] border border-white/[0.28]'
                    : 'text-black bg-black/[0.08] border border-black/[0.18]'
                  : isDark
                    ? 'text-white/80 bg-white/[0.1] border border-white/[0.2] hover:text-white hover:bg-white/[0.14] hover:border-white/[0.3]'
                    : 'text-black/70 bg-white/70 border border-black/[0.14] hover:text-black hover:bg-white/90 hover:border-black/[0.2]'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <RollingText>Contact</RollingText>
            </motion.a>

            {/* Mobile Menu Button with morphing animation */}
            <motion.button
              className={`md:hidden z-[130] p-2 ${isDark ? 'text-white/90' : 'text-black font-bold'}`}
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
          <>
            {/* Invisible backdrop to close menu when tapping outside */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[125] md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              className={`absolute top-20 left-4 right-4 rounded-2xl md:hidden overflow-hidden backdrop-blur-xl z-[128] ${
              isDark 
                ? 'bg-white/[0.05] shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/[0.1]' 
                : 'bg-white/60 shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-black/[0.15]'
            }`}
          >
            <div className="flex flex-col p-4 space-y-2">
              {allNavLinks.map((link, index) => (
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
                        ? isDark ? 'text-white bg-white/[0.14]' : 'text-black bg-black/[0.08]'
                        : isDark 
                          ? 'text-white/80 hover:text-white hover:bg-white/[0.12]' 
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
            </div>
          </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
