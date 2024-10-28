import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserData {
  id: number;
  name: string;
  imageSrc: string;
}

interface UserState {
  user: UserData | null;
  // isLoggedIn: boolean;
  setUser: (user: UserData) => void;
  clearUser: () => void;
}

const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null as UserData | null,
      setUser: (user: UserData) => set({ user }),
      clearUser: () => set({ user: null }),
    }),
    {
      name: "user-storage",
    }
  )
);

export default useUserStore;
