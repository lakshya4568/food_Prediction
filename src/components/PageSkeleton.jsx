import React from "react";

const PageSkeleton = () => {
  return (
    <div className="min-h-screen bg-vibrant-overlay dark:bg-dark-overlay animate-pulse">
      {/* Header Skeleton */}
      <header className="bg-surface-light/90 dark:bg-surface-dark/90 backdrop-blur-md shadow-lg dark:shadow-glow-green sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-primary-300 dark:bg-primary-700 rounded"></div>
              <div className="w-20 h-4 bg-primary-300 dark:bg-primary-700 rounded"></div>
            </div>

            <div className="text-center">
              <div className="w-32 h-6 bg-primary-300 dark:bg-primary-700 rounded mx-auto mb-2"></div>
              <div className="w-24 h-3 bg-primary-200 dark:bg-primary-800 rounded mx-auto"></div>
            </div>

            <div className="w-20 h-4"></div>
          </div>
        </div>
      </header>

      {/* Main Content Skeleton */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center space-y-6">
          {/* Icon Skeleton */}
          <div className="mx-auto w-24 h-24 bg-primary-300 dark:bg-primary-700 rounded-full"></div>
          
          {/* Title and Description Skeleton */}
          <div className="space-y-4">
            <div className="w-48 h-8 bg-primary-300 dark:bg-primary-700 rounded mx-auto"></div>
            <div className="space-y-2">
              <div className="w-96 h-4 bg-primary-200 dark:bg-primary-800 rounded mx-auto"></div>
              <div className="w-80 h-4 bg-primary-200 dark:bg-primary-800 rounded mx-auto"></div>
              <div className="w-72 h-4 bg-primary-200 dark:bg-primary-800 rounded mx-auto"></div>
            </div>
          </div>

          {/* Feature Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {[1, 2, 3].map((item) => (
              <div key={item} className="card p-6">
                <div className="w-12 h-12 bg-primary-300 dark:bg-primary-700 rounded-xl mx-auto mb-4"></div>
                <div className="w-32 h-5 bg-primary-300 dark:bg-primary-700 rounded mx-auto mb-2"></div>
                <div className="space-y-2">
                  <div className="w-full h-3 bg-primary-200 dark:bg-primary-800 rounded"></div>
                  <div className="w-3/4 h-3 bg-primary-200 dark:bg-primary-800 rounded mx-auto"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Coming Soon Badge Skeleton */}
          <div className="mt-8">
            <div className="w-64 h-8 bg-primary-300 dark:bg-primary-700 rounded-full mx-auto"></div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PageSkeleton;
