
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { NotificationStore, Notification, NotificationType } from '../types';
import { v4 as uuidv4 } from 'uuid';

const DEMO_NOTIFICATIONS: Partial<Notification>[] = [
  {
    type: 'assignment',
    message: 'You have been assigned to the new task "Update Dashboard UI"',
    taskId: 'task-1',
    userId: '2',
    targetUserId: '1',
  },
  {
    type: 'update-request',
    message: 'Jane Smith requested changes on "API Integration"',
    taskId: 'task-2',
    userId: '2',
    targetUserId: '1',
  },
  {
    type: 'completion',
    message: 'Mike Johnson completed "User Authentication Flow"',
    taskId: 'task-3',
    userId: '3',
    targetUserId: '1',
  },
  {
    type: 'assignment',
    message: 'Sarah Lee mentioned you in a comment on "Mobile Responsiveness"',
    taskId: 'task-4',
    userId: '4',
    targetUserId: '1',
  }
];

export const useNotificationStore = create<NotificationStore>()(
  persist(
    (set, get) => ({
      notifications: DEMO_NOTIFICATIONS.map(notification => ({
        ...notification,
        id: uuidv4(),
        timestamp: new Date(Date.now() - Math.floor(Math.random() * 86400000)).toISOString(),
        isRead: false
      })) as Notification[],
      addNotification: (notification) => {
        const newNotification: Notification = {
          ...notification,
          id: uuidv4(),
          timestamp: new Date().toISOString(),
          isRead: false
        };
        set((state) => ({
          notifications: [newNotification, ...state.notifications]
        }));
      },
      markAsRead: (id) => {
        set((state) => ({
          notifications: state.notifications.map((notification) => 
            notification.id === id ? { ...notification, isRead: true } : notification
          )
        }));
      },
      markAllAsRead: () => {
        set((state) => ({
          notifications: state.notifications.map((notification) => ({
            ...notification,
            isRead: true
          }))
        }));
      },
      getUnreadCount: () => {
        const { notifications } = get();
        return notifications.filter(notification => !notification.isRead).length;
      },
      getUserNotifications: (userId) => {
        const { notifications } = get();
        return notifications.filter(notification => notification.targetUserId === userId);
      }
    }),
    {
      name: 'notification-storage',
      storage: createJSONStorage(() => localStorage)
    }
  )
);
