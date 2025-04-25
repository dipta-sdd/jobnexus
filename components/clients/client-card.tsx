import Link from "next/link";
import { Mail, Phone, Building, Calendar, Clock, FileText } from "lucide-react";
import { formatDistance } from "date-fns";
import { Client, Project } from "@/lib/types";



type ClientCardProps = {
  client: Client;
};

export default function ClientCard({ client }: ClientCardProps) {
  // Get time ago
  const getTimeAgo = (dateString: string) => {
    if (!dateString) return "";
    return formatDistance(new Date(dateString), new Date(), {
      addSuffix: true,
    });
  };

  // Count active projects
  const activeProjects = client?.projects?.filter(
    (project: Project) => project.status !== "Completed"
  ).length;

  // Check for upcoming reminders (due in the next 48 hours)
  const upcomingReminders = client.reminders.filter((reminder) => {
    const dueDate = new Date(reminder.dueDate);
    const now = new Date();
    const diffTime = dueDate.getTime() - now.getTime();
    const diffHours = diffTime / (1000 * 60 * 60);
    return diffHours > 0 && diffHours < 48 && reminder.status !== "Completed";
  }).length;

  // Get latest activity (log or reminder)
  const getLatestActivity = () => {
    const activities = [
      ...client.logs.map((log) => ({
        type: "log",
        date: log.date,
        title: log.type,
      })),
      ...client.reminders.map((reminder) => ({
        type: "reminder",
        date: reminder.dueDate,
        title: reminder.title,
      })),
    ];

    if (activities.length === 0) return null;

    activities.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    return activities[0];
  };

  const latestActivity = getLatestActivity();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 dark:border-gray-700 flex flex-col">
      {/* Card Header with Status Indicator */}
      <div className="relative">
        <div
          className={`h-1.5 w-full ${
            upcomingReminders > 0
              ? "bg-yellow-500 dark:bg-yellow-700"
              : client?.projects?.length > 0
              ? activeProjects > 0
                ? "bg-green-500"
                : "bg-blue-500"
              : "bg-gray-300"
          }`}
        ></div>

        <div className="p-5 pb-3">
          <Link href={`/clients/${client.id}`} className="block">
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 hover:text-blue-600 transition-colors">
              {client.name}
            </h2>
          </Link>
          {client.company && (
            <div className="mt-1 text-sm text-gray-500 dark:text-gray-400 flex items-center">
              <Building className="h-4 w-4 mr-1 text-gray-400" />
              {client.company}
            </div>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="px-5 py-2 flex-grow">
        <div className="space-y-2 text-sm">
          <div className="flex items-center">
            <Mail className="h-4 w-4 mr-2 text-gray-400" />
            <a
              href={`mailto:${client.email}`}
              className="text-blue-600 hover:text-blue-800"
            >
              {client.email}
            </a>
          </div>
          <div className="flex items-center">
            <Phone className="h-4 w-4 mr-2 text-gray-400" />
            <a
              href={`tel:${client.phone}`}
              className="text-blue-600 hover:text-blue-800"
            >
              {client.phone}
            </a>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
          <div className="bg-gray-50 dark:bg-gray-700 rounded p-2">
            <div className="text-gray-500">Projects</div>
            <div className="font-semibold text-gray-900 dark:text-gray-100 mt-1">
              {client?.projects?.length}
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 rounded p-2">
            <div className="text-gray-500">Reminders</div>
            <div className="font-semibold text-gray-900 dark:text-gray-100 mt-1">
              {client?.reminders?.length}
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 rounded p-2">
            <div className="text-gray-500">Logs</div>
            <div className="font-semibold text-gray-900 dark:text-gray-100 mt-1">
              {client?.logs?.length}
            </div>
          </div>
        </div>

        {/* Latest Activity */}
        {latestActivity && (
          <div className="mt-4 text-xs">
            <div className="text-gray-500 mb-1">Latest Activity</div>
            <div className="flex items-center">
              {latestActivity.type === "log" ? (
                <FileText className="h-3 w-3 mr-1 text-purple-500 dark:text-purple-400" />
              ) : (
                <Clock className="h-3 w-3 mr-1 text-yellow-500 dark:text-yellow-400" />
              )}
              <span className="text-gray-700 dark:text-gray-300">
                {latestActivity.type === "log" ? "Log: " : "Reminder: "}
                {latestActivity.title}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Card Footer */}
      <div className="px-5 py-3 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-500 mt-2">
        <div className="flex justify-between items-center">
          <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
            <Calendar className="h-3 w-3 mr-1" />
            {getTimeAgo(client.createdAt.toString())}
          </div>
          <Link
            href={`/clients/${client.id}`}
            className="text-sm text-green-600 hover:text-green-800 font-medium"
          >
            View
          </Link>
        </div>
      </div>
    </div>
  );
}
