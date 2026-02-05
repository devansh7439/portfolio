"use client";

import { useRef } from "react";
import { useScroll } from "framer-motion";
import { ScrollyCanvas } from "@/components/custom/ScrollyCanvas";
import { Overlay } from "@/components/custom/Overlay";
import Projects  from "@/components/Projects";
import Skills from "@/components/Skills";
import ContactMe from "@/components/ContactMe";
import AboutMe from "@/components/Aboutme";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <main className="relative bg-[#121212]">
      {/* Scrollytelling Section */}
      <section ref={containerRef} className="relative">
        {/* Canvas-based frame sequence */}
        <ScrollyCanvas 
          frameCount={147} 
          framePath="/sequence/webp"
          scrollHeight="500vh"
        />
        
        {/* Overlay with parallax text */}
        <Overlay scrollYProgress={scrollYProgress} />
      </section>
      <AboutMe/>

      <Skills/>
      {/* Projects Section */}
      <Projects />

      {/* Footer / Contact Section */}
      <ContactMe/>
    </main>
  );
}
