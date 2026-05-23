"use client";

import { motion, MotionValue } from "framer-motion";

interface CurtainPanelProps {
  side: "left" | "right";
  x: MotionValue<number>;
}

// SVG fractal-noise grain — simulates velvet micro-fiber pile
// baseFrequency "0.32 0.78" = coarser horizontal (fiber strands) + finer vertical (pile direction)
const GRAIN_URI =
  `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='256' height='256'%3E` +
  `%3Cfilter id='g'%3E` +
  `%3CfeTurbulence type='fractalNoise' baseFrequency='0.32 0.78' numOctaves='4' stitchTiles='stitch'/%3E` +
  `%3C/filter%3E` +
  `%3Crect width='256' height='256' filter='url(%23g)'/%3E` +
  `%3C/svg%3E")`;

// ─── Fold definitions ────────────────────────────────────────────────────────
// p  = position % across panel (from the "open" edge — left for left curtain)
// hw = highlight half-width in px (determines how cylindrical each fold looks)
// b  = brightness scalar (folds near the center seam receive less direct light)
// ─────────────────────────────────────────────────────────────────────────────
const LEFT_FOLDS = [
  { p:  5, hw: 20, b: 1.00 },  // edge fold — closest to open gap, fully lit
  { p: 13, hw: 14, b: 0.96 },
  { p: 21, hw: 24, b: 0.98 },  // slightly wider — a deeper pleat
  { p: 29, hw: 13, b: 0.91 },  // narrow, shallower fold
  { p: 38, hw: 22, b: 0.94 },
  { p: 47, hw: 16, b: 0.89 },
  { p: 56, hw: 20, b: 0.85 },
  { p: 64, hw: 12, b: 0.80 },  // narrowest — compressed against wall side
  { p: 73, hw: 18, b: 0.76 },
  { p: 81, hw: 14, b: 0.71 },
  { p: 90, hw: 18, b: 0.65 },  // wall edge — falls into shadow
];

// Right curtain is a mirror: positions flip, folds dim toward the right (wall side)
const RIGHT_FOLDS = LEFT_FOLDS
  .map((f) => ({ p: 100 - f.p, hw: f.hw, b: f.b }))
  .reverse();

// Build stacked radial-gradient CSS string — one ellipse per fold
// Each gradient simulates a lit cylindrical pleat
function buildFoldGradients(folds: typeof LEFT_FOLDS): string {
  return folds
    .map(({ p, hw, b }) => {
      // Peak color — vivid crimson-red, scales with brightness
      const rP = Math.round(218 * b);
      const gP = Math.round(26 * b);
      const bP = Math.round(38 * b);
      // Shoulder — mid red, drops off fast
      const rS = Math.round(160 * b);
      const gS = Math.round(11 * b);
      const bS = Math.round(18 * b);

      // ellipse [x-radius]px 110% places a tall cylinder highlight at position p%
      return (
        `radial-gradient(ellipse ${hw}px 110% at ${p}% 44%,` +
        ` rgba(${rP},${gP},${bP},0.97) 0%,` +
        ` rgba(${rS},${gS},${bS},0.78) 30%,` +
        ` rgba(92,5,12,0.30) 62%,` +
        ` transparent 85%)`
      );
    })
    .join(", ");
}

export function CurtainPanel({ side, x }: CurtainPanelProps) {
  const isLeft = side === "left";
  const folds = isLeft ? LEFT_FOLDS : RIGHT_FOLDS;
  const foldLayer = buildFoldGradients(folds);

  // Outer-edge vignette — curtain gets darker as it wraps around the wall
  const outerVignette = isLeft
    ? "linear-gradient(to left, transparent 55%, rgba(0,0,0,0.50) 100%)"
    : "linear-gradient(to right, transparent 55%, rgba(0,0,0,0.50) 100%)";

  // Inner-edge (center seam) — slight shadow so the gap reads as a real gap
  const seamShadow = isLeft
    ? "linear-gradient(to right, transparent 78%, rgba(0,0,0,0.38) 100%)"
    : "linear-gradient(to left, transparent 78%, rgba(0,0,0,0.38) 100%)";

  // Directional velvet sheen — light hits the near-center face of the fabric
  const sheen = isLeft
    ? "linear-gradient(118deg, rgba(255,195,170,0.07) 0%, rgba(255,170,150,0.03) 30%, transparent 55%)"
    : "linear-gradient(242deg, rgba(255,195,170,0.07) 0%, rgba(255,170,150,0.03) 30%, transparent 55%)";

  return (
    <motion.div
      className={`absolute top-0 bottom-0 ${isLeft ? "left-0" : "right-0"}`}
      style={{ x, width: "57%", zIndex: 30, willChange: "transform" }}
    >
      {/* Subtle idle breathing — makes the fabric feel alive */}
      <motion.div
        className="absolute inset-0"
        animate={{ y: [0, -7, 0, -4, 0] }}
        transition={{
          repeat: Infinity,
          duration: 7.5,
          ease: "easeInOut",
          times: [0, 0.28, 0.52, 0.74, 1],
        }}
      >
        {/* ── L1: Base shadow — the deep between-fold troughs ── */}
        <div className="absolute inset-0" style={{ background: "#0d0102" }} />

        {/* ── L2: Cylindrical fold highlights ── */}
        <div className="absolute inset-0" style={{ background: foldLayer }} />

        {/* ── L3: Micro-fold mid-tones — second set of smaller, dimmer folds
               between the main ones; gives the layered gathered-fabric look ── */}
        <div
          className="absolute inset-0"
          style={{
            background: buildFoldGradients(
              folds
                .slice(0, -1)
                .map((f, i) => ({
                  p: (f.p + folds[i + 1].p) / 2,   // midpoint between main folds
                  hw: Math.round(folds[i].hw * 0.55), // narrower highlight
                  b: folds[i].b * 0.48,               // much dimmer
                }))
            ),
          }}
        />

        {/* ── L4: Top shadow — darkness under the valance ── */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0.10) 14%, transparent 24%)",
          }}
        />

        {/* ── L5: Bottom hem shadow ── */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.42) 0%, transparent 18%)",
          }}
        />

        {/* ── L6: Outer (wall-side) vignette ── */}
        <div className="absolute inset-0" style={{ background: outerVignette }} />

        {/* ── L7: Inner (seam-side) shadow ── */}
        <div className="absolute inset-0" style={{ background: seamShadow }} />

        {/* ── L8: Directional velvet sheen ── */}
        <div
          className="absolute inset-0"
          style={{ background: sheen, mixBlendMode: "screen" }}
        />

        {/* ── L9: Velvet grain — SVG fractal noise, screen blend
               Stays invisible on deep shadows; adds shimmer on lit fold faces ── */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: GRAIN_URI,
            backgroundSize: "256px 256px",
            mixBlendMode: "screen",
            opacity: 0.09,
          }}
        />
      </motion.div>
    </motion.div>
  );
}
