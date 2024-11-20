/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',  // Cambié esto para que solo se enfoque en archivos React/TSX
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

