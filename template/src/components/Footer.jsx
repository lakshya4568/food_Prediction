import React from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer>
      <div className="container">
        <div className="footer-grid">
          <div className="footer-info">
            <div className="logo">
              <h2>
                Nutri<span>Vision</span>
              </h2>
            </div>
            <p>
              Revolutionizing nutrition tracking through AI and computer vision
              technology.
            </p>
            <div className="social-icons">
              <a href="#" aria-label="Facebook">
                <FaFacebookF />
              </a>
              <a href="#" aria-label="Twitter">
                <FaTwitter />
              </a>
              <a href="#" aria-label="Instagram">
                <FaInstagram />
              </a>
              <a href="#" aria-label="LinkedIn">
                <FaLinkedinIn />
              </a>
            </div>
          </div>
          <div className="footer-links">
            <h3>Quick Links</h3>
            <ul>
              <li>
                <a href="#features">Features</a>
              </li>
              <li>
                <a href="#benefits">Benefits</a>
              </li>
              <li>
                <a href="#how-it-works">How It Works</a>
              </li>
              <li>
                <a href="#testimonials">Testimonials</a>
              </li>
            </ul>
          </div>
          <div className="footer-links">
            <h3>Company</h3>
            <ul>
              <li>
                <a href="#">About Us</a>
              </li>
              <li>
                <a href="#">Careers</a>
              </li>
              <li>
                <a href="#">Press</a>
              </li>
              <li>
                <a href="#">Contact</a>
              </li>
            </ul>
          </div>
          <div className="footer-links">
            <h3>Support</h3>
            <ul>
              <li>
                <a href="#">Help Center</a>
              </li>
              <li>
                <a href="#">Privacy Policy</a>
              </li>
              <li>
                <a href="#">Terms of Service</a>
              </li>
              <li>
                <a href="#">FAQ</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 CyberKnights. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
