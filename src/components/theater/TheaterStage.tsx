"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  animate,
} from "framer-motion";
import { CurtainPanel } from "./CurtainPanel";
import { DustParticles } from "./DustParticles";

// ↓ Swap this URL for your own cinematic showreel or portfolio video
const VIDEO_SRC = "https://www.w3schools.com/html/mov_bbb.mp4";

type StageState = "idle" | "dragging" | "opening" | "open" | "closing";

export function TheaterStage() {
  const [stageState, setStageState] = useState<StageState>("idle");
  const isDragging = useRef(false);
  const startX = useRef(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [vw, setVw] = useState(1440);

  useEffect(() => {
    setVw(window.innerWidth);
    const onResize = () => setVw(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Single source of truth for how open the curtains are (0 = closed, 1 = fully open)
  const progress = useMotionValue(0);

  // Left curtain goes left, right curtain goes right
  const leftX  = useTransform(progress, [0, 1], [0, -(vw * 0.58 + 80)]);
  const rightX = useTransform(progress, [0, 1], [0,   vw * 0.58 + 80]);

  // Warm radial glow builds as curtains part, then fades when fully open (video takes over)
  const glowOpacity = useTransform(
    progress,
    [0, 0.08, 0.55, 0.85, 1.0],
    [0.07, 0.55, 0.72, 0.30, 0.0]
  );

  // Bright narrow gap-light — the "light leak" effect as curtains first separate
  const gapLightOpacity = useTransform(
    progress,
    [0, 0.04, 0.22, 0.55],
    [0,  0.9,  0.5,  0.0]
  );
  const gapLightWidth = useTransform(
    progress,
    [0, 0.04, 0.55],
    [0, 48, 320]
  );

  // Video fades in when curtains are nearly fully open
  const videoOpacity = useTransform(progress, [0.68, 1.0], [0, 1]);

  // "Pull to Begin" hint disappears early
  const hintOpacity = useTransform(progress, [0, 0.12], [1, 0]);

  // ── Play / pause video in sync with open state ──
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    if (stageState === "open") {
      vid.play().catch(() => {});
    } else if (stageState === "closing" || stageState === "idle") {
      vid.pause();
      vid.currentTime = 0;
    }
  }, [stageState]);

  // ── Animations ──
  const openFully = useCallback(() => {
    setStageState("opening");
    animate(progress, 1, {
      type: "spring",
      stiffness: 38,
      damping: 22,
      mass: 1.2,
      onComplete: () => setStageState("open"),
    });
  }, [progress]);

  const closeCurtains = useCallback(() => {
    setStageState("closing");
    // Slightly underdamped so curtains overshoot and settle (fabric impact feel)
    animate(progress, 0, {
      type: "spring",
      stiffness: 28,
      damping: 10,
      mass: 1.3,
      onComplete: () => setStageState("idle"),
    });
  }, [progress]);

  // ── Pointer drag handlers ──
  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (stageState === "open" || stageState === "opening" || stageState === "closing") return;
      isDragging.current = true;
      startX.current = e.clientX;
      setStageState("dragging");
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    },
    [stageState]
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!isDragging.current) return;
      const dx = e.clientX - startX.current;
      // Slight power curve for the "heavy fabric" resistance feel
      const raw = Math.max(0, Math.min(1, dx / (vw * 0.46)));
      progress.set(Math.pow(raw, 0.88));
    },
    [progress, vw]
  );

  const onPointerUp = useCallback(() => {
    if (!isDragging.current) return;
    isDragging.current = false;
    if (progress.get() >= 0.5) {
      openFully();
    } else {
      setStageState("idle");
      animate(progress, 0, { type: "spring", stiffness: 58, damping: 18, mass: 1.0 });
    }
  }, [progress, openFully]);

  const isDraggable = stageState === "idle" || stageState === "dragging";

  return (
    <div
      className="relative w-full overflow-hidden select-none"
      style={{
        height: "100svh",
        background: "#060101",
        touchAction: "none",
        cursor: isDraggable ? (isDragging.current ? "grabbing" : "grab") : "default",
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      {/* ── Stage background ── */}
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse 80% 70% at 50% 60%, #120208 0%, #060101 100%)" }}
      />

      {/* ── Video layer ── */}
      <motion.div className="absolute inset-0" style={{ opacity: videoOpacity }}>
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          muted
          loop
          playsInline
          preload="metadata"
          onEnded={closeCurtains}
        >
          <source src={VIDEO_SRC} type="video/mp4" />
        </video>
        {/* Film grain vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.65) 100%)",
          }}
        />
      </motion.div>

      {/* ── Radial glow (warm cinematic light escaping from behind the curtains) ── */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ opacity: glowOpacity, zIndex: 10 }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 48% 90% at 50% 52%, rgba(255,195,65,0.6) 0%, rgba(230,115,25,0.28) 36%, transparent 66%)",
          }}
        />
      </motion.div>

      {/* ── Gap light — the bright vertical streak as curtains first separate ── */}
      <motion.div
        className="absolute inset-y-0 pointer-events-none"
        style={{
          left: "50%",
          translateX: "-50%",
          width: gapLightWidth,
          opacity: gapLightOpacity,
          zIndex: 12,
          background:
            "radial-gradient(ellipse 50% 100% at 50% 50%, rgba(255,235,150,0.95) 0%, rgba(255,185,60,0.5) 40%, transparent 100%)",
          filter: "blur(8px)",
        }}
      />

      {/* ── Ambient seam glow (always present before drag) ── */}
      <div
        className="absolute inset-y-0 pointer-events-none"
        style={{
          left: "50%",
          transform: "translateX(-50%)",
          width: "100px",
          background:
            "radial-gradient(ellipse 50px 100% at 50% 50%, rgba(255,170,50,0.09) 0%, transparent 100%)",
          zIndex: 14,
        }}
      />

      {/* ── Dust particles ── */}
      <DustParticles />

      {/* ── Curtain panels ── */}
      <CurtainPanel side="left"  x={leftX}  />
      <CurtainPanel side="right" x={rightX} />

      {/* ── Fixed top masking + valance + gold rod ── */}
      <div
        className="absolute top-0 left-0 right-0 pointer-events-none"
        style={{ zIndex: 45 }}
      >
        {/* Theater masking bar */}
        <div
          style={{
            height: "50px",
            background: "linear-gradient(to bottom, #030101 65%, transparent 100%)",
          }}
        />
        {/* Velvet valance */}
        <div
          style={{
            height: "30px",
            background:
              "linear-gradient(to right, #0e0205 0%, #380c14 12%, #5a1820 25%, #6e1e2c 38%, #5a1820 50%, #6e1e2c 62%, #5a1820 75%, #380c14 88%, #0e0205 100%)",
            boxShadow: "0 6px 24px rgba(0,0,0,0.75)",
          }}
        />
        {/* Gold curtain rod */}
        <div
          style={{
            height: "5px",
            background:
              "linear-gradient(to right, #2e2204, #b8921e 18%, #e2c235 50%, #b8921e 82%, #2e2204)",
            boxShadow: "0 3px 14px rgba(180,140,20,0.45)",
          }}
        />
      </div>

      {/* ── "Pull to Begin" hint ── */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ opacity: hintOpacity, zIndex: 50 }}
      >
        <motion.div
          className="flex flex-col items-center gap-4"
          animate={{ opacity: [0.55, 1, 0.55] }}
          transition={{ repeat: Infinity, duration: 2.8, ease: "easeInOut" }}
        >
          <div className="flex items-center gap-5">
            <motion.span
              className="text-xl"
              style={{ color: "rgba(255,210,120,0.6)" }}
              animate={{ x: [-6, 0, -6] }}
              transition={{ repeat: Infinity, duration: 2.0, ease: "easeInOut" }}
            >
              ←
            </motion.span>
            <span
              style={{
                fontSize: "10px",
                letterSpacing: "0.55em",
                textTransform: "uppercase",
                color: "rgba(255, 218, 140, 0.68)",
                fontWeight: 300,
                fontFamily: "var(--font-inter), system-ui, sans-serif",
              }}
            >
              Pull to Begin
            </span>
            <motion.span
              className="text-xl"
              style={{ color: "rgba(255,210,120,0.6)" }}
              animate={{ x: [6, 0, 6] }}
              transition={{ repeat: Infinity, duration: 2.0, ease: "easeInOut" }}
            >
              →
            </motion.span>
          </div>
          <motion.div
            style={{ width: "1px", height: "36px", background: "rgba(255,205,95,0.28)" }}
            animate={{ scaleY: [0.4, 1, 0.4] }}
            transition={{ repeat: Infinity, duration: 2.8, ease: "easeInOut" }}
          />
        </motion.div>
      </motion.div>

      {/* ── Close button (shown when fully open) ── */}
      {stageState === "open" && (
        <motion.button
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.4 }}
          className="absolute top-5 right-6 pointer-events-auto"
          style={{
            zIndex: 55,
            fontSize: "9px",
            letterSpacing: "0.5em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.45)",
            background: "none",
            border: "none",
            cursor: "pointer",
            fontFamily: "var(--font-inter), system-ui, sans-serif",
            transition: "color 0.2s",
          }}
          onClick={(e) => {
            e.stopPropagation();
            closeCurtains();
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.85)")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.45)")}
        >
          Close ✕
        </motion.button>
      )}
    </div>
  );
}
