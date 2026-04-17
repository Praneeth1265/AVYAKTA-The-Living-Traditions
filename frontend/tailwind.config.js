/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bronze: "#92791B",
        emerald: "#1B5E3B",
        charcoal: "#1C1C1C",
        olive: "#737955",
        crimson: "#8B1A1A",
        warm: "#F5F0E8",
        gold: "#C9A84C",
      },
      fontFamily: {
        heading: ["Cormorant Garamond", "serif"],
        body: ["Inter", "sans-serif"],
        accent: ["Playfair Display", "serif"],
      },
    },
  },
  plugins: [],
};
