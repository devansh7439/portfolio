"use client";

import { motion, MotionValue, useTransform } from "framer-motion";

interface SectionProps {
  children: React.ReactNode;
  opacity: MotionValue<number>;
  y: MotionValue<number>;
  className?: string;
}

export function Overlay({
  scrollYProgress,
}: {
  scrollYProgress: MotionValue<number>;
}) {
  /* SECTION 1 — Hero */
  const s1Opacity = useTransform(scrollYProgress, [0, 0.15, 0.25], [1, 1, 0]);
  const s1Y = useTransform(scrollYProgress, [0, 0.25], [0, -60]);

  /* SECTION 2 — Left */
  const s2Opacity = useTransform(
    scrollYProgress,
    [0.25, 0.35, 0.5],
    [0, 1, 0]
  );
  const s2Y = useTransform(scrollYProgress, [0.25, 0.5], [60, -60]);

  /* SECTION 3 — Right */
  const s3Opacity = useTransform(
    scrollYProgress,
    [0.5, 0.65, 0.8],
    [0, 1, 0]
  );
  const s3Y = useTransform(scrollYProgress, [0.5, 0.8], [60, -60]);

  return (
    <>
      {/* SECTION 1 */}
      <Section opacity={s1Opacity} y={s1Y} className="justify-center text-center">
        <h1 className="text-6xl md:text-8xl font-bold tracking-tighter leading-tight">
          Devansh Bagaria
          <br />
          <span className="text-white/50 text-3xl md:text-4xl font-medium">
            Creative Developer
          </span>
        </h1>
      </Section>

      {/* SECTION 2 */}
      <Section
        opacity={s2Opacity}
        y={s2Y}
        className="justify-start pl-8 md:pl-20 text-left"
      >
        <h2 className="text-5xl md:text-7xl font-semibold leading-tight">
          I build systems,
          <br />
          not just interfaces
        </h2>
      </Section>

      {/* SECTION 3 */}
      <Section
        opacity={s3Opacity}
        y={s3Y}
        className="justify-end pr-8 md:pr-20 text-right"
      >
        <h2 className="text-5xl md:text-7xl font-semibold leading-tight">
          Bridging design
          <br />
          and engineering
        </h2>
      </Section>
    </>
  );
}

function Section({ children, opacity, y, className = "" }: SectionProps) {
  return (
    <motion.div
      style={{ opacity, y }}
      aria-hidden="true"
      className={`absolute inset-0 flex items-center pointer-events-none
        [will-change:transform,opacity]
        text-white ${className}`}
    >
      {children}
    </motion.div>
  );
}
