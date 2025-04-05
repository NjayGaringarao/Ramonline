/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#4B3F39",
        primaryLight: "#BFAFA4",
        background: "#F5F3F1",
        panel: "#E5DED8",
        uBlack: "#1C1C1C",
        uGray: "#5C5C5C",
      },
    },
  },
  plugins: [],
};
