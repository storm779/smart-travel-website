/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        lilac: {
          50: "#fbf7fb",
          100: "#f5ebf5",
          200: "#ebd6eb",
          300: "#deb5de",
          400: "#cc8ccc",
          500: "#b566b5",
          600: "#964996",
          700: "#7a387a",
          800: "#663066",
          900: "#542954",
          950: "#361436",
        },
      },
      fontFamily: {
        sans: ["Helvetica", "Arial", "sans-serif"],
        kugile: ['"Playfair Display"', "serif"],
      },
    },
  },
  plugins: [],
};
