/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f0f9f0",
          100: "#dcf2dc",
          500: "#4CAF50",
          600: "#388E3C",
          700: "#2E7D32",
        },
        secondary: {
          50: "#e3f2fd",
          100: "#bbdefb",
          500: "#2196F3",
          600: "#1976D2",
          700: "#1565C0",
        },
        accent: {
          500: "#FF9800",
          600: "#F57C00",
        },
        success: "#4CAF50",
        warning: "#FFC107",
        error: "#F44336",
      },
      fontFamily: {
        sans: ["Poppins", "system-ui", "sans-serif"],
        display: ["Pacifico", "cursive"],
      },
      animation: {
        gradient: "gradient-shift 6s ease infinite",
        float: "float 6s ease-in-out infinite",
        "bounce-slow": "bounce 3s ease-in-out infinite",
        "spin-slow": "spin 8s linear infinite",
      },
      keyframes: {
        "gradient-shift": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};
