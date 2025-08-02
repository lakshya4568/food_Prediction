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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Side - Branding & Image */}
        <div className="space-y-8">
          {/* Logo */}
          <div className="text-center lg:text-left">
            <Link to="/" className="inline-block">
              <h1 className="text-4xl lg:text-5xl font-bold">
                <span className="text-gray-800">Nutri</span>
                <span className="text-primary-600">Vision</span>
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
            <div className="absolute -top-4 -left-4 bg-white rounded-lg shadow-lg p-4 animate-float">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                  <FaCamera className="text-primary-600" />
                </div>
                <span className="font-semibold text-gray-800">Snap</span>
              </div>
            </div>
            
            <div className="absolute top-1/3 -right-4 bg-white rounded-lg shadow-lg p-4 animate-float" style={{animationDelay: '1s'}}>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <FaBrain className="text-green-600" />
                </div>
                <span className="font-semibold text-gray-800">Analyze</span>
              </div>
            </div>
            
            <div className="absolute -bottom-4 left-1/4 bg-white rounded-lg shadow-lg p-4 animate-float" style={{animationDelay: '2s'}}>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <FaChartPie className="text-yellow-600" />
                </div>
                <span className="font-semibold text-gray-800">Track</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="text-center lg:text-left space-y-4">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-800">
              Transform Your Nutrition Journey
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Take a photo of your food and instantly get detailed nutritional
              information to help you make healthier choices.
            </p>
          </div>
        </div>

        {/* Right Side - Authentication Forms */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 lg:p-12">
          {/* Tabs */}
          <div className="flex mb-8 bg-gray-100 rounded-xl p-1">
            <button
              className={`flex-1 py-3 px-6 text-center font-semibold rounded-lg transition-all duration-200 ${
                activeTab === "login"
                  ? "bg-primary-600 text-white shadow-md"
                  : "text-gray-600 hover:text-gray-800"
              }`}
              onClick={() => setActiveTab("login")}
            >
              Login
            </button>
            <button
              className={`flex-1 py-3 px-6 text-center font-semibold rounded-lg transition-all duration-200 ${
                activeTab === "signup"
                  ? "bg-primary-600 text-white shadow-md"
                  : "text-gray-600 hover:text-gray-800"
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
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome Back!</h2>
                <p className="text-gray-600">Sign in to your account to continue your nutrition journey.</p>
              </div>

              <div className="space-y-2">
                <label htmlFor="login-email" className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  id="login-email"
                  name="email"
                  value={loginData.email}
                  onChange={handleLoginChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  placeholder="Enter your email"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="login-password" className="block text-sm font-medium text-gray-700">
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
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input type="checkbox" className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                  <span className="ml-2 text-sm text-gray-600">Remember me</span>
                </label>
                <a href="#" className="text-sm text-primary-600 hover:text-primary-700">
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                className="w-full bg-primary-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
              >
                Sign In
              </button>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Or continue with</span>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center py-3 px-4 border border-gray-300 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    <FaGoogle className="text-red-500" />
                    <span className="ml-2">Google</span>
                  </button>
                  <button
                    type="button"
                    className="w-full inline-flex justify-center py-3 px-4 border border-gray-300 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
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
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Create Account</h2>
                <p className="text-gray-600">Join NutriVision and start your healthy journey today.</p>
              </div>

              <div className="space-y-2">
                <label htmlFor="signup-fullName" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  id="signup-fullName"
                  name="fullName"
                  value={signupData.fullName}
                  onChange={handleSignupChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  placeholder="Enter your full name"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  id="signup-email"
                  name="email"
                  value={signupData.email}
                  onChange={handleSignupChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  placeholder="Enter your email"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700">
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
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    placeholder="Create a password"
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="signup-confirmPassword" className="block text-sm font-medium text-gray-700">
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
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div className="flex items-start">
                <input type="checkbox" className="mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500" required />
                <label className="ml-3 text-sm text-gray-600">
                  I agree to the{" "}
                  <a href="#" className="text-primary-600 hover:text-primary-700">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-primary-600 hover:text-primary-700">
                    Privacy Policy
                  </a>
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-primary-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
              >
                Create Account
              </button>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Or continue with</span>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center py-3 px-4 border border-gray-300 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    <FaGoogle className="text-red-500" />
                    <span className="ml-2">Google</span>
                  </button>
                  <button
                    type="button"
                    className="w-full inline-flex justify-center py-3 px-4 border border-gray-300 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
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
