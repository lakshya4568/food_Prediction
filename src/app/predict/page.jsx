"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  FaSun,
  FaMoon,
  FaCheck,
  FaPizzaSlice,
  FaHamburger,
  FaAppleAlt,
} from "react-icons/fa";
import Image from "next/image";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const API_BASE_URL = "http://localhost:5001/";

export default function PredictPage() {
  // Theme state ('light' or 'dark')
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme) {
        return savedTheme;
      }
      if (
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
      ) {
        return "dark";
      }
    }
    return "light";
  });

  // Apply theme to document body
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (theme === "dark") {
        document.body.classList.add("dark");
      } else {
        document.body.classList.remove("dark");
      }
      localStorage.setItem("theme", theme);
    }
  }, [theme]);

  // Existing state
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  // Health info state
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [bmi, setBmi] = useState(null);
  const [conditions, setConditions] = useState("");
  const [healthInfo, setHealthInfo] = useState(null);
  const [isHealthLoading, setIsHealthLoading] = useState(false);
  const [healthError, setHealthError] = useState(null);
  const [commonConditions, setCommonConditions] = useState({
    diabetes: false,
    hypertension: false,
    cholesterol: false,
    allergies: false,
  });

  // Calculate BMI automatically
  useEffect(() => {
    if (height > 0 && weight > 0) {
      const heightInMeters = height / 100;
      const calculatedBmi = (
        weight /
        (heightInMeters * heightInMeters)
      ).toFixed(1);
      setBmi(calculatedBmi);
    } else {
      setBmi(null);
    }
  }, [height, weight]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file (PNG, JPG, JPEG)");
      return;
    }

    setSelectedImage(file);
    setError(null);
    setPrediction(null);

    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!selectedImage) {
      setError("Please select an image first");
      return;
    }

    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("image", selectedImage);

    try {
      const response = await fetch(`${API_BASE_URL}/predict`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      const data = await response.json();
      setPrediction(data);
    } catch (err) {
      console.error("Error:", err);
      setError("Failed to get prediction. Please try again.");
      setHealthInfo(null);
      setHealthError(null);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchHealthInfo = useCallback(async () => {
    if (!prediction || !prediction.class || !height || !weight || !bmi) {
      setHealthError(
        "Please enter your height and weight to get health recommendations."
      );
      return;
    }

    setIsHealthLoading(true);
    setHealthError(null);
    setHealthInfo(null);

    try {
      const response = await fetch(`${API_BASE_URL}/get_health_info`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          food_name: prediction.class,
          height: height,
          weight: weight,
          bmi: bmi,
          conditions: conditions,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `Server responded with ${response.status}`
        );
      }

      const data = await response.json();
      setHealthInfo(data);
    } catch (err) {
      console.error("Error fetching health info:", err);
      setHealthError(`Failed to get health info: ${err.message}`);
    } finally {
      setIsHealthLoading(false);
    }
  }, [prediction, height, weight, bmi, conditions]);

  useEffect(() => {
    if (prediction && prediction.class && height && weight && bmi) {
      fetchHealthInfo();
    }
    if (!prediction) {
      setHealthInfo(null);
      setHealthError(null);
    }
  }, [prediction, height, weight, bmi, fetchHealthInfo]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  const resetForm = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setPrediction(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
    setHeight("");
    setWeight("");
    setBmi(null);
    setConditions("");
    setHealthInfo(null);
    setHealthError(null);
    setIsHealthLoading(false);
    setIsLoading(false);
  };

  const toggleCondition = (condition) => {
    setCommonConditions((prev) => {
      const newState = { ...prev, [condition]: !prev[condition] };

      const activeConditions = Object.entries(newState)
        .filter(([, isActive]) => isActive)
        .map(([name]) => name.charAt(0).toUpperCase() + name.slice(1));

      setConditions(activeConditions.join(", "));

      return newState;
    });
  };

  const handleHealthSubmit = () => {
    if (!prediction) {
      setHealthError("Please upload and analyze a food image first");
      return;
    }

    if (!height || !weight || !bmi) {
      setHealthError("Please enter your height and weight");
      return;
    }

    fetchHealthInfo();
  };

  return (
    <div
      className={`min-h-screen ${
        theme === "dark" ? "dark bg-gray-900" : "bg-gray-50"
      }`}
    >
      <Header />

      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h1
              className={`text-4xl md:text-5xl font-bold ${
                theme === "dark" ? "text-white" : "text-gray-900"
              } mb-4`}
            >
              Nutri <span className="text-green-500">VISION</span>
            </h1>
            <p
              className={`text-xl ${
                theme === "dark" ? "text-gray-300" : "text-gray-600"
              } mb-6 font-serif`}
            >
              Classification of Food & Drug with Health Advisory
            </p>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="fixed top-24 right-6 z-50 bg-green-500 hover:bg-green-600 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
            >
              {theme === "light" ? <FaMoon /> : <FaSun />}
            </button>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Upload Section */}
            <div
              className={`${
                theme === "dark" ? "bg-gray-800" : "bg-white"
              } rounded-xl shadow-lg p-6 relative`}
            >
              <FaPizzaSlice className="absolute top-4 right-4 text-green-500 text-2xl animate-pulse" />
              <h2
                className={`text-2xl font-bold ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                } mb-4`}
              >
                Upload Image
              </h2>
              <p
                className={`${
                  theme === "dark" ? "text-gray-300" : "text-gray-600"
                } mb-6`}
              >
                Select an image of pizza, steak, or sushi
              </p>

              <div className="mb-6">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  ref={fileInputRef}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="block w-full p-4 border-2 border-dashed border-green-300 rounded-lg text-center cursor-pointer hover:border-green-500 transition-colors"
                >
                  <div className="text-green-500 text-3xl mb-2">
                    <i className="fas fa-cloud-upload-alt"></i>
                  </div>
                  <span
                    className={`${
                      theme === "dark" ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    {selectedImage
                      ? selectedImage.name
                      : "Choose Image or Drag & Drop"}
                  </span>
                </label>
              </div>

              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {error}
                </div>
              )}

              <div className="flex gap-4">
                <button
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleSubmit}
                  disabled={!selectedImage || isLoading}
                >
                  {isLoading ? "Predicting..." : "Predict Food"}
                </button>

                <button
                  className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:opacity-50"
                  onClick={resetForm}
                  disabled={isLoading}
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Image Preview Section */}
            <div
              className={`${
                theme === "dark" ? "bg-gray-800" : "bg-white"
              } rounded-xl shadow-lg p-6 relative`}
            >
              <FaHamburger className="absolute top-4 right-4 text-green-500 text-2xl animate-pulse" />
              <h2
                className={`text-2xl font-bold ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                } mb-4`}
              >
                Image Preview
              </h2>

              {imagePreview ? (
                <div className="text-center">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    width={300}
                    height={300}
                    className="max-w-full h-auto rounded-lg shadow-md mx-auto object-contain"
                    style={{ maxHeight: "300px" }}
                  />
                </div>
              ) : (
                <div
                  className={`h-64 flex items-center justify-center ${
                    theme === "dark" ? "bg-gray-700" : "bg-gray-100"
                  } rounded-lg`}
                >
                  <p
                    className={`${
                      theme === "dark" ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Your image will appear here
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Health Input and Results Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Health Input Section */}
            <div
              className={`${
                theme === "dark" ? "bg-gray-800" : "bg-white"
              } rounded-xl shadow-lg p-6 relative`}
            >
              <FaAppleAlt className="absolute top-4 right-4 text-green-500 text-2xl animate-pulse" />
              <h2
                className={`text-2xl font-bold ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                } mb-4`}
              >
                Your Health Profile
              </h2>
              <p
                className={`${
                  theme === "dark" ? "text-gray-300" : "text-gray-600"
                } mb-6`}
              >
                Enter your details for personalized recommendations.
              </p>

              <div className="space-y-4">
                <div>
                  <label
                    className={`block ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    } font-medium mb-2`}
                  >
                    Height (cm):
                  </label>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    placeholder="e.g., 175"
                    disabled={isLoading || isHealthLoading}
                    className={`w-full p-3 rounded-lg border ${
                      theme === "dark"
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300"
                    } focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                  />
                </div>

                <div>
                  <label
                    className={`block ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    } font-medium mb-2`}
                  >
                    Weight (kg):
                  </label>
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="e.g., 70"
                    disabled={isLoading || isHealthLoading}
                    className={`w-full p-3 rounded-lg border ${
                      theme === "dark"
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300"
                    } focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                  />
                </div>

                <div>
                  <label
                    className={`block ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    } font-medium mb-2`}
                  >
                    Calculated BMI:
                  </label>
                  <div
                    className={`p-3 rounded-lg ${
                      theme === "dark"
                        ? "bg-gray-700 text-white"
                        : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    {bmi ? bmi : "Enter height & weight"}
                  </div>
                </div>

                <div>
                  <label
                    className={`block ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    } font-medium mb-2`}
                  >
                    Common Health Conditions:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(commonConditions).map(
                      ([condition, isActive]) => (
                        <button
                          key={condition}
                          type="button"
                          className={`p-2 rounded-lg border transition-colors ${
                            isActive
                              ? "bg-green-500 text-white border-green-500"
                              : theme === "dark"
                              ? "bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600"
                              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                          }`}
                          onClick={() => toggleCondition(condition)}
                          disabled={isLoading || isHealthLoading}
                        >
                          {condition.charAt(0).toUpperCase() +
                            condition.slice(1)}
                        </button>
                      )
                    )}
                  </div>
                </div>

                <div>
                  <label
                    className={`block ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    } font-medium mb-2`}
                  >
                    Other Conditions:
                  </label>
                  <textarea
                    value={conditions}
                    onChange={(e) => setConditions(e.target.value)}
                    placeholder="e.g., Diabetes, High Blood Pressure"
                    rows="3"
                    disabled={isLoading || isHealthLoading}
                    className={`w-full p-3 rounded-lg border ${
                      theme === "dark"
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300"
                    } focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                  />
                </div>

                <button
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  onClick={handleHealthSubmit}
                  disabled={isLoading || isHealthLoading || !prediction}
                >
                  <FaCheck className="mr-2" />
                  Get Health Recommendations
                </button>

                {healthError && !isHealthLoading && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {healthError}
                  </div>
                )}
              </div>
            </div>

            {/* Results Section */}
            <div
              className={`${
                theme === "dark" ? "bg-gray-800" : "bg-white"
              } rounded-xl shadow-lg p-6 relative`}
            >
              <FaCheck className="absolute top-4 right-4 text-green-500 text-2xl animate-pulse" />

              {prediction ? (
                <div>
                  <h2
                    className={`text-2xl font-bold ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    } mb-6`}
                  >
                    Prediction Results
                  </h2>

                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <span
                        className={`text-lg ${
                          theme === "dark" ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        Predicted Food:
                      </span>
                      <span className="text-xl font-bold text-green-500">
                        {prediction.class}
                      </span>
                    </div>

                    <div>
                      <h3
                        className={`text-lg font-semibold ${
                          theme === "dark" ? "text-white" : "text-gray-900"
                        } mb-3`}
                      >
                        Confidence Scores
                      </h3>
                      {prediction.top_classes &&
                        prediction.top_classes.map((item, index) => (
                          <div key={index} className="mb-3">
                            <div className="flex justify-between items-center mb-1">
                              <span
                                className={`${
                                  theme === "dark"
                                    ? "text-gray-300"
                                    : "text-gray-700"
                                }`}
                              >
                                {item.class}
                              </span>
                              <span
                                className={`font-semibold ${
                                  theme === "dark"
                                    ? "text-white"
                                    : "text-gray-900"
                                }`}
                              >
                                {(item.confidence * 100).toFixed(1)}%
                              </span>
                            </div>
                            <div
                              className={`w-full ${
                                theme === "dark" ? "bg-gray-700" : "bg-gray-200"
                              } rounded-full h-2`}
                            >
                              <div
                                className="bg-green-500 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${item.confidence * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Health Information */}
                  {isHealthLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-4"></div>
                      <p
                        className={`${
                          theme === "dark" ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        Fetching health recommendations...
                      </p>
                    </div>
                  ) : healthInfo ? (
                    <div className="border-t pt-6">
                      <h3
                        className={`text-lg font-semibold ${
                          theme === "dark" ? "text-white" : "text-gray-900"
                        } mb-4`}
                      >
                        Health Information for {prediction?.class}
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <h4
                            className={`font-medium ${
                              theme === "dark"
                                ? "text-green-400"
                                : "text-green-600"
                            } mb-2`}
                          >
                            Health Benefits:
                          </h4>
                          <p
                            className={`${
                              theme === "dark"
                                ? "text-gray-300"
                                : "text-gray-700"
                            }`}
                          >
                            {healthInfo.health_benefits}
                          </p>
                        </div>
                        <div>
                          <h4
                            className={`font-medium ${
                              theme === "dark"
                                ? "text-green-400"
                                : "text-green-600"
                            } mb-2`}
                          >
                            Recommendation:
                          </h4>
                          <p
                            className={`${
                              theme === "dark"
                                ? "text-gray-300"
                                : "text-gray-700"
                            }`}
                          >
                            {healthInfo.recommendation}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              ) : (
                <div className="text-center py-12">
                  <h2
                    className={`text-2xl font-bold ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    } mb-4`}
                  >
                    Prediction Results
                  </h2>
                  <div
                    className={`h-32 flex items-center justify-center ${
                      theme === "dark" ? "bg-gray-700" : "bg-gray-100"
                    } rounded-lg`}
                  >
                    <p
                      className={`${
                        theme === "dark" ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      {isLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-4"></div>
                          Analyzing image...
                        </>
                      ) : (
                        "Prediction results will appear here"
                      )}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
