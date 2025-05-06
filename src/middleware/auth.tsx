// src/middleware/auth.tsx
import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { useAuth } from "@/hooks/useAuth_v0";

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: string[];
  redirectPath?: string;
}

export function RoleGuard({
  children,
  allowedRoles,
  redirectPath = "/unauthorized",
}: RoleGuardProps) {
  const { user } = useAuth();
  console.log(
    " 🔹  🔹  🔹  🔹  🔹  🔹  🔹  🔹  🔹  🔹  🔹  🔹  🔹  🔹  🔹  🔹  🔹  🔹  🔹  🔹  🔹 user",
    user
  ); // Debugging line to check user object
  // Check if user exists and has roles
  if (!user || !user.userRoles) {
    redirect("/signin");
    return null;
  }

  // Check if user has any of the allowed roles
  const hasAllowedRole = user.userRoles.some((userRole) =>
    allowedRoles.includes(userRole.role.name)
  );

  if (!hasAllowedRole) {
    redirect(redirectPath);
    return null;
  }

  return <>{children}</>;
}
