import React from "react";
import {
  FaCamera,
  FaBrain,
  FaChartPie,
  FaArrowRight,
  FaPlay,
} from "react-icons/fa";

const Hero = () => {
  const handleGetStarted = () => {
    // Navigate to auth page
    window.location.hash = "auth";
  };

  const handleLearnMore = () => {
    const element = document.querySelector("#how-it-works");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="home" className="hero">
      <div className="container">
        <div className="hero-content">
          <h1 className="hero-title">
            AI-Powered <span>Nutrition</span> Analysis at Your Fingertips
          </h1>
          <p className="hero-subtitle">
            Take a photo of your food and instantly get detailed nutritional
            information to help you make healthier choices.
          </p>
          <div className="hero-buttons">
            <button
              className="btn btn-primary btn-large"
              onClick={handleGetStarted}
            >
              Get Started Now <FaArrowRight />
            </button>
            <button
              className="btn btn-secondary btn-large"
              onClick={handleLearnMore}
            >
              Learn More <FaPlay />
            </button>
          </div>
        </div>
        <div className="hero-image">
          <div className="image-container">
            <img
              src="https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=2940&auto=format&fit=crop"
              alt="Healthy food plate with AI analysis overlay"
            />
          </div>
          <div className="floating-card card-1">
            <FaCamera />
            <span>Snap a Photo</span>
          </div>
          <div className="floating-card card-2">
            <FaBrain />
            <span>AI Analyzes</span>
          </div>
          <div className="floating-card card-3">
            <FaChartPie />
            <span>Get Nutrition Data</span>
          </div>
        </div>
      </div>
      <div className="wave-divider">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path
            fill="#ffffff"
            fillOpacity="1"
            d="M0,288L48,272C96,256,192,224,288,197.3C384,171,480,149,576,165.3C672,181,768,235,864,250.7C960,267,1056,245,1152,224C1248,203,1344,181,1392,170.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </div>
    </section>
  );
};

export default Hero;
