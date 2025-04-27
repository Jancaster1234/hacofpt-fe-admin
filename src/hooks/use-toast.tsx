// src/hooks/use-toast.tsx
import { useToastStore } from "@/store/toast-store";
import { useCallback } from "react";

export const useToast = () => {
  const { addToast } = useToastStore();

  // Use useCallback to stabilize the functions and prevent unnecessary re-renders
  const success = useCallback(
    (message: string, duration?: number) => {
      // Use setTimeout to separate the toast call from state updates
      setTimeout(() => addToast(message, "success", duration), 0);
    },
    [addToast]
  );

  const error = useCallback(
    (message: string, duration?: number) => {
      setTimeout(() => addToast(message, "error", duration), 0);
    },
    [addToast]
  );

  const info = useCallback(
    (message: string, duration?: number) => {
      setTimeout(() => addToast(message, "info", duration), 0);
    },
    [addToast]
  );

  const warning = useCallback(
    (message: string, duration?: number) => {
      setTimeout(() => addToast(message, "warning", duration), 0);
    },
    [addToast]
  );

  return { success, error, info, warning };
};
