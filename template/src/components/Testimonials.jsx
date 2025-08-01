import React, { useState, useEffect } from "react";
import { FaQuoteLeft, FaChevronLeft, FaChevronRight } from "react-icons/fa";

const Testimonials = () => {
  const testimonials = [
    {
      quote:
        "NutriVision has completely transformed how I track my meals. The AI accuracy is impressive, and it's saved me so much time!",
      name: "Sarah J.",
      role: "Fitness Coach",
      image: "https://randomuser.me/api/portraits/women/65.jpg",
    },
    {
      quote:
        "As a nutritionist, I recommend NutriVision to all my clients. The detailed breakdown of nutrients helps them stay on track with their health goals.",
      name: "Dr. Michael T.",
      role: "Clinical Nutritionist",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      quote:
        "The convenience of taking a photo instead of manually logging everything has made me consistent with tracking my nutrition for the first time ever!",
      name: "Emma R.",
      role: "Busy Professional",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [testimonials.length]);

  const goToPrevious = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  return (
    <section id="testimonials" className="testimonials">
      <div className="container">
        <div className="section-header light">
          <h2>
            What Our <span>Users Say</span>
          </h2>
          <p>
            Join thousands of satisfied users who have transformed their health
            with NutriVision
          </p>
        </div>
        <div className="testimonial-slider">
          <div className="testimonial-container">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className={`testimonial ${
                  index === currentIndex ? "active" : ""
                }`}
                style={{ display: index === currentIndex ? "block" : "none" }}
              >
                <div className="testimonial-content">
                  <div className="quote">
                    <FaQuoteLeft />
                  </div>
                  <p>"{testimonial.quote}"</p>
                  <div className="testimonial-author">
                    <div className="author-image">
                      <img src={testimonial.image} alt={testimonial.name} />
                    </div>
                    <div className="author-info">
                      <h4>{testimonial.name}</h4>
                      <p>{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="testimonial-controls">
            <button className="control-btn prev" onClick={goToPrevious}>
              <FaChevronLeft />
            </button>
            <button className="control-btn next" onClick={goToNext}>
              <FaChevronRight />
            </button>
          </div>
          <div className="testimonial-dots">
            {testimonials.map((_, index) => (
              <span
                key={index}
                className={`dot ${index === currentIndex ? "active" : ""}`}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
