import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  future: {
    hoverOnlyWhenSupported: true,
  },
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Plus Jakarta Sans",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      fontWeight: {
        light: "300",
        normal: "400",
        medium: "500",
        semibold: "600",
        bold: "700",
        extrabold: "800",
        black: "900",
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Modern Organic Color Palette
        "brand-beige": "#F5F5DC",
        "brand-text": "#4A4238",
        "brand-primary": "#556B2F",
        "brand-secondary": "#D2B48C",
        // Extended palette for variations
        "brand-beige-light": "#FAFAF0",
        "brand-beige-dark": "#E8E8C8",
        "brand-text-light": "#6B5B47",
        "brand-text-dark": "#3A3329",
        "brand-primary-light": "#6B7B3F",
        "brand-primary-dark": "#3F4A22",
        "brand-secondary-light": "#E0C4A0",
        "brand-secondary-dark": "#B89A6B",
      },
      boxShadow: {
        organic:
          "0 4px 6px -1px rgba(74, 66, 56, 0.1), 0 2px 4px -1px rgba(74, 66, 56, 0.06)",
        "organic-lg":
          "0 10px 15px -3px rgba(74, 66, 56, 0.1), 0 4px 6px -2px rgba(74, 66, 56, 0.05)",
        "organic-xl":
          "0 20px 25px -5px rgba(74, 66, 56, 0.1), 0 10px 10px -5px rgba(74, 66, 56, 0.04)",
        "organic-2xl": "0 25px 50px -12px rgba(74, 66, 56, 0.25)",
      },
    },
  },
  plugins: [],
};
export default config;
