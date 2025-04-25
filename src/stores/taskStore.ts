
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { TaskStore, Task } from '../types';
import { v4 as uuidv4 } from 'uuid';

export const useTaskStore = create<TaskStore>()(
  persist(
    (set, get) => ({
      tasks: [],
      addTask: (task) => {
        const newTask: Task = {
          ...task,
          id: uuidv4(),
          createdAt: new Date().toISOString(),
          isDeleted: false
        };
        set((state) => ({ tasks: [...state.tasks, newTask] }));
      },
      updateTask: (id, taskData) => {
        set((state) => ({
          tasks: state.tasks.map((task) => 
            task.id === id ? { ...task, ...taskData } : task
          )
        }));
      },
      deleteTask: (id) => {
        set((state) => ({
          tasks: state.tasks.map((task) => 
            task.id === id ? { ...task, isDeleted: true } : task
          )
        }));
      },
      getTasks: () => {
        return get().tasks.filter(task => !task.isDeleted);
      },
      getTaskById: (id) => {
        return get().tasks.find(task => task.id === id && !task.isDeleted);
      },
      getTasksByUser: (userId) => {
        return get().tasks.filter(
          task => 
            (task.assignedTo.includes(userId) || task.assignedBy === userId) && 
            !task.isDeleted
        );
      },
      getTasksByDepartment: (department) => {
        return get().tasks.filter(
          task => task.department === department && !task.isDeleted
        );
      },
      getTasksByStatus: (status) => {
        // Sort tasks by deadline to prevent visual overlap
        return get().tasks
          .filter(task => task.status === status && !task.isDeleted)
          .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
      }
    }),
    {
      name: 'task-storage',
      storage: createJSONStorage(() => localStorage)
    }
  )
);
