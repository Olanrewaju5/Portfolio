import type { PhotoContent } from "@/lib/types";

interface PhotoPageProps {
  content: PhotoContent;
}

export function PhotoPage({ content }: PhotoPageProps) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-4 p-8">
      {/* Photo frame */}
      <div
        className="overflow-hidden flex-shrink-0"
        style={{
          width: "clamp(140px, 45%, 220px)",
          aspectRatio: "3/4",
          boxShadow: "4px 6px 20px rgba(0,0,0,0.28), 0 2px 6px rgba(0,0,0,0.15)",
          border: "6px solid #fff",
          outline: "1px solid rgba(0,0,0,0.08)",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={content.src}
          alt={content.alt}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.currentTarget;
            target.style.display = "none";
            const parent = target.parentElement!;
            parent.style.background =
              "linear-gradient(135deg, #d8d4ce 0%, #c8c2b8 100%)";
            parent.setAttribute("aria-label", content.alt);
          }}
        />
      </div>

      {content.caption && (
        <p
          className="text-center text-sm tracking-wide"
          style={{ color: "#6b6560" }}
        >
          {content.caption}
        </p>
      )}
    </div>
  );
}
