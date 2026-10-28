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
      fontFamily: {
        quicksand: ['Quicksand', 'sans-serif'],
        jakarta: ['"Plus Jakarta Sans"', 'sans-serif'],
        nimbus: ['"Nimbus Sans"', 'Helvetica', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
