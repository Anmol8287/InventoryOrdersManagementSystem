/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        app: {
          bg: "#0f172a",
          card: "#1e293b",
          accent: "#3b82f6",
          text: "#f8fafc"
        }
      },
      boxShadow: {
        glow: "0 20px 45px rgba(15, 23, 42, 0.35)"
      }
    }
  },
  plugins: []
};
