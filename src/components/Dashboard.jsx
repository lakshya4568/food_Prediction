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

const Dashboard = () => {
  const handleTakePhoto = () => {
    // Navigate to NutriVision page
    window.location.hash = "nutrivision";
  };

  const handleLogout = () => {
    // Handle logout logic
    window.location.hash = "landing";
  };

  const goBack = () => {
    window.location.hash = "landing";
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
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
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                <span className="text-gray-800">Nutri</span>
                <span className="text-primary-600">Vision</span>
              </h1>
              <p className="text-sm text-gray-600">Dashboard</p>
            </div>

            <div className="flex items-center space-x-4">
              <button className="text-gray-600 hover:text-gray-800 transition-colors">
                <FaBell className="text-xl" />
              </button>
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-gray-800 transition-colors"
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
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome back, User!
          </h2>
          <p className="text-gray-600">
            Let's continue your healthy nutrition journey.
          </p>
        </div>

        {/* Quick Action Button */}
        <div className="mb-8">
          <button
            onClick={handleTakePhoto}
            className="w-full sm:w-auto bg-gradient-to-r from-primary-600 to-green-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:from-primary-700 hover:to-green-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-3"
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
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mr-4">
                  <div className="text-primary-600 text-xl">{stat.icon}</div>
                </div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {stat.title}
                </h3>
              </div>
              <div className="space-y-2">
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.target}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Meals */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-800">Recent Meals</h3>
            <button className="text-primary-600 hover:text-primary-700 font-medium">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {recentMeals.map((meal, index) => (
              <div
                key={index}
                className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <img
                  src={meal.image}
                  alt={meal.food}
                  className="w-16 h-16 rounded-xl object-cover"
                />
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800">{meal.food}</h4>
                  <p className="text-sm text-gray-600">{meal.time}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-800">{meal.calories}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Progress Chart Placeholder */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-6">
            Weekly Progress
          </h3>
          <div className="h-64 bg-gradient-to-br from-primary-50 to-green-50 rounded-xl flex items-center justify-center">
            <div className="text-center">
              <FaChartLine className="text-4xl text-primary-600 mx-auto mb-4" />
              <p className="text-gray-600">
                Chart visualization would be implemented here
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Weekly nutrition tracking and trends
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Navigation (Mobile) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
        <div className="flex justify-around">
          <button className="flex flex-col items-center py-2 px-4 text-primary-600">
            <FaChartLine className="text-xl mb-1" />
            <span className="text-xs">Dashboard</span>
          </button>
          <button
            onClick={handleTakePhoto}
            className="flex flex-col items-center py-2 px-4 text-gray-600"
          >
            <FaCamera className="text-xl mb-1" />
            <span className="text-xs">Scan</span>
          </button>
          <button className="flex flex-col items-center py-2 px-4 text-gray-600">
            <FaHistory className="text-xl mb-1" />
            <span className="text-xs">History</span>
          </button>
          <button className="flex flex-col items-center py-2 px-4 text-gray-600">
            <FaUserCog className="text-xl mb-1" />
            <span className="text-xs">Profile</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Dashboard;
