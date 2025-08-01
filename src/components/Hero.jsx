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
    <section
      id="home"
      className="relative min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 pt-16 lg:pt-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-4rem)] lg:min-h-[calc(100vh-5rem)]">
          <div className="text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-800 leading-tight">
              AI-Powered{" "}
              <span className="bg-gradient-to-r from-primary-600 to-green-600 bg-clip-text text-transparent">
                Nutrition
              </span>{" "}
              Analysis at Your Fingertips
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto lg:mx-0">
              Take a photo of your food and instantly get detailed nutritional
              information to help you make healthier choices.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button
                className="group inline-flex items-center justify-center px-8 py-4 bg-primary-600 text-white text-lg font-semibold rounded-xl hover:bg-primary-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                onClick={handleGetStarted}
              >
                Get Started Now
                <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                className="group inline-flex items-center justify-center px-8 py-4 bg-white text-primary-600 text-lg font-semibold rounded-xl hover:bg-gray-50 border-2 border-primary-600 transition-all duration-200 shadow-lg hover:shadow-xl"
                onClick={handleLearnMore}
              >
                <FaPlay className="mr-2 group-hover:scale-110 transition-transform" />
                Learn More
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-500">
              <img
                src="https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=2940&auto=format&fit=crop"
                alt="Healthy food plate with AI analysis overlay"
                className="w-full h-96 lg:h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>

            {/* Floating cards */}
            <div className="absolute -top-4 -left-4 bg-white rounded-lg shadow-lg p-4 animate-float">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                  <FaCamera className="text-primary-600" />
                </div>
                <span className="font-semibold text-gray-800">
                  Snap a Photo
                </span>
              </div>
            </div>

            <div
              className="absolute top-1/3 -right-4 bg-white rounded-lg shadow-lg p-4 animate-float"
              style={{ animationDelay: "1s" }}
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <FaBrain className="text-green-600" />
                </div>
                <span className="font-semibold text-gray-800">AI Analyzes</span>
              </div>
            </div>

            <div
              className="absolute -bottom-4 left-1/4 bg-white rounded-lg shadow-lg p-4 animate-float"
              style={{ animationDelay: "2s" }}
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <FaChartPie className="text-yellow-600" />
                </div>
                <span className="font-semibold text-gray-800">
                  Get Nutrition Data
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wave divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          className="w-full"
        >
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
