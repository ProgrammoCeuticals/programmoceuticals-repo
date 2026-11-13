/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx}",
    "../../packages/ui/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary brand — GLSI deep teal
        brand: {
          50: "#e8f0f4",
          100: "#c5d8e3",
          200: "#9dbfd1",
          300: "#74a5be",
          400: "#4d8dac",
          500: "#2a7699", // mid teal
          600: "#193441", // core brand — same as GLSI --brand
          700: "#122830", // hover darken
          800: "#0c1b21",
          900: "#060e11",
        },
        // Accent — GLSI amber
        accent: {
          DEFAULT: "#c17f24",
          light: "#f5e8d0",
          dark: "#a06820",
        },
        // Status colours — mirrors GLSI exactly
        ok: "#276749",
        danger: "#c53030",
        warn: "#d97706",
        // Structural / sidebar — same as brand-600 but aliased for clarity
        navy: {
          600: "#193441",
          700: "#122830",
          800: "#0c1b21",
          900: "#060e11",
        },
        // Neutral surface tokens
        surface: {
          DEFAULT: "#ffffff",
          subtle: "#f7f8fa", // GLSI --bg
          muted: "#f0f2f4",
        },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ['"Courier New"', "Courier", "ui-monospace", "monospace"],
      },
      // Sharp corners everywhere — mirrors GLSI (no border-radius on elements)
      borderRadius: {
        none: "0px",
        DEFAULT: "0px", // override Tailwind default
        sm: "0px",
        md: "0px",
        lg: "2px", // only used for flag chips (micro exception)
        xl: "2px",
        "2xl": "2px",
        full: "9999px", // kept only for explicit pill/circle use
      },
      boxShadow: {
        // No elevation — GLSI uses border only, no shadows
        card: "0 1px 3px 0 rgb(0 0 0 / 0.05)",
        "card-hover": "0 2px 6px 0 rgb(0 0 0 / 0.08)",
        dropdown:
          "0 4px 16px 0 rgb(0 0 0 / 0.12), 0 1px 4px 0 rgb(0 0 0 / 0.06)",
      },
    },
  },
  plugins: [],
};
