import React from "react";
import { FaArrowRight } from "react-icons/fa";

const CTA = () => {
  const handleGetStarted = () => {
    // Navigate to auth page using hash routing
    window.location.hash = "auth";
  };

  return (
    <section className="cta">
      <div className="container">
        <div className="cta-content">
          <h2>Ready to Transform Your Nutrition Journey?</h2>
          <p>
            Join thousands of users who are already living healthier lives with
            NutriVision's AI-powered insights.
          </p>
          <button
            className="btn btn-primary btn-large"
            onClick={handleGetStarted}
          >
            Get Started Now <FaArrowRight />
          </button>
        </div>
      </div>
    </section>
  );
};

export default CTA;
