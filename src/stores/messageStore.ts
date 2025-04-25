import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MessageStore, Message } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { createJSONStorage } from 'zustand/middleware';

export const useMessageStore = create<MessageStore>()(
  persist(
    (set, get) => ({
      messages: [
        {
          id: '1',
          senderId: '1',
          content: 'Hello team, welcome to the HR channel!',
          department: 'HR',
          timestamp: '2023-05-01T09:00:00.000Z'
        },
        {
          id: '2',
          senderId: '2',
          content: 'Check out the new design system updates',
          department: 'Design',
          timestamp: '2023-05-01T10:15:00.000Z'
        },
        {
          id: '3',
          senderId: '3',
          content: 'The API endpoints are now available for testing',
          department: 'Development',
          timestamp: '2023-05-01T11:30:00.000Z'
        },
        {
          id: '4',
          senderId: '4',
          content: 'New marketing campaign kicks off next week',
          department: 'Marketing',
          timestamp: '2023-05-01T13:45:00.000Z'
        }
      ],
      addMessage: (message) => {
        const newMessage: Message = {
          ...message,
          id: uuidv4(),
          timestamp: new Date().toISOString()
        };
        set((state) => ({
          messages: [...state.messages, newMessage]
        }));
      },
      getMessagesByDepartment: (department) => {
        return get().messages
          .filter(message => message.department === department)
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      },
      getThreadedMessages: (parentId) => {
        return get().messages
          .filter(message => message.parentId === parentId)
          .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
      }
    }),
    {
      name: 'message-storage',
      storage: createJSONStorage(() => localStorage)
    }
  )
);
