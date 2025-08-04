import React from "react";
import PageSkeleton from "./PageSkeleton";

/**
 * Specific skeleton for Dashboard page
 */
export const DashboardSkeleton = () => {
  return (
    <div className="min-h-screen bg-vibrant-overlay dark:bg-dark-overlay animate-pulse">
      {/* Header Skeleton */}
      <header className="bg-surface-light/90 dark:bg-surface-dark/90 backdrop-blur-md shadow-lg dark:shadow-glow-green sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-primary-300 dark:bg-primary-700 rounded"></div>
              <div className="w-24 h-4 bg-primary-300 dark:bg-primary-700 rounded"></div>
            </div>
            <div className="w-32 h-6 bg-primary-300 dark:bg-primary-700 rounded"></div>
            <div className="flex space-x-2">
              <div className="w-8 h-8 bg-primary-300 dark:bg-primary-700 rounded"></div>
              <div className="w-8 h-8 bg-primary-300 dark:bg-primary-700 rounded"></div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Skeleton */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="w-64 h-8 bg-primary-300 dark:bg-primary-700 rounded mb-2"></div>
          <div className="w-80 h-4 bg-primary-200 dark:bg-primary-800 rounded"></div>
        </div>

        {/* Quick Action Button */}
        <div className="mb-8">
          <div className="w-48 h-12 bg-primary-300 dark:bg-primary-700 rounded-xl"></div>
        </div>

        {/* Navigation Cards */}
        <div className="mb-8">
          <div className="w-32 h-6 bg-primary-300 dark:bg-primary-700 rounded mb-6"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="card p-4">
                <div className="w-12 h-12 bg-primary-300 dark:bg-primary-700 rounded-xl mx-auto mb-3"></div>
                <div className="w-20 h-4 bg-primary-300 dark:bg-primary-700 rounded mx-auto"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[1, 2, 3].map((item) => (
            <div key={item} className="card p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-primary-300 dark:bg-primary-700 rounded-xl mr-4"></div>
                <div className="w-32 h-6 bg-primary-300 dark:bg-primary-700 rounded"></div>
              </div>
              <div className="w-24 h-8 bg-primary-300 dark:bg-primary-700 rounded mb-2"></div>
              <div className="w-20 h-4 bg-primary-200 dark:bg-primary-800 rounded"></div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

/**
 * Specific skeleton for Settings page
 */
export const SettingsSkeleton = () => {
  return (
    <div className="min-h-screen bg-vibrant-overlay dark:bg-dark-overlay animate-pulse">
      {/* Header Skeleton */}
      <header className="bg-surface-light/90 dark:bg-surface-dark/90 backdrop-blur-md shadow-lg dark:shadow-glow-green sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-primary-300 dark:bg-primary-700 rounded"></div>
              <div className="w-32 h-4 bg-primary-300 dark:bg-primary-700 rounded"></div>
            </div>
            <div className="text-center">
              <div className="w-32 h-6 bg-primary-300 dark:bg-primary-700 rounded mx-auto mb-2"></div>
              <div className="w-40 h-3 bg-primary-200 dark:bg-primary-800 rounded mx-auto"></div>
            </div>
            <div className="w-20 h-4"></div>
          </div>
        </div>
      </header>

      {/* Main Content Skeleton */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Profile Card */}
          <div className="card p-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-primary-300 dark:bg-primary-700 rounded-full"></div>
              <div className="flex-1">
                <div className="w-32 h-6 bg-primary-300 dark:bg-primary-700 rounded mb-2"></div>
                <div className="w-48 h-4 bg-primary-200 dark:bg-primary-800 rounded mb-1"></div>
                <div className="w-40 h-3 bg-primary-200 dark:bg-primary-800 rounded"></div>
              </div>
              <div className="w-24 h-8 bg-primary-300 dark:bg-primary-700 rounded"></div>
            </div>
          </div>

          {/* Settings Sections */}
          {[1, 2, 3].map((section) => (
            <div key={section} className="space-y-4">
              <div className="w-24 h-5 bg-primary-300 dark:bg-primary-700 rounded"></div>
              <div className="card divide-y divide-primary-200 dark:divide-primary-700">
                {[1, 2].map((item) => (
                  <div key={item} className="p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-primary-300 dark:bg-primary-700 rounded-lg"></div>
                      <div>
                        <div className="w-32 h-4 bg-primary-300 dark:bg-primary-700 rounded mb-2"></div>
                        <div className="w-48 h-3 bg-primary-200 dark:bg-primary-800 rounded"></div>
                      </div>
                    </div>
                    <div className="w-8 h-6 bg-primary-300 dark:bg-primary-700 rounded"></div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

/**
 * Generic page skeleton component (re-export)
 */
export { default as PageSkeleton } from "./PageSkeleton";

export default PageSkeleton;
