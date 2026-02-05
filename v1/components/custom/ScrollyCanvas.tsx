"use client";

import { useEffect, useRef, useState } from "react";
import { useScroll, useTransform } from "framer-motion";

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
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const preloadedImages = useRef<Map<number, HTMLImageElement>>(new Map());

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const frameIndex = useTransform(
    scrollYProgress,
    [0, 1],
    [0, frameCount - 1]
  );

  // Preload all images and store them
  useEffect(() => {
    const loadImages = async () => {
      const batchSize = 20;
      const totalBatches = Math.ceil(frameCount / batchSize);

      for (let batch = 0; batch < totalBatches; batch++) {
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
        setLoadingProgress(Math.round(((batch + 1) / totalBatches) * 100));
      }

      // Set initial frame
      const firstFrame = preloadedImages.current.get(1);
      if (firstFrame && imgRef.current) {
        imgRef.current.src = firstFrame.src;
      }
      
      setImagesLoaded(true);
    };

    loadImages();
  }, [framePath, frameCount]);

  // Subscribe to scroll progress and update frame
  useEffect(() => {
    const unsubscribe = frameIndex.on("change", (latest) => {
      const frameNum = Math.floor(latest) + 1;
      const frame = preloadedImages.current.get(frameNum);
      
      if (frame && imgRef.current) {
        imgRef.current.src = frame.src;
      }
    });

    return () => unsubscribe();
  }, [frameIndex]);

  return (
    <div
      ref={containerRef}
      className="relative w-full"
      style={{ height: scrollHeight }}
    >
      {/* Sticky container with full-width image */}
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        {/* Image wrapper - full width and height */}
        <div
          className="relative w-full h-full overflow-hidden"
          style={{ backgroundColor: "#121212" }}
        >
          {/* Single img element - no key, no remounting */}
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

          {/* Loading indicator */}
          {!imagesLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#121212]">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin mb-3 mx-auto" />
                <p className="text-white/60 text-sm font-medium">
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
