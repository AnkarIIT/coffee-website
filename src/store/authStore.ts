import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User, AuthResponse, LoginRequest, RegisterRequest } from '../types';
import { api } from '../services/api';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  setUser: (user: User) => void;
  setAuthenticated: (authenticated: boolean) => void;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
  clearError: () => void;

  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, _get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      setUser: (user: User) => set({ user, isAuthenticated: true }),
      setAuthenticated: (isAuthenticated: boolean) => set({ isAuthenticated }),
      setError: (error: string | null) => set({ error }),
      setLoading: (isLoading: boolean) => set({ isLoading }),
      clearError: () => set({ error: null }),

      login: async (credentials: LoginRequest) => {
        set({ isLoading: true, error: null });
        try {
          const { user }: AuthResponse = await api.login(credentials);
          set({ user, isAuthenticated: true, isLoading: false });
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Login failed';
          set({ error: message, isLoading: false });
          throw error;
        }
      },

      register: async (data: RegisterRequest) => {
        set({ isLoading: true, error: null });
        try {
          const { user }: AuthResponse = await api.register(data);
          set({ user, isAuthenticated: true, isLoading: false });
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Registration failed';
          set({ error: message, isLoading: false });
          throw error;
        }
      },

      logout: async () => {
        set({ isLoading: true });
        try {
          await api.logout();
        } finally {
          set({ user: null, isAuthenticated: false, isLoading: false });
        }
      },

      checkAuth: async () => {
        const token = localStorage.getItem('authToken');
        const storedUser = localStorage.getItem('user');

        if (!token || !storedUser) {
          set({ isAuthenticated: false, user: null });
          return;
        }

        set({ isLoading: true });
        try {
          const user = await api.getCurrentUser();
          set({ user, isAuthenticated: true, isLoading: false });
        } catch {
          localStorage.removeItem('authToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          set({ user: null, isAuthenticated: false, isLoading: false });
        }
      },

      updateProfile: async (data: Partial<User>) => {
        set({ isLoading: true, error: null });
        try {
          const user = await api.updateProfile(data);
          set({ user, isLoading: false });
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to update profile';
          set({ error: message, isLoading: false });
          throw error;
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);