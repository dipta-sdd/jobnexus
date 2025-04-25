"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Calendar,
  Clock,
  DollarSign,
  FileText,
  User,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  AlertCircle,
  Check,
} from "lucide-react";
import Modal from "@/components/ui/Modal";
import api from "@/lib/axios";
import { Project, Reminder, Client } from "@/lib/types";
import AddInteractionLog from "@/components/interaction-logs/add-interaction-log";
import AddReminder from "@/components/reminders/add-reminder";
import { formatDistance } from "date-fns";
import ProjectDetailsLoader from "@/components/loaders/project-details-loader";
import { Description } from "@/components/ui/Description";
import { InteractionLog } from "@/lib/generated/prisma";
import { toast } from "react-hot-toast";
import AddProject from "@/components/projects/add-project";
import { filterReminders } from "@/lib/utils/reminder-filters";

export default function ProjectPage() {
  const { id } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  const fetchProject = async () => {
    try {
      const res = await api.get(`/projects/${id}`);
      setProject(res.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching project:", error);
    }
  };

  const fetchClients = async () => {
    try {
      const res = await api.get("/clients");
      setClients(res.data);
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  };

  useEffect(() => {
    fetchProject();
    fetchClients();
  }, [id]);

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Format time function
  const formatTime = (dateString: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

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
      case "In Progress":
        return "bg-blue-100 text-blue-800";
      case "Completed":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Calculate project progress
  const calculateProgress = () => {
    const startDate = new Date(project?.startDate || "");
    const deadlineDate = new Date(project?.deadline || "");
    const currentDate = new Date();

    // Calculate total duration and elapsed time
    const totalDuration = deadlineDate.getTime() - startDate.getTime();
    const elapsedTime = currentDate.getTime() - startDate.getTime();

    // Calculate progress percentage (capped between 0-100)
    let progress = Math.floor((elapsedTime / totalDuration) * 100);
    progress = Math.max(0, Math.min(progress, 100));

    // Determine if project is overdue
    const isOverdue =
      currentDate > deadlineDate && project?.status !== "Completed";

    // Days remaining calculation
    const daysRemaining = Math.ceil(
      (deadlineDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    return {
      percentage: progress,
      isOverdue,
      daysRemaining,
      totalDays: Math.ceil(totalDuration / (1000 * 60 * 60 * 24)),
      elapsedDays: Math.ceil(elapsedTime / (1000 * 60 * 60 * 24)),
    };
  };

  const progress = calculateProgress();

  useEffect(() => {
    let sortedReminders = [...(project?.reminders || [])].sort(
      (a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime()
    );
    sortedReminders = filterReminders(
      sortedReminders,
      reminderFilter,
      reminderStatusFilter
    );
    setSortedReminders(sortedReminders);
  }, [project?.reminders, reminderFilter, reminderStatusFilter]);

  const sortedLogs = [...(project?.logs || [])].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const handleDeleteLog = async (id: string) => {
    try {
      await api.delete("/interaction-logs/" + id);
      const logs = project?.logs?.filter((log) => {
        return log.id !== id;
      });
      if (logs && project) {
        setProject({ ...project, logs: logs });
      }
      toast.success("Log deleted successfully");
    } catch (error) {
      console.error("Error deleting log:", error);
      toast.error("Failed to delete log");
    }
  };

  const handleDeleteReminder = async (id: string) => {
    try {
      await api.delete("/reminders/" + id);
      const reminders = project?.reminders?.filter((reminder) => {
        return reminder.id !== id;
      });
      if (reminders && project) {
        setProject({ ...project, reminders: reminders });
      }
      toast.success("Reminder deleted successfully");
    } catch (error) {
      console.error("Error deleting reminder:", error);
      toast.error("Failed to delete reminder");
    }
  };

  return (
    <>
      {isLoading || !project ? (
        <ProjectDetailsLoader />
      ) : (
        <div className="w-full mx-auto">
          {/* Project Header */}
          <div className="my-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 capitalize">
                  {project.title}
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  Project ID: {project.id}
                </p>
              </div>
              <div className="mt-4 sm:mt-0 flex items-center gap-3">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                    project.status
                  )}`}
                >
                  {project.status}
                </span>
                <button
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                  onClick={() => {
                    setIsModalOpen(true);
                  }}
                >
                  Edit Project
                </button>
              </div>
            </div>
          </div>

          {/* Project Timeline */}
          <div className="bg-white rounded-xs shadow-sm border border-gray-200 overflow-hidden mb-6">
            <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-medium text-gray-900 flex items-center">
                <Clock className="h-5 w-5 mr-2 text-gray-500" />
                Project Timeline
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm text-gray-500 mb-1">Start Date</div>
                  <div className="text-lg font-medium text-gray-900 flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-blue-500" />
                    {formatDate(project.startDate)}
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm text-gray-500 mb-1">Deadline</div>
                  <div className="text-lg font-medium text-gray-900 flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-red-500" />
                    {formatDate(project.deadline)}
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm text-gray-500 mb-1">Duration</div>
                  <div className="text-lg font-medium text-gray-900 flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-purple-500" />
                    {progress.totalDays} days
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-2">
                <div className="flex justify-between text-sm text-gray-500 mb-1">
                  <span>Progress</span>
                  <span>{progress.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className={`h-2.5 rounded-full ${
                      project.status === "Completed"
                        ? "bg-green-500"
                        : progress.isOverdue
                        ? "bg-red-500"
                        : "bg-blue-500"
                    }`}
                    style={{ width: `${progress.percentage}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex justify-between items-center mt-2">
                <div className="text-sm text-gray-500">
                  Day {progress.elapsedDays} of {progress.totalDays}
                </div>
                <div className="text-sm font-medium">
                  {progress.isOverdue ? (
                    <span className="text-red-600 flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-1" />
                      Overdue by {Math.abs(progress.daysRemaining)} days
                    </span>
                  ) : project.status === "Completed" ? (
                    <span className="text-green-600 flex items-center">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Completed
                    </span>
                  ) : (
                    <span className="text-blue-600">
                      {progress.daysRemaining} days remaining
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Project Details */}
            <div className="md:col-span-2 space-y-3">
              {/* Project Information */}
              <div className="bg-white rounded-xs shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
                  <h2 className="text-lg font-medium text-gray-900 flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-gray-500" />
                    Project Information
                  </h2>
                </div>
                <div className="p-6">
                  <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Description
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100 break-words">
                        <Description
                          text={
                            project?.description || "No description provided"
                          }
                          length={50}
                        />
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500 flex items-center">
                        <DollarSign className="h-4 w-4 mr-1 text-gray-400" />
                        Budget
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        ${project.budget}
                      </dd>
                    </div>
                    <div className="col-span-2">
                      <details className="text-sm">
                        <summary className="text-gray-500 font-medium cursor-pointer hover:text-gray-700">
                          System Information
                        </summary>
                        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-4 pl-4 text-gray-500">
                          <div>
                            <dt className="text-xs font-medium">Created</dt>
                            <dd className="mt-1">
                              {formatDate(project.createdAt)} at{" "}
                              {formatTime(project.createdAt)}
                            </dd>
                            <dd className="mt-1 text-xs">
                              ({getTimeAgo(project.createdAt)})
                            </dd>
                          </div>
                          <div>
                            <dt className="text-xs font-medium">
                              Last Updated
                            </dt>
                            <dd className="mt-1">
                              {formatDate(project.updatedAt)} at{" "}
                              {formatTime(project.updatedAt)}
                            </dd>
                            <dd className="mt-1 text-xs">
                              ({getTimeAgo(project.updatedAt)})
                            </dd>
                          </div>
                        </div>
                      </details>
                    </div>
                  </dl>
                </div>
              </div>

              {/* Activity Logs */}
              <div className="bg-white rounded-xs shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                  <h2 className="text-lg font-medium text-gray-900 flex items-center">
                    <RefreshCw className="h-5 w-5 mr-2 text-gray-500" />
                    Interaction Logs
                  </h2>
                  <span className="text-sm text-gray-500">
                    {sortedLogs.length} entries
                  </span>
                </div>
                <div>
                  {sortedLogs.length > 0 ? (
                    <ul className="divide-y divide-gray-200">
                      {sortedLogs.map((log) => (
                        <li key={log.id} className="px-6 py-4">
                          <div className="flex items-start">
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium text-gray-900 capitalize">
                                {log.type} {getTimeAgo(log.date.toString())}
                              </p>
                            </div>
                            <div className="ml-4">
                              <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                                {formatDate(log.date.toString())} ,{" "}
                                {formatTime(log.date.toString())}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 justify-between mt-1">
                            <Description
                              text={log.notes || "No notes provided"}
                              length={100}
                            />
                            <div className="flex items-center gap-2">
                              <button
                                className="text-sm text-blue-500 hover:text-blue-600 cursor-pointer"
                                onClick={() => {
                                  setEditLog(log);
                                  setIsEditLogModalOpen(true);
                                }}
                              >
                                Edit
                              </button>
                              <button
                                className="text-sm text-red-500 hover:text-red-600 cursor-pointer"
                                onClick={() => {
                                  handleDeleteLog(log.id);
                                }}
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="px-6 py-5 text-center text-sm text-gray-500">
                      No activity logs found
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
                    + Add new interaction log
                  </button>
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
                        onChange={(e) =>
                          setReminderStatusFilter(e.target.value)
                        }
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

                        return (
                          <li
                            key={reminder.id}
                            className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700"
                          >
                            <div className="flex items-start justify-between">
                              <div>
                                <div className="flex items-center">
                                  {reminder.status === "Completed" ? (
                                    <CheckCircle className="h-4 w-4 text-green-500 dark:text-green-400 mr-1" />
                                  ) : isUpcoming ? (
                                    <AlertCircle className="h-4 w-4 text-red-500 dark:text-red-400 mr-1" />
                                  ) : (
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
                                  {formatDate(reminder.dueDate.toString())} at{" "}
                                  {formatTime(reminder.dueDate.toString())}
                                </span>
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
                                  onClick={() =>
                                    handleDeleteReminder(reminder.id)
                                  }
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

            {/* Client Information */}
            <div className="space-y-3">
              <div className="bg-white rounded-xs shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
                  <h2 className="text-lg font-medium text-gray-900 flex items-center">
                    <User className="h-5 w-5 mr-2 text-gray-500" />
                    Client Information
                  </h2>
                </div>
                <div className="p-6">
                  <dl className="space-y-4">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Name
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {project.client.name}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Email
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        <a
                          href={`mailto:${project.client.email}`}
                          className="text-blue-600 hover:text-blue-500"
                        >
                          {project.client.email}
                        </a>
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Phone
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        <a
                          href={`tel:${project.client.phone}`}
                          className="text-blue-600 hover:text-blue-500"
                        >
                          {project.client.phone}
                        </a>
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Company
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {project.client.company}
                      </dd>
                    </div>
                    {project.client.notes && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">
                          Notes
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {project.client.notes}
                        </dd>
                      </div>
                    )}
                  </dl>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xs shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
                  <h2 className="text-lg font-medium text-gray-900">
                    Quick Actions
                  </h2>
                </div>
                <div className="p-6 space-y-3">
                  <button
                    onClick={() => setIsAddLogModalOpen(true)}
                    className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Add Interaction Log
                  </button>
                  <button
                    onClick={() => setIsAddReminderModalOpen(true)}
                    className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700"
                  >
                    Add Reminder
                  </button>
                  <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                    Contact Client
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* edit project modal */}
          <Modal
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
            }}
            title="Edit Project"
          >
            <AddProject
              clients={clients}
              project={project}
              onClose={() => {
                setIsModalOpen(false);
              }}
              onUpdate={(data: Project) => {
                setProject({
                  ...project,
                  ...data,
                });
                setIsModalOpen(false);
              }}
            />
          </Modal>
          {/* add log modal */}
          <Modal
            isOpen={isAddLogModalOpen}
            onClose={() => {
              setIsAddLogModalOpen(false);
            }}
            title="Add Interaction Log"
          >
            <AddInteractionLog
              clients={clients}
              onClose={(data?: InteractionLog) => {
                if (data) {
                  setProject({
                    ...project,
                    logs: [...(project?.logs || []), data],
                  });
                }
                setIsAddLogModalOpen(false);
              }}
              clientId={project?.clientId}
              projectId={project?.id}
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
              clients={clients}
              onClose={() => {
                setIsEditLogModalOpen(false);
              }}
              log={editLog}
              onUpdate={(data: InteractionLog) => {
                setProject({
                  ...project,
                  logs: project?.logs?.map((log) =>
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
              clients={clients}
              clientId={project?.clientId}
              projectId={project?.id}
              onClose={(data?: Reminder) => {
                if (data) {
                  setProject({
                    ...project,
                    reminders: [...(project?.reminders || []), data],
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
              clients={clients}
              clientId={project?.clientId}
              onClose={() => {
                setIsAddReminderModalOpen(false);
              }}
              reminder={editReminder}
              onUpdate={(data: Reminder) => {
                setProject({
                  ...project,
                  reminders: project?.reminders?.map((reminder: Reminder) =>
                    reminder.id === editReminder?.id ? data : reminder
                  ),
                });
                setIsEditReminderModalOpen(false);
              }}
            />
          </Modal>
        </div>
      )}
    </>
  );
}
