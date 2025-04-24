"use client";

import { useState } from "react";
import { Filter, Plus, Search } from "lucide-react";
import ClientRow from "@/components/clients/client-row";
import ClientCard from "@/components/clients/client-card";

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string | null;
  notes?: string | null;
  projects: Array<{ id: string }>;
  userId: string;
  user: { id: string };
  createdAt: Date;
  updatedAt: Date;
}

export default function ClientsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [view, setView] = useState("grid"); // grid or list

  const clients: Client[] = [
    {
      id: "CLT-001",
      name: "Acme Inc",
      email: "john@acmeinc.com",
      phone: "+1 (555) 123-4567",
      company: "Acme Corporation",
      notes: "Long-term client with multiple ongoing projects. Looking to expand their digital presence.",
      projects: [{ id: "1" }, { id: "2" }, { id: "3" }],
      userId: "user1",
      user: { id: "user1" },
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: "CLT-002",
      name: "TechCorp",
      email: "sarah@techcorp.com",
      phone: "+1 (555) 987-6543",
      company: "TechCorp Solutions",
      notes: "New client with a large mobile app development project. Potential for ongoing maintenance contract.",
      projects: [{ id: "4" }],
      userId: "user1",
      user: { id: "user1" },
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: "CLT-003",
      name: "StartUp Co",
      email: "michael@startupco.com",
      phone: "+1 (555) 456-7890",
      company: "StartUp Co",
      notes: "Startup with limited budget but high growth potential. Currently working on branding and website.",
      projects: [{ id: "5" }, { id: "6" }],
      userId: "user1",
      user: { id: "user1" },
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: "CLT-004",
      name: "Local Business",
      email: "emily@localbusiness.com",
      phone: "+1 (555) 234-5678",
      company: "Local Business Inc",
      notes: "Small local business that needed SEO help. Project completed but may need additional services in the future.",
      projects: [{ id: "7" }],
      userId: "user1",
      user: { id: "user1" },
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: "CLT-005",
      name: "Marketing Agency",
      email: "david@marketingagency.com",
      phone: "+1 (555) 876-5432",
      company: "Marketing Agency LLC",
      notes: "Agency partnership for content strategy project. Currently on hold due to budget constraints.",
      projects: [{ id: "8" }],
      userId: "user1",
      user: { id: "user1" },
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: "CLT-006",
      name: "Fashion Brand",
      email: "jessica@fashionbrand.com",
      phone: "+1 (555) 345-6789",
      company: "Fashion Brand Co",
      notes: "Fashion brand looking to improve social media presence. Current project is a social media campaign.",
      projects: [{ id: "9" }],
      userId: "user1",
      user: { id: "user1" },
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: "CLT-007",
      name: "Retail Solutions",
      email: "robert@retailsolutions.com",
      phone: "+1 (555) 654-3210",
      company: "Retail Solutions Inc",
      notes: "Large e-commerce platform project in planning phase. High-value client with potential for long-term relationship.",
      projects: [{ id: "10" }],
      userId: "user1",
      user: { id: "user1" },
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: "CLT-008",
      name: "Healthcare Provider",
      email: "amanda@healthcare.com",
      phone: "+1 (555) 789-0123",
      company: "Healthcare Provider LLC",
      notes: "Potential client interested in website redesign and patient portal. Initial consultation completed.",
      projects: [],
      userId: "user1",
      user: { id: "user1" },
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  // Filter clients based on search query
  const filteredClients = clients.filter((client) => {
    if (!searchQuery) return true;
    return (
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (client.company?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
      client.id.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col w-full">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 shadow-md z-10">
          <div className="px-4 md:px-6 lg:px-8 py-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Clients
              </h1>

              <div className="mt-4 md:mt-0 flex flex-wrap gap-2 items-center">
                <div className="relative flex-1 min-w-[200px]">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search clients..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 w-full"
                  />
                </div>

                <div className="flex items-center gap-2 flex-1 md:flex-none">
                  <button
                    onClick={() => setView("grid")}
                    className={`p-2 rounded-md ${
                      view === "grid"
                        ? "bg-gray-100 dark:bg-gray-700"
                        : "hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    <svg
                      className="h-5 w-5 text-gray-500 dark:text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => setView("list")}
                    className={`p-2 rounded-md ${
                      view === "list"
                        ? "bg-gray-100 dark:bg-gray-700"
                        : "hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    <svg
                      className="h-5 w-5 text-gray-500 dark:text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 10h16M4 14h16M4 18h16"
                      />
                    </svg>
                  </button>
                  <button className="inline-flex flex-1 md:flex-none items-center flex-nowrap px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500">
                    <Plus className="h-5 w-5 mr-2" />
                    Add Client
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center space-x-4 overflow-x-auto pb-2">
              <button className="px-3 py-2 text-sm rounded-md whitespace-nowrap bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100">
                All Clients
              </button>
              <button className="px-3 py-2 text-sm rounded-md whitespace-nowrap text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">
                Active
              </button>
              <button className="px-3 py-2 text-sm rounded-md whitespace-nowrap text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">
                Leads
              </button>
              <button className="px-3 py-2 text-sm rounded-md whitespace-nowrap text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">
                Inactive
              </button>
              <button className="px-3 py-2 text-sm rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center whitespace-nowrap">
                <Filter className="h-4 w-4 mr-2" />
                More Filters
              </button>
            </div>
          </div>
        </div>

        {/* Clients List */}
        <main className="flex-1 overflow-auto p-0 mt-4">
          {view === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredClients.map((client) => (
                <ClientCard key={client.id} client={client} />
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
              <table className="divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700/50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      Client
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      Contact Info
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      Notes
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      Projects
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      Last Updated
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredClients.map((client) => (
                    <ClientRow key={client.id} client={client} />
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {filteredClients.length === 0 && (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                No clients found
              </h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Try adjusting your search or filter to find what you&apos;re looking
                for.
              </p>
              <button
                onClick={() => setSearchQuery("")}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-emerald-700 bg-emerald-100 hover:bg-emerald-200 dark:text-emerald-100 dark:bg-emerald-900/30 dark:hover:bg-emerald-900/50"
              >
                Clear search
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
