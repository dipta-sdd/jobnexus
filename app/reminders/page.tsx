'use client';

import { useEffect, useState } from 'react';
import {   Search } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import AddReminder from '@/components/reminders/add-reminder';
import api from '@/lib/axios';
import { Reminder } from '@/lib/types';
import ReminderCard from '@/components/reminders/reminder-card';
import ReminderRow from '@/components/reminders/reminder-row';
import Thead from '@/components/THead';
import Header from '@/components/Header';
import { toast } from 'react-hot-toast';
import ProjectCardLoader from '@/components/loaders/project-card-loader';
import ProjectRowLoader from '@/components/loaders/project-row-loader';

type SortOrder = 'asc' | 'desc';

export default function RemindersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [view, setView] = useState('grid');
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [clients, setClients] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortField, setSortField] = useState<string>('dueDate');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [editReminder, setEditReminder] = useState<Reminder | null>(null);
  const theadOptions = [
    { label: "Title", field: "title", isSortable: true },
    { label: "Notes", field: "notes", isSortable: false },
    { label: "Client", field: "client", isSortable: true },
    { label: "Project", field: "project", isSortable: false },
    { label: "Due Date", field: "dueDate", isSortable: true },
    { label: "Status", field: "status", isSortable: true },
    { label: "Last Updated", field: "updatedAt", isSortable: true },
    { label: "Created At", field: "createdAt", isSortable: true },
    { label: "Actions", field: "actions", isSortable: false },
  ];
  const sortOptions = [
    { label: 'Title (A-Z)', field: 'title', order: 'asc' },
    { label: 'Title (Z-A)', field: 'title', order: 'desc' },
    { label: 'Notes (A-Z)', field: 'notes', order: 'asc' },
    { label: 'Notes (Z-A)', field: 'notes', order: 'desc' },
    { label: 'Client (A-Z)', field: 'client', order: 'asc' },
    { label: 'Client (Z-A)', field: 'client', order: 'desc' },
    { label: 'Project (A-Z)', field: 'project', order: 'asc' },
    { label: 'Project (Z-A)', field: 'project', order: 'desc' },
    { label: 'Due Date (Ascending)', field: 'dueDate', order: 'asc' },
    { label: 'Due Date (Descending)', field: 'dueDate', order: 'desc' },
    { label: 'Status (A-Z)', field: 'status', order: 'asc' },
    { label: 'Status (Z-A)', field: 'status', order: 'desc' },
    { label: 'Last Updated (Ascending)', field: 'updatedAt', order: 'asc' },
    { label: 'Last Updated (Descending)', field: 'updatedAt', order: 'desc' },
    { label: 'Created At (Ascending)', field: 'createdAt', order: 'asc' },
    { label: 'Created At (Descending)', field: 'createdAt', order: 'desc' },
  ];

  const fetchReminders = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      params.append('sortField', sortField);
      params.append('sortOrder', sortOrder);
      
      const res = await api.get(`/reminders?${params.toString()}`);
      setReminders(res.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching reminders:', error);
      setIsLoading(false);
    }
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
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
    fetchReminders();
    
  }, [searchQuery, startDate, endDate, sortField, sortOrder]);
  useEffect(() => {
    fetchClients();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/reminders/${id}`);
      setReminders(reminders.filter((reminder) => reminder.id !== id));
      toast.success('Reminder deleted successfully');
    } catch (error) { 
      console.error('Error deleting reminder:', error);
      toast.error('Error deleting reminder');
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 mt-4">
      <div className="flex flex-col w-full">
        {/* Header */}
        <Header
          title="Reminders"
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
          resultsCount={reminders.length}
        />

        {/* Reminders List */}
        <main className="flex-1 overflow-auto p-0 mt-4">
          {view === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoading ? (
                [...Array(6)].map((_, index) => (
                  <ProjectCardLoader key={index} />
                ))
              ) : (
                reminders.map((reminder) => (
                  <ReminderCard key={reminder.id} reminder={reminder} onEdit={()=>{
                  setEditReminder(reminder);
                  setIsEditModalOpen(true);
                }} onDelete={()=>{
                  handleDelete(reminder.id);
                }} />
              ))
              )}
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 overflow-auto">
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
                  {isLoading ? (
                    [...Array(6)].map((_, index) => (
                      <ProjectRowLoader key={index} />
                    ))
                  ) : (
                    reminders.map((reminder) => (
                      <ReminderRow key={reminder.id} reminder={reminder} onEdit={()=>{
                      setEditReminder(reminder);
                      setIsEditModalOpen(true);
                    }} onDelete={()=>{
                      handleDelete(reminder.id);
                    }} />
                  ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {reminders.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                No reminders found
              </h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Try adjusting your search or filter to find what you&apos;re
                looking for.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setStartDate('');
                  setEndDate('');
                }}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-emerald-700 bg-emerald-100 hover:bg-emerald-200 dark:text-emerald-100 dark:bg-emerald-900/30 dark:hover:bg-emerald-900/50"
              >
                Clear filters
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
          onClose={() => {
            setIsModalOpen(false);
            fetchReminders();
          }} 
          clients={clients} 
          onUpdate={()=>{}}
        />
      </Modal>
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Reminder"
      >
        <AddReminder
          onClose={() => {
            setIsEditModalOpen(false);
          }}
          clients={clients}
          reminder={editReminder}
          onUpdate={()=>{
            fetchReminders();
            setIsEditModalOpen(false);
          }}
        />
      </Modal>
    </div>
  );
} 