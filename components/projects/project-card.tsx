import { Project } from "@/lib/types";
import { formatDate } from "@/lib/utils/date";
import { Clock, Edit, FileText, Trash2 } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

interface ProjectCardProps {
  project: Project ;
  onEdit: () => void;
  onDelete: () => void;
}

export default function ProjectCard({ project, onEdit, onDelete }: ProjectCardProps) {


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

  // Calculate project progress and timeline information
  const { progressPercentage, isOverdue, daysRemaining, statusColor } =
    useMemo(() => {
      const startDate = new Date(project.startDate);
      const deadlineDate = new Date(project.deadline);
      const currentDate = new Date();

      // Calculate total duration and elapsed time
      const totalDuration = deadlineDate.getTime() - startDate.getTime();
      const elapsedTime = currentDate.getTime() - startDate.getTime();

      // Calculate progress percentage (capped between 0-100)
      let progress = Math.floor((elapsedTime / totalDuration) * 100);
      progress = Math.max(0, Math.min(progress, 100));

      // Determine if project is overdue
      const overdue =
        currentDate > deadlineDate && project.status !== "Completed";

      // Days remaining calculation
      const remaining = Math.ceil(
        (deadlineDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      // Determine status color
      const color =
        project.status === "Completed"
          ? "bg-blue-500 dark:bg-blue-700"
          : overdue
          ? "bg-red-500 dark:bg-red-700"
          : "bg-green-500 dark:bg-green-700";

      return {
        progressPercentage: progress,
        isOverdue: overdue,
        daysRemaining: remaining,
        statusColor: color,
      };
    }, [project.startDate, project.deadline, project.status]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700 flex flex-col">
      {/* Card Header with Status */}
      <div className="relative">
        <div className={`h-2 w-full ${statusColor}`}></div>

        <div className="p-5 pb-3">
          <div className="flex justify-between items-start">
            <Link href={`/projects/${project.id}`} className="block">
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 hover:text-blue-600 transition-colors">
                {project.title}
              </h2>
            </Link>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                project.status
              )}`}
            >
              {project.status}
            </span>
          </div>

          <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Client:{" "}
            <span className="text-gray-700 dark:text-gray-300 font-medium">
              {project.client.name}
            </span>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="px-5 py-2 flex-grow">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-gray-500 dark:text-gray-400">Budget</div>
            <div className="font-semibold text-gray-900 dark:text-gray-100">
              ${project.budget.toLocaleString()}
            </div>
          </div>
          <div>
            <div className="text-gray-500 dark:text-gray-400">Deadline</div>
            <div
              className={`font-semibold ${
                isOverdue
                  ? "text-red-600 dark:text-red-400"
                  : "text-gray-900 dark:text-gray-100"
              }`}
            >
              {formatDate(new Date(project.deadline))}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
            <span>Progress</span>
            <span>{progressPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${statusColor}`}
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {isOverdue ? (
              <span className="text-red-600 dark:text-red-400 font-medium">
                Overdue by {Math.abs(daysRemaining)} days
              </span>
            ) : project.status === "Completed" ? (
              <span className="text-blue-600 dark:text-blue-400">
                Completed
              </span>
            ) : (
              <span>{daysRemaining} days remaining</span>
            )}
          </div>
        </div>
      </div>

      {/* Card Footer */}
      <div className="px-5 py-3 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-500 mt-2">
        <div className="flex justify-between items-center">
          <div className="flex space-x-4 text-xs text-gray-500 dark:text-gray-400">
            {project?.reminders?.length && project?.reminders?.length > 0 && (
              <div className="flex items-center">
                <Clock className="w-3 h-3 text-yellow-400 dark:text-yellow-400 mr-1" />
                <span>
                  {project?.reminders?.length} reminder
                  {project?.reminders?.length !== 1 ? "s" : ""}
                </span>
              </div>
            )}
            {project?.logs?.length && project?.logs?.length > 0 && (
              <div className="flex items-center">
                <FileText className="h-3 w-3 mr-1 text-purple-500 dark:text-purple-400" />
                <span>
                  {project?.logs?.length} log
                  {project?.logs?.length !== 1 ? "s" : ""}
                </span>
              </div>
            )}
          </div>
          <div
            className="flex space-x-1 transition-all duration-200 hover:opacity-100 opacity-30"
          >
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
