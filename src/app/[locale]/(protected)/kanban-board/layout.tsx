// src/app/[locale]/(protected)/kanban-board/layout.tsx
"use client";

import { ReactNode } from "react";
import { RoleGuard } from "@/middleware/auth";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <RoleGuard allowedRoles={["JUDGE", "ORGANIZER", "MENTOR"]}>
      {children}
    </RoleGuard>
  );
}
