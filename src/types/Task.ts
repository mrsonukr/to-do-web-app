export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  dueTime?: string;
  createdAt: Date;
  completedAt?: Date;
  tags: string[];
}