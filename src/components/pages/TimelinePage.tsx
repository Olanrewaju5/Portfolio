import type { TimelineContent } from "@/lib/types";

interface TimelinePageProps {
  content: TimelineContent;
}

export function TimelinePage({ content }: TimelinePageProps) {
  return (
    <div className="w-full h-full flex flex-col justify-center p-8 lg:p-10">
      <h3
        className="font-bold mb-6 tracking-tight"
        style={{ fontSize: "clamp(0.85rem, 1.8vw, 1.1rem)", color: "#2c2825" }}
      >
        {content.heading}
      </h3>

      <div className="relative space-y-5 pl-4">
        {/* Vertical line */}
        <div
          className="absolute left-0 top-0 bottom-0 w-px"
          style={{ background: "#ddd8d0" }}
        />

        {content.items.map((item, i) => (
          <div key={i} className="relative">
            {/* Dot */}
            <div
              className="absolute -left-[18px] top-[3px] w-2 h-2 rounded-full border-2"
              style={{ borderColor: "#2c2825", background: "#f8f4ec" }}
            />

            <div>
              <div className="flex items-baseline gap-2">
                <span
                  className="font-bold tabular-nums"
                  style={{
                    fontSize: "clamp(0.65rem, 1.2vw, 0.78rem)",
                    color: "#9a9288",
                  }}
                >
                  {item.year}
                </span>
                <span
                  className="font-semibold leading-tight"
                  style={{
                    fontSize: "clamp(0.72rem, 1.3vw, 0.85rem)",
                    color: "#2c2825",
                  }}
                >
                  {item.role}
                </span>
              </div>
              <p
                className="text-[10px] tracking-wide mb-1"
                style={{ color: "#c8c2b8" }}
              >
                {item.place}
              </p>
              <p
                className="leading-snug"
                style={{
                  fontSize: "clamp(0.65rem, 1.2vw, 0.78rem)",
                  color: "#6b6560",
                }}
              >
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
