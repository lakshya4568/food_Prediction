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
    <section id="features" className="features">
      <div className="container">
        <div className="section-header">
          <h2>
            Powerful <span>Features</span>
          </h2>
          <p>
            Discover how NutriVision can transform your relationship with food
          </p>
        </div>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
