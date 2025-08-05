export default function DashboardLoading() {
  return (
    <div className="bg-gray-50 py-8 animate-pulse">
      <div className="container mx-auto px-4">
        {/* Welcome Section Skeleton */}
        <div className="mb-8">
          <div className="h-10 bg-gray-300 rounded mb-2 w-96"></div>
          <div className="h-6 bg-gray-200 rounded w-80"></div>
        </div>

        {/* Quick Actions Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                <div className="w-6 h-6 bg-gray-200 rounded"></div>
              </div>
              <div className="h-6 bg-gray-200 rounded mb-2 w-32"></div>
              <div className="h-4 bg-gray-100 rounded w-full"></div>
            </div>
          ))}
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="bg-gray-300 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="h-4 bg-gray-400 rounded mb-2 w-24"></div>
                  <div className="h-8 bg-gray-400 rounded mb-1 w-20"></div>
                  <div className="h-3 bg-gray-400 rounded w-16"></div>
                </div>
                <div className="w-12 h-12 bg-gray-400 rounded-lg"></div>
              </div>
              <div className="mt-4">
                <div className="bg-gray-400 rounded-full h-2"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Activity Skeleton */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="h-6 bg-gray-200 rounded mb-4 w-40"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div>
                    <div className="h-4 bg-gray-200 rounded mb-1 w-16"></div>
                    <div className="h-3 bg-gray-100 rounded w-20"></div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="h-4 bg-gray-200 rounded mb-1 w-16"></div>
                  <div className="h-3 bg-gray-100 rounded w-20"></div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <div className="h-4 bg-gray-200 rounded w-32 mx-auto"></div>
          </div>
        </div>

        {/* Nutrition Insights Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(2)].map((_, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6">
              <div className="h-6 bg-gray-200 rounded mb-4 w-48"></div>
              <div className="space-y-3">
                {[...Array(3)].map((_, itemIndex) => (
                  <div
                    key={itemIndex}
                    className="flex justify-between items-center"
                  >
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-8"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
