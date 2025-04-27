// src/components/ui/toast-provider.tsx
"use client";

import { Toaster, toast } from "sonner";
import { useToastStore } from "@/store/toast-store";
import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";

export function ToastProvider() {
  const { toasts, removeToast } = useToastStore();
  const { resolvedTheme } = useTheme();
  const processedToastsRef = useRef(new Set());

  useEffect(() => {
    // Process only new toasts that haven't been displayed yet
    toasts.forEach((t) => {
      const { id, message, type } = t;

      // Skip if we've already processed this toast
      if (processedToastsRef.current.has(id)) return;

      // Mark this toast as processed
      processedToastsRef.current.add(id);

      console.log("Displaying toast:", { id, message, type });

      // Display the toast with Sonner
      switch (type) {
        case "success":
          toast.success(message, { id });
          break;
        case "error":
          toast.error(message, { id });
          break;
        case "info":
          toast.info(message, { id });
          break;
        case "warning":
          toast.warning(message, { id });
          break;
      }

      // Clean up the processed set when toasts are removed from the store
      setTimeout(() => {
        removeToast(id);
      }, 100);
    });
  }, [toasts, removeToast]);

  return (
    <Toaster
      position="bottom-right"
      closeButton
      richColors
      expand={false}
      theme={(resolvedTheme as "light" | "dark") || "light"}
      // className="overflow-hidden max-w-[90vw] sm:max-w-sm !z-[9999]"
    />
  );
}
