import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { 
  FaCog, 
  FaUser, 
  FaBell, 
  FaPalette, 
  FaShieldAlt, 
  FaLanguage, 
  FaSignOutAlt,
  FaArrowLeft,
  FaToggleOn,
  FaToggleOff,
  FaChevronRight
} from "react-icons/fa";

const SettingsPage = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [emailUpdates, setEmailUpdates] = useState(true);

  const goBack = () => {
    navigate("/dashboard");
  };

  const handleLogout = () => {
    // Use the logout function from useAuth hook
    logout();
    // Navigate to home page
    navigate("/");
  };

  const toggleSetting = (setting) => {
    switch (setting) {
      case 'notifications':
        setNotifications(!notifications);
        break;
      case 'darkMode':
        setDarkMode(!darkMode);
        break;
      case 'emailUpdates':
        setEmailUpdates(!emailUpdates);
        break;
      default:
        break;
    }
  };

  const settingSections = [
    {
      title: "Account",
      items: [
        {
          icon: <FaUser />,
          label: "Profile Information",
          description: "Update your personal details and preferences",
          action: "navigate"
        },
        {
          icon: <FaShieldAlt />,
          label: "Privacy & Security",
          description: "Manage your privacy settings and security options",
          action: "navigate"
        }
      ]
    },
    {
      title: "Notifications",
      items: [
        {
          icon: <FaBell />,
          label: "Push Notifications",
          description: "Receive meal reminders and health insights",
          action: "toggle",
          value: notifications,
          setting: "notifications"
        },
        {
          icon: <FaLanguage />,
          label: "Email Updates",
          description: "Get weekly nutrition reports via email",
          action: "toggle",
          value: emailUpdates,
          setting: "emailUpdates"
        }
      ]
    },
    {
      title: "Appearance",
      items: [
        {
          icon: <FaPalette />,
          label: "Dark Mode",
          description: "Switch between light and dark themes",
          action: "toggle",
          value: darkMode,
          setting: "darkMode"
        },
        {
          icon: <FaLanguage />,
          label: "Language",
          description: "Choose your preferred language",
          action: "navigate",
          value: "English (US)"
        }
      ]
    }
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
              <span>Back to Dashboard</span>
            </button>

            <div className="text-center">
              <h1 className="text-2xl lg:text-3xl font-bold text-text-dark dark:text-text-light">
                <span className="text-text-dark dark:text-text-light">
                  App
                </span>
                <span className="text-primary-600 dark:text-primary-400">
                  Settings
                </span>
              </h1>
              <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
                Customize your NutriVision experience
              </p>
            </div>

            <div className="w-20"></div> {/* Spacer for balance */}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Profile Card */}
          <div className="card p-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-primary-100 dark:bg-primary-800/50 rounded-full flex items-center justify-center">
                <FaUser className="text-2xl text-primary-600 dark:text-primary-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-text-dark dark:text-text-light">
                  {user?.name || "User"}
                </h3>
                <p className="text-text-muted-light dark:text-text-muted-dark">
                  {user?.email || "user@example.com"}
                </p>
                <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
                  Member since January 2025
                </p>
              </div>
              <button className="btn-secondary">
                Edit Profile
              </button>
            </div>
          </div>

          {/* Settings Sections */}
          {settingSections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="space-y-4">
              <h2 className="text-lg font-semibold text-text-dark dark:text-text-light">
                {section.title}
              </h2>
              <div className="card divide-y divide-primary-200 dark:divide-primary-700">
                {section.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-primary-100 dark:bg-primary-800/50 rounded-lg flex items-center justify-center">
                        <span className="text-primary-600 dark:text-primary-400">
                          {item.icon}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-text-dark dark:text-text-light">
                          {item.label}
                        </h4>
                        <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
                          {item.description}
                        </p>
                        {item.value && item.action === "navigate" && (
                          <p className="text-sm text-primary-600 dark:text-primary-400">
                            {item.value}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      {item.action === "toggle" ? (
                        <button
                          onClick={() => toggleSetting(item.setting)}
                          className="text-2xl transition-colors"
                        >
                          {item.value ? (
                            <FaToggleOn className="text-primary-600 dark:text-primary-400" />
                          ) : (
                            <FaToggleOff className="text-text-muted-light dark:text-text-muted-dark" />
                          )}
                        </button>
                      ) : (
                        <FaChevronRight className="text-text-muted-light dark:text-text-muted-dark" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Data & Privacy */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-text-dark dark:text-text-light">
              Data & Privacy
            </h2>
            <div className="card p-4">
              <div className="space-y-4">
                <button className="w-full text-left p-3 rounded-lg hover:bg-surface-hover-light dark:hover:bg-surface-hover-dark transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-text-dark dark:text-text-light">Export My Data</span>
                    <FaChevronRight className="text-text-muted-light dark:text-text-muted-dark" />
                  </div>
                </button>
                <button className="w-full text-left p-3 rounded-lg hover:bg-surface-hover-light dark:hover:bg-surface-hover-dark transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-text-dark dark:text-text-light">Delete Account</span>
                    <FaChevronRight className="text-text-muted-light dark:text-text-muted-dark" />
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <div className="card p-4">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center space-x-2 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            >
              <FaSignOutAlt />
              <span>Sign Out</span>
            </button>
          </div>

          {/* App Info */}
          <div className="text-center space-y-2">
            <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
              NutriVision AI v1.0.0
            </p>
            <div className="flex justify-center space-x-4 text-sm">
              <a href="#" className="text-primary-600 dark:text-primary-400 hover:underline">
                Privacy Policy
              </a>
              <a href="#" className="text-primary-600 dark:text-primary-400 hover:underline">
                Terms of Service
              </a>
              <a href="#" className="text-primary-600 dark:text-primary-400 hover:underline">
                Support
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SettingsPage;
