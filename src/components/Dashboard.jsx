import React, { useState } from "react";
import {
  FaCamera,
  FaChartLine,
  FaAppleAlt,
  FaTrophy,
  FaBell,
  FaHistory,
  FaUserCog,
  FaSignOutAlt,
} from "react-icons/fa";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const handleTakePhoto = () => {
    // Navigate to camera/photo upload functionality
    alert("Camera functionality would be implemented here");
  };

  const handleLogout = () => {
    // Handle logout logic
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

  return (
    <div className="dashboard-page">
      {/* Header */}
      <header>
        <div className="container">
          <div className="logo">
            <h1>
              Nutri<span>Vision</span>
            </h1>
          </div>
          <nav>
            <ul className="menu">
              <li>
                <a
                  href="#dashboard"
                  className={activeTab === "dashboard" ? "active" : ""}
                  onClick={() => setActiveTab("dashboard")}
                >
                  Dashboard
                </a>
              </li>
              <li>
                <a
                  href="#nutrition"
                  className={activeTab === "nutrition" ? "active" : ""}
                  onClick={() => setActiveTab("nutrition")}
                >
                  Nutrition
                </a>
              </li>
              <li>
                <a
                  href="#history"
                  className={activeTab === "history" ? "active" : ""}
                  onClick={() => setActiveTab("history")}
                >
                  History
                </a>
              </li>
              <li>
                <a
                  href="#settings"
                  className={activeTab === "settings" ? "active" : ""}
                  onClick={() => setActiveTab("settings")}
                >
                  Settings
                </a>
              </li>
            </ul>
          </nav>
          <div className="user-menu">
            <button className="btn btn-outline" onClick={handleLogout}>
              <FaSignOutAlt /> Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-container">
        <div className="container">
          <div className="dashboard-header">
            <h2>Welcome to Your Dashboard</h2>
            <p>Start tracking your nutrition by taking a photo of your food.</p>
          </div>

          <div className="dashboard-actions">
            <button
              className="btn btn-primary btn-large"
              onClick={handleTakePhoto}
            >
              <FaCamera />
              Take a Photo
            </button>
          </div>

          <div className="dashboard-stats">
            {stats.map((stat, index) => (
              <div key={index} className="stat-card">
                <div className="stat-icon">{stat.icon}</div>
                <h3>{stat.title}</h3>
                <div className="stat-value">
                  <span className="current">{stat.value}</span>
                  <span className="target">/ {stat.target}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Activity Section */}
          <div className="dashboard-section">
            <h3>Recent Activity</h3>
            <div className="activity-list">
              <div className="activity-item">
                <div className="activity-icon">
                  <FaCamera />
                </div>
                <div className="activity-content">
                  <h4>Breakfast Logged</h4>
                  <p>Oatmeal with berries - 320 calories</p>
                  <span className="activity-time">2 hours ago</span>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-icon">
                  <FaCamera />
                </div>
                <div className="activity-content">
                  <h4>Lunch Analyzed</h4>
                  <p>Grilled chicken salad - 450 calories</p>
                  <span className="activity-time">5 hours ago</span>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-icon">
                  <FaTrophy />
                </div>
                <div className="activity-content">
                  <h4>Achievement Unlocked</h4>
                  <p>7-day tracking streak!</p>
                  <span className="activity-time">Yesterday</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="dashboard-section">
            <h3>Quick Actions</h3>
            <div className="quick-actions">
              <button className="quick-action-btn">
                <FaHistory />
                <span>View History</span>
              </button>
              <button className="quick-action-btn">
                <FaBell />
                <span>Set Reminders</span>
              </button>
              <button className="quick-action-btn">
                <FaUserCog />
                <span>Account Settings</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
