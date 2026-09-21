import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthUser } from '@/types/auth.types';

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  setAuth: (token: string, user: AuthUser) => void;
  setToken: (token: string) => void;
  setUser: (user: AuthUser) => void;
  logout: () => void;
  updateUser: (user: Partial<AuthUser>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      setAuth: (token, user) => {
        localStorage.setItem('sippci_token', token);
        set({ token, user, isAuthenticated: true });
      },
      setToken: (token) => {
        localStorage.setItem('sippci_token', token);
        set((state) => ({ token, isAuthenticated: !!state.user }));
      },
      setUser: (user) => {
        set((state) => ({ user, isAuthenticated: !!state.token }));
      },
      logout: () => {
        localStorage.removeItem('sippci_token');
        set({ token: null, user: null, isAuthenticated: false });
      },
      updateUser: (partial) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...partial } : null,
        })),
    }),
    { name: 'sippci-auth' },
  ),
);
