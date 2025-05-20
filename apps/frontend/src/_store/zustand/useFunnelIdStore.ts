import { create } from 'zustand';

interface FunnelIdState {
  funnelId: string | null;
  setFunnelId: (id: string) => void;
  clearFunnelId: () => void;
}

export const useFunnelIdStore = create<FunnelIdState>(set => ({
  funnelId: null,
  setFunnelId: (id: string) => set({ funnelId: id }),
  clearFunnelId: () => set({ funnelId: null }),
}));
