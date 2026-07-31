import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './features/**/*.{ts,tsx}',
    './data/**/*.{ts,tsx}',
  ],
  safelist: [
    { pattern: /^from-/ },
    { pattern: /^to-/ },
    { pattern: /^via-/ },
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ['Manrope', 'sans-serif'],
        sans: ['Plus Jakarta Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
