import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#14161C",
        surface: "#1B1E27",
        raised: "#232733",
        line: "#2C3040",
        ivory: "#EDEFF5",
        muted: "#8B93A7",
        signal: {
          DEFAULT: "#6FE7B0",
          dim: "#3F8E6C",
        },
        relay: {
          DEFAULT: "#8B7FD6",
          dim: "#564E8C",
        },
        amber: {
          DEFAULT: "#F5B759",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      backgroundImage: {
        "dot-grid":
          "radial-gradient(circle, rgba(139,147,167,0.14) 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
};

export default config;
