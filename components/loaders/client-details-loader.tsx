export default function ClientDetailsLoader() {
  return (
    <div className="animate-pulse">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="h-16 w-16 rounded-full bg-gray-200 dark:bg-gray-700" />
            <div className="ml-4">
              <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="mt-2 h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
          </div>
          <div className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6">
          <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded-full" />
              <div className="ml-3 h-4 w-40 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
            <div className="flex items-center">
              <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded-full" />
              <div className="ml-3 h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
            <div className="flex items-center">
              <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded-full" />
              <div className="ml-3 h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6">
          <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded-full" />
              <div className="ml-3 h-4 w-40 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
            <div className="flex items-center">
              <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded-full" />
              <div className="ml-3 h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
          </div>
        </div>
      </div>

      {/* Projects Section */}
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6 mb-6">
        <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700" />
                <div className="ml-4">
                  <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
                  <div className="mt-2 h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
                </div>
              </div>
              <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
          ))}
        </div>
      </div>

      {/* Notes Section */}
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6">
        <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="mt-2 h-3 w-3/4 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
