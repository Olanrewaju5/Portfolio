"use client";

import dynamic from "next/dynamic";
import content from "@/data/content.json";
import type { BookData } from "@/lib/types";

const BookViewer = dynamic(
  () => import("@/components/book/BookViewer").then((m) => m.BookViewer),
  {
    ssr: false,
    loading: () => (
      <div
        style={{ minHeight: "100svh", background: "#d8d4ce" }}
        aria-label="Loading…"
      />
    ),
  }
);

export default function Home() {
  return <BookViewer data={content as BookData} />;
}
