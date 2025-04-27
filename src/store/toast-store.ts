// src/store/toast-store.ts
import { create } from "zustand";

type ToastType = "success" | "error" | "info" | "warning";

interface ToastState {
  toasts: Array<{
    id: string;
    message: string;
    type: ToastType;
    duration?: number;
  }>;
  addToast: (message: string, type: ToastType, duration?: number) => void;
  removeToast: (id: string) => void;
}

// List of terms that indicate an aborted request
const ABORT_TERMS = [
  "aborted",
  "abort error",
  "component unmounted",
  "Request aborted",
  "canceled",
  "cancelled",
  "request timed out",
  "manually canceled",
  "request was aborted",
];

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  addToast: (message, type, duration = 5000) => {
    // For error types, check if it's an abort-related message and skip if it is

    const lowerMessage = message.toLowerCase();
    const isAbortMessage = ABORT_TERMS.some((term) =>
      lowerMessage.includes(term.toLowerCase())
    );

    if (isAbortMessage) {
      console.log("Skipping abort-related toast:", message);
      return;
    }

    const id = Math.random().toString(36).substring(2, 9);

    // Check for duplicate messages (similar to useApiModal)
    set((state) => {
      // Don't add duplicate toasts
      const isDuplicate = state.toasts.some(
        (toast) => toast.message === message && toast.type === type
      );

      if (isDuplicate) {
        console.log("Skipping duplicate toast:", message);
        return state;
      }

      return {
        toasts: [...state.toasts, { id, message, type, duration }],
      };
    });

    // Auto remove toast after duration
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((toast) => toast.id !== id),
      }));
    }, duration);
  },
  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    }));
  },
}));
