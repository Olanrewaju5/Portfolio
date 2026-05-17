import type { SkillsContent } from "@/lib/types";

interface SkillsPageProps {
  content: SkillsContent;
}

export function SkillsPage({ content }: SkillsPageProps) {
  const categories = [...new Set(content.skills.map((s) => s.category))];

  return (
    <div className="w-full h-full flex flex-col justify-center p-8 lg:p-10">
      <h3
        className="font-bold mb-6 tracking-tight"
        style={{ fontSize: "clamp(0.85rem, 1.8vw, 1.1rem)", color: "#2c2825" }}
      >
        {content.heading}
      </h3>

      <div className="space-y-5">
        {categories.map((cat) => (
          <div key={cat}>
            <p
              className="text-[10px] font-semibold tracking-widest uppercase mb-2"
              style={{ color: "#c8c2b8" }}
            >
              {cat}
            </p>
            <div className="space-y-2">
              {content.skills
                .filter((s) => s.category === cat)
                .map((skill) => (
                  <div key={skill.name} className="flex items-center gap-3">
                    <span
                      className="flex-1 text-right truncate"
                      style={{
                        fontSize: "clamp(0.7rem, 1.3vw, 0.82rem)",
                        color: "#4a4642",
                        minWidth: 0,
                      }}
                    >
                      {skill.name}
                    </span>
                    <div className="flex gap-[3px] flex-shrink-0">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div
                          key={i}
                          className="w-[18px] h-[3px] rounded-full"
                          style={{
                            background:
                              i < skill.level ? "#2c2825" : "#e0dcd5",
                          }}
                        />
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
