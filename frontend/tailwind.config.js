/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        luxuryGold: "#16a34a",
        deepBlack: "#f8faf9",
        softGreen: "#0f8f4d",
        forest: "#063f28",
        ink: "#06142b"
      },
      backgroundImage: {
        hero: "linear-gradient(90deg, rgba(3,63,40,.86), rgba(6,83,51,.62)), linear-gradient(180deg, rgba(7,73,43,.12), rgba(3,63,40,.86)), url('https://images.unsplash.com/photo-1559329007-40df8a9345d8?auto=format&fit=crop&w=1900&q=80')"
      }
    }
  },
  plugins: []
};
