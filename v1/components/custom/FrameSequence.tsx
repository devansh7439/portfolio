"use client";

import { useEffect, useRef, useState, useMemo } from "react";
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

export function FrameSequence({
  texts,
  frameCount = 147,
  framePath = "/sequence/webp",
}: FrameSequenceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentFrame, setCurrentFrame] = useState(1);
  const [isLoaded, setIsLoaded] = useState(false);
  const triggersRef = useRef<ScrollTrigger[]>([]);

  // Preload initial frames
  useEffect(() => {
    const preloadFrames = async () => {
      const promises = [];
      // Preload first 10 frames
      for (let i = 1; i <= Math.min(10, frameCount); i++) {
        const img = new window.Image();
        img.src = `${framePath}/frame (${i}).webp`;
        promises.push(
          new Promise((resolve) => {
            img.onload = resolve;
            img.onerror = resolve;
          })
        );
      }
      await Promise.all(promises);
      setIsLoaded(true);
    };
    
    preloadFrames();
  }, [framePath, frameCount]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !isLoaded) return;

    // Clear any existing triggers
    triggersRef.current.forEach((trigger) => trigger.kill());
    triggersRef.current = [];

    // Create scroll-triggered animation - pin for 100vh
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

    return () => {
      triggersRef.current.forEach((trigger) => trigger.kill());
      triggersRef.current = [];
    };
  }, [frameCount, isLoaded]);

  // Calculate text opacities based on frame position
  const getTextOpacity = useMemo(() => {
    return (textIndex: number): number => {
      // Total frames per text (approximately)
      const framesPerText = frameCount / 3;
      const fadeDuration = framesPerText * 0.1; // 10% fade
      
      let startFrame, endFrame;
      
      if (textIndex === 0) {
        // Text 1: 1-49, fade out 41-49
        startFrame = 1;
        endFrame = 49;
        
        if (currentFrame <= 40) return 1;
        if (currentFrame >= 49) return 0;
        // Fade out: frames 41-49
        return 1 - ((currentFrame - 40) / 9);
      } else if (textIndex === 1) {
        // Text 2: fade in 41-50, visible 51-90, fade out 91-100
        if (currentFrame < 41) return 0;
        if (currentFrame >= 41 && currentFrame <= 50) {
          // Fade in: frames 41-50
          return (currentFrame - 41) / 9;
        }
        if (currentFrame <= 90) return 1;
        if (currentFrame >= 100) return 0;
        // Fade out: frames 91-100
        return 1 - ((currentFrame - 90) / 10);
      } else {
        // Text 3: fade in 91-100, visible 101-147
        if (currentFrame < 91) return 0;
        if (currentFrame >= 91 && currentFrame <= 100) {
          // Fade in: frames 91-100
          return (currentFrame - 91) / 9;
        }
        return 1;
      }
    };
  }, [currentFrame, frameCount]);

  // Position classes for text overlay
  const positionClasses = {
    center: "items-center justify-center text-center",
    "bottom-left": "items-end justify-start text-left pb-20 pl-20",
    "bottom-right": "items-end justify-end text-right pb-20 pr-20",
    "top-left": "items-start justify-start text-left pt-20 pl-20",
    "top-right": "items-start justify-end text-right pt-20 pr-20",
  };

  const currentFrameUrl = `${framePath}/frame (${currentFrame}).webp`;

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden"
    >
      {/* Single frame - much more performant */}
      <div className="absolute inset-0 w-full h-full">
        {isLoaded && (
          <Image
            src={currentFrameUrl}
            alt={`Frame ${currentFrame}`}
            fill
            className="object-cover"
            priority
            sizes="100vw"
            unoptimized
          />
        )}
      </div>

      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-black/30 pointer-events-none" />

      {/* Text overlays - each with its own position and opacity */}
      {texts.map((textOverlay, index) => {
        const opacity = getTextOpacity(index);
        
        // Only render if there's some opacity
        if (opacity <= 0) return null;
        
        return (
          <div
            key={index}
            className={`absolute inset-0 flex flex-col ${positionClasses[textOverlay.position]} z-10`}
            style={{ opacity }}
          >
            {/* Main large text */}
            <h2 className="text-6xl md:text-8xl lg:text-9xl font-bold text-white leading-none tracking-tight">
              {textOverlay.text}
            </h2>
          </div>
        );
      })}
    </div>
  );
}
