export default function ProjectCardLoader() {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden animate-pulse">
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>

        <div className="mt-4">
          <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="mt-2 h-3 w-3/4 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <div>
            <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
            <div className="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
          <div>
            <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
            <div className="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700" />
              <div className="ml-3">
                <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="mt-1 h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
              </div>
            </div>
            <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}
