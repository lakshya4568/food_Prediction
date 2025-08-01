import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import LandingPage from "./components/LandingPage";
import AuthPage from "./components/AuthPage";
import Dashboard from "./components/Dashboard";
import "./styles/nutrivision.css";
import "./App.css";

function App() {
  const [currentPage, setCurrentPage] = useState("landing");
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

  // Simple routing based on hash
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      switch (hash) {
        case "auth":
          setCurrentPage("auth");
          break;
        case "dashboard":
          setCurrentPage("dashboard");
          break;
        default:
          setCurrentPage("landing");
      }
    };

    // Initial check
    handleHashChange();

    // Listen for hash changes
    window.addEventListener("hashchange", handleHashChange);

    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "auth":
        return <AuthPage />;
      case "dashboard":
        return <Dashboard />;
      default:
        return (
          <>
            <Header currentPage="landing" />
            <LandingPage />
          </>
        );
    }
  };

  return <div className="App">{renderCurrentPage()}</div>;
}

export default App;
