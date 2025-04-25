import { InteractionLog } from '@/lib/types';

interface InteractionLogCardProps {
  log: InteractionLog;
}

export default function InteractionLogCard({ log }: InteractionLogCardProps) {
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

  const formattedDate = formatDate(log.date);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-6">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">{getTypeIcon(log.type)}</span>
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white capitalize">
              {log.type}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {formattedDate}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {log.client && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
              {log.client.name}
            </span>
          )}
          {log.project && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100">
              {log.project.title}
            </span>
          )}
        </div>
      </div>
      <div className="mt-4">
        <p className="text-gray-600 dark:text-gray-300">{log.notes}</p>
      </div>
    </div>
  );
} 