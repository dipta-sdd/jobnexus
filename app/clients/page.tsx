"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Calendar,
  FileText,
  Filter,
  Mail,
  MapPin,
  MoreHorizontal,
  Phone,
  Plus,
  Search,
  Star,
  Trash2,
  User,
} from "lucide-react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import Image from "next/image"
import ClientRow from "@/components/clients/client-row"

export default function ClientsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [view, setView] = useState("grid") // grid or list

  const clients = [
    {
      id: "CLT-001",
      name: "Acme Inc",
      industry: "Technology",
      contact: "John Smith",
      email: "john@acmeinc.com",
      phone: "+1 (555) 123-4567",
      location: "New York, NY",
      projects: 3,
      totalValue: "$15,500",
      status: "Active",
      image: "/placeholder.svg?height=80&width=80&text=A",
      lastContact: "2 days ago",
      notes: "Long-term client with multiple ongoing projects. Looking to expand their digital presence.",
    },
    {
      id: "CLT-002",
      name: "TechCorp",
      industry: "Software",
      contact: "Sarah Johnson",
      email: "sarah@techcorp.com",
      phone: "+1 (555) 987-6543",
      location: "San Francisco, CA",
      projects: 1,
      totalValue: "$12,000",
      status: "Active",
      image: "/placeholder.svg?height=80&width=80&text=T",
      lastContact: "Yesterday",
      notes: "New client with a large mobile app development project. Potential for ongoing maintenance contract.",
    },
    {
      id: "CLT-003",
      name: "StartUp Co",
      industry: "E-commerce",
      contact: "Michael Chen",
      email: "michael@startupco.com",
      phone: "+1 (555) 456-7890",
      location: "Austin, TX",
      projects: 2,
      totalValue: "$7,800",
      status: "Active",
      image: "/placeholder.svg?height=80&width=80&text=S",
      lastContact: "1 week ago",
      notes: "Startup with limited budget but high growth potential. Currently working on branding and website.",
    },
    {
      id: "CLT-004",
      name: "Local Business",
      industry: "Retail",
      contact: "Emily Davis",
      email: "emily@localbusiness.com",
      phone: "+1 (555) 234-5678",
      location: "Chicago, IL",
      projects: 1,
      totalValue: "$2,800",
      status: "Completed",
      image: "/placeholder.svg?height=80&width=80&text=L",
      lastContact: "3 weeks ago",
      notes:
        "Small local business that needed SEO help. Project completed but may need additional services in the future.",
    },
    {
      id: "CLT-005",
      name: "Marketing Agency",
      industry: "Marketing",
      contact: "David Wilson",
      email: "david@marketingagency.com",
      phone: "+1 (555) 876-5432",
      location: "Los Angeles, CA",
      projects: 1,
      totalValue: "$4,500",
      status: "On Hold",
      image: "/placeholder.svg?height=80&width=80&text=M",
      lastContact: "1 month ago",
      notes: "Agency partnership for content strategy project. Currently on hold due to budget constraints.",
    },
    {
      id: "CLT-006",
      name: "Fashion Brand",
      industry: "Fashion",
      contact: "Jessica Lee",
      email: "jessica@fashionbrand.com",
      phone: "+1 (555) 345-6789",
      location: "Miami, FL",
      projects: 1,
      totalValue: "$3,200",
      status: "Active",
      image: "/placeholder.svg?height=80&width=80&text=F",
      lastContact: "5 days ago",
      notes: "Fashion brand looking to improve social media presence. Current project is a social media campaign.",
    },
    {
      id: "CLT-007",
      name: "Retail Solutions",
      industry: "Retail Technology",
      contact: "Robert Brown",
      email: "robert@retailsolutions.com",
      phone: "+1 (555) 654-3210",
      location: "Seattle, WA",
      projects: 1,
      totalValue: "$15,000",
      status: "Planning",
      image: "/placeholder.svg?height=80&width=80&text=R",
      lastContact: "3 days ago",
      notes:
        "Large e-commerce platform project in planning phase. High-value client with potential for long-term relationship.",
    },
    {
      id: "CLT-008",
      name: "Healthcare Provider",
      industry: "Healthcare",
      contact: "Amanda Martinez",
      email: "amanda@healthcare.com",
      phone: "+1 (555) 789-0123",
      location: "Boston, MA",
      projects: 0,
      totalValue: "$0",
      status: "Lead",
      image: "/placeholder.svg?height=80&width=80&text=H",
      lastContact: "1 week ago",
      notes: "Potential client interested in website redesign and patient portal. Initial consultation completed.",
    },
  ]

  // Filter clients based on search query
  const filteredClients = clients.filter((client) => {
    if (!searchQuery) return true
    return (
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.contact.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.id.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm z-10">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Clients</h1>

              <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search clients..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 w-full sm:w-auto"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setView("grid")}
                    className={`p-2 rounded-md ${view === "grid" ? "bg-gray-100 dark:bg-gray-700" : "hover:bg-gray-100 dark:hover:bg-gray-700"}`}
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
                    className={`p-2 rounded-md ${view === "list" ? "bg-gray-100 dark:bg-gray-700" : "hover:bg-gray-100 dark:hover:bg-gray-700"}`}
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
                </div>

                <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500">
                  <Plus className="h-5 w-5 mr-2" />
                  Add Client
                </button>
              </div>
            </div>
          </div>
        </header>

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
                <div
                  key={client.id}
                  className="bg-white dark:bg-gray-800  shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow"
                >
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
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white">{client.name}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{client.industry}</p>
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
                        <span className="text-gray-600 dark:text-gray-300">{client.contact}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Mail className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-gray-600 dark:text-gray-300">{client.email}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Phone className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-gray-600 dark:text-gray-300">{client.phone}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-gray-600 dark:text-gray-300">{client.location}</span>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center text-gray-500 dark:text-gray-400">
                          <FileText className="h-4 w-4 mr-1" />
                          <span>
                            {client.projects} {client.projects === 1 ? "project" : "projects"}
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
                              className={`h-4 w-4 ${star <= Math.ceil(client.projects / 2) ? "text-yellow-400 fill-current" : "text-gray-300 dark:text-gray-600"}`}
                            />
                          ))}
                          <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">Client rating</span>
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
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800  shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
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
                      Contact
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      Location
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
                      Value
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
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">No clients found</h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Try adjusting your search or filter to find what you're looking for.
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
  )
}
