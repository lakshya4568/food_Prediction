import React from "react";
import Hero from "./Hero";
import Features from "./Features";
import Benefits from "./Benefits";
import HowItWorks from "./HowItWorks";
import Testimonials from "./Testimonials";
import CTA from "./CTA";
import AuthPage from "./AuthPage";
import Footer from "./Footer";

const LandingPage = () => {
  return (
    <div className="landing-page">
      <Hero />
      <Features />
      <Benefits />
      <HowItWorks />
      <Testimonials />
      <CTA />
      <div id="auth">
        <AuthPage />
      </div>
      <Footer />
    </div>
  );
};

export default LandingPage;
