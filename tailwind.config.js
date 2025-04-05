/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#6A5ACD",
        primaryLight: "#A89EF5",
        background: "#EFEAE2",
        panel: "#E2DBD0",
        uBlack: "#2D2D2D",
        uGray: "#676767",
      },
    },
  },
  plugins: [],
};
