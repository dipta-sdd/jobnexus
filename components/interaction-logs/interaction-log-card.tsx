import { InteractionLog } from '@/lib/types';
import { Edit, FileText, Trash2, User } from 'lucide-react';
import { Mail } from 'lucide-react';
import { Phone, Users } from 'lucide-react';
import Link from 'next/link';
import { Description } from '../ui/Description';
import formatDateTime from '@/lib/utils/date';
import { formatDistance } from 'date-fns';
interface InteractionLogCardProps {
  log: InteractionLog;
  onEdit: () => void;
  onDelete: () => void;
}

export default function InteractionLogCard({ log,  onEdit, onDelete }: InteractionLogCardProps) {
  // Get time ago
  const getTimeAgo = (dateString: string) => {
    if (!dateString) return "";
    return formatDistance(new Date(dateString), new Date(), {
      addSuffix: true,
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xs shadow-sm border border-gray-100 dark:border-gray-700 relative">
      <div className="p-6 pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
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
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white capitalize">
                {log.type}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {formatDateTime(log.date)}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end space-y-2">
            {log.client && (
              <Link
                href={`/clients/${log.client.id}`}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
              >
                <User className="h-3 w-3 mr-1" /> {log.client.name}
              </Link>
            )}
            {log.project && (
              <Link
                href={`/projects/${log.project.id}`}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100"
              >
                <FileText className="h-3 w-3 mr-1" /> {log.project.title}
              </Link>
            )}
          </div>
        </div>
        <div className="w-full mt-2">
          <Description
            text={log.notes || ""}
            className=" w-full mr-10"
            length={50}
          />
        </div>

      </div>

      {/* Card Footer */}
      <div className="px-5 py-2 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700 mt-2">
        <div className="flex justify-between items-center">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Created {getTimeAgo(log.createdAt.toString())}
          </div>
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
        </div>
      </div>
    </div>
  );
} 