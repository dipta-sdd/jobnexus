export default function ClientDetailsLoader() {
  return (
    <div className="mx-auto dark:bg-gray-900 mt-4 animate-pulse">
      {/* Client Header */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between">
          <div>
            <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
            <div className="h-4 w-36 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
          <div className="flex space-x-3">
            <div className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
        {/* Client Details */}
        <div className="md:col-span-2 space-y-3">
          {/* Client Information */}
          <div className="bg-white dark:bg-gray-800 rounded-xs shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <div className="h-6 w-40 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
            <div className="p-6">
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i}>
                    <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
                    <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
                  </div>
                ))}
                <div className="sm:col-span-2">
                  <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
                  <div className="h-20 w-full bg-gray-200 dark:bg-gray-700 rounded" />
                </div>
              </dl>
            </div>
          </div>

          {/* Projects */}
          <div className="bg-white dark:bg-gray-800 rounded-xs shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
            <div>
              {[1, 2, 3].map((i) => (
                <div key={i} className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <div className="h-5 w-48 bg-gray-200 dark:bg-gray-700 rounded" />
                    <div className="h-5 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
                  </div>
                  <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded" />
                </div>
              ))}
            </div>
          </div>

          {/* Reminders */}
          <div className="bg-white dark:bg-gray-800 rounded-xs shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
            <div>
              {[1, 2, 3].map((i) => (
                <div key={i} className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-start justify-between mb-2">
                    <div className="h-5 w-48 bg-gray-200 dark:bg-gray-700 rounded" />
                    <div className="h-5 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
                  </div>
                  <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats and Activity */}
        <div className="space-y-3">
          {/* Stats */}
          <div className="bg-white dark:bg-gray-800 rounded-xs shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <div className="h-6 w-36 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
            <div className="p-6 space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i}>
                  <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
                  <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
                </div>
              ))}
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="bg-white dark:bg-gray-800 rounded-xs shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
            <div className="p-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-start space-x-3 mb-6">
                  <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full" />
                  <div className="flex-1">
                    <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
                    <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-xs shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
            <div className="p-6 space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
