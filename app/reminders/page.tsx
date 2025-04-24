'use client';

import { useEffect, useState } from 'react';
import { Filter, Plus, Search } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import AddReminder from '@/components/reminders/add-reminder';
import api from '@/lib/axios';
import { Reminder } from '@/lib/types';
import ReminderCard from '@/components/reminders/reminder-card';
import ReminderRow from '@/components/reminders/reminder-row';

export default function RemindersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [view, setView] = useState('grid');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [clients, setClients] = useState([]);

  useEffect(() => {
    fetchReminders();
    fetchClients();
  }, []);

  const fetchReminders = async () => {
    try {
      const res = await api.get('/reminders');
      setReminders(res.data);
    } catch (error) {
      console.error('Error fetching reminders:', error);
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


  const filteredReminders = reminders.filter((reminder) => {
    if (!searchQuery) return true;
    return (
      reminder.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (reminder.client?.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (reminder.project?.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      reminder.status.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });
  console.log(filteredReminders);
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col w-full">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 shadow-md z-10">
          <div className="px-4 md:px-6 lg:px-8 py-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Reminders
              </h1>

              <div className="mt-4 md:mt-0 flex flex-wrap gap-2 items-center">
                <div className="relative flex-1 min-w-[200px]">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search reminders..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 w-full"
                  />
                </div>

                <div className="flex items-center gap-2 flex-1 md:flex-none">
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
                    className="inline-flex flex-1 md:flex-none items-center flex-nowrap px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Add Reminder
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>



        {/* Reminders List */}
        <main className="flex-1 overflow-auto p-0 mt-4">
          {view === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredReminders.map((reminder) => (
                <ReminderCard key={reminder.id} reminder={reminder}/>
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 overflow-auto">
              <table className="divide-y divide-gray-200 dark:divide-gray-700 min-w-full">
                <thead className="bg-gray-50 dark:bg-gray-700/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Client
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Project
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Due Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredReminders.map((reminder) => (
                    <ReminderRow key={reminder.id} reminder={reminder}/>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {filteredReminders.length === 0 && (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                No reminders found
              </h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Try adjusting your search or filter to find what you&apos;re looking for.
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
        title="Add New Reminder"
      >
        <AddReminder
          onClose={() => setIsModalOpen(false)}
          clients={clients}
        />
      </Modal>
    </div>
  );
} 