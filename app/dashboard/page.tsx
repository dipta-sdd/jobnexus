"use client";
import api from '@/lib/axios';

import { useEffect, useState } from "react";
import { Bar, Doughnut, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from "chart.js";
import {
  Calendar,
  DollarSign,
  FileText,
  Phone,
  User,
  Users,
  AlertTriangle,
  CheckCircle,
  ClockIcon,
  Mail,
  MessageSquare,
  Bell,
  BarChart2,
  Building,
  Filter,
} from "lucide-react";
import Link from "next/link";
import formatDateTime from "@/lib/utils/date";
import { DashboardLoader } from '@/components/loaders/dashboardLoader';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);


export default function Dashboard() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [tmpStartDate, setTmpStartDate] = useState("");
  const [tmpEndDate, setTmpEndDate] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, [startDate, endDate]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);
      const response = await api.get(`/dashboard?${params.toString()}`);
      setData(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setIsLoading(false);
    }
  };
  if (isLoading) {
    return <DashboardLoader />;
  }

  const projectStatusData = {
    labels: data?.projectsByStatus.map((item) => item.status) || [],
    datasets: [
      {
        data: data?.projectsByStatus.map((item) => item._count) || [],
        backgroundColor: ["rgba(96, 165, 250, 0.8)", "rgba(250, 204, 21, 0.8)"],
        borderColor: ["rgba(96, 165, 250, 1)", "rgba(250, 204, 21, 1)"],
        borderWidth: 1,
      },
    ],
  };

  const logsByTypeData = {
    labels: data?.logsByType.map((item) => item.type) || [],
    datasets: [
      {
        label: "Logs by Type",
        data: data?.logsByType.map((item) => item._count) || [],
        backgroundColor: ["rgba(74, 222, 128, 0.7)", "rgba(167, 139, 250, 0.7)"],
        borderColor: ["rgba(74, 222, 128, 1)", "rgba(167, 139, 250, 1)"],
        borderWidth: 1,
      },
    ],
  };

  const topBudgetClientsData = {
    labels: data?.topBudgetClients.map((client) => client.name) || [],
    datasets: [
      {
        label: "Budget ($)",
        data: data?.topBudgetClients.map((client) => client._sum.budget) || [],
        backgroundColor: "rgba(248, 113, 113, 0.8)",
        borderColor: "rgba(248, 113, 113, 1)",
        borderWidth: 1,
      },
      {
        label: "Project Count",
        data: data?.topBudgetClients.map((client) => client._count) || [] ,
        backgroundColor: "rgba(96, 165, 250, 0.8)",
        borderColor: "rgba(96, 165, 250, 1)",
        borderWidth: 1,
      },
    ],
  };
  const topProjectsCountClientsData = {
    labels: data?.topCountProjectsClients.map((client) => client.name) || [],
    datasets: [
      {
        label: "Budget ($)",
        data:
          data?.topCountProjectsClients.map((client) => client._sum.budget) ||
          [],
        backgroundColor: "rgba(248, 113, 113, 0.8)",
        borderColor: "rgba(248, 113, 113, 1)",
        borderWidth: 1,
      },
      {
        label: "Project Count",
        data:
          data?.topCountProjectsClients.map((client) => client._count) || [],
        backgroundColor: "rgba(96, 165, 250, 0.8)",
        borderColor: "rgba(96, 165, 250, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Format date function
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  // Get icon based on log type
  const getLogIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "call":
        return <Phone className="h-5 w-5 text-green-600 dark:text-green-400" />;
      case "meeting":
        return (
          <MessageSquare className="h-5 w-5 text-purple-600 dark:text-purple-400" />
        );
      default:
        return (
          <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        );
    }
  };

  // Get background color based on log type
  const getLogBgColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "call":
        return "bg-green-100 dark:bg-green-900";
      case "meeting":
        return "bg-purple-100 dark:bg-purple-900";
      default:
        return "bg-blue-100 dark:bg-blue-900";
    }
  };

  const totalOverdueReminders = data?.overdueReminders.length || 0;   


  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-xs border border-gray-200 dark:border-gray-700 mt-4">
        <div className="mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
               Dashboard
            </h1>
            <div className="flex items-center gap-3">
              {/* Date Filter */}
              <div className="relative">
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <Filter className="h-4 w-4" />
                  <span>Filter</span>
                </button>

                {isFilterOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-md shadow-lg p-4 z-10 border border-gray-200 dark:border-gray-700">
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Date Range
                    </h3>
                    <div className="flex flex-col gap-3">
                      <div>
                        <label
                          htmlFor="start-date"
                          className="block text-xs text-gray-500 dark:text-gray-400 mb-1"
                        >
                          Start Date
                        </label>
                        <input
                          type="date"
                          id="start-date"
                          value={tmpStartDate}
                          onChange={(e) => setTmpStartDate(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="end-date"
                          className="block text-xs text-gray-500 dark:text-gray-400 mb-1"
                        >
                          End Date
                        </label>
                        <input
                          type="date"
                          id="end-date"
                          value={tmpEndDate}
                          onChange={(e) => setTmpEndDate(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700"
                        />
                      </div>
                      <div className="flex justify-between">
                        <button
                          onClick={() => {
                            setStartDate("");
                            setEndDate("");
                            setTmpStartDate("");
                            setTmpEndDate("");
                          }}
                          className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                        >
                          Clear
                        </button>
                        <button
                          onClick={() => {
                            setIsFilterOpen(false);
                            setStartDate(tmpStartDate);
                            setEndDate(tmpEndDate);
                          }}
                          className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="mt-4">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6 gap-3 mb-3">
          <div className="bg-white dark:bg-gray-800 rounded-xs shadow p-5 flex items-center">
            <div className="rounded-full bg-blue-100 dark:bg-blue-900 p-3 mr-4">
              <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Total Clients
              </p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {data.totalClients}
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xs shadow p-5 flex items-center">
            <div className="rounded-full bg-green-100 dark:bg-green-900 p-3 mr-4">
              <FileText className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Total Projects
              </p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {data.totalProjects}
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xs shadow p-5 flex items-center">
            <div className="rounded-full bg-purple-100 dark:bg-purple-900 p-3 mr-4">
              <Phone className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Total Logs
              </p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {data.totalLogs}
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xs shadow p-5 flex items-center">
            <div className="rounded-full bg-green-100 dark:bg-green-900 p-3 mr-4">
              <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Total Budget
              </p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                ${data.totalBudget}
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xs shadow p-5 flex items-center">
            <div className="rounded-full bg-yellow-100 dark:bg-yellow-900 p-3 mr-4">
              <Bell className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Reminders
              </p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {data.totalReminders}
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xs shadow p-5 flex items-center">
            <div className="rounded-full bg-red-100 dark:bg-red-900 p-3 mr-4">
              <Bell className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Overdue Reminders
              </p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {totalOverdueReminders}
              </p>
            </div>
          </div>
        </div>

        {/* Charts and Tables Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-3">
          {/* Project Status Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-xs shadow p-6 col-span-1">
            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Projects by Status
            </h2>
            <div className="h-64 flex items-center justify-center">
              <Doughnut
                data={projectStatusData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: "bottom",
                      labels: {
                        color: "#71717A",
                      },
                    },
                  },
                }}
              />
            </div>
          </div>

          {/* Logs by Type Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-xs shadow p-6 col-span-1">
            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Logs by Type
            </h2>
            <div className="h-64 flex items-center justify-center">
              <Pie
                data={logsByTypeData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: "bottom",
                      labels: {
                        color: "#71717A",
                      },
                    },
                  },
                }}
              />
            </div>
          </div>

          {/* Budget by Client Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-xs shadow p-6 col-span-1">
            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Budget by Client
            </h2>
            <div className="h-64 flex items-center justify-center">
              <Bar
                data={topBudgetClientsData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      ticks: {
                        color: "#71717A",
                      },
                      grid: {
                        color: "#71717A50",
                      },
                    },
                    x: {
                      ticks: {
                        color: "#71717A",
                      },
                      grid: {
                        color: "#71717A50",
                      },
                    },
                  },
                }}
              />
            </div>
          </div>
          {/* Projects by Client Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-xs shadow p-6 col-span-1">
            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Projects by Client
            </h2>
            <div className="h-64 flex items-center justify-center">
              <Bar
                data={topProjectsCountClientsData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      ticks: {
                        color: "#71717A",
                      },
                      grid: {
                        color: "#71717A50",
                      },
                    },
                    x: {
                      ticks: {
                        color: "#71717A",
                      },
                      grid: {
                        color: "#71717A50",
                      },
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>

        {/* Latest Project and Reminders */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {/* Latest Project */}
          <div className="bg-white dark:bg-gray-800 rounded-xs shadow p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Latest Project
            </h2>
            {data.latestProject && (
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {data.latestProject.title}
                  </h3>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      data.latestProject.status === "Pending"
                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                        : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                    }`}
                  >
                    {data.latestProject.status}
                  </span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  {data.latestProject.description}
                </p>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Client:</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {data.latestProject.client.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Budget:</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      ${data.latestProject.budget}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">
                      Start Date:
                    </p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {formatDate(data.latestProject.startDate)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">
                      Deadline:
                    </p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {formatDate(data.latestProject.deadline)}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Upcoming Reminders */}
          <div className="bg-white dark:bg-gray-800 rounded-xs shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Upcoming Reminders
              </h2>
            </div>
            {data.upcomingReminders && data.upcomingReminders.length > 0 ? (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {data.upcomingReminders.map((reminder) => (
                  <div key={reminder.id} className="px-6 py-4">
                    <div className="flex items-start">
                      <div className="bg-yellow-100 dark:bg-yellow-900 rounded-full p-2 mr-4">
                        <Bell className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {reminder.title}
                          </p>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {formatDate(reminder.dueDate)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 truncate">
                          {reminder.notes || "No notes"}
                        </p>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                          <User className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400 dark:text-gray-500" />
                          <p className="truncate">{reminder.client.name}</p>
                        </div>
                        {reminder.project && (
                          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                            <FileText className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400 dark:text-gray-500" />
                            <p className="truncate">
                              Project: {reminder.project.title}
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            reminder.status === "Pending"
                              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                              : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          }`}
                        >
                          {reminder.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="px-6 py-8 text-center">
                <p className="text-gray-500 dark:text-gray-400">
                  No upcoming reminders.
                </p>
              </div>
            )}
          </div>
          {/* Recent Clients */}
          <div className="bg-white dark:bg-gray-800 rounded-xs shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Recent Clients
              </h2>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {data.recentClients.slice(0, 3).map((client) => (
                <div key={client.id} className="px-6 py-4">
                  <div className="flex items-start">
                    <div className="bg-gray-100 dark:bg-gray-700 rounded-full p-2 mr-4">
                      <User className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/clients/${client.id}`}
                        className="text-sm font-medium text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
                      >
                        {client.name}
                      </Link>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                        <Mail className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400 dark:text-gray-500" />
                        <p className="truncate">{client.email}</p>
                      </div>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                        <Phone className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400 dark:text-gray-500" />
                        <p>{client.phone}</p>
                      </div>
                      {client.projects.length > 0 && (
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                          <FileText className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400 dark:text-gray-500" />
                          <p>{client.projects.length} project(s)</p>
                        </div>
                      )}
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <button className="px-3 py-1 text-xs font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600">
                        sdd
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 px-6 py-3 text-center mt-auto">
              <Link
                href="/clients"
                className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300"
              >
                View all clients
              </Link>
            </div>
          </div>

          {/* Recent Projects */}
          <div className="bg-white dark:bg-gray-800 rounded-xs shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Recent Projects
              </h2>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {data?.recentProjects.map((project) => (
                <div key={project.id} className="px-6 py-4">
                  <div className="flex justify-between items-start">
                    <Link
                      href={`/projects/${project.id}`}
                      className="text-sm font-medium text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
                    >
                      {project.title}
                    </Link>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        project.status === "Pending"
                          ? "bg-amber-600 text-white"
                          : project.status === "In Progress"
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                      }`}
                    >
                      {project.status}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 truncate">
                    {project.description}
                  </p>
                  <div className="mt-2 flex justify-between text-sm">
                    <Link
                      href={`/clients/${project.client.id}`}
                      className="flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
                    >
                      <User className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400 dark:text-gray-500" />
                      <p>{project.client.name}</p>
                    </Link>
                    <div className="flex items-center text-gray-500 dark:text-gray-400">
                      <DollarSign className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400 dark:text-gray-500" />
                      <p>${project.budget}</p>
                    </div>
                  </div>
                  <div className="mt-2 flex justify-between text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center">
                      <Calendar className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400 dark:text-gray-500" />
                      <p>Deadline: {formatDate(project.deadline)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 px-6 py-3 text-center">
              <button className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300">
                View all projects
              </button>
            </div>
          </div>
          {/* Overdue Projects */}
          <div className="bg-white dark:bg-gray-800 rounded-xs shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-red-50 dark:bg-red-900/30">
              <h2 className="text-lg font-semibold flex items-center text-red-700 dark:text-red-400">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Overdue Projects
              </h2>
            </div>
            {data.overdueProjects && data.overdueProjects.length > 0 ? (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {data.overdueProjects.map((project) => (
                  <div key={project.id} className="px-6 py-4">
                    <div className="flex justify-between items-start">
                      <Link
                        href={`/projects/${project.id}`}
                        className="text-sm font-medium text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
                      >
                        {project.title}
                      </Link>
                      <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                        Overdue
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 truncate">
                      {project.description}
                    </p>
                    <div className="mt-2 flex justify-between text-sm">
                      <Link
                        href={`/clients/${project.client.id}`}
                        className="flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
                      >
                        <User className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400 dark:text-gray-500" />
                        <p>{project.client.name}</p>
                      </Link>
                      <div className="flex items-center text-gray-500 dark:text-gray-400">
                        <DollarSign className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400 dark:text-gray-500" />
                        <p>${project.budget}</p>
                      </div>
                    </div>
                    <div className="mt-2 flex justify-between text-sm">
                      <div className="flex items-center text-red-500 dark:text-red-400">
                        <Calendar className="flex-shrink-0 mr-1.5 h-4 w-4 text-red-400 dark:text-red-500" />
                        <p>Due: {formatDate(project.deadline)}</p>
                      </div>
                      <div className="flex items-center text-gray-500 dark:text-gray-400">
                        <ClockIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400 dark:text-gray-500" />
                        <p>Status: {project.status}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="px-6 py-8 text-center">
                <CheckCircle className="h-12 w-12 text-green-500 dark:text-green-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  No overdue projects! Everything is on track.
                </p>
              </div>
            )}
          </div>

          {/* Recent Logs */}
          <div className="bg-white dark:bg-gray-800 rounded-xs shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Recent Activity Logs
              </h2>
            </div>
            {data.recentLogs && data.recentLogs.length > 0 ? (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {data.recentLogs.map((log) => (
                  <div key={log.id} className="px-6 py-4">
                    <div className="flex items-start">
                      <div
                        className={`rounded-full p-2 mr-4 ${getLogBgColor(
                          log.type
                        )}`}
                      >
                        {getLogIcon(log.type)}
                      </div>
                      <div>
                        <div className="flex items-center">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {log.type.charAt(0).toUpperCase() +
                              log.type.slice(1)}{" "}
                            with{" "}
                            <Link
                              href={`/clients/${log.client.id}`}
                              className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors duration-200"
                            >
                              {log.client.name}
                            </Link>
                          </p>
                          <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                            {formatDateTime(log.date)}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                          {log.notes}
                        </p>
                        {log.project && (
                          <div className="mt-1 flex items-center text-xs text-gray-500 dark:text-gray-400">
                            <Link
                              href={`/projects/${log.project.id}`}
                              className="flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
                            >
                              <FileText className="flex-shrink-0 mr-1.5 h-3 w-3 text-gray-400 dark:text-gray-500" />
                              <p>Project: {log.project.title}</p>
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="px-6 py-8 text-center">
                <p className="text-gray-500 dark:text-gray-400">
                  No recent activity logs.
                </p>
              </div>
            )}
            <div className="bg-gray-50 dark:bg-gray-700 px-6 py-3">
              <Link
                href="/interaction-logs"
                className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300"
              >
                View all logs
              </Link>
            </div>
          </div>
          {/* Overdue Reminders */}
          <div className="bg-white dark:bg-gray-800 rounded-xs shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-red-50 dark:bg-red-900/30">
              <h2 className="text-lg font-semibold flex items-center text-red-700 dark:text-red-400">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Overdue Reminders
              </h2>
            </div>
            {data.overdueReminders && data.overdueReminders.length > 0 ? (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {data.overdueReminders.map((reminder) => (
                  <div key={reminder.id} className="px-6 py-4">
                    <div className="flex items-start">
                      <div className="bg-red-100 dark:bg-red-900 rounded-full p-2 mr-4">
                        <Bell className="h-5 w-5 text-red-600 dark:text-red-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {reminder.title}
                          </p>
                          <span className="text-xs text-red-500 dark:text-red-400 font-medium">
                            {formatDateTime(reminder.dueDate)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 truncate">
                          {reminder.notes || "No notes"}
                        </p>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                          <Link
                            href={`/clients/${reminder.client.id}`}
                            className="flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
                          >
                            <User className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400 dark:text-gray-500" />
                            <p className="truncate">{reminder.client.name}</p>
                          </Link>
                        </div>
                        {reminder.project && (
                          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                            <Link
                              href={`/projects/${reminder.project.id}`}
                              className="flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
                            >
                              <FileText className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400 dark:text-gray-500" />
                              <p className="truncate">
                                Project: {reminder.project.title}
                              </p>
                            </Link>
                          </div>
                        )}
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                          {reminder.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="px-6 py-8 text-center">
                <CheckCircle className="h-12 w-12 text-green-500 dark:text-green-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  No overdue reminders! You're all caught up.
                </p>
              </div>
            )}
          </div>

          {/* Top Budget Clients */}
          <div className="bg-white dark:bg-gray-800 rounded-xs shadow overflow-hidden mb-6">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold flex items-center text-gray-900 dark:text-white">
                <BarChart2 className="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400" />
                Top Budget Clients
              </h2>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {data.topBudgetClients.map((client) => (
                <div key={client.id} className="px-6 py-4">
                  <div className="flex items-start">
                    <div className="bg-gray-100 dark:bg-gray-700 rounded-full p-2 mr-4">
                      <Building className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/clients/${client.id}`}
                        className="text-sm font-medium text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200 truncate"
                      >
                        {client.name}
                      </Link>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                        <Mail className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400 dark:text-gray-500" />
                        <p className="truncate">{client.email}</p>
                      </div>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                        <FileText className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400 dark:text-gray-500" />
                        <p>{client._count} project(s)</p>
                      </div>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        ${client._sum.budget}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
