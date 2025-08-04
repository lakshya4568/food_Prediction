import React from "react";
import { useNavigate } from "react-router-dom";
import { FaShoppingCart, FaAppleAlt, FaListUl, FaArrowLeft } from "react-icons/fa";

const GroceryPage = () => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-vibrant-overlay dark:bg-dark-overlay">
      {/* Header */}
      <header className="bg-surface-light/90 dark:bg-surface-dark/90 backdrop-blur-md shadow-lg dark:shadow-glow-green sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={goBack}
              className="flex items-center space-x-2 text-text-muted-light dark:text-text-muted-dark hover:text-text-dark dark:hover:text-text-light transition-colors"
            >
              <FaArrowLeft />
              <span>Back to Dashboard</span>
            </button>

            <div className="text-center">
              <h1 className="text-2xl lg:text-3xl font-bold text-text-dark dark:text-text-light">
                <span className="text-text-dark dark:text-text-light">
                  Grocery
                </span>
                <span className="text-primary-600 dark:text-primary-400">
                  Assistant
                </span>
              </h1>
              <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
                Smart shopping lists and nutrition insights
              </p>
            </div>

            <div className="w-20"></div> {/* Spacer for balance */}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center space-y-6">
          <div className="mx-auto w-24 h-24 bg-secondary-100 dark:bg-secondary-800/50 rounded-full flex items-center justify-center">
            <FaShoppingCart className="text-4xl text-secondary-600 dark:text-secondary-400" />
          </div>
          
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-text-dark dark:text-text-light">
              Smart Grocery Assistant
            </h2>
            <p className="text-lg text-text-muted-light dark:text-text-muted-dark max-w-2xl mx-auto">
              Generate intelligent shopping lists based on your meal plans, dietary preferences, and nutritional goals. 
              Get real-time nutritional analysis and budget-friendly suggestions.
            </p>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="card text-center p-6">
              <div className="w-12 h-12 bg-secondary-100 dark:bg-secondary-800/50 rounded-xl flex items-center justify-center mx-auto mb-4">
                <FaListUl className="text-2xl text-secondary-600 dark:text-secondary-400" />
              </div>
              <h3 className="text-lg font-semibold text-text-dark dark:text-text-light mb-2">
                Auto-Generated Lists
              </h3>
              <p className="text-text-muted-light dark:text-text-muted-dark">
                Create shopping lists automatically from your meal plans
              </p>
            </div>

            <div className="card text-center p-6">
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-800/50 rounded-xl flex items-center justify-center mx-auto mb-4">
                <FaAppleAlt className="text-2xl text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="text-lg font-semibold text-text-dark dark:text-text-light mb-2">
                Nutrition Analysis
              </h3>
              <p className="text-text-muted-light dark:text-text-muted-dark">
                Get nutritional breakdowns for your grocery selections
              </p>
            </div>

            <div className="card text-center p-6">
              <div className="w-12 h-12 bg-accent-100 dark:bg-accent-800/50 rounded-xl flex items-center justify-center mx-auto mb-4">
                <FaShoppingCart className="text-2xl text-accent-600 dark:text-accent-400" />
              </div>
              <h3 className="text-lg font-semibold text-text-dark dark:text-text-light mb-2">
                Smart Suggestions
              </h3>
              <p className="text-text-muted-light dark:text-text-muted-dark">
                Get healthy alternatives and budget-friendly options
              </p>
            </div>
          </div>

          {/* Sample Grocery Categories */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
            {[
              { name: "Fruits & Vegetables", icon: "🥬", count: "12 items" },
              { name: "Proteins", icon: "🥩", count: "8 items" },
              { name: "Dairy & Alternatives", icon: "🥛", count: "6 items" },
              { name: "Grains & Cereals", icon: "🌾", count: "5 items" },
            ].map((category, index) => (
              <div key={index} className="card p-4 text-center hover:shadow-lg dark:hover:shadow-glow-green transition-all duration-300">
                <div className="text-3xl mb-2">{category.icon}</div>
                <h4 className="font-semibold text-text-dark dark:text-text-light text-sm">
                  {category.name}
                </h4>
                <p className="text-xs text-text-muted-light dark:text-text-muted-dark mt-1">
                  {category.count}
                </p>
              </div>
            ))}
          </div>

          {/* Coming Soon Badge */}
          <div className="mt-8">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-secondary-100 dark:bg-secondary-800/50 text-secondary-700 dark:text-secondary-300 text-sm font-medium">
              🛒 Coming Soon - Full grocery management features
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default GroceryPage;
