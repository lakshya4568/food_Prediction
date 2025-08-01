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
    <section id="how-it-works" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
            How <span className="text-primary-600">NutriVision</span> Works
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            A simple three-step process to transform your nutrition
          </p>
        </div>
        <div className="space-y-20">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`grid lg:grid-cols-2 gap-12 items-center ${
                step.reverse ? "lg:grid-flow-col-dense" : ""
              }`}
            >
              <div className={`${step.reverse ? "lg:col-start-2" : ""}`}>
                <div className="relative">
                  <div className="absolute -top-4 -left-4 w-16 h-16 bg-primary-600 text-white text-2xl font-bold rounded-full flex items-center justify-center shadow-lg">
                    {step.number}
                  </div>
                  <div className="bg-gray-50 rounded-2xl p-8 pt-12">
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 text-lg leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
              <div className={`${step.reverse ? "lg:col-start-1" : ""}`}>
                <div className="relative rounded-2xl overflow-hidden shadow-xl transform hover:scale-105 transition-transform duration-300">
                  <img
                    src={step.image}
                    alt={step.alt}
                    className="w-full h-64 lg:h-80 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
