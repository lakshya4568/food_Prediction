"use client";

import { useEffect, useState } from "react";
import { FaShoppingCart, FaPlus, FaCheck, FaTrash } from "react-icons/fa";
import { useAuth } from "./AuthContext";

export default function GroceryContent() {
  const { initialized } = useAuth();
  const [groceryItems, setGroceryItems] = useState([]);

  const [aggregated, setAggregated] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [genError, setGenError] = useState(null);

  // Add Item modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [addError, setAddError] = useState(0);
  const [form, setForm] = useState({
    name: "",
    quantity: "1",
    unit: "pc",
    category: "",
    price: "0",
  });

  const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || ""; // same-origin

  const loadItems = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/grocery/items`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setGroceryItems(Array.isArray(data.items) ? data.items : []);
    } catch (e) {
      console.error("load grocery items error", e);
    }
  };

  useEffect(() => {
    if (initialized) loadItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialized]);

  const toggleCompleted = async (id, current) => {
    try {
      const res = await fetch(`${API_BASE}/api/grocery/items/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ completed: !current }),
      });
      if (!res.ok) throw new Error(await res.text());
      const { item } = await res.json();
      setGroceryItems((prev) => prev.map((i) => (i.id === id ? item : i)));
    } catch (e) {
      console.error("toggle completed error", e);
    }
  };

  // Ensure numeric coercion for prices when summing
  const totalCost = groceryItems.reduce((sum, item) => {
    const priceNum =
      typeof item.price === "number"
        ? item.price
        : parseFloat(item.price ?? "0");
    return sum + (Number.isFinite(priceNum) ? priceNum : 0);
  }, 0);
  const completedItems = groceryItems.filter((item) => item.completed).length;

  const toAggregatePayload = () => {
    // Naive parse: split quantity into number + unit when possible, else treat as piece count
    return groceryItems.map((i) => {
      const q =
        typeof i.quantity === "number"
          ? String(i.quantity)
          : String(i.quantity || "1");
      const m = q.match(/^(\d+(?:\.\d+)?)\s*(.*)$/);
      return {
        name: i.name,
        category: i.category,
        quantity: m ? parseFloat(m[1]) : 1,
        unit: m ? m[2].trim() : i.unit || "pc",
      };
    });
  };

  const handleGenerate = async () => {
    try {
      setIsGenerating(true);
      setGenError(null);
      setAggregated([]);
      const resp = await fetch(`${API_BASE}/api/grocery/aggregate`, {
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

  const openAddModal = () => {
    setAddError("");
    setForm({ name: "", quantity: "1", unit: "pc", category: "", price: "0" });
    setShowAddModal(true);
  };

  const closeAddModal = () => {
    setShowAddModal(false);
  };

  const handleSubmitAdd = async (e) => {
    e?.preventDefault?.();
    setAddError("");
    const name = String(form.name || "").trim();
    const qty = parseFloat(String(form.quantity || "").trim());
    const unit = String(form.unit || "").trim() || "pc";
    const category = String(form.category || "").trim();
    const price = parseFloat(String(form.price || "").trim());

    if (!name) {
      setAddError("Name is required");
      return;
    }
    if (!Number.isFinite(qty) || qty <= 0) {
      setAddError("Quantity must be a positive number");
      return;
    }
    if (!Number.isFinite(price) || price < 0) {
      setAddError("Price must be a valid number (>= 0)");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/grocery/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name, category, quantity: qty, unit, price }),
      });
      if (!res.ok) throw new Error(await res.text());
      const { item } = await res.json();
      setGroceryItems((prev) => [item, ...prev]);
      setShowAddModal(false);
      setForm({
        name: "",
        quantity: "1",
        unit: "pc",
        category: "",
        price: "0",
      });
    } catch (e) {
      console.error("add item error", e);
      setAddError(e.message || "Failed to add item");
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/api/grocery/items/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error(await res.text());
      setGroceryItems((prev) => prev.filter((i) => i.id !== id));
    } catch (e) {
      console.error("delete item error", e);
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
                <button
                  onClick={openAddModal}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center"
                >
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
                      onClick={() => toggleCompleted(item.id, item.completed)}
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
                        {item.category || ""} • {item.quantity}
                        {item.unit ? ` ${item.unit}` : ""}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {typeof item.price === "number" && (
                      <span className="font-medium text-gray-900">
                        ${item.price.toFixed(2)}
                      </span>
                    )}
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    >
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

        {/* Add Item Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
              className="absolute inset-0 bg-black/40"
              onClick={closeAddModal}
              aria-hidden="true"
            />
            <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  Add Grocery Item
                </h3>
              </div>
              <form onSubmit={handleSubmitAdd} className="px-6 py-4 space-y-4">
                {addError ? (
                  <div className="bg-red-50 border border-red-200 text-red-700 p-2 rounded text-sm">
                    {addError}
                  </div>
                ) : null}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, name: e.target.value }))
                    }
                    className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    placeholder="e.g., Chicken Breast"
                    required
                  />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Quantity
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={form.quantity}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, quantity: e.target.value }))
                      }
                      className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Unit
                    </label>
                    <input
                      type="text"
                      value={form.unit}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, unit: e.target.value }))
                      }
                      className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                      placeholder="pc, g, ml, kg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Price ($)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={form.price}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, price: e.target.value }))
                      }
                      className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Category
                  </label>
                  <input
                    type="text"
                    value={form.category}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, category: e.target.value }))
                    }
                    className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    placeholder="e.g., Produce, Meat, Dairy"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={closeAddModal}
                    className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700"
                  >
                    Save Item
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
