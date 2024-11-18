import { create } from "zustand";

interface ErrorDialogState {
  isError: boolean;
  message: string;
  setError: (message: string) => void;
  clearError: () => void;
}

export const useErrorDialogStore = create<ErrorDialogState>((set) => ({
  isError: false,
  message: "",
  setError: (message: string) => set({ isError: true, message }),
  clearError: () => set({ isError: false, message: "" }),
}));
