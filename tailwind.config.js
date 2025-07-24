/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#FF6B6B",
        secondary: "#4ECDC4",
        accent: "#FFE66D",
        success: "#95E1D3",
        warning: "#FECA57",
        error: "#EE5A6F",
        info: "#48DBFB",
        surface: "#FFFFFF",
        background: "#FFF9F0",
      },
      fontFamily: {
        display: ['Fredoka One', 'cursive'],
        body: ['Plus Jakarta Sans', 'sans-serif'],
      },
      animation: {
        bounce: 'bounce 0.5s ease-in-out',
        shake: 'shake 0.5s ease-in-out',
        pop: 'pop 0.3s ease-out',
      },
      keyframes: {
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-5px)' },
          '75%': { transform: 'translateX(5px)' },
        },
        pop: {
          '0%': { transform: 'scale(0.8)' },
          '50%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}