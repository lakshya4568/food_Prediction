import React from "react";
import { FaBolt, FaBrain, FaChartLine, FaUserShield } from "react-icons/fa";

const Benefits = () => {
  const benefits = [
    {
      icon: <FaBolt />,
      title: "Effortless Tracking",
      description:
        "No more manual logging. Just snap a photo and let our AI do the work.",
    },
    {
      icon: <FaBrain />,
      title: "AI-Powered Precision",
      description:
        "Our Vision Transformer technology ensures accurate food identification and analysis.",
    },
    {
      icon: <FaChartLine />,
      title: "Data-Driven Insights",
      description:
        "Make informed decisions with comprehensive nutritional breakdowns.",
    },
    {
      icon: <FaUserShield />,
      title: "Privacy Focused",
      description:
        "Your health data stays private and secure with our robust encryption.",
    },
  ];

  return (
    <section
      id="benefits"
      className="py-20 bg-gradient-to-br from-primary-50 to-green-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
            Why Choose <span className="text-primary-600">NutriVision</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Transform your health journey with our cutting-edge technology
          </p>
        </div>
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <div className="relative rounded-2xl overflow-hidden shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=2853&auto=format&fit=crop"
                alt="Woman enjoying healthy meal with NutriVision app"
                className="w-full h-96 lg:h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
          </div>
          <div className="order-1 lg:order-2 space-y-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start space-x-4 group">
                <div className="flex-shrink-0 w-12 h-12 bg-white rounded-xl shadow-lg flex items-center justify-center group-hover:bg-primary-600 transition-colors">
                  <div className="text-xl text-primary-600 group-hover:text-white transition-colors">
                    {benefit.icon}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Benefits;
