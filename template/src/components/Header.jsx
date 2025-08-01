import React, { useState, useEffect } from "react";
import "./Header.css";

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
    <header className={`header ${isScrolled ? "scrolled" : ""}`}>
      <div className="container">
        <div className="logo">
          <h1>
            Nutri<span>Vision</span>
          </h1>
        </div>
        <nav>
          <ul className={`menu ${isMenuOpen ? "active" : ""}`}>
            <li>
              <a
                href="#home"
                className={activeSection === "home" ? "active" : ""}
                onClick={(e) => {
                  e.preventDefault();
                  handleMenuClick("#home");
                }}
              >
                Home
              </a>
            </li>
            <li>
              <a
                href="#features"
                className={activeSection === "features" ? "active" : ""}
                onClick={(e) => {
                  e.preventDefault();
                  handleMenuClick("#features");
                }}
              >
                Features
              </a>
            </li>
            <li>
              <a
                href="#benefits"
                className={activeSection === "benefits" ? "active" : ""}
                onClick={(e) => {
                  e.preventDefault();
                  handleMenuClick("#benefits");
                }}
              >
                Benefits
              </a>
            </li>
            <li>
              <a
                href="#how-it-works"
                className={activeSection === "how-it-works" ? "active" : ""}
                onClick={(e) => {
                  e.preventDefault();
                  handleMenuClick("#how-it-works");
                }}
              >
                How It Works
              </a>
            </li>
            <li>
              <a
                href="#testimonials"
                className={activeSection === "testimonials" ? "active" : ""}
                onClick={(e) => {
                  e.preventDefault();
                  handleMenuClick("#testimonials");
                }}
              >
                Testimonials
              </a>
            </li>
          </ul>
          <div
            className={`hamburger-menu ${isMenuOpen ? "active" : ""}`}
            onClick={toggleMenu}
          >
            <div className="bar"></div>
            <div className="bar"></div>
            <div className="bar"></div>
          </div>
        </nav>
        <div className="cta-buttons">
          <a
            href="#auth"
            className="btn btn-outline"
            onClick={(e) => {
              e.preventDefault();
              handleMenuClick("#auth");
            }}
          >
            Log In
          </a>
          <a
            href="#auth"
            className="btn btn-primary"
            onClick={(e) => {
              e.preventDefault();
              handleMenuClick("#auth");
            }}
          >
            Sign Up
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
