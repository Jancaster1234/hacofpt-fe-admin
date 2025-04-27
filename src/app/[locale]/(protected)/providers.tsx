// src/app/[locale]/(protected)/providers.tsx
"use client";

import { TooltipProvider } from "@/components/ui/tooltip";
import { DataTableStoreProvider } from "@/context/dataTableStoreProvider";

export function ProtectedProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return <TooltipProvider>{children}</TooltipProvider>;
}
