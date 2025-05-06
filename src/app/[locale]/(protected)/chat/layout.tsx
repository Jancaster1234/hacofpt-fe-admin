// src/app/[locale]/(protected)/chat/layout.tsx
"use client";

import { ReactNode } from "react";
import { RoleGuard } from "@/middleware/auth";

export default function GradingSubmissionLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <RoleGuard allowedRoles={["ORGANIZER", "JUDGE", "MENTOR", "ADMIN"]}>
      {children}
    </RoleGuard>
  );
}
