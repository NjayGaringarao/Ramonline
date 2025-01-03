/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#e14954",
        primaryLight: "#f0a4a9",
        background: "#f4ecd0",
        panel: "#f0e5be",
        uBlack: "#1f2937",
        uGray: "#4b5563"
      }
    }
  },
  plugins: [],
}