/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkbg: '#1a1a2d',
        lightbg: '#5d5d9c',
      },
      boxShadow: {
        white: '1px 2px 5px rgb(0, 0, 0, 0.5)',
      },
      transform: {
        'scale-120': 'scale(1.2)',
      },
      translate: {
        'x-17': '17px',
        'y--5': '-5px',
      },
    },
    variants: {
      transform: ['hover'],
      translate: ['hover'],
    },
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        '.no-spinner': {
          // Hide arrows in WebKit browsers (Chrome, Safari, Opera, etc.)
          '&::-webkit-inner-spin-button': {
            '-webkit-appearance': 'none',
            margin: '0',
          },
          '&::-webkit-outer-spin-button': {
            '-webkit-appearance': 'none',
            margin: '0',
          },
          // Hide arrows in Firefox
          '-moz-appearance': 'textfield',
        },
      };

      addUtilities(newUtilities, ['responsive', 'hover']);
    },
  ],
}