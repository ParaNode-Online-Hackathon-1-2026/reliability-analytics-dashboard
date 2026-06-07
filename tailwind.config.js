/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        bg: {
          primary: '#0f172a',
          card: '#1e293b',
          hover: '#263147',
        },
        border: {
          DEFAULT: '#334155',
        }
      }
    },
  },
  plugins: [],
}
