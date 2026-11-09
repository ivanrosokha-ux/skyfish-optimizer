/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        page: '#1A1411',
        card: '#241C18',
        border: '#3A2F29',
        'txt-main': '#F5F1EC',
        'txt-muted': '#A39A92',
        accent: {
          DEFAULT: '#1FA64A',
          hover: '#26bd56',
        },
        gain: '#3ED16B',
        price: '#F2A93B',
        gold: '#D9A21B',
        track: '#4A413B',
      },
    },
  },
  plugins: [],
};
