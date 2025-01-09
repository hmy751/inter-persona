import { create } from "zustand";

export interface ToastData {
  id: string;
  title?: string;
  description?: string;
  duration?: number;
}

interface ToastState {
  toasts: ToastData[];
  addToast: (toast: Omit<ToastData, "id">) => void;
  removeToast: (id: string) => void;
}

const randomId = () => Math.random().toString(36).substring(2);

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  addToast: (toast: Omit<ToastData, "id">) => set((state) => ({
    toasts: [...state.toasts, { ...toast, id: randomId() }]
  })),
  removeToast: (id: string) =>
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    })),
}));

export default useToastStore;