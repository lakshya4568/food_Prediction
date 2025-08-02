import React from "react";
import {
  FaCamera,
  FaBrain,
  FaChartPie,
  FaArrowRight,
  FaPlay,
  FaStar,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const Hero = () => {
  const handleLearnMore = () => {
    const element = document.querySelector("#how-it-works");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="home"
      className="relative min-h-screen bg-hero-pattern-light dark:bg-hero-pattern-dark bg-bg-light dark:bg-bg-dark pt-16 lg:pt-20 overflow-hidden"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-72 h-72 bg-primary-200/30 dark:bg-primary-800/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div
          className="absolute bottom-10 right-10 w-96 h-96 bg-secondary-200/30 dark:bg-secondary-800/20 rounded-full blur-3xl animate-pulse-slow"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-accent-200/20 dark:bg-accent-800/10 rounded-full blur-3xl animate-pulse-slow"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-4rem)] lg:min-h-[calc(100vh-5rem)]">
          <div className="text-center lg:text-left animate-fade-in">
            <div className="inline-flex items-center bg-primary-100/80 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300 px-4 py-2 rounded-full text-sm font-medium mb-6 backdrop-blur-sm">
              <FaStar className="mr-2 animate-bounce-gentle" />
              Powered by Advanced AI Vision Technology
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
              <span className="text-gradient bg-gradient-to-r from-primary-600 via-accent-500 to-info-600 bg-clip-text text-transparent">
                AI-Powered
              </span>
              <br />
              <span className="text-text-dark dark:text-text-light">
                Nutrition Analysis
              </span>
              <br />
              <span className="text-text-muted-light dark:text-text-muted-dark text-3xl sm:text-4xl lg:text-5xl">
                at Your Fingertips
              </span>
            </h1>

            <p className="mt-6 text-lg sm:text-xl lg:text-2xl text-text-muted-light dark:text-text-muted-dark max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Take a photo of your food and instantly get detailed nutritional
              information to help you make{" "}
              <span className="text-primary-600 dark:text-primary-400 font-semibold">
                healthier choices
              </span>
              .
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                to="/auth"
                className="btn-primary group animate-scale-in"
                style={{ animationDelay: "0.2s" }}
              >
                Get Started Now
                <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button
                className="btn-outline group animate-scale-in"
                onClick={handleLearnMore}
                style={{ animationDelay: "0.4s" }}
              >
                <FaPlay className="mr-2 group-hover:scale-110 transition-transform" />
                Learn More
              </button>
            </div>

            {/* Stats */}
            <div
              className="mt-12 grid grid-cols-3 gap-8 animate-slide-up"
              style={{ animationDelay: "0.6s" }}
            >
              <div className="text-center">
                <div className="text-2xl lg:text-3xl font-bold text-primary-600 dark:text-primary-400">
                  95%+
                </div>
                <div className="text-sm text-text-muted-light dark:text-text-muted-dark">
                  Accuracy
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl lg:text-3xl font-bold text-accent-600 dark:text-accent-400">
                  10K+
                </div>
                <div className="text-sm text-text-muted-light dark:text-text-muted-dark">
                  Users
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl lg:text-3xl font-bold text-info-600 dark:text-info-400">
                  1M+
                </div>
                <div className="text-sm text-text-muted-light dark:text-text-muted-dark">
                  Photos Analyzed
                </div>
              </div>
            </div>
          </div>

          <div
            className="relative animate-fade-in"
            style={{ animationDelay: "0.3s" }}
          >
            <div className="relative rounded-2xl overflow-hidden shadow-nutrition-lg dark:shadow-dark-lg transform rotate-2 hover:rotate-0 transition-all duration-500 hover:scale-105">
              <img
                src="https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=2940&auto=format&fit=crop"
                alt="Healthy food plate with AI analysis overlay"
                className="w-full h-96 lg:h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary-900/30 via-transparent to-accent-900/20"></div>

              {/* AI Analysis Overlay */}
              <div className="absolute top-4 right-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-success-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    AI Analyzing...
                  </span>
                </div>
              </div>
            </div>

            {/* Enhanced floating cards */}
            <div className="absolute -top-4 -left-4 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-xl shadow-nutrition p-4 animate-float border border-primary-200 dark:border-primary-700">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-info-400 to-info-600 rounded-xl flex items-center justify-center shadow-lg">
                  <FaCamera className="text-white text-lg" />
                </div>
                <div>
                  <span className="font-semibold text-text-dark dark:text-text-light block">
                    Snap a Photo
                  </span>
                  <span className="text-xs text-text-muted-light dark:text-text-muted-dark">
                    Instant recognition
                  </span>
                </div>
              </div>
            </div>

            <div
              className="absolute top-1/3 -right-4 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-xl shadow-nutrition p-4 animate-float border border-primary-200 dark:border-primary-700"
              style={{ animationDelay: "1s" }}
            >
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center shadow-lg">
                  <FaBrain className="text-white text-lg" />
                </div>
                <div>
                  <span className="font-semibold text-text-dark dark:text-text-light block">
                    AI Analyzes
                  </span>
                  <span className="text-xs text-text-muted-light dark:text-text-muted-dark">
                    Deep learning
                  </span>
                </div>
              </div>
            </div>

            <div
              className="absolute -bottom-4 left-1/4 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-xl shadow-nutrition p-4 animate-float border border-primary-200 dark:border-primary-700"
              style={{ animationDelay: "2s" }}
            >
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-secondary-400 to-secondary-600 rounded-xl flex items-center justify-center shadow-lg">
                  <FaChartPie className="text-white text-lg" />
                </div>
                <div>
                  <span className="font-semibold text-text-dark dark:text-text-light block">
                    Get Nutrition Data
                  </span>
                  <span className="text-xs text-text-muted-light dark:text-text-muted-dark">
                    Detailed insights
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced wave divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          className="w-full"
        >
          <path
            fill="url(#waveGradient)"
            fillOpacity="1"
            d="M0,288L48,272C96,256,192,224,288,197.3C384,171,480,149,576,165.3C672,181,768,235,864,250.7C960,267,1056,245,1152,224C1248,203,1344,181,1392,170.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
          <defs>
            <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop
                offset="0%"
                className="stop-color-bg-secondary-light dark:stop-color-bg-secondary-dark"
              />
              <stop
                offset="50%"
                className="stop-color-primary-100 dark:stop-color-primary-900"
              />
              <stop
                offset="100%"
                className="stop-color-bg-secondary-light dark:stop-color-bg-secondary-dark"
              />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </section>
  );
};

export default Hero;
