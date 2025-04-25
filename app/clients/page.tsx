"use client";

import { useEffect, useState } from "react";
import { Loader, Plus, Search } from "lucide-react";
import ClientRow from "@/components/clients/client-row";
import ClientCard from "@/components/clients/client-card";
import Modal from '@/components/ui/Modal';
import AddClient from "@/components/clients/add-client";
import api from "@/lib/axios";
import { Client } from '@/lib/types';
import Thead from '@/components/THead';
import ClientCardLoader from "@/components/loaders/client-card-loader";
import ClientRowLoader from "@/components/loaders/client-row-loader";

type SortOrder = "asc" | "desc";

export default function ClientsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [view, setView] = useState("grid"); 
  const [isLoading, setIsLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [sortField, setSortField] = useState<string>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  const theadOptions = [
    { label: 'Name', field: 'name', isSortable: true },
    { label: 'Email', field: 'email', isSortable: true },
    { label: 'Phone', field: 'phone', isSortable: true },
    { label: 'Last Updated', field: 'updatedAt', isSortable: true },
    { label: 'Actions', field: 'actions', isSortable: false },
  ];

  const fetchClients = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      params.append('sortField', sortField);
      params.append('sortOrder', sortOrder);
      const response = await api.get(`/clients?${params.toString()}`);
      setClients(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching clients:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, [searchQuery, sortField, sortOrder]);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 mt-4">
      <div className="flex flex-col w-full">
        {/* Header */}
        <div className="">
          <div className="">
            <div className="flex flex-row md:items-center md:justify-between flex-wrap gap-2">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white min-w-min">
                Clients
              </h1>

              <div className="relative flex-1 md:flex-none md:ml-auto order-3 md:order-none min-w-full md:min-w-xs">
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

              <div className="flex items-center gap-2 ml-auto md:ml-0">
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
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex items-center flex-nowrap px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Add Client
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Clients List */}
        <main className="flex-1 overflow-auto p-0 mt-4">
          {view === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoading
                ? [...Array(10)].map((_, index) => (
                    <ClientCardLoader key={index} />
                  ))
                : clients.map((client) => (
                    <ClientCard key={client.id} client={client} />
                  ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 overflow-auto">
              <table className="divide-y divide-gray-200 dark:divide-gray-700 min-w-full">
                <thead className="bg-gray-50 dark:bg-gray-700/50">
                  <Thead
                    sortField={sortField}
                    sortOrder={sortOrder}
                    handleSort={handleSort}
                    options={theadOptions}
                  />
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {isLoading
                    ? [...Array(10)].map((_, index) => (
                        <ClientRowLoader key={index} />
                      ))
                    : clients.map((client) => (
                        <ClientRow key={client.id} client={client} />
                      ))}
                </tbody>
              </table>
            </div>
          )}

          {clients.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                No clients found
              </h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Try adjusting your search to find what you&apos;re looking for.
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

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          fetchClients();
        }}
        title="Add New Client"
      >
        <AddClient
          onClose={() => {
            setIsModalOpen(false);
            fetchClients();
          }}
        />
      </Modal>
    </div>
  );
}
