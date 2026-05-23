"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import type { Spread } from "@/lib/types";
import { PageRenderer } from "@/components/pages/PageRenderer";

interface MobileBookProps {
  spreads: Spread[];
}

function MobilePage({
  page,
  side,
  index,
}: {
  page: Spread["left"];
  side: "left" | "right";
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: false, margin: "-15% 0px -15% 0px" });

  return (
    <motion.div
      ref={ref}
      className="w-full flex-shrink-0 rounded-xl overflow-hidden"
      style={{
        height: "85svh",
        maxHeight: 680,
        boxShadow:
          "0 16px 48px rgba(0,0,0,0.28), 0 4px 12px rgba(0,0,0,0.15)",
      }}
      initial={{ opacity: 0, y: 32, scale: 0.97 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0.6, y: 16, scale: 0.97 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: index * 0.04 }}
    >
      <PageRenderer page={page} side={side} />
    </motion.div>
  );
}

export function MobileBook({ spreads }: MobileBookProps) {
  return (
    <div className="min-h-screen px-5 py-24 space-y-6">
      {/* Mobile top bar */}
      <div
        className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-3 py-2 rounded-full"
        style={{
          background: "rgba(28,25,22,0.88)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <span className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.7)", fontFamily: "var(--font-inter)" }}>
          Abdulquddus
        </span>
        <div style={{ width: 1, height: 12, background: "rgba(255,255,255,0.2)" }} />
        <Link
          href="/playground"
          style={{
            fontSize: 11,
            fontWeight: 500,
            color: "rgba(255,255,255,0.55)",
            fontFamily: "var(--font-inter)",
            textDecoration: "none",
            letterSpacing: "-0.2px",
          }}
        >
          Playground ↗
        </Link>
      </div>

      {spreads.map((spread, si) => (
        <div key={spread.id} className="space-y-4">
          {/* Show left page unless it's a blank decorative page */}
          {spread.left.type !== "blank" && (
            <MobilePage page={spread.left} side="left" index={si * 2} />
          )}
          <MobilePage page={spread.right} side="right" index={si * 2 + 1} />
        </div>
      ))}

      <div
        className="text-center text-xs pt-8 pb-4"
        style={{ color: "rgba(44,40,37,0.35)" }}
      >
        © {new Date().getFullYear()} Abdulquddus
      </div>
    </div>
  );
}
