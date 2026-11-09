/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#0c0a09',
        surface: '#18181b',
        'surface-border': '#27272a',
        accent: '#22c55e',
        'accent-cyan': '#06b6d4',
      },
    },
  },
  plugins: [],
};
