'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { toast } from 'react-hot-toast';
import api from '@/lib/axios';
import { useState } from 'react';
import { Client, Project } from '@/lib/types';

const projectSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  budget: z.string().min(1, 'Budget is required'),
  startDate: z.string().min(1, 'Start Date is required'),
  deadline: z.string().min(1, 'Deadline is required'),
  status: z.string().min(1, 'Status is required'),
  clientId: z.string().min(1, 'Client is required'),
});

type ProjectFormData = z.infer<typeof projectSchema>;

interface AddProjectProps {
  clients: Client[];
  onClose: () => void;
  project?: Project | null;
  clientId?: string;
  onUpdate: (data: Project) => void;
}

export default function AddProject({ 
  clients, 
  onClose, 
  project,
  clientId: initialClientId,
  onUpdate
}: AddProjectProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: project ? {
      title: project.title,
      description: project.description || '',
      budget: project.budget.toString(),
      startDate: new Date(project.startDate).toISOString().slice(0, 10),
      deadline: new Date(project.deadline).toISOString().slice(0, 10),
      status: project.status,
      clientId: project.clientId,
    } : {
      clientId: initialClientId || '',
      status: 'Pending',
      startDate: new Date().toISOString().slice(0, 10),
    },
  });

  const onSubmit = async (data: ProjectFormData) => {
    try {
      setIsSubmitting(true);
      const projectData = {
        ...data,
        budget: parseFloat(data.budget),
        startDate: new Date(data.startDate),
        deadline: new Date(data.deadline),
      };

      if (project) {
        const response = await api.put(`/projects/${project.id}`, projectData);
        toast.success('Project updated successfully');
        onUpdate(response.data);
        reset();
      } else {
        const response = await api.post('/projects', projectData);
        toast.success('Project created successfully');
        onClose();
        reset();
      }
    } catch (error) {
      toast.error(project ? 'Failed to update project' : 'Failed to create project');
      console.error('Error saving project:', error);
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
            placeholder="Project Title"
          />
        </div>
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Description
        </label>
        <div className="mt-1">
          <textarea
            id="description"
            {...register('description')}
            rows={4}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white sm:text-sm"
            placeholder="Project Description"
          />
        </div>
      </div>

      <div>
        <label htmlFor="budget" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Budget *
        </label>
        <div className="mt-1">
          <input
            id="budget"
            type="number"
            step="0.01"
            {...register('budget')}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white sm:text-sm"
            placeholder="Project Budget"
          />
        </div>
        {errors.budget && (
          <p className="mt-1 text-sm text-red-600">{errors.budget.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Start Date *
        </label>
        <div className="mt-1">
          <input
            id="startDate"
            type="date"
            {...register('startDate')}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white sm:text-sm"
          />
        </div>
        {errors.startDate && (
          <p className="mt-1 text-sm text-red-600">{errors.startDate.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Deadline *
        </label>
        <div className="mt-1">
          <input
            id="deadline"
            type="date"
            {...register('deadline')}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white sm:text-sm"
          />
        </div>
        {errors.deadline && (
          <p className="mt-1 text-sm text-red-600">{errors.deadline.message}</p>
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
            <option value="In Progress">In Progress</option>
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
            disabled={!!initialClientId}
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
          {isSubmitting ? (project ? 'Updating...' : 'Creating...') : (project ? 'Update Project' : 'Create Project')}
        </button>
      </div>
    </form>
  );
} 