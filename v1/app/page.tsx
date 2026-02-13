import { SmoothScroll } from "@/components/custom/SmoothScroll";
import { ScrollyCanvas } from "@/components/custom/ScrollyCanvas";
import ProjectsSection from "./sections/ProjectsSection";
import Skills from "@/components/Skills";
import ContactMe from "@/components/ContactMe";
import AboutMe from "@/components/Aboutme";

export default function Home() {
  return (
    <SmoothScroll>
      <main className="relative">

        {/* Scrollytelling Section */}
        <section className="relative">
          <ScrollyCanvas
            frameCount={147}
            framePath="/sequence/webp"
            scrollHeight="500vh"
          />
        </section>

        <div>
          <AboutMe />
        </div>

        <div>
          <Skills />
        </div>

        {/* Projects Section */}
        <div>
          <ProjectsSection />
        </div>

        {/* Footer / Contact Section */}
        <div>
          <ContactMe />
        </div>
      </main>
    </SmoothScroll>
  );
}
