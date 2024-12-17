export interface Members {
  id: string;
  name: string;
  avatar: string;
  email: string;
  role: string;
}

interface Recents {
  id: string;
  userId: string;
  name: string;
  text: string;
  avatar: string;
  occurredAt: string;
}

interface Files {
  url: string;
  name: string;
  type: string;
}

export interface Messages {
  id: string;
  name: string;
  avatar: string;
  content: string;
  files: Files[];
  sendAt: string;
  userId: string;
}

export interface TasksInterface {
  id: string;
  name: string;
  description: string;
  status: string;
  priority: string;
  users: Members[];
  createdAt: string;
  plannrId: string;
  messages: Messages;
  expiresAt: string;
  tags?: string[];
}

export interface PlannrInterface {
  id: string;
  name: string;
  logo: string;
  banner: string;
  members: Members[];
  userId: string;
  tasks: TasksInterface[];
  recents: Recents[];
  accessedIn: string;
}
