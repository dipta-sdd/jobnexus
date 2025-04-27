import { InteractionLog } from '@/lib/types';
import { Edit, Mail, Phone, Users, FileText, User, Trash2, Calendar } from 'lucide-react';
import Link from 'next/link';
import { Description } from '../ui/Description';
import formatDateTime from '@/lib/utils/date';

interface InteractionLogRowProps {
  log: InteractionLog;
  onEdit: () => void;
  onDelete: () => void;
}

export default function InteractionLogRow({ log, onEdit, onDelete }: InteractionLogRowProps) {


  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          {log.type === "call" && (
            <Phone className="h-6 w-6 text-gray-600 dark:text-gray-400" />
          )}
          {log.type === "meeting" && (
            <Users className="h-6 w-6 text-gray-600 dark:text-gray-400" />
          )}
          {log.type === "email" && (
            <Mail className="h-6 w-6 text-gray-600 dark:text-gray-400" />
          )}
          {log.type === "note" && (
            <FileText className="h-6 w-6 text-gray-600 dark:text-gray-400" />
          )}
          <div className="text-sm font-medium text-gray-900 dark:text-white capitalize ml-2">
            {log.type}
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          <Calendar className="h-4 w-4 inline mr-1 mb-0.5 text-gray-400" />
          {formatDateTime(log.date)}
        </div>
      </td>
      <td className="px-6 py-4">
        <Description text={log.notes} length={100} />
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {log.client && (
          <Link
            href={`/clients/${log.client.id}`}
            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
          >
            <User className="h-3 w-3 mr-1" /> {log.client.name}
          </Link>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {log.project && (
          <Link
            href={`/projects/${log.project.id}`}
            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100"
          >
            <FileText className="h-3 w-3 mr-1" /> {log.project.title}
          </Link>
        )}
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          <Calendar className="h-4 w-4 inline mr-1 mb-0.5 text-gray-400" />
          {formatDateTime(new Date(log?.updatedAt))}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          <Calendar className="h-4 w-4 inline mr-1 mb-0.5 text-gray-400" />
          {formatDateTime(new Date(log?.createdAt))}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap ">
        <div className="flex space-x-1 transition-all duration-200 hover:opacity-100 opacity-30">
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