'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { toast } from 'react-hot-toast';
import api from '@/lib/axios';
import { useState, useEffect } from 'react';
import { Client, Project } from '@/lib/types';

const reminderSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  notes: z.string().optional(),
  dueDate: z.string().min(1, 'Due date is required'),
  clientId: z.string().optional(),
  projectId: z.string().optional(),
});

type ReminderFormData = z.infer<typeof reminderSchema>;

interface AddReminderProps {
  clients: Client[];
  onClose: () => void;
}

export default function AddReminder({ clients, onClose }: AddReminderProps) {
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

  // Update client when project is selected
  useEffect(() => {
    if (selectedProjectId) {
      const selectedProject = allProjects.find(p => p.id === selectedProjectId) as Project | undefined;
      if (selectedProject) {
        setValue('clientId', selectedProject.clientId);
      }
    }
  }, [selectedProjectId, allProjects, setValue]);

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
      await api.post('/reminders', {
        ...data,
        dueDate: new Date(data.dueDate),
      });
      toast.success('Reminder added successfully');
      onClose();
      reset();
      window.location.reload();
    } catch (error) {
      toast.error('Failed to create reminder');
      console.error('Error creating reminder:', error);
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
        <label htmlFor="projectId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Project
        </label>
        <div className="mt-1">
          <select
            id="projectId"
            {...register('projectId')}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white sm:text-sm"
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

      <div>
        <label htmlFor="clientId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Client
        </label>
        <div className="mt-1">
          <select
            id="clientId"
            {...register('clientId')}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white sm:text-sm"
          >
            <option value="">Select a client</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name}
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
          {isSubmitting ? 'Creating...' : 'Create Reminder'}
        </button>
      </div>
    </form>
  );
} 