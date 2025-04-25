'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { toast } from 'react-hot-toast';
import api from '@/lib/axios';
import { useState, useEffect } from 'react';
import { Client, Project, InteractionLog } from '@/lib/types';

const interactionLogSchema = z.object({
  type: z.string().min(1, 'Type is required'),
  notes: z.string().min(1, 'Notes are required'),
  date: z.string().min(1, 'Date is required'),
  clientId: z.string().min(1, 'Client is required'),
  projectId: z.string().optional(),
});

type InteractionLogFormData = z.infer<typeof interactionLogSchema>;

interface AddInteractionLogProps {
  clients: Client[];
  onClose: () => void;
  log?: InteractionLog;
  clientId?: string;
  projectId?: string;
  onUpdate: (data: InteractionLog) => void;
}

export default function AddInteractionLog({ 
  clients, 
  onClose, 
  log,
  clientId: initialClientId,
  projectId: initialProjectId,
  onUpdate
}: AddInteractionLogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [allProjects, setAllProjects] = useState<Project[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<InteractionLogFormData>({
    resolver: zodResolver(interactionLogSchema),
    defaultValues: log ? {
      type: log.type,
      notes: log.notes || '',
      date: new Date(log.date).toISOString().slice(0, 16),
      clientId: log.clientId || '',
      projectId: log.projectId || '',
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

  const onSubmit = async (data: InteractionLogFormData) => {
    try {
      setIsSubmitting(true);
      const logData = {
        ...data,
        date: new Date(data.date),
      };
      
      if (log) {
        const response = await api.put(`/interaction-logs/${log.id}`, logData);
        toast.success('Interaction log updated successfully');
        onUpdate(response.data);
        reset();
      } else {
        const response = await api.post('/interaction-logs', logData);
        toast.success('Interaction log added successfully');
        onClose(response.data);
        reset();
        onUpdate(response.data);
      }
    } catch (error) {
      toast.error(log ? 'Failed to update interaction log' : 'Failed to create interaction log');
      console.error('Error saving interaction log:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Type *
        </label>
        <div className="mt-1">
          <select
            id="type"
            {...register('type')}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white sm:text-sm"
          >
            <option value="">Select a type</option>
            <option value="meeting">Meeting</option>
            <option value="call">Call</option>
            <option value="email">Email</option>
            <option value="message">Message</option>
            <option value="other">Other</option>
          </select>
        </div>
        {errors.type && (
          <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Notes *
        </label>
        <div className="mt-1">
          <textarea
            id="notes"
            {...register('notes')}
            rows={4}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white sm:text-sm"
            placeholder="Enter notes about the interaction..."
          />
        </div>
        {errors.notes && (
          <p className="mt-1 text-sm text-red-600">{errors.notes.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Date *
        </label>
        <div className="mt-1">
          <input
            id="date"
            type="datetime-local"
            {...register('date')}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white sm:text-sm"
          />
        </div>
        {errors.date && (
          <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
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
          {isSubmitting ? (log ? 'Updating...' : 'Creating...') : (log ? 'Update Log' : 'Create Log')}
        </button>
      </div>
    </form>
  );
} 