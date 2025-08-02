import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import LandingPage from "../components/LandingPage";

function App() {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      return savedTheme;
    }
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      return "dark";
    }
    return "light";
  });

  // Apply theme to document body
  useEffect(() => {
    if (theme === "dark") {
      document.body.classList.add("dark-theme");
    } else {
      document.body.classList.remove("dark-theme");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Theme toggle function for future use
  // eslint-disable-next-line no-unused-vars
  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentPage="landing" />
      <LandingPage />
    </div>
  );
}

export default App;
