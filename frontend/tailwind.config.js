/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'bronze-gold': '#92791B',
        'emerald-green': '#1B5E3B',
        'charcoal-black': '#1C1C1C',
        'dull-olive': '#737955',
        'deep-crimson': '#8B1A1A',
        'muted-white': '#F5F0E8',
        'gold-light': '#C9A84C',
      },
      fontFamily: {
        cormorant: ['Cormorant Garamond', 'serif'],
        inter: ['Inter', 'sans-serif'],
        'dm-sans': ['DM Sans', 'sans-serif'],
        playfair: ['Playfair Display', 'serif'],
        jetbrains: ['JetBrains Mono', 'monospace'],
        'noto-deva': ['Noto Sans Devanagari', 'sans-serif'],
      },
      spacing: {
        0: '0px',
        1: '8px',
        2: '16px',
        3: '24px',
        4: '32px',
        5: '40px',
        6: '48px',
        7: '56px',
        8: '64px',
      },
    },
  },
  plugins: [],
};
