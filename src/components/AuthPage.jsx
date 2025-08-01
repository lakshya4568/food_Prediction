import React, { useState } from "react";
import {
  FaCamera,
  FaBrain,
  FaChartPie,
  FaFacebookF,
  FaGoogle,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

const AuthPage = () => {
  const [activeTab, setActiveTab] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [signupData, setSignupData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleLoginChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignupChange = (e) => {
    setSignupData({
      ...signupData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
    console.log("Login data:", loginData);
    // Navigate to dashboard
    window.location.hash = "dashboard";
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    // Handle signup logic here
    console.log("Signup data:", signupData);
    // Navigate to dashboard
    window.location.hash = "dashboard";
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-left">
          <div className="auth-logo">
            <a href="#landing">
              <h1>
                Nutri<span>Vision</span>
              </h1>
            </a>
          </div>
          <div className="auth-image">
            <img
              src="https://images.unsplash.com/photo-1490818387583-1baba5e638af?q=80&w=2732&auto=format&fit=crop&w=800&h=450"
              alt="Healthy food composition"
            />
            <div className="floating-card auth-card-1">
              <FaCamera />
              <span>Snap</span>
            </div>
            <div className="floating-card auth-card-2">
              <FaBrain />
              <span>Analyze</span>
            </div>
            <div className="floating-card auth-card-3">
              <FaChartPie />
              <span>Track</span>
            </div>
          </div>
          <div className="auth-text">
            <h2>Transform Your Nutrition Journey</h2>
            <p>
              Take a photo of your food and instantly get detailed nutritional
              information to help you make healthier choices.
            </p>
          </div>
        </div>

        <div className="auth-right">
          <div className="auth-tabs">
            <button
              className={`auth-tab login-tab ${
                activeTab === "login" ? "active" : ""
              }`}
              onClick={() => setActiveTab("login")}
            >
              Login
            </button>
            <button
              className={`auth-tab signup-tab ${
                activeTab === "signup" ? "active" : ""
              }`}
              onClick={() => setActiveTab("signup")}
            >
              Sign Up
            </button>
          </div>

          <div className="auth-forms">
            {/* Login Form */}
            <form
              id="login-form"
              className={activeTab === "login" ? "active" : ""}
              onSubmit={handleLoginSubmit}
              style={{ display: activeTab === "login" ? "block" : "none" }}
            >
              <h2>Welcome Back!</h2>
              <p>Sign in to your account to continue your nutrition journey.</p>

              <div className="form-group">
                <label htmlFor="login-email">Email Address</label>
                <input
                  type="email"
                  id="login-email"
                  name="email"
                  value={loginData.email}
                  onChange={handleLoginChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="login-password">Password</label>
                <div className="password-input">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="login-password"
                    name="password"
                    value={loginData.password}
                    onChange={handleLoginChange}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div className="form-options">
                <label className="checkbox">
                  <input type="checkbox" />
                  <span className="checkmark"></span>
                  Remember me
                </label>
                <a href="#" className="forgot-password">
                  Forgot Password?
                </a>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-large auth-submit"
              >
                Sign In
              </button>

              <div className="auth-divider">
                <span>or continue with</span>
              </div>

              <div className="social-buttons">
                <button type="button" className="social-btn google">
                  <FaGoogle />
                  <span>Google</span>
                </button>
                <button type="button" className="social-btn facebook">
                  <FaFacebookF />
                  <span>Facebook</span>
                </button>
              </div>

              <div className="auth-switch">
                <p>
                  Don't have an account?{" "}
                  <button
                    type="button"
                    className="switch-to-signup"
                    onClick={() => setActiveTab("signup")}
                  >
                    Sign up
                  </button>
                </p>
              </div>
            </form>

            {/* Signup Form */}
            <form
              id="signup-form"
              className={activeTab === "signup" ? "active" : ""}
              onSubmit={handleSignupSubmit}
              style={{ display: activeTab === "signup" ? "block" : "none" }}
            >
              <h2>Join NutriVision</h2>
              <p>
                Create your account and start your personalized nutrition
                journey today.
              </p>

              <div className="form-group">
                <label htmlFor="signup-name">Full Name</label>
                <input
                  type="text"
                  id="signup-name"
                  name="fullName"
                  value={signupData.fullName}
                  onChange={handleSignupChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="signup-email">Email Address</label>
                <input
                  type="email"
                  id="signup-email"
                  name="email"
                  value={signupData.email}
                  onChange={handleSignupChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="signup-password">Password</label>
                <div className="password-input">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="signup-password"
                    name="password"
                    value={signupData.password}
                    onChange={handleSignupChange}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="signup-confirm-password">
                  Confirm Password
                </label>
                <div className="password-input">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="signup-confirm-password"
                    name="confirmPassword"
                    value={signupData.confirmPassword}
                    onChange={handleSignupChange}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div className="form-options">
                <label className="checkbox">
                  <input type="checkbox" required />
                  <span className="checkmark"></span>I agree to the{" "}
                  <a href="#">Terms of Service</a> and{" "}
                  <a href="#">Privacy Policy</a>
                </label>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-large auth-submit"
              >
                Create Account
              </button>

              <div className="auth-divider">
                <span>or continue with</span>
              </div>

              <div className="social-buttons">
                <button type="button" className="social-btn google">
                  <FaGoogle />
                  <span>Google</span>
                </button>
                <button type="button" className="social-btn facebook">
                  <FaFacebookF />
                  <span>Facebook</span>
                </button>
              </div>

              <div className="auth-switch">
                <p>
                  Already have an account?{" "}
                  <button
                    type="button"
                    className="switch-to-login"
                    onClick={() => setActiveTab("login")}
                  >
                    Login
                  </button>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
