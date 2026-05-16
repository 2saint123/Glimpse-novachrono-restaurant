/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#d4af37",
        secondary: "#1a1a1a",
        accent: "#c9a961",
        dark: "#0a0a0a",
        light: "#f8f6f3",
        cream: "#faf8f5",
        gold: "#d4af37",
        darkGold: "#b8941f",
        charcoal: "#2d2d2d",
        slate: "#64748b"
      },
      backgroundImage: {
        hero: "linear-gradient(135deg, rgba(0,0,0,.65), rgba(26,26,26,.55)), url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=2070&q=80')",
        authBg: "linear-gradient(135deg, rgba(0,0,0,.75), rgba(212,175,55,.25)), url('https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=2070&q=80')",
        gradient: "linear-gradient(135deg, #d4af37 0%, #c9a961 100%)"
      }
    }
  },
  plugins: []
};
