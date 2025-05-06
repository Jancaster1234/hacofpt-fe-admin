// src/app/[locale]/(protected)/chat/layout.tsx
"use client";

import { ReactNode, Suspense } from "react";
import { RoleGuard } from "@/middleware/auth";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<div>Loading protected content...</div>}>
      <RoleGuard allowedRoles={["ORGANIZER", "JUDGE", "MENTOR", "ADMIN"]}>
        {children}
      </RoleGuard>
    </Suspense>
  );
}
