'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { toast } from 'react-hot-toast';
import api from '@/lib/axios';
import { useState, useEffect } from 'react';
import { Client, Project, Reminder } from '@/lib/types';

const reminderSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  notes: z.string().optional(),
  dueDate: z.string().min(1, 'Due date is required'),
  status: z.string().min(1, 'Status is required'),
  clientId: z.string().min(1, 'Client is required'),
  projectId: z.string().optional(),
});

type ReminderFormData = z.infer<typeof reminderSchema>;

interface AddReminderProps {
  clients: Client[];
  onClose: () => void;
  reminder?: Reminder | null;
  clientId?: string;
  projectId?: string;
  onUpdate: (data: Reminder) => void;
}

export default function AddReminder({ 
  clients, 
  onClose, 
  reminder,
  clientId: initialClientId,
  projectId: initialProjectId,
  onUpdate
}: AddReminderProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [allProjects, setAllProjects] = useState<Project[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ReminderFormData>({
    resolver: zodResolver(reminderSchema),
    defaultValues: reminder ? {
      title: reminder.title,
      notes: reminder.notes || '',
      dueDate: new Date(reminder.dueDate).toISOString().slice(0, 16),
      status: reminder.status || 'Pending',
      clientId: reminder.clientId || '',
      projectId: reminder.projectId || '',
    } : {
      clientId: initialClientId || '',
      projectId: initialProjectId || '',
    },
  });

  const selectedClientId = watch('clientId');
  const selectedProjectId = watch('projectId');

  // Get all projects from all clients
  useEffect(() => {
    const projects = clients.reduce<Project[]>((acc, client) => {
      if (client.projects && Array.isArray(client.projects)) {
        return [...acc, ...(client.projects as Project[])];
      }
      return acc;
    }, []);
    setAllProjects(projects);
  }, [clients]);

  // Set initial client and project if provided
  useEffect(() => {
    if (initialProjectId) {
      const project = allProjects.find(p => p.id === initialProjectId);
      if (project) {
        setValue('clientId', project.clientId);
        setValue('projectId', project.id);
      }
    } else if (initialClientId) {
      setValue('clientId', initialClientId);
    }
  }, [initialProjectId, initialClientId, allProjects, setValue]);

  // Update client when project is selected
  useEffect(() => {
    if (selectedProjectId && !initialProjectId) {
      const selectedProject = allProjects.find(p => p.id === selectedProjectId);
      if (selectedProject) {
        setValue('clientId', selectedProject.clientId);
      }
    }
  }, [selectedProjectId, allProjects, setValue, initialProjectId]);

  const getFilteredProjects = () => {
    if (selectedClientId) {
      const client = clients.find(c => c.id === selectedClientId);
      return (client?.projects as Project[]) || [];
    }
    return allProjects;
  };

  const onSubmit = async (data: ReminderFormData) => {
    try {
      setIsSubmitting(true);
      const reminderData = {
        ...data,
        dueDate: new Date(data.dueDate),
      };
      
      if (reminder) {
        const response = await api.put(`/reminders/${reminder.id}`, reminderData);
        toast.success('Reminder updated successfully');
        onUpdate(response.data);
        reset();
      } else {
        const response = await api.post('/reminders', reminderData);
        toast.success('Reminder added successfully');
        onClose(response.data);
        reset();
        onUpdate(response.data);
      }
    } catch (error) {
      toast.error(reminder ? 'Failed to update reminder' : 'Failed to create reminder');
      console.error('Error saving reminder:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Title *
        </label>
        <div className="mt-1">
          <input
            id="title"
            type="text"
            {...register('title')}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white sm:text-sm"
            placeholder="Reminder Title"
          />
        </div>
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Notes
        </label>
        <div className="mt-1">
          <textarea
            id="notes"
            {...register('notes')}
            rows={4}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white sm:text-sm"
            placeholder="Additional notes..."
          />
        </div>
      </div>

      <div>
        <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Due Date *
        </label>
        <div className="mt-1">
          <input
            id="dueDate"
            type="datetime-local"
            {...register('dueDate')}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white sm:text-sm"
          />
        </div>
        {errors.dueDate && (
          <p className="mt-1 text-sm text-red-600">{errors.dueDate.message}</p>
        )}
      </div>
      
      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Status *
        </label>
        <div className="mt-1">
          <select
            id="status"
            {...register('status')}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white sm:text-sm"
          >
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
        {errors.status && (
          <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
        )}  
      </div>
      
      <div>
        <label htmlFor="clientId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Client *
        </label>
        <div className="mt-1">
          <select
            id="clientId"
            {...register('clientId')}
            disabled={!!initialClientId || !!initialProjectId}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white sm:text-sm disabled:bg-gray-100 dark:disabled:bg-gray-800"
          >
            <option value="">Select a client</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name}
              </option>
            ))}
          </select>
        </div>
        {errors.clientId && (
          <p className="mt-1 text-sm text-red-600">{errors.clientId.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="projectId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Project
        </label>
        <div className="mt-1">
          <select
            id="projectId"
            {...register('projectId')}
            disabled={!!initialProjectId}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white sm:text-sm disabled:bg-gray-100 dark:disabled:bg-gray-800"
          >
            <option value="">Select a project</option>
            {getFilteredProjects().map((project) => (
              <option key={project.id} value={project.id}>
                {project.title} - {clients.find(c => c.id === project.clientId)?.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => {
            onClose();
            reset();
          }}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 transition-colors"
        >
          {isSubmitting ? (reminder ? 'Updating...' : 'Creating...') : (reminder ? 'Update Reminder' : 'Create Reminder')}
        </button>
      </div>
    </form>
  );
} 