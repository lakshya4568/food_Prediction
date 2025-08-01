import React, { useState, useRef } from "react";
import {
  FaCamera,
  FaUpload,
  FaTimes,
  FaSpinner,
  FaCheck,
  FaExclamationTriangle,
  FaArrowLeft,
  FaRobot,
  FaHeart,
  FaWeight,
  FaRuler,
  FaCalculator,
} from "react-icons/fa";

const NutriVision = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [healthInfo, setHealthInfo] = useState(null);
  const [showHealthForm, setShowHealthForm] = useState(false);
  const fileInputRef = useRef(null);

  // Health form state
  const [healthData, setHealthData] = useState({
    height: "",
    weight: "",
    bmi: "",
    conditions: [],
  });

  const commonConditions = [
    "Diabetes",
    "High Blood Pressure",
    "Heart Disease",
    "Allergies",
    "Vegetarian",
    "Vegan",
    "Gluten-Free",
  ];

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
      setPrediction(null);
      setHealthInfo(null);
      setShowHealthForm(false);
      setError(null);
    }
  };

  const calculateBMI = (height, weight) => {
    if (height && weight) {
      const heightInMeters = height / 100;
      const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(1);
      setHealthData((prev) => ({ ...prev, bmi }));
      return bmi;
    }
    return "";
  };

  const handleHeightWeightChange = (field, value) => {
    setHealthData((prev) => {
      const newData = { ...prev, [field]: value };
      if (field === "height" || field === "weight") {
        newData.bmi = calculateBMI(
          field === "height" ? value : prev.height,
          field === "weight" ? value : prev.weight
        );
      }
      return newData;
    });
  };

  const toggleCondition = (condition) => {
    setHealthData((prev) => ({
      ...prev,
      conditions: prev.conditions.includes(condition)
        ? prev.conditions.filter((c) => c !== condition)
        : [...prev.conditions, condition],
    }));
  };

  const predictFood = async () => {
    if (!selectedImage) {
      setError("Please select an image first.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("image", selectedImage);

      const response = await fetch("http://localhost:5000/predict", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to predict food");
      }

      const result = await response.json();
      setPrediction(result);
      setShowHealthForm(true);
    } catch (err) {
      setError("Error predicting food: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getHealthInfo = async () => {
    if (!prediction || !healthData.height || !healthData.weight) {
      setError("Please fill in your health information.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:5000/get_health_info", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          food_name: prediction.predicted_class,
          height: healthData.height,
          weight: healthData.weight,
          bmi: healthData.bmi,
          conditions: healthData.conditions.join(", "),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get health information");
      }

      const result = await response.json();
      setHealthInfo(result);
    } catch (err) {
      setError("Error getting health info: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const resetAll = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setPrediction(null);
    setHealthInfo(null);
    setShowHealthForm(false);
    setError(null);
    setHealthData({
      height: "",
      weight: "",
      bmi: "",
      conditions: [],
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const goBack = () => {
    window.location.hash = "";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={goBack}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <FaArrowLeft />
              <span>Back to Home</span>
            </button>

            <div className="text-center">
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-1">
                <span className="bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                  🍽️ NutriVision
                </span>
              </h1>
              <p className="text-sm lg:text-base text-gray-600">
                AI-Powered Food Recognition & Nutrition Analysis
              </p>
            </div>

            <div className="w-24"></div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Display */}
        {error && (
          <div className="mb-8 bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
            <div className="flex items-center">
              <FaExclamationTriangle className="text-red-400 mr-3" />
              <p className="text-red-700">{error}</p>
              <button
                onClick={() => setError(null)}
                className="ml-auto text-red-400 hover:text-red-600"
              >
                <FaTimes />
              </button>
            </div>
          </div>
        )}

        {/* Upload and Analysis Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Upload Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
              <div className="flex items-center justify-center mb-6">
                <div className="bg-gradient-to-r from-emerald-500 to-blue-500 p-3 rounded-full">
                  <FaCamera className="text-white text-2xl" />
                </div>
              </div>

              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                Upload Food Image
              </h2>

              <div className="space-y-6">
                <div
                  className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer
                    ${
                      selectedImage
                        ? "border-emerald-400 bg-emerald-50"
                        : "border-gray-300 hover:border-emerald-400 hover:bg-emerald-50"
                    }`}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <div className="space-y-3">
                    <FaUpload className="text-4xl text-gray-400 mx-auto" />
                    <div>
                      <p className="text-gray-600 font-medium">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-sm text-gray-400">
                        PNG, JPG, JPEG up to 10MB
                      </p>
                    </div>
                    {selectedImage && (
                      <div className="flex items-center justify-center text-emerald-600">
                        <FaCheck className="mr-2" />
                        <span className="text-sm font-medium">
                          Image selected
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={predictFood}
                    disabled={!selectedImage || isLoading}
                    className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 text-white py-4 px-6 rounded-xl font-bold text-lg 
                      hover:from-emerald-600 hover:to-blue-600 disabled:from-gray-300 disabled:to-gray-400 
                      disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 
                      hover:shadow-lg disabled:hover:scale-100 disabled:hover:shadow-none"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <FaSpinner className="animate-spin mr-3" />
                        <FaRobot className="mr-2" />
                        Analyzing...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <FaRobot className="mr-2" />
                        Analyze Food
                      </div>
                    )}
                  </button>

                  <button
                    onClick={resetAll}
                    className="w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold 
                      hover:bg-gray-200 transition-colors duration-200"
                  >
                    🔄 Reset All
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Preview Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                Image Preview
              </h2>

              <div className="aspect-square bg-gray-50 rounded-xl overflow-hidden border-2 border-gray-100">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Food preview"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-400">
                    <div className="text-center">
                      <div className="text-6xl mb-4">🖼️</div>
                      <p className="text-lg font-medium">
                        Your image will appear here
                      </p>
                      <p className="text-sm">Upload an image to get started</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                AI Prediction
              </h2>

              {prediction ? (
                <div className="space-y-6">
                  <div className="text-center p-6 bg-gradient-to-br from-emerald-50 to-blue-50 rounded-xl">
                    <div className="text-4xl mb-3">🍽️</div>
                    <h3 className="text-2xl font-bold text-gray-800 capitalize mb-2">
                      {prediction.predicted_class}
                    </h3>
                    <div className="inline-flex items-center bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-semibold">
                      <FaCheck className="mr-2" />
                      {(prediction.confidence * 100).toFixed(1)}% Confidence
                    </div>
                  </div>

                  {prediction.all_predictions && (
                    <div className="space-y-3">
                      <h4 className="font-bold text-gray-700 text-center">
                        Detailed Analysis
                      </h4>
                      <div className="space-y-3">
                        {Object.entries(prediction.all_predictions)
                          .sort(([, a], [, b]) => b - a)
                          .slice(0, 3)
                          .map(([food, conf]) => (
                            <div
                              key={food}
                              className="bg-gray-50 rounded-lg p-3"
                            >
                              <div className="flex justify-between items-center mb-2">
                                <span className="capitalize font-medium text-gray-700">
                                  {food}
                                </span>
                                <span className="text-sm font-bold text-gray-600">
                                  {(conf * 100).toFixed(1)}%
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-gradient-to-r from-emerald-400 to-blue-500 h-2 rounded-full transition-all duration-1000"
                                  style={{ width: `${conf * 100}%` }}
                                ></div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}

                  {showHealthForm && (
                    <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
                      <p className="text-blue-800 text-center font-medium">
                        📊 Ready for nutritional analysis! Fill in your health
                        profile below.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center text-gray-400 py-12">
                  <div className="text-6xl mb-4">🤖</div>
                  <p className="text-lg font-medium mb-2">
                    Waiting for Analysis
                  </p>
                  <p className="text-sm">
                    Upload an image and click "Analyze Food" to see AI
                    predictions
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Health Information Section */}
        {showHealthForm && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Health Input Form */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <div className="flex items-center justify-center mb-6">
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-full">
                  <FaHeart className="text-white text-2xl" />
                </div>
              </div>

              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                Your Health Profile
              </h2>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-bold text-gray-700">
                      <FaRuler className="mr-2 text-blue-500" />
                      Height (cm)
                    </label>
                    <input
                      type="number"
                      value={healthData.height}
                      onChange={(e) =>
                        handleHeightWeightChange("height", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="170"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-bold text-gray-700">
                      <FaWeight className="mr-2 text-emerald-500" />
                      Weight (kg)
                    </label>
                    <input
                      type="number"
                      value={healthData.weight}
                      onChange={(e) =>
                        handleHeightWeightChange("weight", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                      placeholder="70"
                    />
                  </div>
                </div>

                {healthData.bmi && (
                  <div className="bg-gradient-to-r from-blue-50 to-emerald-50 p-4 rounded-xl border border-blue-200">
                    <div className="flex items-center">
                      <FaCalculator className="text-blue-600 mr-3" />
                      <p className="text-blue-800 font-bold">
                        BMI: <span className="text-2xl">{healthData.bmi}</span>
                      </p>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  <label className="block text-sm font-bold text-gray-700">
                    Health Conditions & Dietary Preferences
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {commonConditions.map((condition) => (
                      <button
                        key={condition}
                        onClick={() => toggleCondition(condition)}
                        className={`px-4 py-3 text-sm font-medium rounded-xl border-2 transition-all duration-200 ${
                          healthData.conditions.includes(condition)
                            ? "bg-emerald-100 border-emerald-400 text-emerald-700 shadow-md"
                            : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100 hover:border-gray-300"
                        }`}
                      >
                        {healthData.conditions.includes(condition) ? "✓ " : ""}
                        {condition}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={getHealthInfo}
                  disabled={
                    !healthData.height || !healthData.weight || isLoading
                  }
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-4 px-6 rounded-xl font-bold text-lg 
                    hover:from-blue-600 hover:to-purple-600 disabled:from-gray-300 disabled:to-gray-400 
                    disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 
                    hover:shadow-lg disabled:hover:scale-100 disabled:hover:shadow-none"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <FaSpinner className="animate-spin mr-3" />
                      Getting Health Info...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <FaHeart className="mr-2" />
                      Get Personalized Analysis
                    </div>
                  )}
                </button>
              </div>
            </div>

            {/* Health Information Display */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                Nutritional Analysis
              </h2>

              {healthInfo ? (
                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-emerald-50 to-blue-50 rounded-xl p-6 border border-emerald-200">
                    <div className="prose prose-sm text-gray-700 max-w-none">
                      <div
                        dangerouslySetInnerHTML={{
                          __html: healthInfo
                            .replace(/\n/g, "<br>")
                            .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>"),
                        }}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-400 py-12">
                  <div className="text-6xl mb-4">🧬</div>
                  <p className="text-lg font-medium mb-2">
                    Waiting for Analysis
                  </p>
                  <p className="text-sm">
                    Complete your health profile and click "Get Personalized
                    Analysis" to receive detailed nutritional insights
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">
              <span className="bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                NutriVision
              </span>
            </h3>
            <p className="text-gray-400 mb-4">
              Powered by AI • Built with ❤️ for your health
            </p>
            <p className="text-sm text-gray-500">
              © 2025 CyberKnights. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default NutriVision;
