/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#c49a12",
        primaryLight: "#F5DB7A",
        background: "#FAF3DC",
        panel: "#F0E6C5",
        uBlack: "#1E1E1E",
        uGray: "#5F6368",
      },
    },
  },
  plugins: [],
};
