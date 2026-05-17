import type { Spread } from "@/lib/types";
import { PageRenderer } from "@/components/pages/PageRenderer";

interface BookSpreadProps {
  spread: Spread;
  style?: React.CSSProperties;
  className?: string;
}

export function BookSpread({ spread, style, className }: BookSpreadProps) {
  return (
    <div
      className={`absolute inset-0 flex ${className ?? ""}`}
      style={style}
    >
      {/* Left page */}
      <div className="w-1/2 h-full overflow-hidden" style={{ boxShadow: "inset -4px 0 8px rgba(0,0,0,0.05)" }}>
        <PageRenderer page={spread.left} side="left" />
      </div>

      {/* Right page */}
      <div className="w-1/2 h-full overflow-hidden" style={{ boxShadow: "inset 4px 0 8px rgba(0,0,0,0.05)" }}>
        <PageRenderer page={spread.right} side="right" />
      </div>
    </div>
  );
}
