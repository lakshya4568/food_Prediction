"use client";

import { useState } from "react";
import { FaShoppingCart, FaPlus, FaCheck, FaTrash } from "react-icons/fa";

export default function GroceryContent() {
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

  const [aggregated, setAggregated] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [genError, setGenError] = useState(null);

  const toggleCompleted = (id) => {
    setGroceryItems(
      groceryItems.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const totalCost = groceryItems.reduce((sum, item) => sum + item.price, 0);
  const completedItems = groceryItems.filter((item) => item.completed).length;

  const toAggregatePayload = () => {
    // Naive parse: split quantity into number + unit when possible, else treat as piece count
    return groceryItems.map((i) => {
      const m = String(i.quantity || "1").match(/^(\d+(?:\.\d+)?)\s*(.*)$/);
      return {
        name: i.name,
        category: i.category,
        quantity: m ? parseFloat(m[1]) : 1,
        unit: m ? m[2].trim() : "pc",
      };
    });
  };

  const handleGenerate = async () => {
    try {
      setIsGenerating(true);
      setGenError(null);
      setAggregated([]);
      const nodeBase =
        process.env.NEXT_PUBLIC_NODE_API_BASE || "http://localhost:3001";
      const resp = await fetch(`${nodeBase}/api/grocery/aggregate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ items: toAggregatePayload() }),
      });
      if (!resp.ok) {
        const text = await resp.text();
        throw new Error(text || `HTTP ${resp.status}`);
      }
      const data = await resp.json();
      setAggregated(Array.isArray(data.items) ? data.items : []);
    } catch (e) {
      console.error("Generate grocery error", e);
      setGenError(e.message || "Failed to generate grocery list");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExport = async () => {
    const lines = (aggregated.length ? aggregated : toAggregatePayload()).map(
      (i) => `- ${i.name} — ${i.quantity}${i.unit ? " " + i.unit : ""}`
    );
    const text = `Grocery List\n\n${lines.join("\n")}`;
    try {
      await navigator.clipboard.writeText(text);
      alert("Grocery list copied to clipboard");
    } catch (e) {
      console.error("Clipboard error", e);
    }
  };

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
              <div className="flex gap-2">
                <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center">
                  <FaPlus className="mr-2" />
                  Add Item
                </button>
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {isGenerating ? "Generating…" : "Generate Consolidated"}
                </button>
                <button
                  onClick={handleExport}
                  className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900 transition-colors"
                >
                  Export
                </button>
              </div>
            </div>
          </div>

          <div className="p-6">
            {genError && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 p-3 rounded">
                {genError}
              </div>
            )}
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

        {/* Aggregated Result */}
        <div className="bg-white rounded-lg shadow-lg mt-6">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">
              Consolidated List
            </h2>
          </div>
          <div className="p-6">
            {isGenerating ? (
              <div className="text-gray-600">Generating...</div>
            ) : aggregated.length ? (
              <ul className="list-disc pl-6 space-y-1">
                {aggregated.map((i, idx) => (
                  <li
                    key={`${i.name}-${i.unit}-${idx}`}
                    className="text-gray-800"
                  >
                    {i.name} — {i.quantity}
                    {i.unit ? ` ${i.unit}` : ""}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-gray-500">No consolidated items yet.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
