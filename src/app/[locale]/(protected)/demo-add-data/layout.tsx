// src/app/[locale]/(protected)/demo-add-data/layout.tsx
"use client";

import { ReactNode } from "react";
import { RoleGuard } from "@/middleware/auth";

export default function Layout({ children }: { children: ReactNode }) {
  return <RoleGuard allowedRoles={["DEMO"]}>{children}</RoleGuard>;
}
