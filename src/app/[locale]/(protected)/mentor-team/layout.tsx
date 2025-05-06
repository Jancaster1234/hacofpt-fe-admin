// src/app/[locale]/(protected)/mentor-team/layout.tsx
"use client";

import { ReactNode } from "react";
import { RoleGuard } from "@/middleware/auth";

export default function Layout({ children }: { children: ReactNode }) {
  return <RoleGuard allowedRoles={["MENTOR"]}>{children}</RoleGuard>;
}
