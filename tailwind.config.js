/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          500: "hsl(var(--primary-hue), var(--primary-saturation), var(--primary-lightness))",
          600: "hsl(var(--primary-hue), var(--primary-saturation), calc(var(--primary-lightness) - 10%))",
        },
        secondary:
          "hsl(var(--secondary-hue), var(--secondary-saturation), var(--secondary-lightness))",
        accent:
          "hsl(var(--accent-hue), var(--accent-saturation), var(--accent-lightness))",
        dark: {
          900: "#121212",
          800: "#1e1e1e",
          700: "#2d2d2d",
          600: "#3d3d3d",
          500: "#4d4d4d",
        },
        light: "#e2e8f0",
      },
      keyframes: {
        dockTabActive: {
          from: { width: "0", opacity: "0" },
          to: { width: "24px", opacity: "1" },
        },
        fadeIn: {
          from: { opacity: "0", transform: "translateX(-5px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        slideUp: {
          from: { opacity: "0", transform: "translateY(5px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        dockTabActive: "dockTabActive 0.3s ease-out",
        fadeIn: "fadeIn 0.3s ease-out",
        slideUp: "slideUp 0.2s ease-out",
      },
    },
  },
  plugins: [],
};
