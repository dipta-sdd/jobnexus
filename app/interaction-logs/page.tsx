'use client';

import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import api from '@/lib/axios';
import { Client, InteractionLog } from '@/lib/types';
import AddInteractionLog from '@/components/interaction-logs/add-interaction-log';
import InteractionLogCard from '@/components/interaction-logs/interaction-log-card';
import InteractionLogRow from '@/components/interaction-logs/interaction-log-row';
import Header from '@/components/Header';
import { toast } from 'react-hot-toast';
import InteractionLogCardLoader from '@/components/loaders/interaction-log-card-loader';
import ProjectRowLoader from '@/components/loaders/project-row-loader';
import Thead from '@/components/THead';
type SortField = 'date' | 'type' | 'client' | 'project';
type SortOrder = 'asc' | 'desc';

export default function InteractionLogsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [view, setView] = useState('grid');
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editLog, setEditLog] = useState<InteractionLog | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [logs, setLogs] = useState<InteractionLog[]>([]);
  const [sortField, setSortField] = useState<string>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const theadOptions = [
    { label: "Type", field: "type", isSortable: true },
    { label: "Date", field: "date", isSortable: true },
    { label: "Notes", field: "notes", isSortable: true },
    { label: "Client", field: "client", isSortable: true },
    { label: "Project", field: "project", isSortable: true },
    { label: "Last Updated", field: "updatedAt", isSortable: true },
    { label: "Created At", field: "createdAt", isSortable: true },
    { label: "Actions", field: "actions", isSortable: false },
  ];

  const sortOptions = [
    { label: "Type (A-Z)", field: "type", order: "asc" },
    { label: "Type (Z-A)", field: "type", order: "desc" },
    { label: "Date (Ascending)", field: "date", order: "asc" },
    { label: "Date (Descending)", field: "date", order: "desc" },
    { label: "Notes (A-Z)", field: "notes", order: "asc" },
    { label: "Notes (Z-A)", field: "notes", order: "desc" },
    { label: "Client (A-Z)", field: "client", order: "asc" },
    { label: "Client (Z-A)", field: "client", order: "desc" },
    { label: "Project (A-Z)", field: "project", order: "asc" },
    { label: "Project (Z-A)", field: "project", order: "desc" },
    { label: "Last Updated (Ascending)", field: "updatedAt", order: "asc" },
    { label: "Last Updated (Descending)", field: "updatedAt", order: "desc" },
    { label: "Created At (Ascending)", field: "createdAt", order: "asc" },
    { label: "Created At (Descending)", field: "createdAt", order: "desc" },
  ];

  const fetchLogs = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      params.append('sortField', sortField);
      params.append('sortOrder', sortOrder);

      const res = await api.get(`/interaction-logs?${params.toString()}`);
      setLogs(res.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching interaction logs:', error);
      setIsLoading(false);
    }
  };

  const fetchClients = async () => {
    try {
      const res = await api.get('/clients');
      setClients(res.data);
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  useEffect(() => {
    fetchLogs();
    fetchClients();
  }, [searchQuery, startDate, endDate, sortField, sortOrder]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/interaction-logs/${id}`);
      setLogs(logs.filter((log) => log.id !== id));
      toast.success('Interaction log deleted successfully');
    } catch (error) {
      toast.error('Error deleting interaction log');
      console.error('Error deleting interaction log:', error);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 mt-4">
      <div className="flex flex-col w-full">
        {/* Header */}
        <Header
          title="Interaction Logs"
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
          resultsCount={logs.length}
        />

        {/* Logs List */}
        <div className="flex-1 overflow-auto p-0 mt-4">
          {view === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {isLoading
                ? [...Array(6)].map((_, index) => (
                    <InteractionLogCardLoader key={index} />
                  ))
                : logs.map((log) => (
                    <InteractionLogCard
                      key={log.id}
                      log={log}
                      onEdit={() => {
                        setEditLog(log);
                        setIsEditModalOpen(true);
                      }}
                      onDelete={() => {
                        handleDelete(log.id);
                      }}
                    />
                  ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 overflow-auto">
              <table className="divide-y divide-gray-200 dark:divide-gray-700 min-w-full">
                <thead className="bg-gray-50 dark:bg-gray-700/50">
                  <Thead
                    sortField={sortField}
                    sortOrder={sortOrder}
                    handleSort={(field: string) => handleSort(field as SortField)}
                    options={theadOptions}
                  />
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {isLoading ? (
                    [...Array(6)].map((_, index) => (
                      <ProjectRowLoader key={index} />
                    ))
                  ) : (
                    logs.map((log) => (
                      <InteractionLogRow
                        key={log.id}
                      log={log}
                      onEdit={() => {
                        setEditLog(log);
                        setIsEditModalOpen(true);
                      }}
                      onDelete={() => {
                        handleDelete(log.id);
                      }}
                    />
                  ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {logs.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                No interaction logs found
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
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Interaction"
      >
        <AddInteractionLog
          clients={clients}
          onClose={() => {
            setIsModalOpen(false);
            fetchLogs();
          }}
          onUpdate={() => {}}
        />
      </Modal>
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Interaction"
      >
        <AddInteractionLog
          clients={clients}
          log={editLog}
          onClose={() => {
            setIsEditModalOpen(false);
          }}
          onUpdate={() => {
            setIsEditModalOpen(false);
            fetchLogs();
          }}
        />
      </Modal>
    </div>
  );
} 