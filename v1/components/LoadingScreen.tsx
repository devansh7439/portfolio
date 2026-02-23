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
  const startTimeRef = useRef<number>(0);
  const MIN_LOADING_TIME = 2000; // 2 seconds minimum

  useEffect(() => {
    startTimeRef.current = Date.now();

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

  const letters = "DEVANSH BAGARIA".split("");
  const clampedProgress = Math.min(progress, 100);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center overflow-hidden bg-[#0a0a0a]"
        >
          {/* Ambient gradient layers */}
          <motion.div
            className="absolute -top-20 -left-20 h-[420px] w-[420px] rounded-full blur-3xl pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(56,189,248,0.16) 0%, rgba(56,189,248,0) 70%)" }}
            animate={{ scale: [0.9, 1.15, 0.95], opacity: [0.35, 0.7, 0.4] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute -bottom-24 -right-24 h-[480px] w-[480px] rounded-full blur-3xl pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(168,85,247,0.14) 0%, rgba(168,85,247,0) 72%)" }}
            animate={{ scale: [1, 1.12, 0.96], opacity: [0.25, 0.55, 0.32] }}
            transition={{ duration: 7.5, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Animated background rings */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="absolute rounded-full border border-white/[0.04]"
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
                <motion.div
                  className="absolute left-1/2 top-1/2 h-24 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl pointer-events-none"
                  style={{ background: "radial-gradient(ellipse at center, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 72%)" }}
                  animate={{ opacity: [0.22, 0.45, 0.26], scale: [0.95, 1.08, 0.98] }}
                  transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
                />

                {/* Letter by letter reveal */}
                <div className="flex justify-center mb-10 overflow-hidden max-w-[92vw]">
                  {letters.map((letter, i) => (
                    <motion.span
                      key={i}
                      className="text-3xl md:text-6xl font-bold inline-block bg-gradient-to-b from-white to-white/65 bg-clip-text text-transparent"
                      style={{ letterSpacing: "0.1em" }}
                      initial={{ y: 100, opacity: 0, rotateX: -90 }}
                      animate={{ y: 0, opacity: 1, rotateX: 0 }}
                      transition={{
                        duration: 0.6,
                        delay: i * 0.08,
                        ease: [0.215, 0.61, 0.355, 1],
                      }}
                    >
                      {letter === " " ? "\u00A0" : letter}
                    </motion.span>
                  ))}
                </div>

                {/* Subtitle */}
                <motion.p
                  className="text-xs md:text-sm tracking-[0.4em] uppercase mb-10 text-white/45"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                >
                  Creative Developer
                </motion.p>

                {/* Loading bar container */}
                <motion.div
                  className="relative w-56 md:w-72 h-[3px] rounded-full overflow-hidden mx-auto bg-white/10"
                  initial={{ opacity: 0, scaleX: 0 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  transition={{ delay: 1, duration: 0.5 }}
                >
                  <motion.div
                    className="h-full bg-gradient-to-r from-cyan-300/55 via-white/85 to-violet-300/55"
                    initial={{ width: "0%" }}
                    animate={{ width: `${clampedProgress}%` }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                  />
                  <motion.div
                    className="absolute inset-y-0 w-10 bg-gradient-to-r from-transparent via-white/70 to-transparent"
                    animate={{ x: ["-140%", "340%"] }}
                    transition={{ duration: 1.25, repeat: Infinity, ease: "linear" }}
                  />
                </motion.div>

                {/* Minimal status cue */}
                <motion.div
                  className="mt-6 flex items-center justify-center gap-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2 }}
                >
                  {[0, 1, 2].map((dot) => (
                    <motion.span
                      key={dot}
                      className="h-1 w-1 rounded-full bg-white/45"
                      animate={{ opacity: [0.2, 1, 0.2], scale: [0.85, 1.2, 0.85] }}
                      transition={{ duration: 0.9, repeat: Infinity, delay: dot * 0.18 }}
                    />
                  ))}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Corner decorations */}
          <motion.div
            className="absolute top-8 left-8 w-8 h-8 border-l border-t border-white/10"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
          />
          <motion.div
            className="absolute top-8 right-8 w-8 h-8 border-r border-t border-white/10"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
          />
          <motion.div
            className="absolute bottom-8 left-8 w-8 h-8 border-l border-b border-white/10"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 }}
          />
          <motion.div
            className="absolute bottom-8 right-8 w-8 h-8 border-r border-b border-white/10"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 }}
          />

        </motion.div>
      )}
    </AnimatePresence>
  );
}
