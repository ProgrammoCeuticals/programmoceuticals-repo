/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        navy: { DEFAULT: "#0F172A", soft: "#16213B" },
        gold: { DEFAULT: "#C9A227", soft: "#E4C766", muted: "rgba(201,162,39,0.12)" },
      },
      fontFamily: {
        display: ["Playfair Display", "serif"],
        body: ["Inter", "sans-serif"],
      },
      keyframes: {
        fadeUp: { from: { opacity: 0, transform: "translateY(24px)" }, to: { opacity: 1, transform: "translateY(0)" } },
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        shimmer: { "0%": { backgroundPosition: "100% 50%" }, "100%": { backgroundPosition: "0 50%" } },
      },
      animation: {
        "fade-up": "fadeUp .7s ease both",
        "fade-in": "fadeIn .8s ease both",
        shimmer: "shimmer 1.4s infinite",
      },
    },
  },
  plugins: [],
};
