import React from "react";
import { FaArrowRight, FaStar, FaHeart } from "react-icons/fa";

const CTA = () => {
  const handleGetStarted = () => {
    window.location.href = "/auth";
  };
  return (
    <section className="relative py-20 overflow-hidden">
      {/* Enhanced dynamic background with vibrant nutrition-themed gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-secondary-500 to-accent-600 dark:from-primary-800 dark:via-secondary-800 dark:to-accent-800">
        <div className="absolute inset-0 bg-vibrant-overlay dark:bg-dark-overlay"></div>
        <div className="absolute inset-0 bg-hero-pattern-light dark:bg-hero-pattern-dark opacity-40"></div>
      </div>

      {/* Enhanced animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-float"></div>
        <div
          className="absolute bottom-10 right-10 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "1s" }}
        ></div>
        <div className="absolute top-1/2 left-1/3 w-40 h-40 bg-white/10 rounded-full blur-2xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/3 right-1/4 w-56 h-56 bg-accent-300/20 rounded-full blur-3xl animate-bounce-gentle"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-full text-sm font-medium mb-8 animate-fade-in">
            <FaStar className="mr-2 text-secondary-200 animate-bounce-gentle" />
            Join 10,000+ Health-Conscious Users
            <FaStar className="ml-2 text-accent-200 animate-pulse" />
          </div>

          {/* Main heading */}
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-8 leading-tight animate-slide-up">
            Ready to Transform Your{" "}
            <span className="relative">
              <span className="bg-gradient-to-r from-white to-accent-100 bg-clip-text text-transparent">
                Nutrition Journey
              </span>
              <FaHeart className="absolute -top-2 -right-8 text-2xl text-red-300 animate-bounce-gentle" />
            </span>
            ?
          </h2>

          {/* Subtitle */}
          <p
            className="text-xl lg:text-2xl text-white/90 mb-12 max-w-4xl mx-auto leading-relaxed animate-slide-up"
            style={{ animationDelay: "0.2s" }}
          >
            Join thousands of users who are already living healthier lives with
            NutriVision's AI-powered insights. Start your journey to better
            nutrition today!
          </p>

          {/* CTA Button */}
          <div className="animate-scale-in relative z-20" style={{ animationDelay: "0.4s" }}>
            <button
              onClick={handleGetStarted}
              className="btn-clickable group inline-flex items-center justify-center px-10 py-5 bg-white text-primary-600 text-xl font-bold rounded-2xl hover:bg-gray-50 transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-3xl relative overflow-hidden cursor-pointer z-30"
              type="button"
            >
              {/* Button shimmer effect */}
              <div className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>

              <span className="relative flex items-center">
                Get Started Now
                <FaArrowRight className="ml-3 group-hover:translate-x-2 transition-transform duration-300" />
              </span>
            </button>
          </div>

          {/* Trust indicators */}
          <div
            className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in"
            style={{ animationDelay: "0.6s" }}
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-white mb-2">95%+</div>
              <div className="text-white/80">Accuracy Rate</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-white mb-2">10K+</div>
              <div className="text-white/80">Happy Users</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-white mb-2">1M+</div>
              <div className="text-white/80">Photos Analyzed</div>
            </div>
          </div>

          {/* Additional trust element */}
          <div
            className="mt-12 flex items-center justify-center space-x-4 text-white/70 animate-fade-in"
            style={{ animationDelay: "0.8s" }}
          >
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} className="text-yellow-300 text-sm" />
              ))}
            </div>
            <span className="text-sm">4.9/5 rating from our users</span>
          </div>
        </div>
      </div>

      {/* Bottom decorative wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 160"
          className="w-full"
        >
          <path
            fill="currentColor"
            className="text-bg-light dark:text-bg-dark"
            d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,96C960,96,1056,96,1152,112C1248,128,1344,160,1392,176L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </div>
    </section>
  );
};

export default CTA;
