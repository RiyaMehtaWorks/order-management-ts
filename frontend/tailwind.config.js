/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#e23744", // Zomato-style red, used for CTAs/highlights
          dark: "#c81c2a"
        }
      }
    }
  },
  plugins: []
};
