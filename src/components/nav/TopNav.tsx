"use client";

import { useState } from "react";

interface TopNavProps {
  soundEnabled: boolean;
  onToggleSound: () => void;
  spreadIndex: number;
  totalSpreads: number;
}

const NAV_ITEMS = ["About", "Work", "Contact"];

export function TopNav({ soundEnabled, onToggleSound, spreadIndex, totalSpreads }: TopNavProps) {
  const [activeNav, setActiveNav] = useState("About");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [_menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-[14px] left-1/2 -translate-x-1/2 z-50 hidden md:block">
      {/* Nav pill — matches Figma: #292727, 374px, justify-between */}
      <div
        className="relative flex items-center justify-between px-3 py-3 rounded-full"
        style={{
          width: 374,
          background: "#292727",
          boxShadow: "0 8px 32px rgba(0,0,0,0.32)",
        }}
      >
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <div
            className="w-7 h-7 rounded-full overflow-hidden border"
            style={{ borderColor: "rgba(255,255,255,0.15)" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/profile.jpg"
              alt="Avatar"
              className="w-full h-full object-cover"
              onError={(e) => { e.currentTarget.style.display = "none"; }}
            />
          </div>
          {/* Status dot */}
          <div
            className="absolute bottom-0 right-0 w-[5px] h-[5px] rounded-full border border-[#292727]"
            style={{ background: "#4ade80" }}
          />
        </div>

        {/* Active section badge with dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen((v) => !v)}
            className="flex items-center gap-2 px-3 rounded-full border"
            style={{
              height: 28,
              background: "rgba(255,255,255,0.15)",
              borderColor: "rgba(255,255,255,0.05)",
            }}
          >
            <span
              className="font-medium text-[#f6f5f5] leading-none"
              style={{ fontSize: 14, letterSpacing: "-0.56px", fontFamily: "var(--font-inter)" }}
            >
              {activeNav}
            </span>
            {/* Arrow-down icon */}
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="rgba(246,245,245,0.8)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ flexShrink: 0 }}
            >
              <polyline points="6,9 12,15 18,9" />
            </svg>
          </button>

          {/* Dropdown menu */}
          {dropdownOpen && (
            <div
              className="absolute top-full mt-2 left-1/2 -translate-x-1/2 rounded-2xl overflow-hidden py-1"
              style={{
                background: "#292727",
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
                minWidth: 120,
              }}
            >
              {NAV_ITEMS.map((item) => (
                <button
                  key={item}
                  onClick={() => { setActiveNav(item); setDropdownOpen(false); }}
                  className="w-full px-4 py-2 text-left text-sm transition-colors duration-150"
                  style={{
                    color: activeNav === item ? "#f6f5f5" : "rgba(246,245,245,0.5)",
                    background: activeNav === item ? "rgba(255,255,255,0.1)" : "transparent",
                    fontFamily: "var(--font-inter)",
                    fontSize: 13,
                    letterSpacing: "-0.4px",
                  }}
                >
                  {item}
                </button>
              ))}
              {/* Sound toggle inside dropdown */}
              <div
                className="border-t mx-2 mt-1 pt-1"
                style={{ borderColor: "rgba(255,255,255,0.08)" }}
              >
                <button
                  onClick={() => { onToggleSound(); setDropdownOpen(false); }}
                  className="w-full px-2 py-1.5 text-left text-xs flex items-center gap-2 rounded-lg transition-colors"
                  style={{ color: "rgba(246,245,245,0.5)", fontFamily: "var(--font-inter)" }}
                >
                  {soundEnabled ? (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
                    </svg>
                  ) : (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
                    </svg>
                  )}
                  Sound {soundEnabled ? "on" : "off"}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Divider + Hamburger */}
        <div className="flex items-center gap-3">
          <div
            className="w-px"
            style={{ height: 22, background: "rgba(255,255,255,0.15)" }}
          />
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center justify-center"
            style={{ color: "rgba(255,255,255,0.75)", width: 24, height: 24 }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6"/>
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Spread dots */}
      <div className="flex justify-center gap-1.5 mt-2">
        {Array.from({ length: totalSpreads }).map((_, i) => (
          <div
            key={i}
            className="rounded-full transition-all duration-300"
            style={{
              width: i === spreadIndex ? 16 : 5,
              height: 5,
              background: i === spreadIndex ? "rgba(44,40,37,0.7)" : "rgba(44,40,37,0.25)",
            }}
          />
        ))}
      </div>
    </header>
  );
}
