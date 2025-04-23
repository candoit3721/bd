/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-poppins)', 'var(--font-inter)', 'sans-serif'],
        mono: ['var(--font-roboto-mono)', 'monospace'],
        playfair: ['var(--font-playfair)', 'serif'],
        montserrat: ['var(--font-montserrat)', 'sans-serif'],
        poppins: ['var(--font-poppins)', 'sans-serif'],
        fredoka: ['var(--font-fredoka-one)', 'cursive'],
        quicksand: ['var(--font-quicksand)', 'sans-serif'],
      },
      colors: {
        party: {
          purple: '#9733EE',
          pink: '#FF4E9D',
          blue: '#4FB3FF',
          yellow: '#FFD700',
          gold: '#FFD700',
          cream: '#f8f0ff',
        },
      },
      animation: {
        'float': 'float 5s ease-in-out infinite',
        'fade-out': 'fade-out 3s ease-in-out forwards',
        'slide-left': 'slide-left 0.3s ease-out',
        'slide-right': 'slide-right 0.3s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-15px) rotate(5deg)' },
        },
        'fade-out': {
          '0%': { opacity: '1' },
          '70%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        'slide-left': {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' }
        },
        'slide-right': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' }
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
