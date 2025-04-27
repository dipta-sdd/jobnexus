export function DashboardLoader() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-xs border border-gray-200 dark:border-gray-700 mt-4">
        <div className="mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="h-8 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="flex items-center gap-3">
              <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </header>

      <main className="mt-4">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6 gap-3 mb-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-xs shadow p-5 flex items-center">
              <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700 mr-4 animate-pulse" />
              <div>
                <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-2 animate-pulse" />
                <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>

        {/* Charts and Tables Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-xs shadow p-6 col-span-1">
              <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-4 animate-pulse" />
              <div className="h-64 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </div>
          ))}
        </div>

        {/* Latest Project and Reminders */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {/* Latest Project */}
          <div className="bg-white dark:bg-gray-800 rounded-xs shadow p-6">
            <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-4 animate-pulse" />
            <div className="space-y-4">
              <div className="flex justify-between">
                <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              </div>
              <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="grid grid-cols-2 gap-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Upcoming Reminders */}
          <div className="bg-white dark:bg-gray-800 rounded-xs shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="px-6 py-4">
                  <div className="flex items-start">
                    <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 mr-4 animate-pulse" />
                    <div className="flex-1 space-y-2">
                      <div className="flex justify-between">
                        <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                        <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                      </div>
                      <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                      <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Clients */}
          <div className="bg-white dark:bg-gray-800 rounded-xs shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="px-6 py-4">
                  <div className="flex items-start">
                    <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 mr-4 animate-pulse" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                      <div className="h-4 w-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                      <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Projects */}
          <div className="bg-white dark:bg-gray-800 rounded-xs shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="px-6 py-4">
                  <div className="flex justify-between">
                    <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  </div>
                  <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded mt-2 animate-pulse" />
                  <div className="flex justify-between mt-2">
                    <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Overdue Projects */}
          <div className="bg-white dark:bg-gray-800 rounded-xs shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-red-50 dark:bg-red-900/30">
              <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="px-6 py-4">
                  <div className="flex justify-between">
                    <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  </div>
                  <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded mt-2 animate-pulse" />
                  <div className="flex justify-between mt-2">
                    <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Logs */}
          <div className="bg-white dark:bg-gray-800 rounded-xs shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="px-6 py-4">
                  <div className="flex items-start">
                    <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 mr-4 animate-pulse" />
                    <div className="flex-1 space-y-2">
                      <div className="flex justify-between">
                        <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                        <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                      </div>
                      <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                      <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Overdue Reminders */}
          <div className="bg-white dark:bg-gray-800 rounded-xs shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-red-50 dark:bg-red-900/30">
              <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="px-6 py-4">
                  <div className="flex items-start">
                    <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 mr-4 animate-pulse" />
                    <div className="flex-1 space-y-2">
                      <div className="flex justify-between">
                        <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                        <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                      </div>
                      <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                      <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Budget Clients */}
          <div className="bg-white dark:bg-gray-800 rounded-xs shadow overflow-hidden mb-6">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="px-6 py-4">
                  <div className="flex items-start">
                    <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 mr-4 animate-pulse" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                      <div className="h-4 w-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                      <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    </div>
                    <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded ml-4 animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

