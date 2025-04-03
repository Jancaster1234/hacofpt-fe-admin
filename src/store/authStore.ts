// src/store/authStore.ts
import { create } from "zustand";
import { User } from "@/types/entities/user";

interface AuthState {
  user: User | null;
  loading: boolean;
  message: string | null; // Add message to store state
  messageType: "success" | "error" | "info" | null; // To help with styling/UI
  setAuth: (data: Partial<AuthState>) => void;
  setMessage: (
    message: string | null,
    type?: "success" | "error" | "info" | null
  ) => void;
  clearMessage: () => void; // Helper to clear messages
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  message: null,
  messageType: null,

  setAuth: (data) => {
    set((state) => {
      console.log("🔹 setAuth called with:", data);
      return { ...state, ...data };
    });
  },

  setMessage: (message, type = "info") => {
    set((state) => {
      console.log(`🔹 Setting ${type} message:`, message);
      return { ...state, message, messageType: type };
    });
  },

  clearMessage: () => {
    set((state) => ({ ...state, message: null, messageType: null }));
  },
}));
