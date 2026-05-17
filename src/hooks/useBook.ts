"use client";

import { useCallback, useState } from "react";
import type { AnimationDirection, BookPhase } from "@/lib/types";

export function useBook(totalSpreads: number) {
  const [state, setState] = useState<BookPhase>({
    phase: "idle",
    spreadIndex: 0,
  });

  const isAnimating = state.phase === "animating";

  const currentSpread =
    state.phase === "idle" ? state.spreadIndex : state.fromSpread;

  const targetSpread =
    state.phase === "animating" ? state.toSpread : state.spreadIndex;

  const canGoForward = !isAnimating && currentSpread < totalSpreads - 1;
  const canGoBackward = !isAnimating && currentSpread > 0;

  const go = useCallback(
    (direction: AnimationDirection) => {
      if (state.phase !== "idle") return;
      const idx = state.spreadIndex;
      const next = direction === "forward" ? idx + 1 : idx - 1;
      if (next < 0 || next >= totalSpreads) return;

      setState({
        phase: "animating",
        fromSpread: idx,
        toSpread: next,
        direction,
      });
    },
    [isAnimating, state, totalSpreads]
  );

  const onAnimationComplete = useCallback(() => {
    setState((prev) => {
      if (prev.phase !== "animating") return prev;
      return { phase: "idle", spreadIndex: prev.toSpread };
    });
  }, []);

  return {
    state,
    currentSpread,
    targetSpread,
    isAnimating,
    canGoForward,
    canGoBackward,
    goForward: () => go("forward"),
    goBackward: () => go("backward"),
    onAnimationComplete,
  };
}
