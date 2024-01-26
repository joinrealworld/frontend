const { nextui } = require("@nextui-org/react");

module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  important: true,
  theme: {
    extend: {
      fontFamily: {
        Peyda: ["Peyda"],
      },
      backgroundImage: {
        "body-bg": "url('/files/default/bg-pattern.png')",
        "price-box-bg": "url('/files/default/price_box_bg.png')",
        "wave-bg": "url('/files/default/wave.png')",
      },
    },
  },
  plugins: [nextui()],
  darkMode: "class",
};