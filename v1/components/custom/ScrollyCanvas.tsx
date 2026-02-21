"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useScroll, useSpring, useTransform } from "framer-motion";
import { useTheme } from "../ThemeProvider";
import Overlay from "./Overlay";

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check, { passive: true });
    return () => window.removeEventListener('resize', check);
  }, []);
  return isMobile;
}

interface ScrollyCanvasProps {
  frameCount?: number;
  framePath?: string;
  scrollHeight?: string;
}

export function ScrollyCanvas({
  frameCount = 147,
  framePath = "/sequence/webp",
  scrollHeight = "500vh",
}: ScrollyCanvasProps) {
  const isMobile = useIsMobile();
  const effectiveScrollHeight = isMobile ? '300vh' : scrollHeight;
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const preloadedImages = useRef<Map<number, HTMLImageElement>>(new Map());
  const currentFrameRef = useRef<number>(-1);
  const pendingFrameRef = useRef<number | null>(null);
  const rafIdRef = useRef<number | null>(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Smooth the raw scroll signal before mapping it to frame index.
  const smoothedProgress = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 32,
    mass: 0.35,
  });

  const frameIndex = useTransform(
    smoothedProgress,
    [0, 1],
    [0, frameCount - 1]
  );

  const getFrameNumberFromValue = useCallback(
    (value: number) => {
      if (!Number.isFinite(value)) return 1;
      return Math.min(frameCount, Math.max(1, Math.round(value) + 1));
    },
    [frameCount]
  );

  const renderFrame = useCallback((frameNum: number) => {
    if (frameNum === currentFrameRef.current) return;
    const frame = preloadedImages.current.get(frameNum);
    if (frame && imgRef.current) {
      imgRef.current.src = frame.src;
      currentFrameRef.current = frameNum;
    }
  }, []);

  const queueFrameRender = useCallback((frameNum: number) => {
    pendingFrameRef.current = frameNum;
    if (rafIdRef.current !== null) return;

    rafIdRef.current = window.requestAnimationFrame(() => {
      rafIdRef.current = null;
      const pending = pendingFrameRef.current;
      if (pending === null) return;
      pendingFrameRef.current = null;
      renderFrame(pending);
    });
  }, [renderFrame]);

  const syncFrameFromScroll = useCallback(() => {
    const currentValue = frameIndex.get();
    queueFrameRender(getFrameNumberFromValue(currentValue));
  }, [frameIndex, getFrameNumberFromValue, queueFrameRender]);

  // Preload all images and store them
  useEffect(() => {
    let isCancelled = false;

    const loadImages = async () => {
      preloadedImages.current.clear();
      setImagesLoaded(false);
      setLoadingProgress(0);

      const batchSize = isMobile ? 10 : 20;
      const totalBatches = Math.ceil(frameCount / batchSize);

      for (let batch = 0; batch < totalBatches; batch++) {
        if (isCancelled) return;

        const start = batch * batchSize + 1;
        const end = Math.min((batch + 1) * batchSize, frameCount);

        const batchPromises = [];
        for (let i = start; i <= end; i++) {
          const img = new Image();
          img.src = `${framePath}/frame-${i}.webp`;
          batchPromises.push(
            new Promise<void>((resolve) => {
              img.onload = () => {
                preloadedImages.current.set(i, img);
                resolve();
              };
              img.onerror = () => resolve();
            })
          );
        }

        await Promise.all(batchPromises);
        if (isCancelled) return;
        setLoadingProgress(Math.round(((batch + 1) / totalBatches) * 100));
      }

      if (isCancelled) return;
      setImagesLoaded(true);

      // Sync once after load + layout/scroll restoration settles.
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (!isCancelled) {
            syncFrameFromScroll();
          }
        });
      });
    };

    loadImages();

    return () => {
      isCancelled = true;
    };
  }, [framePath, frameCount, syncFrameFromScroll]);

  // Ensure frame stays in sync on browser refresh/resize.
  useEffect(() => {
    if (!imagesLoaded) return;

    const handleSync = () => {
      syncFrameFromScroll();
    };

    handleSync();
    window.addEventListener("resize", handleSync);
    return () => {
      window.removeEventListener("resize", handleSync);
    };
  }, [imagesLoaded, syncFrameFromScroll]);

  // Subscribe to scroll progress and update frame
  useEffect(() => {
    if (!imagesLoaded) return;

    const unsubscribe = frameIndex.on("change", (latest) => {
      queueFrameRender(getFrameNumberFromValue(latest));
    });

    return () => unsubscribe();
  }, [frameIndex, imagesLoaded, getFrameNumberFromValue, queueFrameRender]);

  useEffect(() => {
    return () => {
      if (rafIdRef.current !== null) {
        window.cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full"
      style={{ height: effectiveScrollHeight }}
    >
      {/* Sticky container with full-width image */}
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        {/* Image wrapper - full width and height */}
        <div
          className={`relative w-full h-full overflow-hidden transition-colors duration-300 ${
            isDark ? 'bg-[#121212]' : 'bg-[#fafafa]'
          }`}
        >
          {/* Single img element - no key, no remounting */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={imgRef}
            alt="Frame sequence"
            className="w-full h-full"
            style={{
              objectFit: "cover",
              width: "100%",
              height: "100%",
              display: imagesLoaded ? "block" : "none",
              imageRendering: "-webkit-optimize-contrast"
            }}
          />

          {/* Overlay text on top of images */}
          <Overlay scrollYProgress={smoothedProgress} />

          {/* Loading indicator */}
          {!imagesLoaded && (
            <div className={`absolute inset-0 flex items-center justify-center transition-colors duration-300 ${
              isDark ? 'bg-[#121212]' : 'bg-[#fafafa]'
            }`}>
              <div className="text-center">
                <div className={`w-12 h-12 border-4 rounded-full animate-spin mb-3 mx-auto ${
                  isDark 
                    ? 'border-white/20 border-t-white' 
                    : 'border-black/20 border-t-black'
                }`} />
                <p className={`text-sm font-medium ${isDark ? 'text-white/60' : 'text-black/60'}`}>
                  Loading {loadingProgress}%
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
