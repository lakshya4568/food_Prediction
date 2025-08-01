import React from "react";
import {
  FaCamera,
  FaCalculator,
  FaUserPlus,
  FaHistory,
  FaBell,
  FaCloud,
} from "react-icons/fa";

const Features = () => {
  const features = [
    {
      icon: <FaCamera />,
      title: "Food Recognition",
      description:
        "Our AI accurately identifies food items from photos with over 95% accuracy.",
    },
    {
      icon: <FaCalculator />,
      title: "Nutrient Analysis",
      description:
        "Get detailed macro and micronutrient breakdowns of your meals instantly.",
    },
    {
      icon: <FaUserPlus />,
      title: "Personalized Insights",
      description:
        "Receive recommendations tailored to your specific health goals and dietary needs.",
    },
    {
      icon: <FaHistory />,
      title: "Meal History",
      description:
        "Track your eating patterns and nutritional intake over time with visual reports.",
    },
    {
      icon: <FaBell />,
      title: "Smart Reminders",
      description:
        "Get gentle nudges to maintain balanced nutrition throughout your day.",
    },
    {
      icon: <FaCloud />,
      title: "Cross-Platform",
      description:
        "Access your nutrition data from any device, anywhere, anytime.",
    },
  ];

  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
            Powerful <span className="text-primary-600">Features</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover how NutriVision can transform your relationship with food
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="group bg-gray-50 rounded-xl p-8 hover:bg-white hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-primary-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary-600 transition-colors">
                <div className="text-2xl text-primary-600 group-hover:text-white transition-colors">
                  {feature.icon}
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
