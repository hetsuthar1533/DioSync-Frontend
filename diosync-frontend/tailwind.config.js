/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      backgroundImage: {
        'search-icon': "url('/src/assets/images/icon_search.svg')",
        'search-icon-grey': "url('/src/assets/images/icon_search_grey.svg')",
      },
      boxShadow: {
        cardShadow: '0 4px 24px 0 rgba(0, 0, 0, 0.08)', // The last value is the spread value
      },
      colors: {
        'primary-blue': '#083ED1',
        'site-black': '#080808',
        'light-grey': '#F6F6F6',
        'medium-grey': '#E0E0E0',
        'dark-grey': '#919297',
        'site-red': '#CB0303',
        'site-green': '#00A511',
        'site-yellow': '#C2780E',
        'light-blue': '#2A2AF41A',
      },
      container: {
        center: true,
      },
      fontFamily: {
        sans: ['Open Sans, sans-serif', ...defaultTheme.fontFamily.sans],
      },
      keyframes: {
        bounce: {
          '0%, 100%': {
            transform: 'translateY(-100%)', // Adjust the translation value here
            animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)',
          },
          '50%': {
            transform: 'translateY(0)', // Adjust the translation value here
            animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)',
          },
        },
      },

      margin: {
        15: '60px',
        30: '30px',
      },
      padding: {
        15: '60px',
        30: '30px',
      },
      screens: {
        xs: '481px',
        // => @media (min-width: 481px) { ... }

        sm: '576px',
        // => @media (min-width: 576px) { ... }

        md: '768px',
        // => @media (min-width: 768px) { ... }

        lg: '992px',
        // => @media (min-width: 992px) { ... }

        xl: '1200px',
        // => @media (min-width: 1200px) { ... }

        xxl: '1441px',
        // => @media (min-width: 1400px) { ... }
      },
    },
  },
  plugins: [],
}
