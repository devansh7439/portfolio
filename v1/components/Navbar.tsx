'use client';

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import Lenis from "lenis";

const navLinks = [
  { name: "About", href: "#about" },
  { name: "Expertise", href: "#skills" },
  { name: "Projects", href: "#projects" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Get Lenis instance from window (set by SmoothScroll component)
  useEffect(() => {
    const checkForLenis = () => {
      if ((window as any).lenis) {
        setLenis((window as any).lenis);
      }
    };
    
    checkForLenis();
    const interval = setInterval(checkForLenis, 100);
    
    return () => clearInterval(interval);
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

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="fixed top-0 left-0 right-0 z-[100] bg-transparent"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex items-center justify-between h-20 md:h-24">
          {/* Logo - Minimal Text */}
          <Link 
            href="/" 
            onClick={handleLogoClick}
            className="text-sm font-medium text-[#b8c5b9] tracking-[0.2em] uppercase z-50 hover:text-white transition-colors duration-300"
          >
            Devansh
          </Link>

          {/* Desktop Navigation - Pill Shaped */}
          <div className="hidden md:flex items-center">
            <div className="flex items-center bg-[#252525]/60 backdrop-blur-sm rounded-full px-2 py-1.5 border border-[#333]/50">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="px-5 py-2 text-xs font-medium tracking-wider text-[#9aaa9b] hover:text-[#b8c5b9] transition-all duration-300 rounded-full hover:bg-[#333]/50 cursor-pointer"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>

          {/* Contact Button - Pill Shaped */}
          <div className="hidden md:block">
            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, "#contact")}
              className="px-6 py-2.5 text-xs font-medium tracking-wider text-[#1a1a1a] bg-[#b8c5b9] hover:bg-[#a5b2a6] transition-all duration-300 rounded-full cursor-pointer"
            >
              Contact
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-[#b8c5b9] z-50 p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
             {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="absolute top-20 left-4 right-4 bg-[#1f1f1f]/95 backdrop-blur-lg rounded-2xl border border-[#333]/50 md:hidden overflow-hidden"
          >
            <div className="flex flex-col p-4 space-y-2">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <a
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className="block px-4 py-3 text-sm tracking-wider text-[#9aaa9b] hover:text-[#b8c5b9] hover:bg-[#333]/30 rounded-xl transition-all duration-300 cursor-pointer"
                  >
                    {link.name}
                  </a>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: navLinks.length * 0.1 }}
                className="pt-2 border-t border-[#333]/50 mt-2"
              >
                <a
                  href="#contact"
                  onClick={(e) => handleNavClick(e, "#contact")}
                  className="block px-4 py-3 text-sm font-medium tracking-wider text-[#1a1a1a] bg-[#b8c5b9] text-center rounded-xl hover:bg-[#a5b2a6] transition-all duration-300 cursor-pointer"
                >
                  Contact
                </a>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
