import { create } from 'zustand';

interface TabState {
  selectedItineraryId: string | null;
  setSelectedItineraryId: (id: string | null) => void;
}

export const useTabStore = create<TabState>((set) => ({
  selectedItineraryId: null,
  setSelectedItineraryId: (id) => set({ selectedItineraryId: id }),
}));
