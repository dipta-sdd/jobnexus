export default function ClientRowLoader() {
  return (
    <tr className="animate-pulse">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700" />
          <div className="ml-4">
            <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="mt-2 h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="mt-2 h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right">
        <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded" />
      </td>
    </tr>
  )
}
