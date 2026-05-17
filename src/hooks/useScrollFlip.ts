"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useMotionValue, animate } from "framer-motion";
import type { MotionValue } from "framer-motion";

export type FlipDirection = "forward" | "backward";
export type FlipPhase = "idle" | "turning";

interface UseScrollFlipReturn {
  spreadIndex: number;
  targetSpreadIndex: number;
  phase: FlipPhase;
  direction: FlipDirection;
  flipAngle: MotionValue<number>;
  canGoForward: boolean;
  canGoBackward: boolean;
  goForward: () => void;
  goBackward: () => void;
}

// How many px of scroll delta = full 180° flip (lower = more sensitive)
const SCROLL_SENSITIVITY = 380;
// Progress fraction at which we auto-snap to completion
const SNAP_THRESHOLD = 0.36;
// Ms without scroll input before snapping back
const IDLE_TIMEOUT = 210;

export function useScrollFlip(totalSpreads: number): UseScrollFlipReturn {
  const [spreadIndex, setSpreadIndex] = useState(0);
  const [targetIndex, setTargetIndex] = useState(0);
  const [phase, setPhase] = useState<FlipPhase>("idle");
  const [direction, setDirection] = useState<FlipDirection>("forward");

  const flipAngle = useMotionValue(0);

  // Refs for synchronous access inside event handlers
  const phaseRef = useRef<FlipPhase>("idle");
  const spreadRef = useRef(0);
  const dirRef = useRef<FlipDirection>("forward");
  const progressRef = useRef(0);
  const lockedRef = useRef(false); // true while snap animation is running
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const setPhaseSync = (p: FlipPhase) => {
    phaseRef.current = p;
    setPhase(p);
  };

  const clearIdleTimer = () => {
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
      idleTimerRef.current = null;
    }
  };

  // Snap back to the start of the flip (user didn't scroll far enough)
  const snapBack = useCallback(() => {
    if (lockedRef.current) return;
    lockedRef.current = true;
    clearIdleTimer();
    progressRef.current = 0;
    animate(flipAngle, 0, { duration: 0.32, ease: [0.25, 0.46, 0.45, 0.94] }).then(() => {
      lockedRef.current = false;
      setPhaseSync("idle");
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flipAngle]);

  // Snap the flip to completion and advance the spread
  const snapComplete = useCallback(
    (dir: FlipDirection) => {
      if (lockedRef.current) return;
      lockedRef.current = true;
      clearIdleTimer();

      const target = dir === "forward" ? -180 : 180;
      animate(flipAngle, target, {
        duration: 0.38,
        ease: [0.645, 0.045, 0.355, 1.0],
      }).then(() => {
        const next =
          dir === "forward"
            ? Math.min(spreadRef.current + 1, totalSpreads - 1)
            : Math.max(spreadRef.current - 1, 0);
        spreadRef.current = next;
        setSpreadIndex(next);
        flipAngle.set(0);
        progressRef.current = 0;
        lockedRef.current = false;
        setPhaseSync("idle");
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [flipAngle, totalSpreads]
  );

  // Wheel / trackpad handler
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (lockedRef.current) return;

      const raw = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      if (Math.abs(raw) < 1) return;

      const dir: FlipDirection = raw > 0 ? "forward" : "backward";
      const idx = spreadRef.current;

      if (dir === "forward" && idx >= totalSpreads - 1) return;
      if (dir === "backward" && idx <= 0) return;

      // Direction reversal mid-flip → snap back first
      if (phaseRef.current === "turning" && dir !== dirRef.current) {
        snapBack();
        return;
      }

      // Begin flip
      if (phaseRef.current === "idle") {
        dirRef.current = dir;
        setDirection(dir);
        setTargetIndex(dir === "forward" ? idx + 1 : idx - 1);
        setPhaseSync("turning");
      }

      // Advance progress
      progressRef.current = Math.min(
        1,
        progressRef.current + Math.abs(raw) / SCROLL_SENSITIVITY
      );
      flipAngle.set(progressRef.current * (dir === "forward" ? -180 : 180));

      clearIdleTimer();

      if (progressRef.current >= SNAP_THRESHOLD) {
        snapComplete(dir);
      } else {
        idleTimerRef.current = setTimeout(() => {
          if (phaseRef.current === "turning" && !lockedRef.current) {
            snapBack();
          }
        }, IDLE_TIMEOUT);
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [totalSpreads, snapBack, snapComplete]);

  // Touch (swipe up/down)
  useEffect(() => {
    let lastY = 0;

    const onTouchStart = (e: TouchEvent) => {
      lastY = e.touches[0].clientY;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (lockedRef.current) return;
      const y = e.touches[0].clientY;
      const delta = lastY - y; // positive = swipe up = forward
      lastY = y;
      if (Math.abs(delta) < 1) return;

      const dir: FlipDirection = delta > 0 ? "forward" : "backward";
      const idx = spreadRef.current;

      if (dir === "forward" && idx >= totalSpreads - 1) return;
      if (dir === "backward" && idx <= 0) return;

      if (phaseRef.current === "turning" && dir !== dirRef.current) {
        snapBack();
        return;
      }

      if (phaseRef.current === "idle") {
        dirRef.current = dir;
        setDirection(dir);
        setTargetIndex(dir === "forward" ? idx + 1 : idx - 1);
        setPhaseSync("turning");
      }

      progressRef.current = Math.min(
        1,
        progressRef.current + Math.abs(delta) / (SCROLL_SENSITIVITY * 0.55)
      );
      flipAngle.set(progressRef.current * (dir === "forward" ? -180 : 180));

      if (progressRef.current >= SNAP_THRESHOLD) {
        snapComplete(dir);
      }
    };

    const onTouchEnd = () => {
      if (phaseRef.current === "turning" && !lockedRef.current) snapBack();
    };

    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [totalSpreads, snapBack, snapComplete]);

  const goForward = useCallback(() => {
    if (lockedRef.current || phaseRef.current !== "idle") return;
    if (spreadRef.current >= totalSpreads - 1) return;
    dirRef.current = "forward";
    setDirection("forward");
    setTargetIndex(spreadRef.current + 1);
    setPhaseSync("turning");
    snapComplete("forward");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalSpreads, snapComplete]);

  const goBackward = useCallback(() => {
    if (lockedRef.current || phaseRef.current !== "idle") return;
    if (spreadRef.current <= 0) return;
    dirRef.current = "backward";
    setDirection("backward");
    setTargetIndex(spreadRef.current - 1);
    setPhaseSync("turning");
    snapComplete("backward");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalSpreads, snapComplete]);

  return {
    spreadIndex,
    targetSpreadIndex: phase === "turning" ? targetIndex : spreadIndex,
    phase,
    direction,
    flipAngle,
    canGoForward: spreadIndex < totalSpreads - 1,
    canGoBackward: spreadIndex > 0,
    goForward,
    goBackward,
  };
}
