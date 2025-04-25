"use client";
import { formatDistance } from "date-fns";
import {
  FolderKanban,
  Mail,
  Phone,
  Building,
  FileText,
  User,
  Calendar,
  Clock,
  AlertCircle,
  MessageSquare,
  PhoneCall,
  Video,
  FileEdit,
  Folder,
  FolderClosed,
} from "lucide-react";
import Link from "next/link";
import type { Client, Project, InteractionLog, Reminder } from "@/lib/types";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import Modal from "@/components/ui/Modal";
import AddClient from "@/components/clients/add-client";
import AddProject from "@/components/projects/add-project";
import AddInteractionLog from "@/components/interaction-logs/add-interaction-log";
import AddReminder from "@/components/reminders/add-reminder";
import { toast } from "react-hot-toast";
import { Description } from "@/components/ui/Description";
import { filterReminders } from "@/lib/utils/reminder-filters";

export default function ClientPage() {
  const { clientId } = useParams();
  const [client, setClient] = useState<Client | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddProjectModalOpen, setIsAddProjectModalOpen] = useState(false);
  const [isAddLogModalOpen, setIsAddLogModalOpen] = useState(false);
  const [isAddReminderModalOpen, setIsAddReminderModalOpen] = useState(false);
  const [isEditReminderModalOpen, setIsEditReminderModalOpen] = useState(false);
  const [isEditLogModalOpen, setIsEditLogModalOpen] = useState(false);
  const [editReminder, setEditReminder] = useState<Reminder | null>(null);
  const [editLog, setEditLog] = useState<InteractionLog | null>(null);
  const [reminderFilter, setReminderFilter] = useState<string>("upcoming7days");
  const [reminderStatusFilter, setReminderStatusFilter] =
    useState<string>("due");
  const [sortedReminders, setSortedReminders] = useState<Reminder[]>([]);

  useEffect(() => {
    fetchClient();
  }, [clientId]);

  useEffect(() => {
    let sortedReminders = [...(client?.reminders || [])].sort(
      (a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime()
    );
    sortedReminders = filterReminders(
      sortedReminders,
      reminderFilter,
      reminderStatusFilter
    );
    setSortedReminders(sortedReminders);
  }, [client?.reminders, reminderFilter, reminderStatusFilter]);

  const fetchClient = async () => {
    try {
      const response = await api.get(`/clients/${clientId}`);
      setClient(response.data);
    } catch (error) {
      console.error("Error fetching client:", error);
    }
  };

  if (!client) return <div>Loading...</div>;

  const formatDate = (dateString: string | Date) => {
    if (!dateString) return "N/A";
    const date =
      typeof dateString === "string" ? new Date(dateString) : dateString;
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Format time function
  const formatTime = (dateString: string | Date) => {
    if (!dateString) return "";
    const date =
      typeof dateString === "string" ? new Date(dateString) : dateString;
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get time ago
  const getTimeAgo = (dateString: string | Date) => {
    if (!dateString) return "";
    const date =
      typeof dateString === "string" ? new Date(dateString) : dateString;
    return formatDistance(date, new Date(), { addSuffix: true });
  };

  // Status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Progress":
        return "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200";
      case "Completed":
        return "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200";
      case "Pending":
        return "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200";
      default:
        return "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200";
    }
  };

  // Get log icon based on type
  const getLogIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "call":
        return <PhoneCall className="h-4 w-4 text-blue-500" />;
      case "meeting":
        return <Video className="h-4 w-4 text-purple-500" />;
      case "note":
        return <FileEdit className="h-4 w-4 text-gray-500" />;
      case "email":
        return <Mail className="h-4 w-4 text-green-500" />;
      case "message":
        return <MessageSquare className="h-4 w-4 text-yellow-500" />;
      default:
        return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  // Calculate client statistics
  const stats = {
    totalProjects: client.projects?.length || 0,
    activeProjects:
      client.projects?.filter((project) => project.status !== "Completed")
        .length || 0,
    completedProjects:
      client.projects?.filter((project) => project.status === "Completed")
        .length || 0,
    totalBudget:
      client.projects?.reduce((sum, project) => sum + project.budget, 0) || 0,
    pendingReminders:
      client.reminders?.filter((reminder) => reminder.status === "Pending")
        .length || 0,
    totalReminders: client.reminders?.length || 0,
    totalLogs: client.logs?.length || 0,
  };

  // Sort projects by deadline (most recent first)
  const sortedProjects = [...(client.projects || [])].sort(
    (a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
  );


  const sortedLogs = [...(client.logs || [])].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const handleDeleteLog = async (id: string) => {
    try {
      await api.delete("/interaction-logs/" + id);
      const logs = client.logs?.filter((log) => {
        return log.id !== id;
      });
      setClient({ ...client, logs: logs });
      toast.success("Log deleted successfully");
    } catch (error) {
      console.error("Error deleting log:", error);
      toast.error("Failed to delete log");
    }
  };

  const handleDeleteReminder = async (id: string) => {
    try {
      await api.delete("/reminders/" + id);
      const reminders = client.reminders.filter((reminder) => {
        return reminder.id !== id;
      });
      setClient({ ...client, reminders: reminders });
      toast.success("Reminder deleted successfully");
    } catch (error) {
      console.error("Error deleting reminder:", error);
      toast.error("Failed to delete reminder");
    }
  };

  return (
    <div className=" mx-auto dark:bg-gray-900 mt-4">
      {/* Client Header */}
      <div className="">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {client.name}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Client since {formatDate(client.createdAt.toString())}
            </p>
          </div>
          <div className=" flex space-x-3">
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Edit Client
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
        {/* Client Details */}
        <div className="md:col-span-2 space-y-3">
          {/* Client Information */}
          <div className="bg-white dark:bg-gray-800 rounded-xs shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                <User className="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400" />
                Client Information
              </h2>
            </div>
            <div className="p-6">
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                    <Mail className="h-4 w-4 mr-1 text-gray-400 dark:text-gray-500" />
                    Email
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                    <a
                      href={`mailto:${client.email}`}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-500"
                    >
                      {client.email}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                    <Phone className="h-4 w-4 mr-1 text-gray-400 dark:text-gray-500" />
                    Phone
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                    <a
                      href={`tel:${client.phone}`}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-500"
                    >
                      {client.phone}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                    <Building className="h-4 w-4 mr-1 text-gray-400 dark:text-gray-500" />
                    Company
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                    {client.company || "Not specified"}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                    <Calendar className="h-4 w-4 mr-1 text-gray-400 dark:text-gray-500" />
                    Last Updated
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                    {getTimeAgo(client.updatedAt)}
                  </dd>
                </div>
                {client.notes && (
                  <div className="sm:col-span-2">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                      <FileText className="h-4 w-4 mr-1 text-gray-400 dark:text-gray-500" />
                      Notes
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
                      {client.notes}
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          </div>

          {/* Client Projects */}
          <div className="bg-white dark:bg-gray-800 rounded-xs shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                <FolderKanban className="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400" />
                Projects
              </h2>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {client.projects.length} projects
              </span>
            </div>
            <div>
              {sortedProjects.length > 0 ? (
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                  {sortedProjects.map((project) => {
                    const isOverdue =
                      new Date() > new Date(project.deadline) &&
                      project.status !== "Completed";
                    return (
                      <li
                        key={project.id}
                        className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <div>
                          <div className="flex items-center justify-between">
                            <Link
                              href={`/projects/${project.id}`}
                              className="text-sm font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
                            >
                              {project.title}
                            </Link>
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                                project.status
                              )}`}
                            >
                              {project.status}
                            </span>
                          </div>
                          <div className="flex items-center mt-1 space-x-4 text-sm text-gray-500 dark:text-gray-400">
                            <span>Budget: ${project.budget}</span>
                            <span
                              className={
                                isOverdue
                                  ? "text-red-600 dark:text-red-400 font-medium"
                                  : ""
                              }
                            >
                              Deadline: {formatDate(project.deadline)}
                            </span>
                          </div>
                          {project.description && (
                            <Description
                              className="text-sm text-gray-500 dark:text-gray-400 mt-1"
                              text={project.description}
                              length={100}
                            />
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <div className="px-6 py-5 text-center text-sm text-gray-500 dark:text-gray-400">
                  No projects found
                </div>
              )}
            </div>
            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
              <Link
                href={`/projects/new?clientId=${client.id}`}
                className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300"
              >
                + Add new project
              </Link>
            </div>
          </div>

          {/* Reminders */}
          <div className="bg-white dark:bg-gray-800 rounded-xs shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                <Clock className="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400" />
                Reminders
              </h2>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  <select
                    className="text-sm text-gray-500 dark:text-gray-400"
                    value={reminderFilter}
                    onChange={(e) => setReminderFilter(e.target.value)}
                  >
                    <option value="all">All</option>
                    <option value="today">Today</option>
                    <option value="tomorrow">Tomorrow</option>
                    <option value="thisweek">This Week</option>
                    <option value="nextweek">Next Week</option>
                    <option value="thismonth">This Month</option>
                    <option value="nextmonth">Next Month</option>
                    <option value="thisyear">This Year</option>
                    <option value="nextyear">Next Year</option>
                    <option value="upcoming">Upcoming</option>
                    <option value="upcoming7days">Upcoming 7 days</option>
                    <option value="upcoming30days">Upcoming 30 days</option>
                    <option value="past">Past</option>
                    <option value="past7days">Past 7 days</option>
                    <option value="past30days">Past 30 days</option>
                  </select>
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  <select
                    className="text-sm text-gray-500 dark:text-gray-400"
                    value={reminderStatusFilter}
                    onChange={(e) => setReminderStatusFilter(e.target.value)}
                  >
                    <option value="all">All</option>
                    <option value="completed">Completed</option>
                    <option value="due">Due</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </span>
              </div>
            </div>
            <div>
              {sortedReminders.length > 0 ? (
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                  {sortedReminders.map((reminder) => {
                    const isPast =
                      new Date() > new Date(reminder.dueDate) &&
                      reminder.status !== "Completed";
                    const isUpcoming =
                      new Date() < new Date(reminder.dueDate) &&
                      reminder.status !== "Completed";

                    const project = (client.projects || []).find(
                      (p) => p.id === reminder.projectId
                    );

                    return (
                      <li
                        key={reminder.id}
                        className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center">
                              {isUpcoming && (
                                <AlertCircle className="h-4 w-4 text-yellow-500 dark:text-yellow-400 mr-1" />
                              )}
                              <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                                {reminder.title}
                              </h3>
                            </div>
                            <Description
                              className="text-sm text-gray-500 dark:text-gray-400 mt-1"
                              text={reminder.notes || ""}
                              length={100}
                            />
                          </div>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                              reminder.status
                            )}`}
                          >
                            {reminder.status}
                          </span>
                        </div>
                        <div className="flex items-end justify-between">
                          <div className="mt-2 flex items-center text-xs text-gray-500 dark:text-gray-400">
                            <Calendar className="h-3 w-3 mr-1 my-auto" />
                            <span
                              className={
                                isPast
                                  ? "text-red-600 dark:text-red-400 font-medium"
                                  : ""
                              }
                            >
                              {formatDate(reminder.dueDate)} at{" "}
                              {formatTime(reminder.dueDate)}
                            </span>
                            {project && (
                              <Link
                                href={`/projects/${project.id}`}
                                className="ml-2 text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 flex items-center"
                              >
                                <FolderClosed className="h-3 w-3 mr-1" />
                                {project.title}
                              </Link>
                            )}
                          </div>
                          <div className="flex item-center gap-2">
                            <button
                              onClick={() => {
                                setEditReminder(reminder);
                                setIsEditReminderModalOpen(true);
                              }}
                              className="text-sm text-blue-500 hover:text-blue-600 cursor-pointer "
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteReminder(reminder.id)}
                              className="text-sm text-red-500 hover:text-red-600 cursor-pointer "
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <div className="px-6 py-5 text-center text-sm text-gray-500 dark:text-gray-400">
                  No reminders found
                </div>
              )}
            </div>
            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => {
                  setEditReminder(null);
                  setIsAddReminderModalOpen(true);
                }}
                className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300"
              >
                + Add new reminder
              </button>
            </div>
          </div>
        </div>

        {/* Client Stats and Activity */}
        <div className="space-y-3">
          {/* Client Stats */}
          <div className="bg-white dark:bg-gray-800 rounded-xs shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                Client Statistics
              </h2>
            </div>
            <div className="p-6">
              <dl className="space-y-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Total Projects
                  </dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">
                    {stats.totalProjects}
                  </dd>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Active
                    </dt>
                    <dd className="mt-1 text-xl font-semibold text-blue-600 dark:text-blue-400">
                      {stats.activeProjects}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Completed
                    </dt>
                    <dd className="mt-1 text-xl font-semibold text-green-600 dark:text-green-400">
                      {stats.completedProjects}
                    </dd>
                  </div>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Total Budget
                  </dt>
                  <dd className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
                    ${stats.totalBudget}
                  </dd>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Reminders
                    </dt>
                    <dd className="mt-1 text-xl font-semibold text-yellow-600 dark:text-yellow-400">
                      {stats.totalReminders}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Activity Logs
                    </dt>
                    <dd className="mt-1 text-xl font-semibold text-purple-600 dark:text-purple-400">
                      {stats.totalLogs}
                    </dd>
                  </div>
                </div>
              </dl>
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="bg-white dark:bg-gray-800 rounded-xs shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                Activity Logs
              </h2>
            </div>
            <div className="p-6">
              {sortedLogs.length > 0 ? (
                <div className="flow-root">
                  <ul className="-mb-8">
                    {sortedLogs.map((log, logIdx) => {
                      const project = (client.projects || []).find(
                        (p) => p.id === log.projectId
                      );

                      return (
                        <li key={log.id}>
                          <div className="relative pb-8">
                            {logIdx !== sortedLogs.length - 1 ? (
                              <span
                                className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-700"
                                aria-hidden="true"
                              />
                            ) : null}
                            <div className="relative flex items-start space-x-3">
                              <div>
                                <div className="relative px-1">
                                  <div
                                    className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white dark:ring-gray-800 bg-purple-100 dark:bg-purple-300`}
                                  >
                                    {getLogIcon(log.type)}
                                  </div>
                                </div>
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <div className="text-sm font-medium text-gray-900 dark:text-white uppercase">
                                      {log.type}
                                    </div>
                                    <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                                      {formatDate(log.date.toString())} at{" "}
                                      {formatTime(log.date.toString())}
                                    </p>
                                  </div>
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => {
                                        setEditLog(log);
                                        setIsEditLogModalOpen(true);
                                      }}
                                      className="text-sm text-blue-500 hover:text-blue-600 cursor-pointer"
                                    >
                                      Edit
                                    </button>
                                    <button
                                      onClick={() => handleDeleteLog(log.id)}
                                      className="text-sm text-red-500 hover:text-red-600 cursor-pointer"
                                    >
                                      Delete
                                    </button>
                                  </div>
                                </div>
                                <div className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                                  <Description
                                    className="text-sm text-gray-500 dark:text-gray-400 mt-1"
                                    text={log.notes}
                                    length={50}
                                  />
                                </div>
                                {project && (
                                  <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                    <Link
                                      href={`/projects/${project.id}`}
                                      className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 flex items-center"
                                    >
                                      <FolderClosed className="h-3 w-3 mr-1" />
                                      {project.title}
                                    </Link>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ) : (
                <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                  No activity found
                </div>
              )}
            </div>
            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => {
                  setEditLog(null);
                  setIsAddLogModalOpen(true);
                }}
                className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300"
              >
                + Add activity log
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-xs shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                Quick Actions
              </h2>
            </div>
            <div className="p-6 space-y-3">
              <button
                onClick={() => setIsAddProjectModalOpen(true)}
                className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
              >
                Create New Project
              </button>
              <button
                onClick={() => setIsAddLogModalOpen(true)}
                className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600"
              >
                Add Activity Log
              </button>
              <button
                onClick={() => setIsAddReminderModalOpen(true)}
                className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700 dark:bg-yellow-500 dark:hover:bg-yellow-600"
              >
                Add Reminder
              </button>
              <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                Export Client Data
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* client edit modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
        }}
        title="Add New Client"
      >
        <AddClient
          client={client}
          onClose={() => {
            setIsModalOpen(false);
          }}
          onUpdate={(data: Client) => {
            setClient(data);
            setIsModalOpen(false);
          }}
        />
      </Modal>
      {/* add project modal */}
      <Modal
        isOpen={isAddProjectModalOpen}
        onClose={() => {
          setIsAddProjectModalOpen(false);
        }}
        title="Add New Project"
      >
        <AddProject
          clients={[{ ...client }]}
          clientId={client.id}
          onClose={() => {
            setIsAddProjectModalOpen(false);
          }}
          onUpdate={(data: Project) => {
            setClient({
              ...client,
              projects: [...(client.projects || []), data],
            });
            setIsAddProjectModalOpen(false);
          }}
        />
      </Modal>
      {/* add log modal */}
      <Modal
        isOpen={isAddLogModalOpen}
        onClose={() => {
          setIsAddLogModalOpen(false);
        }}
        title="Add Activity Log"
      >
        <AddInteractionLog
          clients={[client]}
          onClose={(data?: InteractionLog) => {
            if (data) {
              setClient({
                ...client,
                logs: [...(client.logs || []), data],
              });
            }
            setIsAddLogModalOpen(false);
          }}
          clientId={client.id}
          onUpdate={(data: InteractionLog) => {}}
        />
      </Modal>
      {/* edit log modal */}
      <Modal
        isOpen={isEditLogModalOpen}
        onClose={() => {
          setIsEditLogModalOpen(false);
        }}
        title="Edit Activity Log"
      >
        <AddInteractionLog
          clients={[client]}
          onClose={() => {
            setIsEditLogModalOpen(false);
          }}
          log={editLog}
          onUpdate={(data: InteractionLog) => {
            setClient({
              ...client,
              logs: client.logs?.map((log) =>
                log.id === editLog?.id ? data : log
              ),
            });
            setIsEditLogModalOpen(false);
          }}
        />
      </Modal>
      {/* add reminder modal */}
      <Modal
        isOpen={isAddReminderModalOpen}
        onClose={() => {
          setIsAddReminderModalOpen(false);
        }}
        title="Add Reminder"
      >
        <AddReminder
          clients={[{ ...client }]}
          clientId={client.id}
          onClose={(data?: Reminder) => {
            if (data) {
              setClient({
                ...client,
                reminders: [...(client.reminders || []), data],
              });
            }
            setIsAddReminderModalOpen(false);
          }}
          onUpdate={(data: Reminder) => {}}
        />
      </Modal>
      {/* edit reminder modal */}
      <Modal
        isOpen={isEditReminderModalOpen}
        onClose={() => {
          setIsEditReminderModalOpen(false);
        }}
        title="Edit Reminder"
      >
        <AddReminder
          clients={[{ ...client }]}
          clientId={client.id}
          onClose={() => {
            setIsAddReminderModalOpen(false);
          }}
          reminder={editReminder}
          onUpdate={(data: Reminder) => {
            setClient({
              ...client,
              reminders: client.reminders?.map((reminder) =>
                reminder.id === editReminder?.id ? data : reminder
              ),
            });
            setIsEditReminderModalOpen(false);
          }}
        />
      </Modal>
    </div>
  );
}
