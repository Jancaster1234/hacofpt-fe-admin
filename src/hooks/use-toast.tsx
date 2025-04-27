// src/hooks/use-toast.tsx
import { useToastStore } from "@/store/toast-store";

export const useToast = () => {
  const { addToast } = useToastStore();

  return {
    success: (message: string, duration?: number) =>
      addToast(message, "success", duration),
    error: (message: string, duration?: number) =>
      addToast(message, "error", duration),
    info: (message: string, duration?: number) =>
      addToast(message, "info", duration),
    warning: (message: string, duration?: number) =>
      addToast(message, "warning", duration),
  };
};
