// src/app/[locale]/(protected)/demo-add-data/layout.tsx
"use client";

import { ReactNode } from "react";
import { RoleGuard } from "@/middleware/auth";

export default function GradingSubmissionLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <RoleGuard allowedRoles={["DEMO"]}>{children}</RoleGuard>;
}
