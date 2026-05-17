import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      colors: {
        paper: {
          50: "#fdfcf8",
          100: "#f8f4ec",
          200: "#ede6d6",
          300: "#ddd3be",
        },
        ink: {
          light: "#6b6560",
          DEFAULT: "#2c2825",
          dark: "#1a1614",
        },
        spine: "#c8c2b8",
      },
      boxShadow: {
        book: "0 25px 60px rgba(0,0,0,0.35), 0 10px 20px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1)",
        page: "2px 0 8px rgba(0,0,0,0.12)",
        "page-left": "-2px 0 8px rgba(0,0,0,0.12)",
      },
    },
  },
  plugins: [],
};

export default config;
