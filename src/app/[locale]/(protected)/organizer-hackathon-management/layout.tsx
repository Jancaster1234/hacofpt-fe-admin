// src/app/[locale]/(protected)/organizer-hackathon-management/layout.tsx
"use client";

import { ReactNode } from "react";
import { RoleGuard } from "@/middleware/auth";

export default function Layout({ children }: { children: ReactNode }) {
  return <RoleGuard allowedRoles={["ORGANIZER"]}>{children}</RoleGuard>;
}
