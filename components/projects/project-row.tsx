import { Project } from "@/lib/types";
import { Clock, FileText } from "lucide-react";
import Link from "next/link";


interface ProjectRowProps {
  project: Project;
}

export default function ProjectRow({ project }: ProjectRowProps) {
  // Format date function
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    });
  };

  // Status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Progress":
        return "bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-100";
      case "Completed":
        return "bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-100";
      case "Pending":
        return "bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-100";
      default:
        return "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100";
    }
  };

  // Check if project is overdue
  const isOverdue = () => {
    const deadlineDate = new Date(project.deadline);
    const currentDate = new Date();
    return currentDate > deadlineDate && project.status !== "Completed";
  };

  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap">
        <Link
          href={`/projects/${project.id}`}
          className="text-sm font-medium text-gray-900 dark:text-gray-100 hover:text-blue-600 transition-colors"
        >
          {project.title}
        </Link>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="text-sm text-gray-900 dark:text-gray-100">
            {project.client.name}
          </div>
          {project.client.company && (
            <div className="ml-1 text-xs text-gray-500 dark:text-gray-400">
              ({project.client.company})
            </div>
          )}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
          ${project.budget.toLocaleString()}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div
          className={`text-sm ${
            isOverdue()
              ? "text-red-600 dark:text-red-400 font-medium"
              : "text-gray-500 dark:text-gray-400"
          }`}
        >
          {formatDate(project.deadline.toString())}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
            project.status
          )}`}
        >
          {project.status}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex items-center justify-end space-x-3">
          {(project.reminders.length > 0 || project.logs.length > 0) && (
            <div className="flex space-x-2">
              {project.reminders.length > 0 && (
                <div
                  className="flex items-center"
                  title={`${project.reminders.length} reminders`}
                >
                  <Clock className="w-3 h-3 text-yellow-400 dark:text-yellow-400"/>
                  <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">
                    {project.reminders.length}
                  </span>
                </div>
              )}
              {project.logs.length > 0 && (
                <div
                  className="flex items-center"
                  title={`${project.logs.length} logs`}
                >
                  <FileText className="h-3 w-3 mr-1 text-purple-500 dark:text-purple-400" />
                  <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">
                    {project.logs.length}
                  </span>
                </div>
              )}
            </div>
          )}
          <Link
            href={`/projects/${project.id}/edit`}
            className="text-green-600 hover:text-green-900"
          >
            Edit
          </Link>
        </div>
      </td>
    </tr>
  );
}
