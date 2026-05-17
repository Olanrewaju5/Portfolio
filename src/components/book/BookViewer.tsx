"use client";

import type { BookData } from "@/lib/types";
import { useScrollFlip } from "@/hooks/useScrollFlip";
import { useSound } from "@/hooks/useSound";
import { BookSpread } from "./BookSpread";
import { TurningPage } from "./TurningPage";
import { BindingRings } from "./BindingRings";
import { PageRenderer } from "@/components/pages/PageRenderer";
import { PageControls } from "@/components/nav/PageControls";
import { TopNav } from "@/components/nav/TopNav";
import { MobileBook } from "@/components/mobile/MobileBook";

interface BookViewerProps {
  data: BookData;
}

export function BookViewer({ data }: BookViewerProps) {
  const { spreads } = data;
  const {
    spreadIndex,
    targetSpreadIndex,
    phase,
    direction,
    flipAngle,
    canGoForward,
    canGoBackward,
    goForward,
    goBackward,
  } = useScrollFlip(spreads.length);
  const { soundEnabled, toggleSound, playPageTurn } = useSound();

  const handleForward = () => {
    if (!canGoForward) return;
    playPageTurn();
    goForward();
  };

  const handleBackward = () => {
    if (!canGoBackward) return;
    playPageTurn();
    goBackward();
  };

  const isTurning = phase === "turning";
  const isForward = direction === "forward";
  const currentSpread = spreads[spreadIndex];
  const targetSpread = spreads[targetSpreadIndex];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#d7d7d7] select-none overflow-hidden">
      {/* Ambient grain texture */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.035] z-50"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "128px",
        }}
      />

      <TopNav
        soundEnabled={soundEnabled}
        onToggleSound={toggleSound}
        spreadIndex={spreadIndex}
        totalSpreads={spreads.length}
      />

      {/* ── DESKTOP BOOK ── */}
      <div className="hidden md:flex flex-col items-center gap-8 py-12">
        <div
          className="relative"
          style={{
            width: "min(860px, 90vw)",
            height: "min(600px, 65vw)",
            perspective: "2200px",
          }}
        >
          {/* Book body */}
          <div
            className="relative w-full h-full rounded-sm overflow-hidden"
            style={{
              transformStyle: "preserve-3d",
              transform: "rotateX(2deg)",
              boxShadow:
                "0 30px 80px rgba(0,0,0,0.4), 0 10px 24px rgba(0,0,0,0.25), 0 2px 6px rgba(0,0,0,0.15)",
            }}
          >
            {/* ── LAYER 1: destination (or current during idle) — always behind ── */}
            <BookSpread spread={isTurning ? targetSpread : currentSpread} />

            {/* ── LAYERS 2+3: only while a flip is in progress ── */}
            {isTurning && (
              <>
                {/* Static half of the source spread that doesn't flip */}
                <div
                  className="absolute top-0 h-full w-1/2 overflow-hidden z-10"
                  style={{ left: isForward ? 0 : "50%" }}
                >
                  <PageRenderer
                    page={isForward ? currentSpread.left : currentSpread.right}
                    side={isForward ? "left" : "right"}
                  />
                </div>

                {/* The magazine page flip */}
                <TurningPage
                  flipAngle={flipAngle}
                  direction={direction}
                  frontContent={
                    <PageRenderer
                      page={isForward ? currentSpread.right : currentSpread.left}
                      side={isForward ? "right" : "left"}
                    />
                  }
                  backContent={
                    <PageRenderer
                      page={isForward ? targetSpread.left : targetSpread.right}
                      side={isForward ? "left" : "right"}
                    />
                  }
                />
              </>
            )}

            {/* ── Binding rings ── */}
            <BindingRings />

            {/* Edge tab */}
            <div
              className="absolute right-0 top-1/2 -translate-y-1/2 w-3 rounded-l-sm z-20"
              style={{
                height: "12%",
                background: "#2c2825",
                boxShadow: "-2px 0 6px rgba(0,0,0,0.3)",
              }}
            />
          </div>
        </div>

        <PageControls
          onPrev={handleBackward}
          onNext={handleForward}
          canPrev={canGoBackward}
          canNext={canGoForward}
          current={spreadIndex}
          total={spreads.length}
        />
      </div>

      {/* ── MOBILE ── */}
      <div className="md:hidden w-full">
        <MobileBook spreads={spreads} />
      </div>
    </div>
  );
}
