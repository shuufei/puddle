/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx,jsx,js}"],
  theme: {
    extend: {
      minWidth: {
        'xs': '16rem',
        'sm': '22rem',
        'md': '26rem',
        'lg': '30rem'
      },
      maxWidth: {
        '10xl': '110rem'
      }
    },
  },
  plugins: [],
}
