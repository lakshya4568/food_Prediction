/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Vibrant primary green for nutrition theme
        primary: {
          50: "#f0fdf4", // Very light green
          100: "#dcfce7", // Light green
          200: "#bbf7d0", // Medium light green
          300: "#86efac", // Bright light green
          400: "#4ade80", // Vibrant green
          500: "#10b981", // Main green (emerald)
          600: "#059669", // Rich green
          700: "#047857", // Deep green
          800: "#065f46", // Very deep green
          900: "#064e3b", // Darkest green
        },
        // Vibrant orange for energy/calories
        secondary: {
          50: "#fff7ed", // Very light orange
          100: "#ffedd5", // Light orange
          200: "#fed7aa", // Medium light orange
          300: "#fdba74", // Bright orange
          400: "#fb923c", // Vibrant orange
          500: "#f97316", // Main orange
          600: "#ea580c", // Rich orange
          700: "#c2410c", // Deep orange
          800: "#9a3412", // Very deep orange
          900: "#7c2d12", // Darkest orange
        },
        // Vibrant purple for wellness/premium features
        accent: {
          50: "#faf5ff", // Very light purple
          100: "#f3e8ff", // Light purple
          200: "#e9d5ff", // Medium light purple
          300: "#d8b4fe", // Bright purple
          400: "#c084fc", // Vibrant purple
          500: "#a855f7", // Main purple
          600: "#9333ea", // Rich purple
          700: "#7c3aed", // Deep purple
          800: "#6b21a8", // Very deep purple
          900: "#581c87", // Darkest purple
        },
        // Vibrant red for warnings/calories
        nutrition: {
          50: "#fef2f2", // Very light red
          100: "#fee2e2", // Light red
          200: "#fecaca", // Medium light red
          300: "#fca5a5", // Bright red
          400: "#f87171", // Vibrant red
          500: "#ef4444", // Main red
          600: "#dc2626", // Rich red
          700: "#b91c1c", // Deep red
          800: "#991b1b", // Very deep red
          900: "#7f1d1d", // Darkest red
        },
        // Optimized text colors
        "text-dark": "#111827", // Rich dark gray for light mode
        "text-light": "#f9fafb", // Soft white for dark mode
        "text-muted-light": "#6b7280", // Muted gray for light mode
        "text-muted-dark": "#d1d5db", // Light gray for dark mode

        // Enhanced background colors
        "bg-light": "#ffffff", // Pure white
        "bg-dark": "#0f172a", // Rich dark navy-green
        "bg-secondary-light": "#f9fafb", // Very light gray
        "bg-secondary-dark": "#1f2937", // Dark gray-green

        // Enhanced surface colors
        "surface-light": "#ffffff", // Pure white
        "surface-dark": "#374151", // Medium dark gray-green
        "surface-hover-light": "#f3f4f6", // Light hover
        "surface-hover-dark": "#4b5563", // Dark hover

        // Enhanced success colors
        success: {
          50: "#ecfdf5",
          100: "#d1fae5",
          200: "#a7f3d0",
          300: "#6ee7b7",
          400: "#34d399",
          500: "#10b981",
          600: "#059669",
          700: "#047857",
          800: "#065f46",
          900: "#064e3b",
        },

        // Enhanced warning colors
        warning: {
          50: "#fff7ed",
          100: "#ffedd5",
          200: "#fed7aa",
          300: "#fdba74",
          400: "#fb923c",
          500: "#f97316",
          600: "#ea580c",
          700: "#c2410c",
          800: "#9a3412",
          900: "#7c2d12",
        },

        // Enhanced error colors
        error: {
          50: "#fef2f2",
          100: "#fee2e2",
          200: "#fecaca",
          300: "#fca5a5",
          400: "#f87171",
          500: "#ef4444",
          600: "#dc2626",
          700: "#b91c1c",
          800: "#991b1b",
          900: "#7f1d1d",
        },

        // Enhanced info colors
        info: {
          50: "#faf5ff",
          100: "#f3e8ff",
          200: "#e9d5ff",
          300: "#d8b4fe",
          400: "#c084fc",
          500: "#a855f7",
          600: "#9333ea",
          700: "#7c3aed",
          800: "#6b21a8",
          900: "#581c87",
        },
      },
      fontFamily: {
        sans: ["Manrope", "sans-serif"],
      },
      animation: {
        gradient: "gradient 6s ease infinite",
        float: "float 3s ease-in-out infinite",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "bounce-gentle": "bounce-gentle 2s infinite",
        "fade-in": "fade-in 0.5s ease-out",
        "slide-up": "slide-up 0.3s ease-out",
        "scale-in": "scale-in 0.2s ease-out",
        shimmer: "shimmer 2s infinite",
      },
      keyframes: {
        gradient: {
          "0%, 100%": {
            "background-size": "200% 200%",
            "background-position": "left center",
          },
          "50%": {
            "background-size": "200% 200%",
            "background-position": "right center",
          },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        "bounce-gentle": {
          "0%, 100%": {
            transform: "translateY(0px)",
            "animation-timing-function": "cubic-bezier(0.8, 0, 1, 1)",
          },
          "50%": {
            transform: "translateY(-10px)",
            "animation-timing-function": "cubic-bezier(0, 0, 0.2, 1)",
          },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-up": {
          "0%": {
            transform: "translateY(10px)",
            opacity: "0",
          },
          "100%": {
            transform: "translateY(0px)",
            opacity: "1",
          },
        },
        "scale-in": {
          "0%": {
            transform: "scale(0.95)",
            opacity: "0",
          },
          "100%": {
            transform: "scale(1)",
            opacity: "1",
          },
        },
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
      },
      boxShadow: {
        nutrition: "0 4px 14px 0 rgba(16, 185, 129, 0.2)",
        "nutrition-lg": "0 10px 25px 0 rgba(16, 185, 129, 0.25)",
        accent: "0 4px 14px 0 rgba(249, 115, 22, 0.2)",
        "accent-lg": "0 10px 25px 0 rgba(249, 115, 22, 0.25)",
        purple: "0 4px 14px 0 rgba(168, 85, 247, 0.2)",
        "purple-lg": "0 10px 25px 0 rgba(168, 85, 247, 0.25)",
        red: "0 4px 14px 0 rgba(239, 68, 68, 0.2)",
        "red-lg": "0 10px 25px 0 rgba(239, 68, 68, 0.25)",
        dark: "0 4px 14px 0 rgba(0, 0, 0, 0.4)",
        "dark-lg": "0 10px 25px 0 rgba(0, 0, 0, 0.5)",
        "glow-green": "0 0 20px rgba(16, 185, 129, 0.3)",
        "glow-orange": "0 0 20px rgba(249, 115, 22, 0.3)",
        "glow-purple": "0 0 20px rgba(168, 85, 247, 0.3)",
        "glow-red": "0 0 20px rgba(239, 68, 68, 0.3)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "nutrition-gradient":
          "linear-gradient(135deg, #10b981 0%, #059669 100%)",
        "nutrition-gradient-dark":
          "linear-gradient(135deg, #047857 0%, #064e3b 100%)",
        "accent-gradient": "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
        "purple-gradient": "linear-gradient(135deg, #a855f7 0%, #9333ea 100%)",
        "red-gradient": "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
        "hero-gradient-light":
          "linear-gradient(135deg, #10b981 0%, #a855f7 50%, #f97316 100%)",
        "hero-gradient-dark":
          "linear-gradient(135deg, #047857 0%, #7c3aed 50%, #c2410c 100%)",
        "rainbow-gradient":
          "linear-gradient(90deg, #10b981 0%, #f97316 25%, #ef4444 50%, #a855f7 75%, #10b981 100%)",
        "dark-green-gradient":
          "linear-gradient(135deg, #064e3b 0%, #0f172a 100%)",
      },
    },
  },
  plugins: [],
};
