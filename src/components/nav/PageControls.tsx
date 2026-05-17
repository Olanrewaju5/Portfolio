"use client";

interface PageControlsProps {
  onPrev: () => void;
  onNext: () => void;
  canPrev: boolean;
  canNext: boolean;
  current: number;
  total: number;
}

export function PageControls({ onPrev, onNext, canPrev, canNext }: PageControlsProps) {
  return (
    <div
      className="flex items-center gap-2 px-1 py-1 rounded-[13px]"
      style={{
        background: "#ffffff",
        boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
      }}
    >
      {/* Prev */}
      <button
        onClick={onPrev}
        disabled={!canPrev}
        className="w-[28px] h-[28px] flex items-center justify-center rounded-full transition-all duration-200"
        style={{
          color: canPrev ? "#2c2825" : "rgba(44,40,37,0.2)",
          cursor: canPrev ? "pointer" : "default",
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15,18 9,12 15,6"/>
        </svg>
      </button>

      {/* Divider */}
      <div
        className="w-px self-stretch"
        style={{ background: "rgba(44,40,37,0.15)", margin: "4px 0" }}
      />

      {/* Next */}
      <button
        onClick={onNext}
        disabled={!canNext}
        className="w-[28px] h-[28px] flex items-center justify-center rounded-full transition-all duration-200"
        style={{
          color: canNext ? "#2c2825" : "rgba(44,40,37,0.2)",
          cursor: canNext ? "pointer" : "default",
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9,18 15,12 9,6"/>
        </svg>
      </button>
    </div>
  );
}
