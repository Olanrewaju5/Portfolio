import type { TextContent } from "@/lib/types";

interface TextPageProps {
  content: TextContent;
  side: "left" | "right";
}

export function TextPage({ content, side }: TextPageProps) {
  return (
    <div className="w-full h-full flex flex-col justify-center p-8 lg:p-12">
      <div className="space-y-5">
        {content.blocks.map((block, i) => (
          <div key={i}>
            {block.heading && (
              <h3
                className="font-bold mb-2 tracking-tight"
                style={{ fontSize: "clamp(0.85rem, 1.8vw, 1.1rem)", color: "#2c2825" }}
              >
                {block.heading}
              </h3>
            )}
            <p
              className="leading-relaxed"
              style={{
                fontSize: "clamp(0.75rem, 1.4vw, 0.9rem)",
                color: "#4a4642",
                lineHeight: 1.75,
              }}
            >
              {block.body}
            </p>
          </div>
        ))}
      </div>

      {content.pullQuote && (
        <blockquote
          className="mt-8 border-l-2 pl-4"
          style={{
            borderColor: "#c8c2b8",
            color: "#6b6560",
            fontSize: "clamp(0.8rem, 1.5vw, 0.95rem)",
            fontStyle: "italic",
            lineHeight: 1.6,
          }}
        >
          {content.pullQuote}
        </blockquote>
      )}

      {/* Page number */}
      <div
        className="absolute bottom-4 text-[10px] tracking-widest uppercase"
        style={{
          color: "#c8c2b8",
          [side === "left" ? "left" : "right"]: "1.5rem",
        }}
      >
        {side === "left" ? "◂" : "▸"}
      </div>
    </div>
  );
}
