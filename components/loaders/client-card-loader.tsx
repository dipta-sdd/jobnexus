export default function ClientCardLoader() {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden animate-pulse">
      <div className="p-6">
        <div className="flex items-center">
          <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700" />
          <div className="ml-4">
            <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="mt-2 h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <div className="flex items-center">
            <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded-full" />
            <div className="ml-3 h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
          <div className="flex items-center">
            <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded-full" />
            <div className="ml-3 h-4 w-40 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
          <div className="flex items-center">
            <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded-full" />
            <div className="ml-3 h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded-full" />
              <div className="ml-2 h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
            <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}
