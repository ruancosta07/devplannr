"use client";
import { create } from "zustand";

interface User {
  id: string;
  name: string;
  email: string;
  avatar:string;
}

interface UserStore {
  user: User | null;
  setUser: (value: User | null) => void;
  signed: boolean;
  setSigned: (value: boolean) => void;
  loadingData: boolean;
  setLoadingData: (value: boolean) => void;
}

const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (value) => set({ user: value }),
  signed: false,
  setSigned: (value) => set({ signed: value }),
  loadingData: true,
  setLoadingData: (value) => set({ loadingData: value }),
}));

export default useUserStore;
