import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./data/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0F1115",
        card: "#171A21",
        secondary: "#1F2430",
        primaryText: "#F5F5F5",
        secondaryText: "#A7AAB3",
        accent: "#FFB000",
        danger: "#D62828",
        success: "#2E7D32",
        borderColor: "#2A2F3A",
      },
      fontFamily: {
        sans: ["Inter", "Arial", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
