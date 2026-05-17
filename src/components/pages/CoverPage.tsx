import type { CoverContent } from "@/lib/types";

interface CoverPageProps {
  content: CoverContent;
  side: "left" | "right";
}

export function CoverPage({ content, side }: CoverPageProps) {
  return (
    <div className="w-full h-full flex flex-col justify-between p-8 lg:p-10">
      {/* Name block — top-aligned, Impact font matching Figma */}
      <div className="mt-2">
        <h1
          className="leading-none text-black"
          style={{
            fontFamily: "Impact, 'Arial Narrow', Arial, sans-serif",
            fontSize: "clamp(1.8rem, 4vw, 2.75rem)",
            letterSpacing: "0",
            fontWeight: "normal",
          }}
        >
          {content.title}
        </h1>
        <h2
          className="leading-none mt-1"
          style={{
            fontFamily: "Impact, 'Arial Narrow', Arial, sans-serif",
            fontSize: "clamp(1.8rem, 4vw, 2.75rem)",
            color: "#726f6f",
            fontWeight: "normal",
            marginLeft: "clamp(8px, 1.5vw, 18px)",
          }}
        >
          {content.subtitle}
        </h2>
      </div>

      {/* Credits — bottom of left page */}
      {content.credits && side === "left" && (
        <div className="space-y-[3px]">
          {content.credits.map((c, i) => (
            <p key={i} className="leading-tight" style={{ fontSize: 10, color: "#32343b" }}>
              <span style={{ fontWeight: 500 }}>{c.label}:</span>{" "}
              <span style={{ color: "#8d8d8d" }}>{c.value}</span>
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
