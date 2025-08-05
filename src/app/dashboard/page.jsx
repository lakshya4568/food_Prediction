"use client";

import { useState, useEffect } from "react";
import {
  FaCamera,
  FaChartLine,
  FaAppleAlt,
  FaTrophy,
  FaHistory,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    todayCalories: 0,
    mealsTracked: 0,
    streak: 0,
  });

  useEffect(() => {
    // Mock user data - in real app this would come from authentication
    setUser({
      name: "John Doe",
      email: "john@example.com",
    });

    // Mock stats - in real app this would come from API
    setStats({
      todayCalories: 1250,
      mealsTracked: 3,
      streak: 7,
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Welcome back{user ? `, ${user.name.split(" ")[0]}` : ""}! 👋
            </h1>
            <p className="text-gray-600 text-lg">
              Start tracking your nutrition by taking a photo of your food.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Link
              href="/predict"
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <FaCamera className="text-green-600 text-xl" />
                </div>
                <span className="text-green-500 group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Take a Photo
              </h3>
              <p className="text-gray-600 text-sm">
                Analyze your food with AI-powered nutrition detection
              </p>
            </Link>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FaHistory className="text-blue-600 text-xl" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                View History
              </h3>
              <p className="text-gray-600 text-sm">
                Check your previous meals and nutrition trends
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <FaCog className="text-purple-600 text-xl" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Settings
              </h3>
              <p className="text-gray-600 text-sm">
                Customize your nutrition goals and preferences
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">
                    Today&apos;s Calories
                  </p>
                  <p className="text-2xl font-bold">
                    {stats.todayCalories} kcal
                  </p>
                  <p className="text-green-100 text-xs mt-1">Goal: 2000 kcal</p>
                </div>
                <div className="w-12 h-12 bg-green-400 bg-opacity-30 rounded-lg flex items-center justify-center">
                  <FaChartLine className="text-xl" />
                </div>
              </div>
              <div className="mt-4">
                <div className="bg-green-400 bg-opacity-30 rounded-full h-2">
                  <div
                    className="bg-white rounded-full h-2 transition-all duration-500"
                    style={{
                      width: `${Math.min(
                        (stats.todayCalories / 2000) * 100,
                        100
                      )}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">
                    Meals Tracked
                  </p>
                  <p className="text-2xl font-bold">{stats.mealsTracked}</p>
                  <p className="text-blue-100 text-xs mt-1">Today</p>
                </div>
                <div className="w-12 h-12 bg-blue-400 bg-opacity-30 rounded-lg flex items-center justify-center">
                  <FaAppleAlt className="text-xl" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">
                    Current Streak
                  </p>
                  <p className="text-2xl font-bold">{stats.streak} days</p>
                  <p className="text-purple-100 text-xs mt-1">Keep it up!</p>
                </div>
                <div className="w-12 h-12 bg-purple-400 bg-opacity-30 rounded-lg flex items-center justify-center">
                  <FaTrophy className="text-xl" />
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Recent Activity
            </h2>
            <div className="space-y-4">
              {[
                {
                  food: "Pizza",
                  time: "2 hours ago",
                  calories: 450,
                  confidence: "95%",
                },
                {
                  food: "Steak",
                  time: "5 hours ago",
                  calories: 350,
                  confidence: "92%",
                },
                {
                  food: "Sushi",
                  time: "1 day ago",
                  calories: 250,
                  confidence: "98%",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <FaAppleAlt className="text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{item.food}</p>
                      <p className="text-sm text-gray-500">{item.time}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">
                      {item.calories} kcal
                    </p>
                    <p className="text-sm text-green-600">
                      {item.confidence} confidence
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <button className="text-green-600 hover:text-green-700 font-medium">
                View All History
              </button>
            </div>
          </div>

          {/* Nutrition Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Today&apos;s Nutrition Breakdown
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Carbohydrates</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: "60%" }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">60%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Protein</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: "25%" }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">25%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Fat</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-yellow-500 h-2 rounded-full"
                        style={{ width: "15%" }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">15%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Weekly Goals
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Track 5 meals/day</span>
                  <span className="text-green-600 font-medium">4/5 ✓</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Stay under 2000 kcal</span>
                  <span className="text-green-600 font-medium">✓</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">7-day streak</span>
                  <span className="text-green-600 font-medium">✓</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
