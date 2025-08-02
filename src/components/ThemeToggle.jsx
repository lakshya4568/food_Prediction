import React, { useState, useEffect } from "react";
import { FaSun, FaMoon, FaLeaf } from "react-icons/fa";

const ThemeToggle = () => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <button
      onClick={toggleTheme}
      className="relative group p-3 rounded-xl bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-primary-900 dark:to-secondary-900 hover:from-primary-200 hover:to-secondary-200 dark:hover:from-primary-800 dark:hover:to-secondary-800 transition-all duration-500 shadow-lg hover:shadow-nutrition dark:hover:shadow-dark transform hover:scale-110"
      title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      <div className="relative overflow-hidden">
        {/* Sun icon */}
        <FaSun
          className={`text-lg text-secondary-600 transition-all duration-500 ${
            theme === "light"
              ? "opacity-100 rotate-0 scale-100"
              : "opacity-0 rotate-180 scale-0 absolute"
          }`}
        />

        {/* Moon icon */}
        <FaMoon
          className={`text-lg text-primary-400 transition-all duration-500 ${
            theme === "dark"
              ? "opacity-100 rotate-0 scale-100"
              : "opacity-0 -rotate-180 scale-0 absolute"
          }`}
        />

        {/* Decorative leaf for nutrition theme */}
        <FaLeaf
          className={`absolute -top-1 -right-1 text-xs text-accent-500 transition-all duration-700 ${
            theme === "light" ? "animate-bounce-gentle" : "animate-pulse"
          }`}
        />
      </div>

      {/* Ripple effect */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary-400/20 to-secondary-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </button>
  );
};

export default ThemeToggle;
