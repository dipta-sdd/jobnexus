import Image from "next/image";
import Link from "next/link";
import { Calendar, FileText, Mail, MapPin, MoreHorizontal, Phone, Star, Trash2, User } from "lucide-react";

interface Client {
  id: string;
  name: string;
  industry: string;
  contact: string;
  email: string;
  phone: string;
  location: string;
  projects: number;
  totalValue: string;
  status: string;
  image: string;
  lastContact: string;
  notes: string;
}

interface ClientRowProps {
  client: Client;
}

export default function ClientCard({ client }: ClientRowProps) {
  

  return (
    <div className="bg-white dark:bg-gray-800  shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center">
            <Image
              src={"/user_placeholder.jpg"}
              width={20}
              height={20}
              alt={client.name}
              className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700"
            />
            <div className="ml-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                {client.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {client.industry}
              </p>
            </div>
          </div>
          <div className="dropdown relative">
            <button className="p-1 rounded-md text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
              <MoreHorizontal className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <div className="flex items-center text-sm">
            <User className="h-4 w-4 text-gray-400 mr-2" />
            <span className="text-gray-600 dark:text-gray-300">
              {client.contact}
            </span>
          </div>
          <div className="flex items-center text-sm">
            <Mail className="h-4 w-4 text-gray-400 mr-2" />
            <span className="text-gray-600 dark:text-gray-300">
              {client.email}
            </span>
          </div>
          <div className="flex items-center text-sm">
            <Phone className="h-4 w-4 text-gray-400 mr-2" />
            <span className="text-gray-600 dark:text-gray-300">
              {client.phone}
            </span>
          </div>
          <div className="flex items-center text-sm">
            <MapPin className="h-4 w-4 text-gray-400 mr-2" />
            <span className="text-gray-600 dark:text-gray-300">
              {client.location}
            </span>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center text-gray-500 dark:text-gray-400">
              <FileText className="h-4 w-4 mr-1" />
              <span>
                {client.projects}{" "}
                {client.projects === 1 ? "project" : "projects"}
              </span>
            </div>
            <div className="flex items-center text-gray-500 dark:text-gray-400">
              <Calendar className="h-4 w-4 mr-1" />
              <span>Last contact: {client.lastContact}</span>
            </div>
          </div>

          <div className="mt-4">
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              Total Value: {client.totalValue}
            </div>
            <div className="mt-1 flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-4 w-4 ${
                    star <= Math.ceil(client.projects / 2)
                      ? "text-yellow-400 fill-current"
                      : "text-gray-300 dark:text-gray-600"
                  }`}
                />
              ))}
              <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                Client rating
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-3 bg-gray-50 dark:bg-gray-700/30 flex justify-between">
        <Link
          href={`/clients/${client.id}`}
          className="text-sm font-medium text-emerald-600 hover:text-emerald-800 dark:text-emerald-500 dark:hover:text-emerald-400"
        >
          View Details
        </Link>
        <button className="text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 flex items-center">
          <Trash2 className="h-4 w-4 mr-1" />
          Delete
        </button>
      </div>
    </div>
  );
}
