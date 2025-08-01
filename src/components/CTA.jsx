import React from "react";
import { FaArrowRight } from "react-icons/fa";

const CTA = () => {
  const handleGetStarted = () => {
    // Navigate to auth page using hash routing
    window.location.hash = "auth";
  };

  return (
    <section className="py-20 bg-gradient-to-r from-primary-600 to-green-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Nutrition Journey?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-3xl mx-auto">
            Join thousands of users who are already living healthier lives with
            NutriVision's AI-powered insights.
          </p>
          <button
            className="group inline-flex items-center justify-center px-8 py-4 bg-white text-primary-600 text-lg font-semibold rounded-xl hover:bg-gray-100 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
            onClick={handleGetStarted}
          >
            Get Started Now 
            <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default CTA;
