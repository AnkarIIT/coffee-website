import { create } from 'zustand';

interface CafeSelectionState {
  selectedCafeId: string | null;
  selectedBookingDate: Date | null;
  selectedTable: string | null;
  selectedTime: string | null;
  numberOfPeople: number;

  setSelectedCafe: (cafeId: string) => void;
  setSelectedBookingDate: (date: Date) => void;
  setSelectedTable: (tableId: string | null) => void;
  setSelectedTime: (time: string | null) => void;
  setNumberOfPeople: (count: number) => void;
  clearSelection: () => void;
}

export const useCafeSelectionStore = create<CafeSelectionState>((set) => ({
  selectedCafeId: null,
  selectedBookingDate: null,
  selectedTable: null,
  selectedTime: null,
  numberOfPeople: 1,

  setSelectedCafe: (cafeId: string) => set({ selectedCafeId: cafeId }),
  setSelectedBookingDate: (date: Date) => set({ selectedBookingDate: date }),
  setSelectedTable: (tableId: string | null) => set({ selectedTable: tableId }),
  setSelectedTime: (time: string | null) => set({ selectedTime: time }),
  setNumberOfPeople: (count: number) => set({ numberOfPeople: count }),
  clearSelection: () => set({
    selectedCafeId: null,
    selectedBookingDate: null,
    selectedTable: null,
    selectedTime: null,
    numberOfPeople: 1,
  }),
}));