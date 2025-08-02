import React from "react";
import Hero from "./Hero";
import Features from "./Features";
import Benefits from "./Benefits";
import HowItWorks from "./HowItWorks";
import Testimonials from "./Testimonials";
import CTA from "./CTA";
import Footer from "./Footer";
import Header from "./Header";

const LandingPage = () => {
  return (
    <div>
      <Header />
      <Hero />
      <Features />
      <Benefits />
      <HowItWorks />
      <Testimonials />
      <CTA />
      <Footer />
    </div>
  );
};

export default LandingPage;
