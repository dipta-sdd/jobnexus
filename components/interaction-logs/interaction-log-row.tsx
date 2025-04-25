import { InteractionLog } from '@/lib/types';

interface InteractionLogRowProps {
  log: InteractionLog;
}

export default function InteractionLogRow({ log }: InteractionLogRowProps) {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'call':
        return '📞';
      case 'meeting':
        return '🤝';
      case 'email':
        return '📧';
      default:
        return '📝';
    }
  };

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    };
    return new Date(date).toLocaleString('en-US', options);
  };

  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <span className="text-xl mr-2">{getTypeIcon(log.type)}</span>
          <div className="text-sm font-medium text-gray-900 dark:text-white capitalize">
            {log.type}
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {formatDate(log.date)}
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="text-sm text-gray-900 dark:text-white">
          {log.notes}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {log.client && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
            {log.client.name}
          </span>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {log.project && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100">
            {log.project.title}
          </span>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <button className="text-emerald-600 hover:text-emerald-900 dark:text-emerald-400 dark:hover:text-emerald-300">
          Edit
        </button>
      </td>
    </tr>
  );
} 