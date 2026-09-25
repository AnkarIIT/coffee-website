import { create } from 'zustand';

interface UiState {
  isMobileMenuOpen: boolean;
  isModalOpen: boolean;
  modalContent: React.ReactNode | null;
  toggleMobileMenu: () => void;
  openModal: (content: React.ReactNode) => void;
  closeModal: () => void;
}

export const useUiStore = create<UiState>((set) => ({
  isMobileMenuOpen: false,
  isModalOpen: false,
  modalContent: null,

  toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
  openModal: (content: React.ReactNode) => set({ isModalOpen: true, modalContent: content }),
  closeModal: () => set({ isModalOpen: false, modalContent: null }),
}));