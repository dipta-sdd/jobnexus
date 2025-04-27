"use client";

import { useEffect, useState } from "react";
import {  Search } from "lucide-react";
import ClientRow from "@/components/clients/client-row";
import ClientCard from "@/components/clients/client-card";
import Modal from '@/components/ui/Modal';
import AddClient from "@/components/clients/add-client";
import api from "@/lib/axios";
import { Client } from '@/lib/types';
import Thead from '@/components/THead';
import ClientCardLoader from "@/components/loaders/client-card-loader";
import ClientRowLoader from "@/components/loaders/client-row-loader";
import Header from "@/components/Header";

type SortOrder = "asc" | "desc";

export default function ClientsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [view, setView] = useState("grid"); 
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [sortField, setSortField] = useState<string>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const theadOptions = [
    { label: 'Name', field: 'name', isSortable: true },
    { label: 'Email', field: 'email', isSortable: true },
    { label: 'Phone', field: 'phone', isSortable: true },
    { label: 'Last Updated', field: 'updatedAt', isSortable: true },
    { label: 'Created At', field: 'createdAt', isSortable: true },
    { label: 'Actions', field: 'actions', isSortable: false },
  ];
  const sortOptions = [
    { label: 'Name (A-Z)', field: 'name', order: 'asc' },
    { label: 'Name (Z-A)', field: 'name', order: 'desc' },
    { label: 'Email (A-Z)', field: 'email', order: 'asc' },
    { label: 'Email (Z-A)', field: 'email', order: 'desc' },
    { label: 'Phone (A-Z)', field: 'phone', order: 'asc' },
    { label: 'Phone (Z-A)', field: 'phone', order: 'desc' },
    { label: 'Last Updated (Ascending)', field: 'updatedAt', order: 'asc' },
    { label: 'Last Updated (Descending)', field: 'updatedAt', order: 'desc' },
    { label: 'Created At (Ascending)', field: 'createdAt', order: 'asc' },
    { label: 'Created At (Descending)', field: 'createdAt', order: 'desc' },
  ];

  const fetchClients = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
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
  }, [searchQuery, startDate, endDate, sortField, sortOrder]);

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
        <Header
          title="Clients"
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          view={view}
          setView={setView}
          setIsModalOpen={setIsModalOpen}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          sortField={sortField}
          setSortField={setSortField}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          sortOptions={sortOptions}
          resultsCount={clients.length}
        />
        

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
          onUpdate={() => {
          }}
        />
      </Modal>
    </div>
  );
}
