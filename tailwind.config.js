/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      screens: {
        xsm: "425px",
        sm: "480px",
        md: "640px",
        tablet: "768px",
        lg: "1024px",
        xl: "1280px",
      },
      fontFamily: {
        sans: ['Roboto', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
