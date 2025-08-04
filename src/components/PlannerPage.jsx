import React from "react";
import { useNavigate } from "react-router-dom";
import { FaCalendarAlt, FaUtensils, FaChartLine, FaArrowLeft } from "react-icons/fa";

const PlannerPage = () => {
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
                  Meal
                </span>
                <span className="text-primary-600 dark:text-primary-400">
                  Planner
                </span>
              </h1>
              <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
                Plan your nutrition journey
              </p>
            </div>

            <div className="w-20"></div> {/* Spacer for balance */}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center space-y-6">
          <div className="mx-auto w-24 h-24 bg-primary-100 dark:bg-primary-800/50 rounded-full flex items-center justify-center">
            <FaCalendarAlt className="text-4xl text-primary-600 dark:text-primary-400" />
          </div>
          
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-text-dark dark:text-text-light">
              Meal Planner
            </h2>
            <p className="text-lg text-text-muted-light dark:text-text-muted-dark max-w-2xl mx-auto">
              Plan your meals ahead of time, set nutrition goals, and track your progress throughout the week. 
              Create custom meal plans that fit your dietary preferences and health objectives.
            </p>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="card text-center p-6">
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-800/50 rounded-xl flex items-center justify-center mx-auto mb-4">
                <FaUtensils className="text-2xl text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="text-lg font-semibold text-text-dark dark:text-text-light mb-2">
                Weekly Meal Planning
              </h3>
              <p className="text-text-muted-light dark:text-text-muted-dark">
                Plan your entire week's meals in advance with nutritional analysis
              </p>
            </div>

            <div className="card text-center p-6">
              <div className="w-12 h-12 bg-secondary-100 dark:bg-secondary-800/50 rounded-xl flex items-center justify-center mx-auto mb-4">
                <FaChartLine className="text-2xl text-secondary-600 dark:text-secondary-400" />
              </div>
              <h3 className="text-lg font-semibold text-text-dark dark:text-text-light mb-2">
                Nutrition Goals
              </h3>
              <p className="text-text-muted-light dark:text-text-muted-dark">
                Set and track daily nutrition targets for optimal health
              </p>
            </div>

            <div className="card text-center p-6">
              <div className="w-12 h-12 bg-accent-100 dark:bg-accent-800/50 rounded-xl flex items-center justify-center mx-auto mb-4">
                <FaCalendarAlt className="text-2xl text-accent-600 dark:text-accent-400" />
              </div>
              <h3 className="text-lg font-semibold text-text-dark dark:text-text-light mb-2">
                Smart Scheduling
              </h3>
              <p className="text-text-muted-light dark:text-text-muted-dark">
                Intelligent meal scheduling based on your preferences and goals
              </p>
            </div>
          </div>

          {/* Coming Soon Badge */}
          <div className="mt-8">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary-100 dark:bg-primary-800/50 text-primary-700 dark:text-primary-300 text-sm font-medium">
              🚀 Coming Soon - Full meal planning features
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PlannerPage;
