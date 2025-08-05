"use client";

import { useState } from "react";
import { FaShoppingCart, FaPlus, FaCheck, FaTrash } from "react-icons/fa";

export default function GroceryPage() {
  const [groceryItems, setGroceryItems] = useState([
    {
      id: 1,
      name: "Organic Oats",
      category: "Grains",
      quantity: "1 lb",
      completed: false,
      price: 4.99,
    },
    {
      id: 2,
      name: "Fresh Blueberries",
      category: "Fruits",
      quantity: "1 cup",
      completed: true,
      price: 3.49,
    },
    {
      id: 3,
      name: "Chicken Breast",
      category: "Protein",
      quantity: "2 lbs",
      completed: false,
      price: 8.99,
    },
  ]);

  const toggleCompleted = (id) => {
    setGroceryItems(
      groceryItems.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const totalCost = groceryItems.reduce((sum, item) => sum + item.price, 0);
  const completedItems = groceryItems.filter((item) => item.completed).length;

  return (
    <div className="bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Grocery List
            </h1>
            <p className="text-gray-600">
              Manage your shopping list based on your meal plans
            </p>
          </div>

          {/* Shopping Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center">
                <FaShoppingCart className="text-blue-500 text-xl mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Total Items</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {groceryItems.length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center">
                <FaCheck className="text-green-500 text-xl mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {completedItems}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center">
                <span className="text-purple-500 text-xl mr-3">$</span>
                <div>
                  <p className="text-sm text-gray-600">Estimated Total</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${totalCost.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Grocery List */}
          <div className="bg-white rounded-lg shadow-lg">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-800">
                  Shopping List
                </h2>
                <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center">
                  <FaPlus className="mr-2" />
                  Add Item
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-3">
                {groceryItems.map((item) => (
                  <div
                    key={item.id}
                    className={`flex items-center justify-between p-4 border rounded-lg transition-colors ${
                      item.completed
                        ? "bg-green-50 border-green-200"
                        : "bg-white border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => toggleCompleted(item.id)}
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                          item.completed
                            ? "bg-green-500 border-green-500 text-white"
                            : "border-gray-300 hover:border-green-400"
                        }`}
                      >
                        {item.completed && <FaCheck className="text-xs" />}
                      </button>
                      <div>
                        <h3
                          className={`font-medium ${
                            item.completed
                              ? "text-green-800 line-through"
                              : "text-gray-900"
                          }`}
                        >
                          {item.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {item.category} • {item.quantity}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="font-medium text-gray-900">
                        ${item.price.toFixed(2)}
                      </span>
                      <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}
