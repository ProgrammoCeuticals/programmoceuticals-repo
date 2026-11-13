/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  safelist: [
    "bg-brand", "bg-brand-dark", "bg-brand-light",
    "text-brand", "border-brand",
    "bg-success", "bg-success-light", "text-success",
    "bg-warning", "bg-warning-light", "text-warning",
    "bg-danger", "bg-danger-light", "text-danger"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#1a202c",
        field: "#eef2f7",
        brand: "#1e40af",
        "brand-light": "#dbeafe",
        "brand-dark": "#1e3a8a",
        success: "#15803d",
        "success-light": "#dcfce7",
        warning: "#b45309",
        "warning-light": "#fef3c7",
        danger: "#b91c1c",
        "danger-light": "#fee2e2"
      },
      boxShadow: {
        card: "0 1px 3px 0 rgb(0 0 0 / 0.07), 0 1px 2px -1px rgb(0 0 0 / 0.07)"
      }
    }
  },
  plugins: []
};
