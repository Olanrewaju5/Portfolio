"use client";

import { useCallback, useRef, useState } from "react";

export function useSound() {
  const [enabled, setEnabled] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);

  const getCtx = useCallback(() => {
    if (!ctxRef.current) {
      ctxRef.current = new AudioContext();
    }
    return ctxRef.current;
  }, []);

  const playPageTurn = useCallback(() => {
    if (!enabled) return;
    try {
      const ctx = getCtx();
      const buffer = ctx.createBuffer(1, ctx.sampleRate * 0.25, ctx.sampleRate);
      const data = buffer.getChannelData(0);

      // Synthesise a soft page-rustle
      for (let i = 0; i < data.length; i++) {
        const t = i / ctx.sampleRate;
        const envelope = Math.exp(-t * 18) * (1 - Math.exp(-t * 80));
        data[i] = (Math.random() * 2 - 1) * envelope * 0.35;
      }

      const source = ctx.createBufferSource();
      source.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.value = 3200;
      filter.Q.value = 0.8;

      source.connect(filter);
      filter.connect(ctx.destination);
      source.start();
    } catch {
      // AudioContext not available (SSR / blocked)
    }
  }, [enabled, getCtx]);

  return { soundEnabled: enabled, toggleSound: () => setEnabled((v) => !v), playPageTurn };
}
