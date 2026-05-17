import type { BookPage } from "@/lib/types";
import { CoverPage } from "./CoverPage";
import { PhotoPage } from "./PhotoPage";
import { TextPage } from "./TextPage";
import { SkillsPage } from "./SkillsPage";
import { TimelinePage } from "./TimelinePage";
import { ContactPage } from "./ContactPage";
import { BlankPage } from "./BlankPage";

interface PageRendererProps {
  page: BookPage;
  side: "left" | "right";
}

export function PageRenderer({ page, side }: PageRendererProps) {
  const style: React.CSSProperties = {
    background: page.background ?? "#f8f4ec",
    width: "100%",
    height: "100%",
  };

  const inner = (() => {
    switch (page.type) {
      case "cover":
        return <CoverPage content={page.content as never} side={side} />;
      case "photo":
        return <PhotoPage content={page.content as never} />;
      case "text":
        return <TextPage content={page.content as never} side={side} />;
      case "skills":
        return <SkillsPage content={page.content as never} />;
      case "timeline":
        return <TimelinePage content={page.content as never} />;
      case "contact":
        return <ContactPage content={page.content as never} />;
      case "blank":
      default:
        return <BlankPage content={page.content as never} />;
    }
  })();

  return (
    <div style={style} className="relative overflow-hidden">
      {/* Optional paper texture */}
      {page.texture && (
        <div
          className="absolute inset-0 pointer-events-none z-10 opacity-[0.06]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='t'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23t)'/%3E%3C/svg%3E")`,
            backgroundSize: "200px",
          }}
        />
      )}
      <div className="relative z-0 w-full h-full">{inner}</div>
    </div>
  );
}
