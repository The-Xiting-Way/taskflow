// User related types
export type Department = 'HR' | 'Design' | 'Development' | 'Marketing' | 'Sales' | 'Management';

export interface User {
  id: string;
  name: string;
  email: string;
  department: Department;
  avatar?: string;
  isAvailable: boolean;
  availabilitySchedule: {
    startTime: string;
    endTime: string;
  } | null;
}

// Task related types
export type TaskStatus = 'Todo' | 'In Progress' | 'In Review' | 'Completed';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  deadline: string; // ISO date string
  createdAt: string; // ISO date string
  assignedBy: string; // User ID
  assignedTo: string[]; // Array of User IDs
  department: Department;
  tags: string[];
  isDeleted?: boolean;
}

// Notification types
export type NotificationType = 'assignment' | 'update-request' | 'completion';

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  taskId?: string;
  userId: string; // User who triggered the notification
  targetUserId: string; // User who should receive the notification
  timestamp: string; // ISO date string
  isRead: boolean;
}

// Message types
export interface Message {
  id: string;
  senderId: string;
  content: string;
  department?: Department;
  timestamp: string;
  parentId?: string; // For threaded replies
}

// Store types
export interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  login: (userData: Omit<User, 'id' | 'isAvailable'>) => void;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

export interface TaskStore {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, taskData: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  getTasks: () => Task[];
  getTaskById: (id: string) => Task | undefined;
  getTasksByUser: (userId: string) => Task[];
  getTasksByDepartment: (department: Department) => Task[];
  getTasksByStatus: (status: TaskStatus) => Task[];
}

export interface UserStore {
  users: User[];
  addUser: (user: User) => void;
  updateUser: (id: string, userData: Partial<User>) => void;
  getUsers: () => User[];
  getUserById: (id: string) => User | undefined;
  getUsersByDepartment: (department: Department) => User[];
  getAvailableUsers: () => User[];
}

export interface NotificationStore {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  getUnreadCount: () => number;
  getUserNotifications: (userId: string) => Notification[];
}

export interface MessageStore {
  messages: Message[];
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  getMessagesByDepartment: (department: Department) => Message[];
  getThreadedMessages: (parentId: string) => Message[];
}
