'use client';

import { Reminder } from '@/lib/types';

interface ReminderCardProps {
  reminder: Reminder;
}

export default function ReminderCard({ reminder }: ReminderCardProps) {
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

  const formattedDate = formatDate(reminder.dueDate);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {reminder.title}
        </h3>
        <span className="px-2 py-1 text-xs font-medium rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100">
          {reminder.status}
        </span>
      </div>
      <div className="space-y-2">
        {reminder.client && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Client: {reminder.client.name}
          </p>
        )}
        {reminder.project && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Project: {reminder.project.title}
          </p>
        )}
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Due: {formattedDate}
        </p>
        {reminder.notes && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Notes: {reminder.notes}
          </p>
        )}
      </div>
    </div>
  );
} 