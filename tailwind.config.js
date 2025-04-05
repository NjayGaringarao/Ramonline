/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#6C9A8B",
        primaryLight: "#B3C6BD",
        background: "#E6E2D7",
        panel: "#D8D3C2",
        uBlack: "#2F2F2F",
        uGray: "#6B7280",
      },
    },
  },
  plugins: [],
};
