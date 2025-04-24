import Image from "next/image";
import Link from "next/link";
import { MoreHorizontal } from "lucide-react";

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string | null;
  notes?: string | null;
  projects: Array<{ id: string }>; // Simplified project interface
  user: { id: string };
  createdAt: Date;
  updatedAt: Date;
}

interface ClientRowProps {
  client: Client;
}

export default function ClientRow({ client }: ClientRowProps) {
  // Calculate derived values
  const projectCount = client.projects.length;
  
  return (
    <tr key={client.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10">
            <Image
              src={"/user_placeholder.jpg"}
              width={50}
              height={50}
              alt={client.name}
              className="w-12 rounded-full bg-gray-200 dark:bg-gray-700 aspect-square"
            />
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              {client.name}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {client.company || "No company"}
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900 dark:text-white">
          {client.phone}
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {client.email}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
        {client.notes || "No notes"}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
        {projectCount} {projectCount === 1 ? "project" : "projects"}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
        {new Date(client.createdAt).toLocaleDateString()}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
            projectCount > 0
              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
              : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
          }`}
        >
          {projectCount > 0 ? "Active" : "No projects"}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <Link
          href={`/clients/${client.id}`}
          className="text-emerald-600 hover:text-emerald-800 dark:text-emerald-500 dark:hover:text-emerald-400 mr-3"
        >
          View
        </Link>
        <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
          <MoreHorizontal className="h-5 w-5 inline" />
        </button>
      </td>
    </tr>
  );
}