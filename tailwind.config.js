/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#181310',
        surface: '#241c19',
        'surface-card': '#241c19',
        'surface-inner': '#1c1613',
        'surface-border': '#382b26',
        'input-bg': '#14100e',
        accent: {
          DEFAULT: '#269f4d',
          hover: '#2eb557',
          dim: '#184d28',
          bg: '#0f2914',
        },
        gold: '#bd9853',
        txt: {
          primary: '#e5e2de',
          secondary: '#b5aca4',
          muted: '#87796a',
        },
      },
    },
  },
  plugins: [],
};
