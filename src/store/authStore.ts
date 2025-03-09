// src/store/authStore.ts
import { create } from "zustand";
import { User } from "@/types/entities/users";

interface AuthState {
  user: User | null;
  loading: boolean;
  setAuth: (data: Partial<AuthState>) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,

  setAuth: (data) => {
    set((state) => {
      console.log("🔹 setAuth called with:", data);
      return { ...state, ...data };
    });
  },
}));
