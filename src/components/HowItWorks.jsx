import React from "react";

const HowItWorks = () => {
  const steps = [
    {
      number: "1",
      title: "Snap a Photo",
      description:
        "Take a picture of your food using our app. It's that simple to start!",
      image:
        "https://images.unsplash.com/photo-1531315630201-bb15abeb1653?q=80&w=2835&auto=format&fit=crop",
      alt: "Taking a photo of food",
      reverse: false,
    },
    {
      number: "2",
      title: "AI Analysis",
      description:
        "Our powerful Vision Transformer AI identifies the food and calculates nutrition facts.",
      image:
        "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2940&auto=format&fit=crop",
      alt: "AI analyzing food image",
      reverse: true,
    },
    {
      number: "3",
      title: "Get Personalized Insights",
      description:
        "Receive detailed nutritional information and personalized recommendations.",
      image:
        "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=2940&auto=format&fit=crop",
      alt: "Person reviewing nutrition data",
      reverse: false,
    },
  ];

  return (
    <section id="how-it-works" className="how-it-works">
      <div className="container">
        <div className="section-header">
          <h2>
            How <span>NutriVision</span> Works
          </h2>
          <p>A simple three-step process to transform your nutrition</p>
        </div>
        <div className="steps-container">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`step ${step.reverse ? "reverse" : ""}`}
            >
              <div className="step-number">{step.number}</div>
              <div className="step-content">
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
              <div className="step-image">
                <img src={step.image} alt={step.alt} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
