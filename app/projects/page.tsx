'use client';

import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import api from '@/lib/axios';
import { Client, Project } from '@/lib/types';
import AddProject from '@/components/projects/add-project';
import ProjectCard from '@/components/projects/project-card';
import ProjectRow from '@/components/projects/project-row';
import Thead from '@/components/THead';
import Header from '@/components/Header';
import ProjectCardLoader from '@/components/loaders/project-card-loader';
import { toast } from 'react-hot-toast';


type SortOrder = 'asc' | 'desc';

export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [editProject, setEditProject] = useState<Project | null>(null);
  const [sortField, setSortField] = useState<string>('title');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [clients, setClients] = useState<Client[]>([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const theadOptions = [
    { label: 'Title', field: 'title', isSortable: true },
    { label: 'Client', field: 'client', isSortable: true },
    { label: 'Budget', field: 'budget', isSortable: true },
    { label: 'Deadline', field: 'deadline', isSortable: true },
    { label: 'Status', field: 'status', isSortable: true },
    { label: 'Last Updated', field: 'updatedAt', isSortable: true },
    { label: 'Created At', field: 'createdAt', isSortable: true },
    { label: 'Actions', field: 'actions', isSortable: false },
  ];
  const sortOptions = [
    { label: 'Title (A-Z)', field: 'title', order: 'asc' },
    { label: 'Title (Z-A)', field: 'title', order: 'desc' },
    { label: 'Client (A-Z)', field: 'client', order: 'asc' },
    { label: 'Client (Z-A)', field: 'client', order: 'desc' },
    { label: 'Budget (Low-High)', field: 'budget', order: 'asc' },
    { label: 'Budget (High-Low)', field: 'budget', order: 'desc' },
    { label: 'Deadline (Ascending)', field: 'deadline', order: 'asc' },
    { label: 'Deadline (Descending)', field: 'deadline', order: 'desc' },
    { label: 'Status (Ascending)', field: 'status', order: 'asc' },
    { label: 'Status (Descending)', field: 'status', order: 'desc' },
    { label: 'Created At (Ascending)', field: 'createdAt', order: 'asc' },
    { label: 'Created At (Descending)', field: 'createdAt', order: 'desc' },
    { label: 'Last Updated (Ascending)', field: 'updatedAt', order: 'asc' },
    { label: 'Last Updated (Descending)', field: 'updatedAt', order: 'desc' },
  ];

  const fetchProjects = async () => {
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      params.append('sortField', sortField);
      params.append('sortOrder', sortOrder);
      const res = await api.get(`/projects?${params.toString()}`);
      setProjects(res.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [searchQuery, startDate, endDate, sortField, sortOrder]);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const fetchClients = async ()=>{
    try{
        const res = await api.get('/clients');
        setClients(res.data);
    }catch(error){
        console.log(error);
    }
  }

  useEffect(()=>{
    fetchClients();
  },[]);


  const handleDeleteProject = async (id: string) => {
    try {
      await api.delete(`/projects/${id}`);
      setProjects(projects.filter((project) => project.id !== id));
      toast.success('Project deleted successfully');
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error('Failed to delete project');
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 mt-4">
      <div className="flex flex-col w-full">
        {/* Header */}
        <Header
          title="Projects"
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
          resultsCount={projects.length}
        />

        {/* Projects List */}
        <main className="flex-1 overflow-auto p-0 mt-4">
          {view === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoading
                ? [...Array(6)].map((_, index) => (
                    <ProjectCardLoader key={index} />
                  ))
                : projects.map((project) => (
                    <ProjectCard key={project.id} project={project} onEdit={() => {
                      setEditProject(project);
                      setIsEditModalOpen(true);
                    }} onDelete={() => {
                      handleDeleteProject(project.id);
                    }} />
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
                  {projects.map((project) => (
                    <ProjectRow key={project.id} project={project} onEdit={() => {
                      setEditProject(project);
                      setIsEditModalOpen(true);
                    }} onDelete={() => {
                      handleDeleteProject(project.id);
                    }} />
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {projects.length === 0 && (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
                <Search className="h-8 w-8 text-gray-400 dark:text-gray-500" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                No projects found
              </h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Try adjusting your search to find what you&apos;re looking for.
              </p>
              <button
                onClick={() => setSearchQuery("")}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-emerald-700 dark:text-emerald-100 bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:hover:bg-emerald-900/50 transition-colors duration-200"
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
        title="Add New Project"
      >
        <AddProject
          clients={clients}
          onClose={() => {
            setIsModalOpen(false);
            fetchProjects();
          }}
          onUpdate={() => {
          }}
        />
      </Modal>
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Project"
      >
        <AddProject
          clients={clients}
          project={editProject}
          onClose={() => {
            setIsModalOpen(false);
          }}
          onUpdate={() => {
            fetchProjects();
            setIsEditModalOpen(false);
          }}
        />
      </Modal>
    </div>
  );
}
