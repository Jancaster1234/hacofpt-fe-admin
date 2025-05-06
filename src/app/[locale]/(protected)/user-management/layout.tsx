// src/app/[locale]/(protected)/user-management/layout.tsx
"use client";

import { ReactNode } from "react";
import { RoleGuard } from "@/middleware/auth";

export default function Layout({ children }: { children: ReactNode }) {
  return <RoleGuard allowedRoles={["ADMIN"]}>{children}</RoleGuard>;
}
