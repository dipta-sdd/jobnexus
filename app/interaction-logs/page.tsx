'use client';

import { useEffect, useState } from 'react';
import { Plus, Search } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import api from '@/lib/axios';
import { Client, InteractionLog } from '@/lib/types';
import AddInteractionLog from '@/components/interaction-logs/add-interaction-log';
import InteractionLogCard from '@/components/interaction-logs/interaction-log-card';
import InteractionLogRow from '@/components/interaction-logs/interaction-log-row';

type SortField = 'date' | 'type' | 'client' | 'project';
type SortOrder = 'asc' | 'desc';

export default function InteractionLogsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [view, setView] = useState('grid'); // grid or list
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [logs, setLogs] = useState<InteractionLog[]>([]);
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const fetchLogs = async () => {
    try {
      const params = new URLSearchParams();
      
      // Add search parameter
      if (searchQuery) params.append('search', searchQuery);
      
      // Add sort parameters
      params.append('sortField', sortField);
      params.append('sortOrder', sortOrder);

      const res = await api.get(`/interaction-logs?${params.toString()}`);
      setLogs(res.data);
    } catch (error) {
      console.error('Error fetching interaction logs:', error);
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
  }, [searchQuery, sortField, sortOrder]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return null;
    return sortOrder === 'asc' ? '↑' : '↓';
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col w-full">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 shadow-md z-10">
          <div className="px-4 md:px-6 lg:px-8 py-4">
            <div className="flex flex-row md:items-center md:justify-between flex-wrap gap-2">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white min-w-min">
                Interaction Logs
              </h1>

              <div className="relative flex-1 md:flex-none md:ml-auto order-3 md:order-none min-w-full md:min-w-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search logs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 w-full"
                />
              </div>

              <div className="flex items-center gap-2 ml-auto md:ml-0">
                <button
                  onClick={() => setView('grid')}
                  className={`p-2 rounded-md ${
                    view === 'grid'
                      ? 'bg-gray-100 dark:bg-gray-700'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700'
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
                  onClick={() => setView('list')}
                  className={`p-2 rounded-md ${
                    view === 'list'
                      ? 'bg-gray-100 dark:bg-gray-700'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700'
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
                  Add Interaction
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Logs List */}
        <main className="flex-1 overflow-auto p-0 mt-4">
          {view === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {logs.map((log) => (
                <InteractionLogCard key={log.id} log={log} />
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 overflow-auto">
              <table className="divide-y divide-gray-200 dark:divide-gray-700 min-w-full">
                <thead className="bg-gray-50 dark:bg-gray-700/50">
                  <tr>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('type')}
                    >
                      Type {getSortIcon('type')}
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('date')}
                    >
                      Date {getSortIcon('date')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Notes
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('client')}
                    >
                      Client {getSortIcon('client')}
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('project')}
                    >
                      Project {getSortIcon('project')}
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {logs.map((log) => (
                    <InteractionLogRow key={log.id} log={log} />
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {logs.length === 0 && (
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
                onClick={() => setSearchQuery('')}
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
        onClose={() => setIsModalOpen(false)}
        title="Add New Interaction"
      >
        <AddInteractionLog
          clients={clients}
          onClose={() => {
            setIsModalOpen(false);
            fetchLogs();
          }}
        />
      </Modal>
    </div>
  );
} 