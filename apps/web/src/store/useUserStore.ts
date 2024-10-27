import { create } from "zustand";

interface User {
  id: number;
  name: string;
  imageSrc: string;
}

interface UserState {
  user: User | null;
  // isLoggedIn: boolean;
  setUser: (user: User) => void;
  // clearUser: () => void;
}

const useUserStore = create<UserState>((set) => ({
  user: {
    id: 2,
    name: "명연",
    imageSrc: "",
  },
  // user: JSON.parse(localStorage.getItem("user") || "null"),
  // isLoggedIn: !!localStorage.getItem("user"),
  setUser: (user) => {
    // localStorage.setItem("user", JSON.stringify(user));
    set({ user });
  },
  // clearUser: () => {
  //   localStorage.removeItem("user");
  //   set({ user: null, isLoggedIn: false });
  // },
}));

export default useUserStore;
