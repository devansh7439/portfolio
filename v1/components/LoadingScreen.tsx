"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LoadingScreenProps {
  onLoadingComplete?: () => void;
}

export default function LoadingScreen({ onLoadingComplete }: LoadingScreenProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [showContent, setShowContent] = useState(false);
  const [isLightMode, setIsLightMode] = useState(false);
  const startTimeRef = useRef<number>(Date.now());
  const MIN_LOADING_TIME = 2000; // 2 seconds minimum

  // Check theme from document class directly to avoid context issues during SSR
  useEffect(() => {
    const checkTheme = () => {
      setIsLightMode(document.documentElement.classList.contains('light'));
    };
    checkTheme();
    
    // Listen for theme changes
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    // Small delay before showing content for dramatic effect
    const showTimeout = setTimeout(() => {
      setShowContent(true);
    }, 100);

    // Simulate loading progress with smoother animation
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        // Slower, more deliberate progress
        return prev + Math.random() * 8 + 3;
      });
    }, 80);

    // Listen for actual page load
    const handleLoad = () => {
      setProgress(100);
    };

    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad);
    }

    return () => {
      clearTimeout(showTimeout);
      clearInterval(interval);
      window.removeEventListener("load", handleLoad);
    };
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      const elapsed = Date.now() - startTimeRef.current;
      const remainingTime = Math.max(0, MIN_LOADING_TIME - elapsed);
      
      // Ensure minimum 2 seconds of loading time
      const timeout = setTimeout(() => {
        setIsLoading(false);
        onLoadingComplete?.();
      }, remainingTime + 300); // Add small buffer for exit animation
      
      return () => clearTimeout(timeout);
    }
  }, [progress, onLoadingComplete]);

  const letters = "DEVANSH".split("");

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          className={`fixed inset-0 z-[200] flex flex-col items-center justify-center overflow-hidden ${isLightMode ? 'bg-[#fafafa]' : 'bg-[#121212]'}`}
        >
          {/* Animated background rings */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className={`absolute rounded-full border ${isLightMode ? 'border-black/[0.03]' : 'border-white/[0.03]'}`}
                style={{
                  width: `${300 + i * 150}px`,
                  height: `${300 + i * 150}px`,
                }}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{
                  scale: [0.8, 1.1, 0.8],
                  opacity: [0.1, 0.3, 0.1],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 8 + i * 2,
                  repeat: Infinity,
                  ease: "linear",
                  delay: i * 0.5,
                }}
              />
            ))}
          </div>

          {/* Logo / Name with letter animation */}
          <AnimatePresence>
            {showContent && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="relative z-10 text-center"
              >
                {/* Letter by letter reveal */}
                <div className="flex justify-center mb-10 overflow-hidden">
                  {letters.map((letter, i) => (
                    <motion.span
                      key={i}
                      className={`text-4xl md:text-6xl font-bold inline-block ${isLightMode ? 'text-[#171717]' : 'text-white'}`}
                      style={{ letterSpacing: "0.1em" }}
                      initial={{ y: 100, opacity: 0, rotateX: -90 }}
                      animate={{ y: 0, opacity: 1, rotateX: 0 }}
                      transition={{
                        duration: 0.6,
                        delay: i * 0.08,
                        ease: [0.215, 0.61, 0.355, 1],
                      }}
                    >
                      {letter}
                    </motion.span>
                  ))}
                </div>

                {/* Subtitle */}
                <motion.p
                  className={`text-xs md:text-sm tracking-[0.4em] uppercase mb-12 ${isLightMode ? 'text-black/40' : 'text-white/40'}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                >
                  Creative Developer
                </motion.p>

                {/* Loading bar container */}
                <motion.div
                  className={`w-56 md:w-72 h-[1px] rounded-full overflow-hidden mx-auto ${isLightMode ? 'bg-black/10' : 'bg-white/10'}`}
                  initial={{ opacity: 0, scaleX: 0 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  transition={{ delay: 1, duration: 0.5 }}
                >
                  <motion.div
                    className={`h-full bg-gradient-to-r ${isLightMode ? 'from-black/60 via-black/80 to-black/60' : 'from-white/60 via-white/80 to-white/60'}`}
                    initial={{ width: "0%" }}
                    animate={{ width: `${Math.min(progress, 100)}%` }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                  />
                </motion.div>

                {/* Progress percentage */}
                <motion.p
                  className={`mt-6 text-[10px] tracking-[0.3em] font-mono ${isLightMode ? 'text-black/30' : 'text-white/30'}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2 }}
                >
                  LOADING {Math.min(Math.round(progress), 100)}%
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Corner decorations */}
          <motion.div
            className={`absolute top-8 left-8 w-8 h-8 border-l border-t ${isLightMode ? 'border-black/10' : 'border-white/10'}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
          />
          <motion.div
            className={`absolute top-8 right-8 w-8 h-8 border-r border-t ${isLightMode ? 'border-black/10' : 'border-white/10'}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
          />
          <motion.div
            className={`absolute bottom-8 left-8 w-8 h-8 border-l border-b ${isLightMode ? 'border-black/10' : 'border-white/10'}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 }}
          />
          <motion.div
            className={`absolute bottom-8 right-8 w-8 h-8 border-r border-b ${isLightMode ? 'border-black/10' : 'border-white/10'}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 }}
          />

          {/* Version number */}
          <motion.p
            className={`absolute bottom-8 left-1/2 -translate-x-1/2 text-[10px] tracking-[0.2em] ${isLightMode ? 'text-black/20' : 'text-white/20'}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            2025
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
