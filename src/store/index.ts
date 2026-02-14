import { create } from 'zustand';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  token: string | null;
  
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  logout: () => void;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set: any) => {
  // Retrieve from localStorage on init
  const storedToken = localStorage.getItem('authToken');
  const storedUser = localStorage.getItem('user');
  
  return {
    user: storedUser ? JSON.parse(storedUser) : null,
    isAuthenticated: !!storedToken,
    isLoading: false,
    error: null,
    token: storedToken,
    
    setUser: (user: any) => {
      set({ user, isAuthenticated: true });
      localStorage.setItem('user', JSON.stringify(user));
    },
    
    setToken: (token: any) => {
      set({ token });
      localStorage.setItem('authToken', token);
    },
    
    setError: (error: any) => set({ error }),
    
    setLoading: (isLoading: any) => set({ isLoading }),
    
    logout: () => {
      set({ user: null, isAuthenticated: false, token: null });
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    },
    
    login: async (email: string, _password: string) => {
      set({ isLoading: true, error: null });
      try {
        // This will be replaced with actual API call
        console.log('Login attempt:', email);
        set({ isLoading: false });
      } catch (error) {
        set({ error: 'Login failed', isLoading: false });
      }
    },
    
    register: async (email: string, _password: string, _firstName: string, _lastName: string) => {
      set({ isLoading: true, error: null });
      try {
        // This will be replaced with actual API call
        console.log('Register attempt:', email);
        set({ isLoading: false });
      } catch (error) {
        set({ error: 'Registration failed', isLoading: false });
      }
    },
  };
});

// UI State Store
interface UiState {
  isMobileMenuOpen: boolean;
  isModalOpen: boolean;
  modalContent: string | null;
  toggleMobileMenu: () => void;
  openModal: (content: string) => void;
  closeModal: () => void;
}

export const useUiStore = create<UiState>((set: any) => ({
  isMobileMenuOpen: false,
  isModalOpen: false,
  modalContent: null,
  
  toggleMobileMenu: () => set((state: any) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
  openModal: (content: any) => set({ isModalOpen: true, modalContent: content }),
  closeModal: () => set({ isModalOpen: false, modalContent: null }),
}));

// Café Selection Store
interface CafeSelectionState {
  selectedCafeId: string | null;
  selectedBookingDate: Date | null;
  selectedTable: string | null;
  
  setSelectedCafe: (cafeId: string) => void;
  setSelectedBookingDate: (date: Date) => void;
  setSelectedTable: (tableId: string) => void;
  clearSelection: () => void;
}

export const useCafeSelectionStore = create<CafeSelectionState>((set: any) => ({
  selectedCafeId: null,
  selectedBookingDate: null,
  selectedTable: null,
  
  setSelectedCafe: (cafeId: any) => set({ selectedCafeId: cafeId }),
  setSelectedBookingDate: (date: any) => set({ selectedBookingDate: date }),
  setSelectedTable: (tableId: any) => set({ selectedTable: tableId }),
  clearSelection: () => set({ selectedCafeId: null, selectedBookingDate: null, selectedTable: null }),
}));
