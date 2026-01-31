import { FrameSequence } from "@/components/custom/FrameSequence";

export default function Home() {
  return (
    <main className="min-h-screen">
      <FrameSequence
        highlightText="Featured Project"
        mainText="CREATIVE WORK"
        textPosition="bottom-left"
      />

      {/* Additional sections below the pinned component */}
      <section className="h-screen flex items-center justify-center bg-[#0D0E12]">
        <div className="text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">
            More Content Below
          </h2>
          <p className="text-[#EBEBEB]/70 text-lg">
            Scroll up to see the frame sequence again
          </p>
        </div>
      </section>
    </main>
  );
}
