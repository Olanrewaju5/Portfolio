import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Abdulyaqeen Abdulquddus",
  description: "Creative developer & designer. Building digital experiences that feel intentional, memorable, and human.",
  openGraph: {
    title: "Abdulyaqeen Abdulquddus",
    description: "Creative developer & designer.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
