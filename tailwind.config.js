/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'mono': ['Monaco', 'Menlo', 'Ubuntu Mono', 'monospace'],
      },
      colors: {
        'milky': '#fdfdfd',
        'light-brown': {
          100: '#f8f5f2',
          200: '#e8e0d5',
          300: '#d4c8b5',
          400: '#a89f91',
          500: '#5c4d41',
          600: '#4a3d33',
        }
      }
    },
  },
  plugins: [],
}