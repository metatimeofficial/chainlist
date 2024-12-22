/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        "3xl": "1680px",
      },
    },
  },
  plugins: [],
};
