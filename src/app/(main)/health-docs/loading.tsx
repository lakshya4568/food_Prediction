export default function HealthDocsLoading() {
  return (
    <div className="bg-gray-50 py-8 animate-pulse">
      <div className="container mx-auto px-4">
        {/* Header Skeleton */}
        <div className="mb-8">
          <div className="h-10 bg-gray-300 rounded mb-2 w-80"></div>
          <div className="h-6 bg-gray-200 rounded w-96"></div>
        </div>

        {/* Quick Actions Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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

        {/* Main Content Grid Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Health Reports */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Reports */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="h-6 bg-gray-200 rounded w-40"></div>
                <div className="h-10 bg-gray-200 rounded w-32"></div>
              </div>

              <div className="space-y-4">
                {[...Array(4)].map((_, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                      <div>
                        <div className="h-4 bg-gray-200 rounded mb-1 w-48"></div>
                        <div className="h-3 bg-gray-100 rounded w-32"></div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="h-4 bg-gray-200 rounded mb-1 w-20"></div>
                      <div className="h-3 bg-gray-100 rounded w-16"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Health Metrics */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="h-6 bg-gray-200 rounded mb-6 w-36"></div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(4)].map((_, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="h-5 bg-gray-200 rounded w-24"></div>
                      <div className="w-8 h-8 bg-gray-200 rounded"></div>
                    </div>
                    <div className="h-8 bg-gray-200 rounded mb-2 w-16"></div>
                    <div className="h-3 bg-gray-100 rounded w-20"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="h-6 bg-gray-200 rounded mb-4 w-28"></div>
              <div className="space-y-4">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="text-center">
                    <div className="h-8 bg-gray-200 rounded mb-1 w-16 mx-auto"></div>
                    <div className="h-3 bg-gray-100 rounded w-20 mx-auto"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="h-6 bg-gray-200 rounded mb-4 w-36"></div>
              <div className="space-y-3">
                {[...Array(5)].map((_, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-gray-200 rounded"></div>
                    <div className="flex-1">
                      <div className="h-3 bg-gray-200 rounded mb-1"></div>
                      <div className="h-2 bg-gray-100 rounded w-16"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Health Tips */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="h-6 bg-gray-200 rounded mb-4 w-32"></div>
              <div className="space-y-3">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-100 rounded"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Health Timeline Skeleton */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="h-6 bg-gray-200 rounded mb-6 w-40"></div>

          <div className="space-y-6">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="w-3 h-3 bg-gray-200 rounded-full mt-2"></div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                    <div className="h-3 bg-gray-100 rounded w-20"></div>
                  </div>
                  <div className="h-3 bg-gray-100 rounded mb-2"></div>
                  <div className="h-3 bg-gray-100 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
