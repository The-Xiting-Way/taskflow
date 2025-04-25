
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { UserStore, User } from '../types';

interface AvailabilitySchedule {
  startTime: string;
  endTime: string;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      users: [
        {
          id: '1',
          name: 'John Doe',
          email: 'john@epack.com',
          department: 'HR',
          isAvailable: true,
          availabilitySchedule: null,
          avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=0D8ABC'
        },
        {
          id: '2',
          name: 'Jane Smith',
          email: 'jane@epack.com',
          department: 'Design',
          isAvailable: true,
          availabilitySchedule: null,
          avatar: 'https://ui-avatars.com/api/?name=Jane+Smith&background=F59E0B'
        },
        {
          id: '3',
          name: 'Mike Johnson',
          email: 'mike@epack.com',
          department: 'Development',
          isAvailable: false,
          availabilitySchedule: null,
          avatar: 'https://ui-avatars.com/api/?name=Mike+Johnson&background=10B981'
        },
        {
          id: '4',
          name: 'Sarah Lee',
          email: 'sarah@epack.com',
          department: 'Marketing',
          isAvailable: true,
          availabilitySchedule: null,
          avatar: 'https://ui-avatars.com/api/?name=Sarah+Lee&background=8B5CF6'
        },
        {
          id: '5',
          name: 'Alex Chen',
          email: 'alex@epack.com',
          department: 'Development',
          isAvailable: true,
          availabilitySchedule: null,
          avatar: 'https://ui-avatars.com/api/?name=Alex+Chen&background=EC4899'
        },
        {
          id: '6',
          name: 'Maria Garcia',
          email: 'maria@epack.com',
          department: 'Design',
          isAvailable: false,
          availabilitySchedule: null,
          avatar: 'https://ui-avatars.com/api/?name=Maria+Garcia&background=F43F5E'
        },
        {
          id: '7',
          name: 'David Kim',
          email: 'david@epack.com',
          department: 'Sales',
          isAvailable: true,
          availabilitySchedule: null,
          avatar: 'https://ui-avatars.com/api/?name=David+Kim&background=6366F1'
        },
        {
          id: '8',
          name: 'Lisa Wang',
          email: 'lisa@epack.com',
          department: 'Management',
          isAvailable: true,
          availabilitySchedule: null,
          avatar: 'https://ui-avatars.com/api/?name=Lisa+Wang&background=14B8A6'
        }
      ],
      addUser: (user) => {
        set((state) => ({ users: [...state.users, user] }));
      },
      updateUser: (id, userData) => {
        set((state) => ({
          users: state.users.map((user) => 
            user.id === id ? { ...user, ...userData } : user
          )
        }));
      },
      setUserAvailability: (id, schedule: AvailabilitySchedule | null) => {
        set((state) => ({
          users: state.users.map((user) => 
            user.id === id ? {
              ...user,
              availabilitySchedule: schedule,
              isAvailable: schedule ? true : user.isAvailable
            } : user
          )
        }));
      },
      getUsers: () => {
        return get().users;
      },
      getUserById: (id) => {
        return get().users.find(user => user.id === id);
      },
      getUsersByDepartment: (department) => {
        return get().users.filter(user => user.department === department);
      },
      getAvailableUsers: () => {
        const now = new Date();
        return get().users.filter(user => {
          if (!user.availabilitySchedule) return user.isAvailable;
          
          const start = new Date(user.availabilitySchedule.startTime);
          const end = new Date(user.availabilitySchedule.endTime);
          return now >= start && now <= end;
        });
      }
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => localStorage)
    }
  )
);
