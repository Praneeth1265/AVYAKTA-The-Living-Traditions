import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        /* Avyakta Custom Color Palette */
        avyakta: {
          "bronze-gold": "#92791B",
          "emerald-green": "#1B5E3B",
          "charcoal-black": "#1C1C1C",
          "dull-olive": "#737955",
          "deep-crimson": "#8B1A1A",
          "warm-white": "#F5F0E8",
          "gold-light": "#C9A84C",
        },
        /* Alias for convenience */
        primary: "#92791B",
        secondary: "#1B5E3B",
        accent: "#8B1A1A",
        muted: "#737955",
        background: "#F5F0E8",
        foreground: "#1C1C1C",
        success: "#1B5E3B",
        danger: "#8B1A1A",
        warning: "#92791B",
      },
      backgroundColor: {
        primary: "#92791B",
        secondary: "#1B5E3B",
        accent: "#8B1A1A",
        card: "#F5F0E8",
        dark: "#1C1C1C",
      },
      textColor: {
        primary: "#92791B",
        secondary: "#1B5E3B",
        accent: "#8B1A1A",
        muted: "#737955",
        body: "#1C1C1C",
      },
      borderColor: {
        primary: "#92791B",
        secondary: "#1B5E3B",
        accent: "#C9A84C",
        muted: "#737955",
      },
      fontFamily: {
        sans: ["Inter", "DM Sans", ...defaultTheme.fontFamily.sans],
        serif: ["Cormorant Garamond", ...defaultTheme.fontFamily.serif],
        display: [
          "Playfair Display",
          "Cormorant Garamond",
          ...defaultTheme.fontFamily.serif,
        ],
      },
      spacing: {
        "safe-top": "env(safe-area-inset-top)",
        "safe-bottom": "env(safe-area-inset-bottom)",
        "safe-left": "env(safe-area-inset-left)",
        "safe-right": "env(safe-area-inset-right)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in",
        "slide-down": "slideDown 0.3s ease-out",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideDown: {
          "0%": { transform: "translateY(-10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
      boxShadow: {
        soft: "0 1px 3px rgba(28, 28, 28, 0.1)",
        medium: "0 4px 14px rgba(146, 121, 27, 0.15)",
        large: "0 10px 30px rgba(146, 121, 27, 0.2)",
        hover: "0 6px 20px rgba(201, 168, 76, 0.25)",
      },
    },
  },
  plugins: [],
};

export default config;
