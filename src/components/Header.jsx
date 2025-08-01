import React, { useState, useEffect } from "react";

const Header = ({ activeSection = "home" }) => {
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
    if (sectionId.startsWith("#auth")) {
      // Navigate to auth page
      window.location.hash = "auth";
    } else if (sectionId.startsWith("#")) {
      const element = document.querySelector(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100" 
        : "bg-transparent"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <div className="flex-shrink-0">
            <h1 className="text-2xl lg:text-3xl font-bold">
              <span className="text-gray-800">Nutri</span>
              <span className="text-primary-600">Vision</span>
            </h1>
          </div>
          
          <nav className="hidden lg:flex items-center space-x-8">
            <a
              href="#home"
              className={`text-sm font-medium transition-colors hover:text-primary-600 ${
                activeSection === "home" 
                  ? "text-primary-600 border-b-2 border-primary-600 pb-1" 
                  : "text-gray-700"
              }`}
              onClick={(e) => {
                e.preventDefault();
                handleMenuClick("#home");
              }}
            >
              Home
            </a>
            <a
              href="#features"
              className={`text-sm font-medium transition-colors hover:text-primary-600 ${
                activeSection === "features" 
                  ? "text-primary-600 border-b-2 border-primary-600 pb-1" 
                  : "text-gray-700"
              }`}
              onClick={(e) => {
                e.preventDefault();
                handleMenuClick("#features");
              }}
            >
              Features
            </a>
            <a
              href="#benefits"
              className={`text-sm font-medium transition-colors hover:text-primary-600 ${
                activeSection === "benefits" 
                  ? "text-primary-600 border-b-2 border-primary-600 pb-1" 
                  : "text-gray-700"
              }`}
              onClick={(e) => {
                e.preventDefault();
                handleMenuClick("#benefits");
              }}
            >
              Benefits
            </a>
            <a
              href="#how-it-works"
              className={`text-sm font-medium transition-colors hover:text-primary-600 ${
                activeSection === "how-it-works" 
                  ? "text-primary-600 border-b-2 border-primary-600 pb-1" 
                  : "text-gray-700"
              }`}
              onClick={(e) => {
                e.preventDefault();
                handleMenuClick("#how-it-works");
              }}
            >
              How It Works
            </a>
            <a
              href="#testimonials"
              className={`text-sm font-medium transition-colors hover:text-primary-600 ${
                activeSection === "testimonials" 
                  ? "text-primary-600 border-b-2 border-primary-600 pb-1" 
                  : "text-gray-700"
              }`}
              onClick={(e) => {
                e.preventDefault();
                handleMenuClick("#testimonials");
              }}
            >
              Testimonials
            </a>
          </nav>

          <div className="hidden lg:flex items-center space-x-4">
            <a
              href="#auth"
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors"
              onClick={(e) => {
                e.preventDefault();
                handleMenuClick("#auth");
              }}
            >
              Log In
            </a>
            <a
              href="#auth"
              className="px-6 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
              onClick={(e) => {
                e.preventDefault();
                handleMenuClick("#auth");
              }}
            >
              Sign Up
            </a>
          </div>

          <div className="lg:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-primary-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
            >
              <div className="space-y-1">
                <div className={`w-6 h-0.5 bg-current transition-all ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></div>
                <div className={`w-6 h-0.5 bg-current transition-all ${isMenuOpen ? 'opacity-0' : ''}`}></div>
                <div className={`w-6 h-0.5 bg-current transition-all ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></div>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`lg:hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
        }`}>
          <div className="py-4 space-y-4 border-t border-gray-200 bg-white/95 backdrop-blur-md">
            <a
              href="#home"
              className={`block px-4 py-2 text-sm font-medium transition-colors ${
                activeSection === "home" ? "text-primary-600" : "text-gray-700"
              }`}
              onClick={(e) => {
                e.preventDefault();
                handleMenuClick("#home");
              }}
            >
              Home
            </a>
            <a
              href="#features"
              className={`block px-4 py-2 text-sm font-medium transition-colors ${
                activeSection === "features" ? "text-primary-600" : "text-gray-700"
              }`}
              onClick={(e) => {
                e.preventDefault();
                handleMenuClick("#features");
              }}
            >
              Features
            </a>
            <a
              href="#benefits"
              className={`block px-4 py-2 text-sm font-medium transition-colors ${
                activeSection === "benefits" ? "text-primary-600" : "text-gray-700"
              }`}
              onClick={(e) => {
                e.preventDefault();
                handleMenuClick("#benefits");
              }}
            >
              Benefits
            </a>
            <a
              href="#how-it-works"
              className={`block px-4 py-2 text-sm font-medium transition-colors ${
                activeSection === "how-it-works" ? "text-primary-600" : "text-gray-700"
              }`}
              onClick={(e) => {
                e.preventDefault();
                handleMenuClick("#how-it-works");
              }}
            >
              How It Works
            </a>
            <a
              href="#testimonials"
              className={`block px-4 py-2 text-sm font-medium transition-colors ${
                activeSection === "testimonials" ? "text-primary-600" : "text-gray-700"
              }`}
              onClick={(e) => {
                e.preventDefault();
                handleMenuClick("#testimonials");
              }}
            >
              Testimonials
            </a>
            <div className="px-4 pt-4 space-y-2 border-t border-gray-200">
              <a
                href="#auth"
                className="block w-full px-4 py-2 text-center text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                onClick={(e) => {
                  e.preventDefault();
                  handleMenuClick("#auth");
                }}
              >
                Log In
              </a>
              <a
                href="#auth"
                className="block w-full px-4 py-2 text-center text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700"
                onClick={(e) => {
                  e.preventDefault();
                  handleMenuClick("#auth");
                }}
              >
                Sign Up
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
