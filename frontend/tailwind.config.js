/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary colors
        primary: {
          DEFAULT: "#0052FF",
          dark: "#0039B3",
          light: "#4D85FF",
        },
        // Semantic colors
        success: "#00C853",
        warning: "#FFB300",
        error: "#FF1744",
        info: "#00B0FF",
        // Background colors
        background: "#0A0A0F",
        surface: {
          DEFAULT: "#141419",
          elevated: "#1E1E24",
        },
        border: "#2A2A35",
        // Text colors
        "text-primary": "#FFFFFF",
        "text-secondary": "#9CA3AF",
        "text-tertiary": "#6B7280",
        // Token colors
        eth: "#627EEA",
        usdc: "#2775CA",
        wbtc: "#F7931A",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      fontSize: {
        "h1": ["48px", { lineHeight: "1.1", fontWeight: "700" }],
        "h2": ["36px", { lineHeight: "1.2", fontWeight: "600" }],
        "h3": ["24px", { lineHeight: "1.3", fontWeight: "600" }],
        "h4": ["20px", { lineHeight: "1.4", fontWeight: "600" }],
        "body": ["16px", { lineHeight: "1.5", fontWeight: "400" }],
        "body-sm": ["14px", { lineHeight: "1.5", fontWeight: "400" }],
        "caption": ["12px", { lineHeight: "1.4", fontWeight: "500" }],
      },
      spacing: {
        xs: "4px",
        sm: "8px",
        md: "16px",
        lg: "24px",
        xl: "32px",
        "2xl": "48px",
        "3xl": "64px",
      },
      borderRadius: {
        sm: "4px",
        md: "8px",
        lg: "12px",
        xl: "16px",
        full: "9999px",
      },
      boxShadow: {
        sm: "0 1px 2px rgba(0,0,0,0.3)",
        md: "0 4px 6px rgba(0,0,0,0.4)",
        lg: "0 10px 15px rgba(0,0,0,0.5)",
        glow: "0 0 20px rgba(0,82,255,0.3)",
      },
      transitionDuration: {
        fast: "150ms",
        base: "200ms",
        slow: "300ms",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideIn: {
          "0%": { transform: "translateX(100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        spin: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
      animation: {
        shimmer: "shimmer 1.5s ease-in-out infinite",
        fadeIn: "fadeIn 300ms ease-out",
        slideIn: "slideIn 300ms cubic-bezier(0.68, -0.55, 0.265, 1.55)",
        spin: "spin 1s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
