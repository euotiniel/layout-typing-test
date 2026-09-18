import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#FAFAF7",
        ink: "#181818",
        "ink-soft": "#55554F",
        rule: "#DEDBD1",
        sand: "#EFECE2",
        accent: "#2B3A55",
        "accent-soft": "#7C8CA8",
        wrong: "#B3413E",
        "wrong-soft": "#E9D3D1",
        key: "#FFFFFF",
        "key-active": "#2B3A55",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      maxWidth: {
        editorial: "1440px",
      },
      keyframes: {
        press: {
          "0%": { transform: "scale(1)" },
          "50%": { transform: "scale(0.93)" },
          "100%": { transform: "scale(1)" },
        },
        rise: {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        press: "press 120ms ease-out",
        rise: "rise 260ms ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
