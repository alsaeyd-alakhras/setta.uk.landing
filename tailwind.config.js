/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './assets/js/**/*.js'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#E9EEF5',
          500: '#1F509A',
        },
        secondary: {
          50: '#FCF4ED',
          100: '#F6DCC7',
          500: '#E38E49',
          600: '#CF8142',
        },
        ink: '#161616',
        navy: '#0B1C30',
        surface: '#F8F9FF',
        mist: '#EFF4FF',
      },
      keyframes: {
        float: {
          '0%, 100%': { translate: '0 0' },
          '50%': { translate: '0 var(--float, -10px)' },
        },
        bob: {
          '0%, 100%': { translate: '0 0' },
          '50%': { translate: '0 -3px' },
        },
        ring: {
          '0%': { transform: 'scale(1)', opacity: '0.45' },
          '70%, 100%': { transform: 'scale(1.06)', opacity: '0' },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        bob: 'bob 1.2s ease-in-out infinite',
        ring: 'ring 3.2s ease-out infinite',
      },
      fontFamily: {
        quicksand: ['Quicksand', 'sans-serif'],
        jakarta: ['"Plus Jakarta Sans"', 'sans-serif'],
        nimbus: ['"Nimbus Sans"', 'Helvetica', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
