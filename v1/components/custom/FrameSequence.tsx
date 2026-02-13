"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

interface TextOverlay {
  text: string;
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right" | "center";
}

interface FrameSequenceProps {
  texts: TextOverlay[];
  frameCount?: number;
  framePath?: string;
}

function getInitialFrameFromScroll(frameCount: number): number {
  // This runs immediately on mount, before React renders
  if (typeof window === 'undefined') return 1;
  
  const scrollY = window.scrollY;
  const viewportHeight = window.innerHeight;
  
  // The FrameSequence typically pins for 100vh after it enters viewport
  // We need to estimate where in the sequence we are based on scroll
  
  // Get all potential trigger elements - look for our container or similar pinned sections
  // Since we don't have the ref yet, we'll estimate based on typical layout
  
  // Estimate: the section is roughly 2x viewport height (pinned + scroll through)
  // The animation happens over roughly 1 viewport height of scroll
  
  // If we're near the top of the page, we're likely at the start
  if (scrollY < viewportHeight) return 1;
  
  // Estimate progress based on scroll position
  // FrameSequence is typically early in the page (after hero)
  // Let's assume it starts around viewport height and spans ~1.5 viewports
  const estimatedStart = viewportHeight * 0.5;
  const estimatedEnd = estimatedStart + (viewportHeight * 1.5);
  
  if (scrollY < estimatedStart) return 1;
  if (scrollY > estimatedEnd) return frameCount;
  
  const progress = (scrollY - estimatedStart) / (estimatedEnd - estimatedStart);
  const frameIndex = Math.min(
    Math.floor(progress * frameCount),
    frameCount - 1
  );
  
  return frameIndex + 1;
}

export function FrameSequence({
  texts,
  frameCount = 147,
  framePath = "/sequence/webp",
}: FrameSequenceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  // Initialize with the correct frame based on current scroll position
  const [currentFrame, setCurrentFrame] = useState(() => getInitialFrameFromScroll(frameCount));
  const [isLoaded, setIsLoaded] = useState(false);
  const [canRender, setCanRender] = useState(false);
  const triggersRef = useRef<ScrollTrigger[]>([]);

  // Preload frames around the current scroll position
  useEffect(() => {
    const preloadFrames = async () => {
      const promises = [];
      // Preload frames around current position (±5 frames)
      const startFrame = Math.max(1, currentFrame - 5);
      const endFrame = Math.min(frameCount, currentFrame + 5);
      
      for (let i = startFrame; i <= endFrame; i++) {
        const img = new window.Image();
        img.src = `${framePath}/frame-${i}.webp`;
        promises.push(
          new Promise((resolve) => {
            img.onload = resolve;
            img.onerror = resolve;
          })
        );
      }
      
      await Promise.all(promises);
      setIsLoaded(true);
      
      // Small delay to ensure everything is ready before rendering
      requestAnimationFrame(() => {
        setCanRender(true);
      });
    };
    
    preloadFrames();
  }, [framePath, frameCount, currentFrame]);

  // Refresh ScrollTrigger after images load
  useEffect(() => {
    if (isLoaded) {
      ScrollTrigger.refresh();
    }
  }, [isLoaded]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !isLoaded) return;

    // Clear any existing triggers
    triggersRef.current.forEach((trigger) => trigger.kill());
    triggersRef.current = [];

    // Create scroll-triggered animation
    const trigger = ScrollTrigger.create({
      trigger: container,
      start: "top top",
      end: "bottom bottom",
      pin: true,
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;
        const frameIndex = Math.min(
          Math.floor(progress * frameCount),
          frameCount - 1
        );
        setCurrentFrame(frameIndex + 1);
      },
    });

    triggersRef.current.push(trigger);

    // Fine-tune the frame based on actual ScrollTrigger measurements
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
        
        const scrollY = window.scrollY;
        const start = trigger.start;
        const end = trigger.end;
        
        let progress = 0;
        if (typeof start === 'number' && typeof end === 'number') {
          const scrollRange = end - start;
          const scrollProgress = scrollY - start;
          progress = Math.max(0, Math.min(1, scrollProgress / scrollRange));
        }
        
        const frameIndex = Math.min(
          Math.floor(progress * frameCount),
          frameCount - 1
        );
        setCurrentFrame(frameIndex + 1);
      });
    });

    return () => {
      triggersRef.current.forEach((trigger) => trigger.kill());
      triggersRef.current = [];
    };
  }, [frameCount, isLoaded]);

  const getTextOpacity = useCallback((textIndex: number): number => {
    if (textIndex === 0) {
      if (currentFrame <= 40) return 1;
      if (currentFrame >= 49) return 0;
      return 1 - ((currentFrame - 40) / 9);
    } else if (textIndex === 1) {
      if (currentFrame < 41) return 0;
      if (currentFrame >= 41 && currentFrame <= 50) {
        return (currentFrame - 41) / 9;
      }
      if (currentFrame <= 90) return 1;
      if (currentFrame >= 100) return 0;
      return 1 - ((currentFrame - 90) / 10);
    } else {
      if (currentFrame < 91) return 0;
      if (currentFrame >= 91 && currentFrame <= 100) {
        return (currentFrame - 91) / 9;
      }
      return 1;
    }
  }, [currentFrame]);

  const positionClasses = {
    center: "items-center justify-center text-center",
    "bottom-left": "items-end justify-start text-left pb-20 pl-20",
    "bottom-right": "items-end justify-end text-right pb-20 pr-20",
    "top-left": "items-start justify-start text-left pt-20 pl-20",
    "top-right": "items-start justify-end text-right pt-20 pr-20",
  };

  const currentFrameUrl = `${framePath}/frame-${currentFrame}.webp`;

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden"
    >
      <div className="absolute inset-0 w-full h-full">
        {canRender && (
          <Image
            src={currentFrameUrl}
            alt={`Frame ${currentFrame}`}
            fill
            className="object-cover"
            priority
            sizes="100vw"
            quality={100}
            unoptimized
          />
        )}
      </div>

      <div className="absolute inset-0 bg-black/30 pointer-events-none" />

      {texts.map((textOverlay, index) => {
        const opacity = getTextOpacity(index);
        if (opacity <= 0) return null;
        
        return (
          <div
            key={index}
            className={`absolute inset-0 flex flex-col ${positionClasses[textOverlay.position]} z-10`}
            style={{ opacity }}
          >
            <h2 className="text-6xl md:text-8xl lg:text-9xl font-bold text-white leading-none tracking-tight">
              {textOverlay.text}
            </h2>
          </div>
        );
      })}
    </div>
  );
}
