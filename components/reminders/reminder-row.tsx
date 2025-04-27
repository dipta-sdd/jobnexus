'use client';

import { Reminder } from '@/lib/types';
import {  User, FileText, Trash2, Calendar } from 'lucide-react';
import { Edit } from 'lucide-react';
import Link from 'next/link';
import { Description } from '@/components/ui/Description';
import formatDateTime from '@/lib/utils/date';

interface ReminderRowProps {
  reminder: Reminder;
  onEdit: () => void;
  onDelete: () => void;
}

export default function ReminderRow({ reminder, onEdit, onDelete }: ReminderRowProps) {

  
  // Check if reminder is upcoming (due in the next 48 hours)
  const isUpcoming = () => {
    const dueDate = new Date(reminder.dueDate);
    const now = new Date();
    const diffTime = dueDate.getTime() - now.getTime();
    const diffHours = diffTime / (1000 * 60 * 60);
    return diffHours > 0 && diffHours < 48 && reminder.status !== "Completed";
  };

  // Check if reminder is overdue
  const isOverdue = () => {
    const dueDate = new Date(reminder.dueDate);
    const now = new Date();
    return now > dueDate && reminder.status !== "Completed";
  };
  // Get reminder color based on status and due date
  const getReminderColor = () => {
    if (reminder.status === "Completed")
      return "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100";
    if (isOverdue()) 
      return "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100";
    if (isUpcoming())
      return "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"; 
    return "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100";
  };

  return (
    <tr key={reminder.id}>
      <td className="px-2 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900 dark:text-white">
          {reminder.title}
        </div>
      </td>
      <td className="px-6 py-4">
        <Description
          text={reminder.notes || ""}
          className="text-wrap break-words max-w-50"
          length={20}
        />
      </td>
      <td className="px-2 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {reminder.client && (
            <Link
              href={`/clients/${reminder.client.id}`}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
            >
              <User className="h-3 w-3 mr-1" /> {reminder.client.name}
            </Link>
          )}
        </div>
      </td>
      <td className="px-2 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {reminder.project && (
            <Link
              href={`/projects/${reminder.project.id}`}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100"
            >
              <FileText className="h-3 w-3 mr-1" /> {reminder.project.title}
            </Link>
          )}
        </div>
      </td>
      <td className="px-2 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          <Calendar className="h-4 w-4 inline mr-1 mb-0.5 text-gray-400" />
          {formatDateTime(reminder.dueDate)}
        </div>
      </td>
      <td className="px-2 py-4 whitespace-nowrap">
        <span className={getReminderColor()}>{reminder.status}</span>
      </td>
      <td className="px-2 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          <Calendar className="h-4 w-4 inline mr-1 mb-0.5 text-gray-400" />
          {formatDateTime(reminder.updatedAt)}
        </div>
      </td>
      <td className="px-2 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          <Calendar className="h-4 w-4 inline mr-1 mb-0.5 text-gray-400" />
          {formatDateTime(reminder.createdAt)}
        </div>
      </td>
      <td className="px-2 py-4 whitespace-nowrap">
        <div className="flex items-center space-x-2">
          <button
            onClick={onEdit}
            className="p-1.5 rounded-md bg-gray-100 dark:bg-gray-700 hover:bg-blue-100 dark:hover:bg-blue-900 text-muted-foreground hover:text-blue-800 dark:hover:text-blue-100 transition-colors"
            aria-label="Edit project"
          >
            <Edit className="h-3 w-3" />
          </button>
          <button
            onClick={onDelete}
            className="p-1.5 rounded-md bg-gray-100 dark:bg-gray-700 hover:bg-red-100 dark:hover:bg-red-900 text-muted-foreground hover:text-red-800 dark:hover:text-red-100 transition-colors"
            aria-label="Delete project"
          >
            <Trash2 className="h-3 w-3" />
          </button>
        </div>
      </td>
    </tr>
  );
} 