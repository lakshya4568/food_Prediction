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
    <section
      id="features"
      className="py-20 bg-gradient-to-br from-bg-light via-primary-50/30 to-secondary-50/30 dark:from-bg-dark dark:via-primary-900/20 dark:to-secondary-900/20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-dark dark:text-text-light mb-4">
            Powerful{" "}
            <span className="text-gradient bg-gradient-to-r from-primary-600 via-secondary-500 to-accent-600 bg-clip-text text-transparent">
              Features
            </span>
          </h2>
          <p className="text-lg text-text-muted-light dark:text-text-muted-dark max-w-2xl mx-auto">
            Discover how NutriVision can transform your relationship with food
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="card-feature group transition-all duration-300 transform hover:-translate-y-2 hover:shadow-nutrition dark:hover:shadow-glow-green"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-800 dark:to-primary-700 rounded-xl flex items-center justify-center mb-6 group-hover:from-primary-500 group-hover:to-primary-600 transition-all duration-300 shadow-sm group-hover:shadow-glow-green">
                <div className="text-2xl text-primary-600 dark:text-primary-300 group-hover:text-white transition-colors">
                  {feature.icon}
                </div>
              </div>
              <h3 className="text-xl font-semibold text-text-dark dark:text-text-light mb-4">
                {feature.title}
              </h3>
              <p className="text-text-muted-light dark:text-text-muted-dark leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
