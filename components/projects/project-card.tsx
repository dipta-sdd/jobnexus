import { Project } from "@/lib/types";
import Link from "next/link";

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link href={'/projects/'+project.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 overflow-hidden hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {project.title}
        </h3>
        <span className="px-2 py-1 text-xs font-medium rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100">
          {project.status}
        </span>
      </div>
      <div className="space-y-2">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Client: {project.client.name}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Budget: ${project.budget.toLocaleString()}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Deadline: {new Date(project.updatedAt).toLocaleDateString()}
        </p>
      </div>
    </Link>
  );
}
