/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
  safelist: [
    "bg-green-200",
    "border-green-400",
    "text-green-400",
    "bg-slate-200",
    "border-slate-400",
    "text-slate-400",
    "color-slate-400",
    "color-green-400",
    "color-slate-200",
    "color-green-200",
  ],
};
