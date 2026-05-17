"use client";

import { motion, useTransform } from "framer-motion";
import type { MotionValue } from "framer-motion";

interface TurningPageProps {
  flipAngle: MotionValue<number>;
  direction: "forward" | "backward";
  frontContent: React.ReactNode;
  backContent: React.ReactNode;
}

export function TurningPage({
  flipAngle,
  direction,
  frontContent,
  backContent,
}: TurningPageProps) {
  const isForward = direction === "forward";

  // Absolute progress 0→1 (0=flat, 1=flat again, peaks at 0.5 = 90°)
  const absProgress = useTransform(flipAngle, (a) => Math.abs(a) / 180);

  // Main fold shadow: dark at 90°, none at 0° and 180°
  const foldShadow = useTransform(absProgress, [0, 0.5, 1], [0, 1, 0]);

  // Spine glow on the static half: lifts up as the page peels away
  const spineGlow = useTransform(absProgress, [0, 0.35, 0.7, 1], [0, 0.55, 0.2, 0]);

  // Back-face reveal shadow (fades in then out as revealed)
  const revealShadow = useTransform(absProgress, [0.5, 0.65, 1], [0.6, 0.25, 0]);

  // Ambient light sweep across the front face (peaks just before 90°)
  const lightSweep = useTransform(absProgress, [0, 0.3, 0.5], [0, 0.7, 0]);

  return (
    <>
      {/* Spine shadow on the static half — simulates the page lifting */}
      <motion.div
        className="absolute top-0 h-full pointer-events-none z-[16]"
        style={{
          width: 48,
          left: isForward ? "calc(50% - 24px)" : "calc(50% - 24px)",
          background: isForward
            ? "linear-gradient(to left, rgba(0,0,0,0.45), transparent)"
            : "linear-gradient(to right, rgba(0,0,0,0.45), transparent)",
          opacity: spineGlow,
        }}
      />

      {/* The flipping half-page */}
      <motion.div
        className="absolute top-0 h-full w-1/2"
        style={{
          left: isForward ? "50%" : 0,
          transformStyle: "preserve-3d",
          transformOrigin: isForward ? "left center" : "right center",
          rotateY: flipAngle,
          zIndex: 15,
        }}
      >
        {/* ── Front face (the page as it was) ── */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
        >
          {frontContent}

          {/* Fold shadow — dark on the leading edge as the page bends away */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: isForward
                ? "linear-gradient(to left, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.08) 40%, transparent 70%)"
                : "linear-gradient(to right, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.08) 40%, transparent 70%)",
              opacity: foldShadow,
            }}
          />

          {/* Ambient light sweep across the page as it turns */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: isForward
                ? "linear-gradient(to right, transparent 40%, rgba(255,255,255,0.12) 100%)"
                : "linear-gradient(to left, transparent 40%, rgba(255,255,255,0.12) 100%)",
              opacity: lightSweep,
            }}
          />
        </div>

        {/* ── Back face (the page being revealed) ── */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          {backContent}

          {/* Reveal shadow fades as it lands */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: isForward
                ? "linear-gradient(to right, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.06) 50%, transparent 80%)"
                : "linear-gradient(to left, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.06) 50%, transparent 80%)",
              opacity: revealShadow,
            }}
          />
        </div>
      </motion.div>
    </>
  );
}
