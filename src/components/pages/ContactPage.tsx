import type { ContactContent } from "@/lib/types";

interface ContactPageProps {
  content: ContactContent;
}

export function ContactPage({ content }: ContactPageProps) {
  return (
    <div className="w-full h-full flex flex-col justify-center p-8 lg:p-12 gap-6">
      <h3
        className="font-bold tracking-tight"
        style={{ fontSize: "clamp(0.85rem, 1.8vw, 1.1rem)", color: "#2c2825" }}
      >
        {content.heading}
      </h3>

      {content.email && (
        <a
          href={`mailto:${content.email}`}
          className="font-medium underline underline-offset-2 decoration-dotted w-fit"
          style={{
            fontSize: "clamp(0.72rem, 1.3vw, 0.85rem)",
            color: "#4a4642",
          }}
        >
          {content.email}
        </a>
      )}

      <div className="space-y-2">
        {content.links.map((link, i) => (
          <a
            key={i}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 group w-fit"
          >
            <span
              className="text-[10px] tracking-widest uppercase font-semibold"
              style={{ color: "#c8c2b8" }}
            >
              ↗
            </span>
            <span
              className="group-hover:underline underline-offset-2 decoration-dotted"
              style={{
                fontSize: "clamp(0.72rem, 1.3vw, 0.85rem)",
                color: "#4a4642",
              }}
            >
              {link.label}
            </span>
          </a>
        ))}
      </div>

      {content.closing && (
        <p
          className="leading-relaxed border-t pt-5"
          style={{
            fontSize: "clamp(0.65rem, 1.2vw, 0.78rem)",
            color: "#6b6560",
            borderColor: "#ede6d6",
            lineHeight: 1.8,
          }}
        >
          {content.closing}
        </p>
      )}
    </div>
  );
}
