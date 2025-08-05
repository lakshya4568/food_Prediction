"use client";

import { useState } from "react";
import {
  FaCog,
  FaUser,
  FaBell,
  FaShieldAlt,
  FaPalette,
  FaLanguage,
  FaSave,
} from "react-icons/fa";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    // Profile Settings
    name: "John Doe",
    email: "john@example.com",
    age: 30,
    height: 175, // cm
    weight: 70, // kg
    activityLevel: "moderate",

    // Notification Settings
    emailNotifications: true,
    pushNotifications: false,
    weeklyReports: true,
    mealReminders: true,

    // Privacy Settings
    dataSharing: false,
    analyticsOptIn: true,

    // Appearance Settings
    theme: "light",
    language: "en",
  });

  const handleSettingChange = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = () => {
    // In a real app, this would save to a backend
    console.log("Settings saved:", settings);
    alert("Settings saved successfully!");
  };

  return (
    <div className="bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
            <p className="text-gray-600">
              Manage your account preferences and application settings
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Settings Navigation */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Settings Categories
                </h2>
                <nav className="space-y-2">
                  <a
                    href="#profile"
                    className="flex items-center px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <FaUser className="mr-3 text-blue-500" />
                    Profile
                  </a>
                  <a
                    href="#notifications"
                    className="flex items-center px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <FaBell className="mr-3 text-green-500" />
                    Notifications
                  </a>
                  <a
                    href="#privacy"
                    className="flex items-center px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <FaShieldAlt className="mr-3 text-red-500" />
                    Privacy
                  </a>
                  <a
                    href="#appearance"
                    className="flex items-center px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <FaPalette className="mr-3 text-purple-500" />
                    Appearance
                  </a>
                </nav>
              </div>
            </div>

            {/* Settings Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Profile Settings */}
              <div id="profile" className="bg-white rounded-lg shadow">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <FaUser className="mr-2 text-blue-500" />
                    Profile Settings
                  </h3>
                </div>
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={settings.name}
                        onChange={(e) =>
                          handleSettingChange("name", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={settings.email}
                        onChange={(e) =>
                          handleSettingChange("email", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Age
                      </label>
                      <input
                        type="number"
                        value={settings.age}
                        onChange={(e) =>
                          handleSettingChange("age", parseInt(e.target.value))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Activity Level
                      </label>
                      <select
                        value={settings.activityLevel}
                        onChange={(e) =>
                          handleSettingChange("activityLevel", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="sedentary">Sedentary</option>
                        <option value="light">Light</option>
                        <option value="moderate">Moderate</option>
                        <option value="active">Active</option>
                        <option value="very-active">Very Active</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notification Settings */}
              <div id="notifications" className="bg-white rounded-lg shadow">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <FaBell className="mr-2 text-green-500" />
                    Notification Preferences
                  </h3>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">
                        Email Notifications
                      </h4>
                      <p className="text-sm text-gray-500">
                        Receive updates via email
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.emailNotifications}
                        onChange={(e) =>
                          handleSettingChange(
                            "emailNotifications",
                            e.target.checked
                          )
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">
                        Push Notifications
                      </h4>
                      <p className="text-sm text-gray-500">
                        Receive mobile push notifications
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.pushNotifications}
                        onChange={(e) =>
                          handleSettingChange(
                            "pushNotifications",
                            e.target.checked
                          )
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Privacy Settings */}
              <div id="privacy" className="bg-white rounded-lg shadow">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <FaShieldAlt className="mr-2 text-red-500" />
                    Privacy & Security
                  </h3>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">
                        Data Sharing
                      </h4>
                      <p className="text-sm text-gray-500">
                        Share anonymized data for research
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.dataSharing}
                        onChange={(e) =>
                          handleSettingChange("dataSharing", e.target.checked)
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Appearance Settings */}
              <div id="appearance" className="bg-white rounded-lg shadow">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <FaPalette className="mr-2 text-purple-500" />
                    Appearance
                  </h3>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Theme
                    </label>
                    <select
                      value={settings.theme}
                      onChange={(e) =>
                        handleSettingChange("theme", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                      <option value="system">System Default</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Language
                    </label>
                    <select
                      value={settings.language}
                      onChange={(e) =>
                        handleSettingChange("language", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="bg-white rounded-lg shadow p-6">
                <button
                  onClick={handleSave}
                  className="w-full bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center"
                >
                  <FaSave className="mr-2" />
                  Save All Settings
                </button>
              </div>
            </div>
          </div>
      </div>
    </div>
  );
}

