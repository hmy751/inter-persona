import { create } from "zustand";

interface ErrorModalState {
  isError: boolean;
  message: string;
  setError: (message: string) => void;
  clearError: () => void;
}

export const useErrorModalStore = create<ErrorModalState>((set) => ({
  isError: false,
  message: "",
  setError: (message: string) => set({ isError: true, message }),
  clearError: () => set({ isError: false, message: "" }),
}));
