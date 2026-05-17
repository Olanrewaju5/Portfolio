import type { BlankContent } from "@/lib/types";

interface BlankPageProps {
  content: BlankContent;
}

export function BlankPage({ content }: BlankPageProps) {
  if (!content.decorative) return null;

  return (
    <div className="w-full h-full flex items-center justify-center p-12">
      {/* Subtle decorative mark */}
      <div
        className="w-12 h-12 rounded-full border opacity-20"
        style={{ borderColor: "#9a9288" }}
      />
    </div>
  );
}
