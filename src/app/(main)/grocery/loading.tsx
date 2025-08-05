export default function GroceryLoading() {
  return (
    <div className="bg-gray-50 py-8 animate-pulse">
      <div className="container mx-auto px-4">
        {/* Header Skeleton */}
        <div className="mb-8">
          <div className="h-10 bg-gray-300 rounded mb-2 w-72"></div>
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
          {/* Shopping List */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="h-6 bg-gray-200 rounded w-32"></div>
              <div className="h-10 bg-gray-200 rounded w-28"></div>
            </div>

            {/* Categories Tabs Skeleton */}
            <div className="flex space-x-4 mb-6 border-b">
              {[...Array(4)].map((_, index) => (
                <div
                  key={index}
                  className="h-10 bg-gray-200 rounded w-20"
                ></div>
              ))}
            </div>

            {/* Shopping Items Skeleton */}
            <div className="space-y-3">
              {[...Array(6)].map((_, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 bg-gray-200 rounded"></div>
                    <div>
                      <div className="h-4 bg-gray-200 rounded mb-1 w-32"></div>
                      <div className="h-3 bg-gray-100 rounded w-24"></div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="h-4 bg-gray-200 rounded mb-1 w-12"></div>
                    <div className="h-3 bg-gray-100 rounded w-16"></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t">
              <div className="flex justify-between items-center">
                <div className="h-5 bg-gray-200 rounded w-24"></div>
                <div className="h-6 bg-gray-300 rounded w-20"></div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Budget Tracker */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="h-6 bg-gray-200 rounded mb-4 w-32"></div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                  <div className="h-5 bg-gray-200 rounded w-12"></div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                  <div className="h-5 bg-gray-200 rounded w-16"></div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2"></div>
              </div>
            </div>

            {/* Recent Purchases */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="h-6 bg-gray-200 rounded mb-4 w-40"></div>
              <div className="space-y-3">
                {[...Array(4)].map((_, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-200 rounded"></div>
                      <div>
                        <div className="h-3 bg-gray-200 rounded mb-1 w-20"></div>
                        <div className="h-2 bg-gray-100 rounded w-16"></div>
                      </div>
                    </div>
                    <div className="h-3 bg-gray-200 rounded w-10"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Suggested Items */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="h-6 bg-gray-200 rounded mb-4 w-36"></div>
              <div className="space-y-3">
                {[...Array(3)].map((_, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                    </div>
                    <div className="w-6 h-6 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Store Locations Skeleton */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="h-6 bg-gray-200 rounded mb-4 w-40"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="h-5 bg-gray-200 rounded w-32"></div>
                  <div className="h-4 bg-gray-100 rounded w-16"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-100 rounded"></div>
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
