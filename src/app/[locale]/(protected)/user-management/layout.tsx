// src/app/[locale]/(protected)/user-management/layout.tsx
"use client";

import { ReactNode } from "react";
import { RoleGuard } from "@/middleware/auth";

export default function GradingSubmissionLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <RoleGuard allowedRoles={["ADMIN"]}>{children}</RoleGuard>;
}
