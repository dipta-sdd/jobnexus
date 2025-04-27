export default function ClientCardLoader() {
  return (
    <div className="mx-auto dark:bg-gray-900 mt-4 animate-pulse">
      {/* Client Header */}
      <div className="">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between">
          <div className="space-y-2">
            <div className="h-8 w-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 w-40 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
          <div className="flex space-x-3">
            <div className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
        {/* Left Column */}
        <div className="md:col-span-2 space-y-3">
          {/* Client Information */}
          <div className="bg-white dark:bg-gray-800 rounded-xs shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
                <div className="space-y-2">
                  <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
                <div className="sm:col-span-2 space-y-2">
                  <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-16 w-full bg-gray-200 dark:bg-gray-700 rounded-md"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Client Projects */}
          <div className="bg-white dark:bg-gray-800 rounded-xs shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex justify-between">
              <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {[1, 2, 3].map((i) => (
                <div key={i} className="px-6 py-4">
                  <div className="flex justify-between">
                    <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="h-5 w-20 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                  </div>
                  <div className="flex mt-2 space-x-4">
                    <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="h-3 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </div>
                  <div className="h-3 w-full bg-gray-200 dark:bg-gray-700 rounded mt-2"></div>
                </div>
              ))}
            </div>
            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
              <div className="h-4 w-40 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>

          {/* Reminders */}
          <div className="bg-white dark:bg-gray-800 rounded-xs shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex justify-between">
              <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="flex gap-4">
                <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {[1, 2].map((i) => (
                <div key={i} className="px-6 py-4">
                  <div className="flex justify-between">
                    <div className="space-y-2">
                      <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      <div className="h-3 w-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </div>
                    <div className="h-5 w-20 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                  </div>
                  <div className="flex justify-between mt-3">
                    <div className="h-3 w-40 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="flex gap-2">
                      <div className="h-4 w-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      <div className="h-4 w-14 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
              <div className="h-4 w-40 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-3">
          {/* Client Stats */}
          <div className="bg-white dark:bg-gray-800 rounded-xs shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <div className="h-6 w-40 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
            <div className="p-6 space-y-6">
              <div className="space-y-2">
                <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-8 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="bg-white dark:bg-gray-800 rounded-xs shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <div className="h-6 w-40 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
            <div className="p-6">
              <div className="flow-root">
                <ul className="-mb-8">
                  {[1, 2, 3].map((i) => (
                    <li key={i}>
                      <div className="relative pb-8">
                        {i !== 3 && (
                          <span className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-700"></span>
                        )}
                        <div className="relative flex items-start space-x-3">
                          <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                          <div className="min-w-0 flex-1 space-y-2">
                            <div className="flex justify-between">
                              <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
                              <div className="flex gap-2">
                                <div className="h-4 w-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
                                <div className="h-4 w-14 bg-gray-200 dark:bg-gray-700 rounded"></div>
                              </div>
                            </div>
                            <div className="h-3 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
                            <div className="h-3 w-3/4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
              <div className="h-4 w-40 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-xs shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <div className="h-6 w-40 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
            <div className="p-6 space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded-md"
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
