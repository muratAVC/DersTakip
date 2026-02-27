/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary:  '#4361EE',
        primaryL: '#7B97FF',
        accent:   '#FF6B6B',
        success:  '#2EC4B6',
        appbg:    '#F0F4FF',
        border:   '#E0E6F7',
        textmain: '#1A1A2E',
        muted:    '#8892B0',
      },
      fontFamily: {
        nunito: ['Nunito', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
