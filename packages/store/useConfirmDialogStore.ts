import { create } from "zustand";

export interface ConfirmDialogState {
  open: boolean;
  title: string;
  description: string;
  setOpen: (open: boolean) => void;
  setConfirm: (
    title: string,
    description: string,
    confirmCallback: () => void,
  ) => void;
  confirmCallback: () => void;
  clearConfirm: () => void;
}

export const useConfirmDialogStore = create<ConfirmDialogState>((set) => ({
  open: false,
  title: "",
  description: "",
  confirmCallback: () => { },
  setOpen: (open: boolean) => set({ open }),
  setConfirm: (
    title: string,
    description: string,
    confirmCallback: () => void,
  ) => {
    set({ open: true, title, description, confirmCallback });
  },
  clearConfirm: () =>
    set({
      open: false,
      title: "",
      description: "",
      confirmCallback: () => { },
    }),
}));

export default useConfirmDialogStore;
