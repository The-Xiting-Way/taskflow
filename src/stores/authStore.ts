
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { AuthStore, User } from '../types';
import { v4 as uuidv4 } from 'uuid';

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      login: (userData) => {
        const newUser: User = {
          ...userData,
          id: uuidv4(),
          isAvailable: true
        };
        set({ user: newUser, isAuthenticated: true });
        localStorage.setItem('currentUser', JSON.stringify(newUser));
      },
      logout: () => {
        set({ user: null, isAuthenticated: false });
        localStorage.removeItem('currentUser');
      },
      updateUser: (userData) => {
        const updatedUser = { ...get().user, ...userData } as User;
        set({ user: updatedUser });
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      }
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage)
    }
  )
);
