export interface User {
  id: string;
  email: string;
  name?: string | null;
  createdAt?: Date;
}

export interface Client {
    id: string;
    name: string;
    email: string;
    phone: string;
    company?: string | null;
    notes?: string | null;
    projects?: Array<{ id: string }> ;
    userId: string;
    user?: { id: string };
    createdAt: Date;
    updatedAt: Date;
  }

export interface Project {
  id: string;
  title: string;
  budget: number;
  deadline: Date;
  status: string;
  clientId: string;
  client: Client;
  userId: string;
  user: User;
  logs: InteractionLog[];
  reminders: Reminder[];
  createdAt: Date;
  updatedAt: Date;
}

export interface InteractionLog {
  id: string;
  type: string; // "call", "meeting", "email"
  notes: string;
  date: Date;
  clientId?: string | null;
  client?: Client | null;
  projectId?: string | null;
  project?: Project | null;
  userId: string;
  user: User;
}

export interface Reminder {
  id: string;
  title: string;
  notes?: string | null;
  dueDate: Date;
  clientId?: string | null;
  client?: Client | null;
  projectId?: string | null;
  project?: Project | null;
  userId: string;
  user: User;
}

// Types for creating new records
export interface CreateUserInput {
  email: string;
  password: string;
  name?: string;
}

export interface CreateClientInput {
  name: string;
  email: string;
  phone: string;
  company?: string;
  notes?: string;
  userId: string;
}

export interface CreateProjectInput {
  title: string;
  budget: number;
  deadline: Date;
  status: string;
  clientId: string;
  userId: string;
}

export interface CreateInteractionLogInput {
  type: string;
  notes: string;
  date?: Date;
  clientId?: string;
  projectId?: string;
  userId: string;
}

export interface CreateReminderInput {
  title: string;
  notes?: string;
  dueDate: Date;
  clientId?: string;
  projectId?: string;
  userId: string;
}

// Types for updating records
export interface UpdateUserInput {
  email?: string;
  password?: string;
  name?: string;
}

export interface UpdateClientInput {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  notes?: string;
}

export interface UpdateProjectInput {
  title?: string;
  budget?: number;
  deadline?: Date;
  status?: string;
}

export interface UpdateInteractionLogInput {
  type?: string;
  notes?: string;
  date?: Date;
}

export interface UpdateReminderInput {
  title?: string;
  notes?: string;
  dueDate?: Date;
} 