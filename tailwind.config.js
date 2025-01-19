/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',  // Cambié esto para que solo se enfoque en archivos React/TSX
  ],
  theme: {
    extend: {
      colors: {
        'cart-bg': '#17171B',
        'cart-hover': '#0A0A0C',
        'cart-tick': '#FF328B',
        'customText' : '#282d32',
        'customBackground': '#e7e8e4',
        'secondary-Bg': '#717f8e',
        'customWord' : '#e45754',
        'customPrice' : '#2f7c9c',
      },
      keyframes: {
        scaleUp: {
          '0%': { transform: 'scale(0)' },
          '100%': { transform: 'scale(1)' },
        },
        rotateIn: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        scaleUp: 'scaleUp 0.3s ease-in-out',
        rotateIn: 'rotateIn 0.5s ease-in-out',
      },
    },
  },
  plugins: [],
}

