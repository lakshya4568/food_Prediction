import React, { useState, useEffect } from "react";
import { FaLeaf, FaStar } from "react-icons/fa";
import ThemeToggle from "./ThemeToggle";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleMenuClick = (sectionId) => {
    setIsMenuOpen(false);
    if (sectionId.startsWith("#")) {
      const element = document.querySelector(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  const handleAuthClick = () => {
    window.location.href = "/auth";
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/90 backdrop-blur-xl shadow-nutrition border-b border-primary-100 dark:bg-bg-secondary-dark/90 dark:border-primary-800"
          : "bg-transparent"
      }`}
      style={{ zIndex: 9999 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <div className="flex-shrink-0 group">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <FaLeaf className="text-2xl text-primary-500 group-hover:text-primary-400 transition-colors duration-300" />
                <FaStar className="absolute -top-1 -right-1 text-xs text-secondary-400 animate-pulse" />
              </div>
              <h1 className="text-2xl lg:text-3xl font-bold">
                <span className="bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">
                  Nutri
                </span>
                <span className="bg-gradient-to-r from-secondary-500 to-accent-500 bg-clip-text text-transparent">
                  Vision
                </span>
              </h1>
            </div>
          </div>

          <nav className="hidden lg:flex items-center space-x-8">
            <a
              href="#home"
              className="text-sm font-medium transition-all duration-300 hover:text-primary-600 text-text-dark dark:text-text-light dark:hover:text-primary-400 relative group cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                handleMenuClick("#home");
              }}
            >
              Home
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-500 to-primary-600 transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a
              href="#features"
              className="text-sm font-medium transition-all duration-300 hover:text-primary-600 text-text-dark dark:text-text-light dark:hover:text-primary-400 relative group cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                handleMenuClick("#features");
              }}
            >
              Features
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-500 to-primary-600 transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a
              href="#benefits"
              className="text-sm font-medium transition-all duration-300 hover:text-primary-600 text-text-dark dark:text-text-light dark:hover:text-primary-400 relative group cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                handleMenuClick("#benefits");
              }}
            >
              Benefits
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-500 to-primary-600 transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a
              href="#how-it-works"
              className="text-sm font-medium transition-all duration-300 hover:text-primary-600 text-text-dark dark:text-text-light dark:hover:text-primary-400 relative group cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                handleMenuClick("#how-it-works");
              }}
            >
              How It Works
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-500 to-primary-600 transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a
              href="#testimonials"
              className="text-sm font-medium transition-all duration-300 hover:text-primary-600 text-text-dark dark:text-text-light dark:hover:text-primary-400 relative group cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                handleMenuClick("#testimonials");
              }}
            >
              Testimonials
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-500 to-primary-600 transition-all duration-300 group-hover:w-full"></span>
            </a>
          </nav>

          <div className="hidden lg:flex items-center space-x-4">
            <ThemeToggle />
            <button
              onClick={handleAuthClick}
              className="px-4 py-2 text-sm font-medium text-text-muted-light hover:text-primary-600 dark:text-text-muted-dark dark:hover:text-primary-400 transition-all duration-300 hover:scale-105 cursor-pointer relative z-50"
              type="button"
            >
              Log In
            </button>
            <button
              onClick={handleAuthClick}
              className="btn-secondary text-sm transform hover:scale-105 transition-all duration-300 cursor-pointer relative z-50"
              type="button"
            >
              Sign Up
            </button>
          </div>

          <div className="lg:hidden flex items-center space-x-4">
            <ThemeToggle />
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-xl text-text-dark dark:text-text-light hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 dark:hover:text-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-300 cursor-pointer relative z-50"
              type="button"
            >
              <div className="space-y-1.5">
                <div
                  className={`w-6 h-0.5 bg-current transition-all duration-300 ${
                    isMenuOpen ? "rotate-45 translate-y-2" : ""
                  }`}
                ></div>
                <div
                  className={`w-6 h-0.5 bg-current transition-all duration-300 ${
                    isMenuOpen ? "opacity-0" : ""
                  }`}
                ></div>
                <div
                  className={`w-6 h-0.5 bg-current transition-all duration-300 ${
                    isMenuOpen ? "-rotate-45 -translate-y-2" : ""
                  }`}
                ></div>
              </div>
            </button>
          </div>
        </div>

        {/* Enhanced mobile menu */}
        <div
          className={`lg:hidden transition-all duration-500 ease-in-out ${
            isMenuOpen
              ? "max-h-screen opacity-100 translate-y-0"
              : "max-h-0 opacity-0 -translate-y-4 overflow-hidden"
          }`}
        >
          <div className="py-6 space-y-4 border-t border-primary-200 bg-white/95 backdrop-blur-xl dark:bg-bg-secondary-dark/95 dark:border-primary-800 rounded-b-2xl shadow-nutrition-lg dark:shadow-dark-lg">
            <a
              href="#home"
              className="block px-6 py-3 text-sm font-medium transition-all duration-300 text-text-dark dark:text-text-light hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg mx-4 cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                handleMenuClick("#home");
              }}
            >
              Home
            </a>
            <a
              href="#features"
              className="block px-6 py-3 text-sm font-medium transition-all duration-300 text-text-dark dark:text-text-light hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg mx-4 cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                handleMenuClick("#features");
              }}
            >
              Features
            </a>
            <a
              href="#benefits"
              className="block px-6 py-3 text-sm font-medium transition-all duration-300 text-text-dark dark:text-text-light hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg mx-4 cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                handleMenuClick("#benefits");
              }}
            >
              Benefits
            </a>
            <a
              href="#how-it-works"
              className="block px-6 py-3 text-sm font-medium transition-all duration-300 text-text-dark dark:text-text-light hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg mx-4 cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                handleMenuClick("#how-it-works");
              }}
            >
              How It Works
            </a>
            <a
              href="#testimonials"
              className="block px-6 py-3 text-sm font-medium transition-all duration-300 text-text-dark dark:text-text-light hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg mx-4 cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                handleMenuClick("#testimonials");
              }}
            >
              Testimonials
            </a>
            <div className="px-4 pt-4 space-y-3 border-t border-primary-200 dark:border-primary-800">
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  handleAuthClick();
                }}
                className="btn-outline w-full text-center cursor-pointer relative z-50"
                type="button"
              >
                Log In
              </button>
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  handleAuthClick();
                }}
                className="btn-secondary w-full text-center cursor-pointer relative z-50"
                type="button"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
