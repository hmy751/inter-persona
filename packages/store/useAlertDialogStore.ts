import { create } from "zustand";

export interface AlertDialogState {
  open: boolean;
  title: string;
  description: string;
  setOpen: (open: boolean) => void;
  setAlert: (title: string, description: string) => void;
  clearAlert: () => void;
}

export const useAlertDialogStore = create<AlertDialogState>((set) => ({
  open: false,
  title: "",
  description: "",
  setOpen: (open: boolean) => set({ open }),
  setAlert: (title: string, description: string) => {
    set({ open: true, title, description });
  },
  clearAlert: () => set({ open: false, title: "", description: "" }),
}));

export default useAlertDialogStore;
