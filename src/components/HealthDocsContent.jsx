"use client";

import { useState } from "react";
import {
  FaFileAlt,
  FaDownload,
  FaEye,
  FaCalendarAlt,
  FaChartLine,
} from "react-icons/fa";

export default function HealthDocsContent() {
  const [documents, setDocuments] = useState([
    {
      id: 1,
      title: "Weekly Nutrition Report",
      type: "PDF",
      date: "2025-08-01",
      size: "2.3 MB",
      description: "Comprehensive analysis of weekly nutritional intake",
    },
    {
      id: 2,
      title: "Monthly Health Summary",
      type: "PDF",
      date: "2025-07-31",
      size: "1.8 MB",
      description: "Monthly overview of health metrics and progress",
    },
    {
      id: 3,
      title: "BMI Tracking Chart",
      type: "PNG",
      date: "2025-07-28",
      size: "450 KB",
      description: "Visual representation of BMI changes over time",
    },
  ]);

  const [healthMetrics, setHealthMetrics] = useState({
    currentBMI: 22.5,
    weeklyCalorieAvg: 2150,
    exerciseHours: 5.5,
    waterIntake: 2.1,
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Health Documents
          </h1>
          <p className="text-gray-600">
            View and download your health reports, nutrition analyses, and
            progress tracking documents
          </p>
        </div>

        {/* Quick Health Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <FaChartLine className="text-blue-500 text-xl mr-3" />
              <div>
                <p className="text-sm text-gray-600">Current BMI</p>
                <p className="text-2xl font-bold text-gray-900">
                  {healthMetrics.currentBMI}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <span className="text-green-500 text-xl mr-3">🔥</span>
              <div>
                <p className="text-sm text-gray-600">Avg Calories/Week</p>
                <p className="text-2xl font-bold text-gray-900">
                  {healthMetrics.weeklyCalorieAvg}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <span className="text-purple-500 text-xl mr-3">💪</span>
              <div>
                <p className="text-sm text-gray-600">Exercise (hrs/week)</p>
                <p className="text-2xl font-bold text-gray-900">
                  {healthMetrics.exerciseHours}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <span className="text-cyan-500 text-xl mr-3">💧</span>
              <div>
                <p className="text-sm text-gray-600">Water (L/day)</p>
                <p className="text-2xl font-bold text-gray-900">
                  {healthMetrics.waterIntake}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Documents List */}
        <div className="bg-white rounded-lg shadow-lg">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                <FaFileAlt className="mr-2 text-blue-500" />
                Your Health Documents
              </h2>
              <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                Generate New Report
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="space-y-4">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FaFileAlt className="text-blue-500 text-xl" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{doc.title}</h3>
                      <p className="text-sm text-gray-500">{doc.description}</p>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-xs text-gray-400 flex items-center">
                          <FaCalendarAlt className="mr-1" />
                          {doc.date}
                        </span>
                        <span className="text-xs text-gray-400">
                          {doc.type} • {doc.size}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="p-2 text-gray-500 hover:text-blue-500 transition-colors">
                      <FaEye />
                    </button>
                    <button className="p-2 text-gray-500 hover:text-green-500 transition-colors">
                      <FaDownload />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State Message */}
            {documents.length === 0 && (
              <div className="text-center py-12">
                <FaFileAlt className="mx-auto text-4xl text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No documents yet
                </h3>
                <p className="text-gray-500 mb-4">
                  Start tracking your nutrition to generate health reports
                </p>
                <button className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                  Generate Your First Report
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
