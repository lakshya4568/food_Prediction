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
    <section id="benefits" className="benefits">
      <div className="container">
        <div className="section-header light">
          <h2>
            Why Choose <span>NutriVision</span>
          </h2>
          <p>Transform your health journey with our cutting-edge technology</p>
        </div>
        <div className="benefits-container">
          <div className="benefit-image">
            <img
              src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=2853&auto=format&fit=crop"
              alt="Woman enjoying healthy meal with NutriVision app"
            />
          </div>
          <div className="benefit-content">
            {benefits.map((benefit, index) => (
              <div key={index} className="benefit-item">
                <div className="benefit-icon">{benefit.icon}</div>
                <div className="benefit-text">
                  <h3>{benefit.title}</h3>
                  <p>{benefit.description}</p>
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
