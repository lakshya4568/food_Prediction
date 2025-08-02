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
import { Link, useNavigate } from "react-router-dom";

const AuthPage = () => {
  const [activeTab, setActiveTab] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

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
    navigate("/dashboard");
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    // Handle signup logic here
    console.log("Signup data:", signupData);
    // Navigate to dashboard
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-bg-light via-primary-50 to-secondary-50 dark:from-bg-dark dark:via-primary-900 dark:to-accent-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Side - Branding & Image */}
        <div className="space-y-8">
          {/* Logo */}
          <div className="text-center lg:text-left">
            <Link to="/" className="inline-block">
              <h1 className="text-4xl lg:text-5xl font-bold">
                <span className="text-text-dark dark:text-text-light">
                  Nutri
                </span>
                <span className="text-primary-600 dark:text-primary-400">
                  Vision
                </span>
              </h1>
            </Link>
          </div>

          {/* Image with floating cards */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1490818387583-1baba5e638af?q=80&w=2732&auto=format&fit=crop&w=800&h=450"
                alt="Healthy food composition"
                className="w-full h-64 lg:h-80 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>

            {/* Floating cards */}
            <div className="absolute -top-4 -left-4 bg-surface-light dark:bg-surface-dark rounded-lg shadow-lg dark:shadow-glow-green p-4 animate-float border border-primary-200/50 dark:border-primary-700/50">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-800 dark:to-primary-700 rounded-lg flex items-center justify-center">
                  <FaCamera className="text-primary-600 dark:text-primary-300" />
                </div>
                <span className="font-semibold text-text-dark dark:text-text-light">
                  Snap
                </span>
              </div>
            </div>

            <div
              className="absolute top-1/3 -right-4 bg-surface-light dark:bg-surface-dark rounded-lg shadow-lg dark:shadow-glow-green p-4 animate-float border border-primary-200/50 dark:border-primary-700/50"
              style={{ animationDelay: "1s" }}
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-secondary-100 to-secondary-200 dark:from-secondary-800 dark:to-secondary-700 rounded-lg flex items-center justify-center">
                  <FaBrain className="text-secondary-600 dark:text-secondary-300" />
                </div>
                <span className="font-semibold text-text-dark dark:text-text-light">
                  Analyze
                </span>
              </div>
            </div>

            <div
              className="absolute -bottom-4 left-1/4 bg-surface-light dark:bg-surface-dark rounded-lg shadow-lg dark:shadow-glow-purple p-4 animate-float border border-primary-200/50 dark:border-primary-700/50"
              style={{ animationDelay: "2s" }}
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-accent-100 to-accent-200 dark:from-accent-800 dark:to-accent-700 rounded-lg flex items-center justify-center">
                  <FaChartPie className="text-accent-600 dark:text-accent-300" />
                </div>
                <span className="font-semibold text-text-dark dark:text-text-light">
                  Track
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="text-center lg:text-left space-y-4">
            <h2 className="text-2xl lg:text-3xl font-bold text-text-dark dark:text-text-light">
              Transform Your Nutrition Journey
            </h2>
            <p className="text-lg text-text-muted-light dark:text-text-muted-dark leading-relaxed">
              Take a photo of your food and instantly get detailed nutritional
              information to help you make healthier choices.
            </p>
          </div>
        </div>

        {/* Right Side - Authentication Forms */}
        <div className="bg-surface-light dark:bg-surface-dark rounded-2xl shadow-2xl dark:shadow-glow-green p-8 lg:p-12 border border-primary-200/50 dark:border-primary-700/50">
          {/* Tabs */}
          <div className="flex mb-8 bg-primary-100/50 dark:bg-primary-900/30 rounded-xl p-1">
            <button
              className={`flex-1 py-3 px-6 text-center font-semibold rounded-lg transition-all duration-200 ${
                activeTab === "login"
                  ? "bg-primary-600 text-white shadow-md"
                  : "text-text-muted-light dark:text-text-muted-dark hover:text-text-dark dark:hover:text-text-light"
              }`}
              onClick={() => setActiveTab("login")}
            >
              Login
            </button>
            <button
              className={`flex-1 py-3 px-6 text-center font-semibold rounded-lg transition-all duration-200 ${
                activeTab === "signup"
                  ? "bg-primary-600 text-white shadow-md"
                  : "text-text-muted-light dark:text-text-muted-dark hover:text-text-dark dark:hover:text-text-light"
              }`}
              onClick={() => setActiveTab("signup")}
            >
              Sign Up
            </button>
          </div>

          {/* Login Form */}
          {activeTab === "login" && (
            <form onSubmit={handleLoginSubmit} className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-text-dark dark:text-text-light mb-2">
                  Welcome Back!
                </h2>
                <p className="text-text-muted-light dark:text-text-muted-dark">
                  Sign in to your account to continue your nutrition journey.
                </p>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="login-email"
                  className="block text-sm font-medium text-text-dark dark:text-text-light"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="login-email"
                  name="email"
                  value={loginData.email}
                  onChange={handleLoginChange}
                  required
                  className="input-field"
                  placeholder="Enter your email"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="login-password"
                  className="block text-sm font-medium text-text-dark dark:text-text-light"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="login-password"
                    name="password"
                    value={loginData.password}
                    onChange={handleLoginChange}
                    required
                    className="input-field pr-12"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-text-muted-light dark:text-text-muted-dark hover:text-text-dark dark:hover:text-text-light transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="rounded border-primary-300 dark:border-primary-600 text-primary-600 focus:ring-primary-500 bg-surface-light dark:bg-surface-dark"
                  />
                  <span className="ml-2 text-sm text-text-muted-light dark:text-text-muted-dark">
                    Remember me
                  </span>
                </label>
                <a
                  href="#"
                  className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
                >
                  Forgot password?
                </a>
              </div>

              <button type="submit" className="btn-primary w-full">
                Sign In
              </button>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-primary-300/50 dark:border-primary-600/50"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-surface-light dark:bg-surface-dark text-text-muted-light dark:text-text-muted-dark">
                      Or continue with
                    </span>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center py-3 px-4 border border-primary-300/50 dark:border-primary-600/50 rounded-xl shadow-sm bg-surface-light dark:bg-surface-dark text-sm font-medium text-text-dark dark:text-text-light hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
                  >
                    <FaGoogle className="text-red-500" />
                    <span className="ml-2">Google</span>
                  </button>
                  <button
                    type="button"
                    className="w-full inline-flex justify-center py-3 px-4 border border-primary-300/50 dark:border-primary-600/50 rounded-xl shadow-sm bg-surface-light dark:bg-surface-dark text-sm font-medium text-text-dark dark:text-text-light hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
                  >
                    <FaFacebookF className="text-blue-600" />
                    <span className="ml-2">Facebook</span>
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Signup Form */}
          {activeTab === "signup" && (
            <form onSubmit={handleSignupSubmit} className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-text-dark dark:text-text-light mb-2">
                  Create Account
                </h2>
                <p className="text-text-muted-light dark:text-text-muted-dark">
                  Join NutriVision and start your healthy journey today.
                </p>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="signup-fullName"
                  className="block text-sm font-medium text-text-dark dark:text-text-light"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="signup-fullName"
                  name="fullName"
                  value={signupData.fullName}
                  onChange={handleSignupChange}
                  required
                  className="input-field"
                  placeholder="Enter your full name"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="signup-email"
                  className="block text-sm font-medium text-text-dark dark:text-text-light"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="signup-email"
                  name="email"
                  value={signupData.email}
                  onChange={handleSignupChange}
                  required
                  className="input-field"
                  placeholder="Enter your email"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="signup-password"
                  className="block text-sm font-medium text-text-dark dark:text-text-light"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="signup-password"
                    name="password"
                    value={signupData.password}
                    onChange={handleSignupChange}
                    required
                    className="input-field pr-12"
                    placeholder="Create a password"
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-text-muted-light dark:text-text-muted-dark hover:text-text-dark dark:hover:text-text-light transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="signup-confirmPassword"
                  className="block text-sm font-medium text-text-dark dark:text-text-light"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="signup-confirmPassword"
                    name="confirmPassword"
                    value={signupData.confirmPassword}
                    onChange={handleSignupChange}
                    required
                    className="input-field pr-12"
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-text-muted-light dark:text-text-muted-dark hover:text-text-dark dark:hover:text-text-light transition-colors"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div className="flex items-start">
                <input
                  type="checkbox"
                  className="mt-1 rounded border-primary-300 dark:border-primary-600 text-primary-600 focus:ring-primary-500 bg-surface-light dark:bg-surface-dark"
                  required
                />
                <label className="ml-3 text-sm text-text-muted-light dark:text-text-muted-dark">
                  I agree to the{" "}
                  <a
                    href="#"
                    className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
                  >
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a
                    href="#"
                    className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
                  >
                    Privacy Policy
                  </a>
                </label>
              </div>

              <button type="submit" className="btn-primary w-full">
                Create Account
              </button>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-primary-300/50 dark:border-primary-600/50"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-surface-light dark:bg-surface-dark text-text-muted-light dark:text-text-muted-dark">
                      Or continue with
                    </span>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center py-3 px-4 border border-primary-300/50 dark:border-primary-600/50 rounded-xl shadow-sm bg-surface-light dark:bg-surface-dark text-sm font-medium text-text-dark dark:text-text-light hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
                  >
                    <FaGoogle className="text-red-500" />
                    <span className="ml-2">Google</span>
                  </button>
                  <button
                    type="button"
                    className="w-full inline-flex justify-center py-3 px-4 border border-primary-300/50 dark:border-primary-600/50 rounded-xl shadow-sm bg-surface-light dark:bg-surface-dark text-sm font-medium text-text-dark dark:text-text-light hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
                  >
                    <FaFacebookF className="text-blue-600" />
                    <span className="ml-2">Facebook</span>
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
