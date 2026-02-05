"use client";

import { useEffect, useRef } from "react";
import { ScrollyCanvas } from "@/components/custom/ScrollyCanvas";
import { SmoothScroll } from "@/components/custom/SmoothScroll";
import Projects from "@/components/Projects";
import Skills from "@/components/Skills";
import ContactMe from "@/components/ContactMe";
import AboutMe from "@/components/Aboutme";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const aboutRef = useRef<HTMLDivElement>(null);
  const skillsRef = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate AboutMe section
      gsap.fromTo(
        aboutRef.current,
        { opacity: 0, y: 100 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: aboutRef.current,
            start: "top 80%",
            end: "top 50%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Animate Skills section
      gsap.fromTo(
        skillsRef.current,
        { opacity: 0, x: -100 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: skillsRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Animate Projects section
      gsap.fromTo(
        projectsRef.current,
        { opacity: 0, y: 100 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: projectsRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Animate Contact section
      gsap.fromTo(
        contactRef.current,
        { opacity: 0, scale: 0.9 },
        {
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: contactRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <SmoothScroll>
      <main className="relative bg-[#121212]">
        {/* Scrollytelling Section */}
        <section className="relative">
          {/* Canvas-based frame sequence */}
          <ScrollyCanvas
            frameCount={147}
            framePath="/sequence/webp"
            scrollHeight="500vh"
          />
        </section>

        <div ref={aboutRef}>
          <AboutMe />
        </div>

        <div ref={skillsRef}>
          <Skills />
        </div>

        {/* Projects Section */}
        <div ref={projectsRef}>
          <Projects />
        </div>

        {/* Footer / Contact Section */}
        <div ref={contactRef}>
          <ContactMe />
        </div>
      </main>
    </SmoothScroll>
  );
}
