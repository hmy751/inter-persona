import { create } from "zustand";

interface ErrorToastState {
  isError: boolean;
  message: string;
  setOpen: (state: boolean) => void;
  setError: (message: string) => void;
  clearError: () => void;
}

export const useErrorToastStore = create<ErrorToastState>((set) => ({
  isError: false,
  message: "",
  setOpen: (state: boolean) => set({ isError: state }),
  setError: (message: string) => set({ isError: true, message }),
  clearError: () => set({ isError: false, message: "" }),
}));

export const errorToastStore = useErrorToastStore;
