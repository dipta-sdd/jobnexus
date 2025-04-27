import Link from "next/link";
import {
  Mail,
  Phone,
  Calendar,
  FileText,
  Clock,
  FolderClosed,
} from "lucide-react";
import { Client, Project, Reminder } from "@/lib/types";
import formatDateTime from "@/lib/utils/date";

type ClientRowProps = {
  client: Client;
};

export default function ClientRow({ client }: ClientRowProps) {


  // Count active projects
  const activeProjects = client?.projects?.filter(
    (project: Project) => project.status !== "Completed"
  ).length;

  // Check for upcoming reminders (due in the next 48 hours)
  const upcomingReminders = client?.reminders?.filter((reminder: Reminder) => {
    const dueDate = new Date(reminder.dueDate);
    const now = new Date();
    const diffTime = dueDate.getTime() - now.getTime();
    const diffHours = diffTime / (1000 * 60 * 60);
    return diffHours > 0 && diffHours < 48 && reminder.status !== "Completed";
  }).length;

  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap">
        <Link
          href={`/clients/${client.id}`}
          className="text-sm font-medium text-gray-900 dark:text-gray-100 hover:text-blue-600 transition-colors"
        >
          {client.name}
        </Link>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <Mail className="h-4 w-4 mr-2 text-gray-400" />
          <a
            href={`mailto:${client.email}`}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            {client.email}
          </a>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <Phone className="h-4 w-4 mr-2 text-gray-400" />
          <a
            href={`tel:${client.phone}`}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            {client.phone}
          </a>
        </div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-500">
          <Calendar className="h-4 w-4 inline mr-1 mb-0.5 text-gray-400" />
          {formatDateTime(new Date(client?.createdAt))}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-500">
          <Calendar className="h-4 w-4 inline mr-1 mb-0.5 text-gray-400" />
          {formatDateTime(new Date(client?.createdAt))}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex items-center justify-between space-x-3">
          <div className="flex space-x-2">
            {(client?.projects?.length && client?.projects?.length > 0) ? (
              <div
                className="flex items-center"
                title={`${client.projects.length} projects`}
              >
                <FolderClosed
                  className={`w-3 h-3 ${
                    activeProjects && activeProjects > 0
                      ? "text-green-500"
                      : client?.projects?.length && client?.projects?.length > 0
                      ? "text-blue-500"
                      : "text-gray-300"
                  }`}
                />
                <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">
                  {client?.projects?.length}
                </span>
              </div>
            ) : null}
            {(client?.reminders?.length && client?.reminders?.length > 0) ? (
              <div
                className="flex items-center"
                title={`${client.reminders.length} reminders`}
              >
                <Clock
                  className={`w-3 h-3 ${
                    upcomingReminders && upcomingReminders > 0
                      ? "text-yellow-700"
                      : client.reminders.length > 0
                      ? "text-yellow-500"
                      : "text-gray-300"
                  } `}
                ></Clock>
                <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">
                  {client.reminders.length}
                </span>
              </div>
            ) : null}
            {(client?.logs?.length && client?.logs?.length > 0) ? (
              <div
                className="flex items-center"
                title={`${client.logs.length} logs`}
              >
                <FileText
                  className={`w-3 h-3  ${
                    client?.logs?.length && client?.logs?.length > 0
                      ? "text-purple-500"
                      : "text-gray-500"
                  }  mr-1`}
                />
                <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">
                  {client?.logs?.length}
                </span>
              </div>
            ) : null}
          </div>

          <Link
            href={`/clients/${client.id}`}
            className="text-green-600 hover:text-green-900"
          >
            View
          </Link>
        </div>
      </td>
    </tr>
  );
}
