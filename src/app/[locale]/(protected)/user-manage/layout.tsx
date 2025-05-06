// src/app/[locale]/(protected)/user-manage/layout.tsx
"use client";

import { ReactNode } from "react";
import { RoleGuard } from "@/middleware/auth";

export default function Layout({ children }: { children: ReactNode }) {
  return <RoleGuard allowedRoles={["ADMIN"]}>{children}</RoleGuard>;
}
