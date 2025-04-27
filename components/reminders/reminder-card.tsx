import { formatDistance } from "date-fns";
import Link from "next/link";
import {
  Calendar,
  Clock,
  User,
  FolderKanban,
  AlertCircle,
  Edit,
  Trash2,
} from "lucide-react";
import type { Reminder } from "@/lib/types";
import { Description } from "../ui/Description";
import { formatDate, formatTime } from "@/lib/utils/date";

type ReminderCardProps = {
  reminder: Reminder;
  onEdit: () => void;
  onDelete: () => void;
};

export default function ReminderCard({
  reminder,
  onEdit,
  onDelete,
}: ReminderCardProps) {
  // Get time ago
  const getTimeAgo = (dateString: string) => {
    if (!dateString) return "";
    return formatDistance(new Date(dateString), new Date(), {
      addSuffix: true,
    });
  };

  // Status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100";
      case "Pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100";
      case "Overdue":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100";
    }
  };

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
      return "bg-green-500 dark:bg-green-600";
    if (isOverdue()) return "bg-red-500 dark:bg-red-600";
    if (isUpcoming()) return "bg-yellow-500 dark:bg-yellow-600";
    return "bg-blue-500 dark:bg-blue-600";
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xs overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 dark:border-gray-700 flex flex-col">
      {/* Card Header with Status Indicator */}
      <div className="relative">
        <div className={`h-1.5 w-full ${getReminderColor()}`}></div>

        <div className="p-5 pb-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              {reminder.title}
            </h2>
            <div className="flex items-center space-x-2">
              {isOverdue() && (
                <span className="text-red-600 dark:text-red-400 font-medium inline-flex items-center px-2.5 py-0.5 rounded-full text-sm ">
                  <AlertCircle className="h-4 w-4 mr-1 text-red-600 dark:text-red-400" />
                  Overdue
                </span>
              )}
              {isUpcoming() && (
                <span className="text-yellow-600 dark:text-yellow-400 font-medium inline-flex items-center px-2.5 py-0.5 rounded-full text-sm ">
                  <AlertCircle className="h-4 w-4 mr-1 text-yellow-600 dark:text-yellow-400" />
                  Upcoming
                </span>
              )}
              <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                    reminder.status
                  )}`}
              >
                {reminder.status}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="px-5 py-2 flex-grow">
        {/* Notes */}
        <div className="mb-4">
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
            Notes
          </div>
          <Description
            text={reminder.notes || ""}
            className="text-sm text-gray-700 dark:text-gray-300 text-wrap break-words w-full"
            length={100}
          />
        </div>

        {/* Due Date and Time */}
        <div className="flex items-center text-sm mb-3">
          <Calendar className="h-4 w-4 mr-1 text-gray-400 dark:text-gray-500" />
          <span
            className={
              isOverdue()
                ? "text-red-600 dark:text-red-400 font-medium"
                : "text-gray-500 dark:text-gray-400"
            }
          >
            {formatDate(reminder.dueDate)}
          </span>
          <Clock className="h-4 w-4 ml-3 mr-1 text-gray-400 dark:text-gray-500" />
          <span
            className={
              isOverdue()
                ? "text-red-600 dark:text-red-400 font-medium"
                : "text-gray-500 dark:text-gray-400"
            }
          >
            {formatTime(reminder.dueDate)}
          </span>
          {isUpcoming() && (
            <AlertCircle className="h-4 w-4 ml-2 text-yellow-500 dark:text-yellow-400" />
          )}
        </div>

        {/* Associated Client and Project */}
        <div className="space-y-2 text-sm">
          {reminder.client && (
            <div className="flex items-center">
              <User className="h-4 w-4 mr-2 text-gray-400 dark:text-gray-500" />
              <Link
                href={`/clients/${reminder.clientId}`}
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              >
                {reminder.client.name}
              </Link>
            </div>
          )}
          {reminder.project && (
            <div className="flex items-center">
              <FolderKanban className="h-4 w-4 mr-2 text-gray-400 dark:text-gray-500" />
              <Link
                href={`/projects/${reminder.projectId}`}
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              >
                {reminder.project.title}
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Card Footer */}
      <div className="px-5 py-3 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700 mt-2">
        <div className="flex justify-between items-center">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Created {getTimeAgo(reminder.createdAt.toString())}
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
