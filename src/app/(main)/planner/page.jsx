"use client";

import { useState } from "react";
import { FaCalendarAlt, FaPlus, FaEdit, FaTrash } from "react-icons/fa";

export default function PlannerPage() {
  const [meals, setMeals] = useState([
    {
      id: 1,
      date: "2025-08-05",
      mealType: "breakfast",
      foodItem: "Oatmeal with berries",
      calories: 320,
    },
    {
      id: 2,
      date: "2025-08-05",
      mealType: "lunch",
      foodItem: "Grilled chicken salad",
      calories: 450,
    },
  ]);

  return (
    <div className="bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Meal Planner
            </h1>
            <p className="text-gray-600">
              Plan your meals for the week and track your nutrition goals
            </p>
          </div>

          {/* Planning Calendar View */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                <FaCalendarAlt className="mr-2 text-blue-500" />
                This Week's Plan
              </h2>
              <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center">
                <FaPlus className="mr-2" />
                Add Meal
              </button>
            </div>

            {/* Meal List */}
            <div className="space-y-4">
              {meals.map((meal) => (
                <div
                  key={meal.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-4">
                      <div className="text-sm font-medium text-blue-600 capitalize">
                        {meal.mealType}
                      </div>
                      <div className="text-gray-900 font-medium">
                        {meal.foodItem}
                      </div>
                      <div className="text-sm text-gray-500">
                        {meal.calories} calories
                      </div>
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {meal.date}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="p-2 text-gray-500 hover:text-blue-500 transition-colors">
                      <FaEdit />
                    </button>
                    <button className="p-2 text-gray-500 hover:text-red-500 transition-colors">
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Weekly Summary */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">
                  Total Calories
                </h3>
                <p className="text-2xl font-bold text-blue-600">
                  {meals.reduce((sum, meal) => sum + meal.calories, 0)}
                </p>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <h3 className="font-semibold text-green-900 mb-2">
                  Meals Planned
                </h3>
                <p className="text-2xl font-bold text-green-600">
                  {meals.length}
                </p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <h3 className="font-semibold text-purple-900 mb-2">
                  Days Covered
                </h3>
                <p className="text-2xl font-bold text-purple-600">
                  {new Set(meals.map((meal) => meal.date)).size}
                </p>
              </div>
            </div>
          </div>
      </div>
    </div>
  );
}
