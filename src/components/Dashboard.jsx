import React from "react";
import {
  FaCamera,
  FaChartLine,
  FaAppleAlt,
  FaTrophy,
  FaBell,
  FaHistory,
  FaUserCog,
  FaSignOutAlt,
  FaArrowLeft,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleTakePhoto = () => {
    navigate("/nutrivision");
  };

  const handleLogout = () => {
    // Handle logout logic
    navigate("/");
  };

  const goBack = () => {
    navigate("/");
  };

  const stats = [
    {
      icon: <FaChartLine />,
      title: "Today's Calories",
      value: "1,240 kcal",
      target: "2,000 kcal",
    },
    {
      icon: <FaAppleAlt />,
      title: "Meals Tracked",
      value: "3",
      target: "4 meals",
    },
    {
      icon: <FaTrophy />,
      title: "Streak",
      value: "7 days",
      target: "Keep going!",
    },
  ];

  const recentMeals = [
    {
      time: "Breakfast",
      food: "Greek Yogurt with Berries",
      calories: "280 kcal",
      image:
        "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=80&h=80&fit=crop&crop=center",
    },
    {
      time: "Lunch",
      food: "Grilled Chicken Salad",
      calories: "450 kcal",
      image:
        "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=80&h=80&fit=crop&crop=center",
    },
    {
      time: "Snack",
      food: "Mixed Nuts",
      calories: "200 kcal",
      image:
        "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=80&h=80&fit=crop&crop=center",
    },
  ];

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
              <span>Back to Home</span>
            </button>

            <div className="text-center">
              <h1 className="text-2xl lg:text-3xl font-bold text-text-dark dark:text-text-light">
                <span className="text-text-dark dark:text-text-light">Nutri</span>
                <span className="text-primary-600 dark:text-primary-400">Vision</span>
              </h1>
              <p className="text-sm text-text-muted-light dark:text-text-muted-dark">Dashboard</p>
            </div>

            <div className="flex items-center space-x-4">
              <button className="text-text-muted-light dark:text-text-muted-dark hover:text-text-dark dark:hover:text-text-light transition-colors">
                <FaBell className="text-xl" />
              </button>
              <button
                onClick={handleLogout}
                className="text-text-muted-light dark:text-text-muted-dark hover:text-text-dark dark:hover:text-text-light transition-colors"
              >
                <FaSignOutAlt className="text-xl" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-text-dark dark:text-text-light mb-2">
            Welcome back, User!
          </h2>
          <p className="text-text-muted-light dark:text-text-muted-dark">
            Let's continue your healthy nutrition journey.
          </p>
        </div>

        {/* Quick Action Button */}
        <div className="mb-8">
          <button
            onClick={handleTakePhoto}
            className="w-full sm:w-auto btn-primary px-8 py-4 text-lg flex items-center justify-center space-x-3"
          >
            <FaCamera className="text-2xl" />
            <span>Analyze New Food</span>
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="card hover:shadow-lg dark:hover:shadow-glow-green transition-all duration-300"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-800/50 rounded-xl flex items-center justify-center mr-4">
                  <div className="text-primary-600 dark:text-primary-400 text-xl">{stat.icon}</div>
                </div>
                <h3 className="text-lg font-semibold text-text-dark dark:text-text-light">
                  {stat.title}
                </h3>
              </div>
              <div className="space-y-2">
                <p className="text-3xl font-bold text-text-dark dark:text-text-light">{stat.value}</p>
                <p className="text-sm text-text-muted-light dark:text-text-muted-dark">{stat.target}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Meals */}
        <div className="card mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-text-dark dark:text-text-light">Recent Meals</h3>
            <button className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium transition-colors">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {recentMeals.map((meal, index) => (
              <div
                key={index}
                className="flex items-center space-x-4 p-4 bg-surface-hover-light dark:bg-surface-hover-dark rounded-xl hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-colors"
              >
                <img
                  src={meal.image}
                  alt={meal.food}
                  className="w-16 h-16 rounded-xl object-cover"
                />
                <div className="flex-1">
                  <h4 className="font-semibold text-text-dark dark:text-text-light">{meal.food}</h4>
                  <p className="text-sm text-text-muted-light dark:text-text-muted-dark">{meal.time}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-text-dark dark:text-text-light">{meal.calories}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Progress Chart Placeholder */}
        <div className="card">
          <h3 className="text-xl font-bold text-text-dark dark:text-text-light mb-6">
            Weekly Progress
          </h3>
          <div className="h-64 bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-900/30 dark:to-secondary-900/30 rounded-xl flex items-center justify-center">
            <div className="text-center">
              <FaChartLine className="text-4xl text-primary-600 dark:text-primary-400 mx-auto mb-4" />
              <p className="text-text-muted-light dark:text-text-muted-dark">
                Chart visualization would be implemented here
              </p>
              <p className="text-sm text-text-muted-light dark:text-text-muted-dark mt-2">
                Weekly nutrition tracking and trends
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Navigation (Mobile) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-surface-light dark:bg-surface-dark border-t border-primary-200 dark:border-primary-700 px-4 py-2">
        <div className="flex justify-around">
          <Link to="/dashboard" className="flex flex-col items-center py-2 px-4 text-primary-600 dark:text-primary-400">
            <FaChartLine className="text-xl mb-1" />
            <span className="text-xs">Dashboard</span>
          </Link>
          <button
            onClick={handleTakePhoto}
            className="flex flex-col items-center py-2 px-4 text-text-muted-light dark:text-text-muted-dark"
          >
            <FaCamera className="text-xl mb-1" />
            <span className="text-xs">Scan</span>
          </button>
          <Link to="#" className="flex flex-col items-center py-2 px-4 text-text-muted-light dark:text-text-muted-dark">
            <FaHistory className="text-xl mb-1" />
            <span className="text-xs">History</span>
          </Link>
          <Link to="#" className="flex flex-col items-center py-2 px-4 text-text-muted-light dark:text-text-muted-dark">
            <FaUserCog className="text-xl mb-1" />
            <span className="text-xs">Profile</span>
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default Dashboard;
