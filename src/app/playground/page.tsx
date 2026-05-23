"use client";

import dynamic from "next/dynamic";

const PlaygroundDisplay = dynamic(
  () =>
    import("@/components/playground/PlaygroundDisplay").then(
      (m) => m.PlaygroundDisplay
    ),
  {
    ssr: false,
    loading: () => (
      <div style={{ width: "100%", height: "100svh", background: "#d7d7d7" }} />
    ),
  }
);

export default function PlaygroundPage() {
  return <PlaygroundDisplay />;
}
