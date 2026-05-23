"use client";

import dynamic from "next/dynamic";

const TheaterStage = dynamic(
  () => import("@/components/theater/TheaterStage").then((m) => m.TheaterStage),
  { ssr: false, loading: () => <div style={{ width: "100%", height: "100svh", background: "#060101" }} /> }
);

export default function TheaterPage() {
  return <TheaterStage />;
}
