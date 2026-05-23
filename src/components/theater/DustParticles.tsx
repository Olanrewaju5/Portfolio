"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

interface Particle {
  id: number;
  x: string;
  delay: number;
  duration: number;
  size: number;
  alpha: number;
  drift: number;
}

export function DustParticles({ count = 28 }: { count?: number }) {
  const particles = useMemo<Particle[]>(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        x: `${8 + Math.random() * 84}%`,
        delay: Math.random() * 12,
        duration: 14 + Math.random() * 18,
        size: 0.8 + Math.random() * 2.2,
        alpha: 0.06 + Math.random() * 0.22,
        drift: (Math.random() - 0.5) * 110,
      })),
    [count]
  );

  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none"
      style={{ zIndex: 25 }}
    >
      {particles.map((p) => (
        <motion.span
          key={p.id}
          className="absolute block rounded-full"
          style={{
            left: p.x,
            bottom: "-4px",
            width: p.size,
            height: p.size,
            background: `rgba(255, 215, 110, ${p.alpha})`,
          }}
          animate={{
            y: [0, "-108vh"],
            x: [0, p.drift],
            opacity: [0, p.alpha, p.alpha * 0.65, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}
