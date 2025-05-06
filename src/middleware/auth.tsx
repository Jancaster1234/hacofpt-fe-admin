// src/middleware/auth.tsx
import { ReactNode, useEffect } from "react";
import { redirect } from "next/navigation";
import { useAuth } from "@/hooks/useAuth_v0";
import { useEffectOnce } from "@/hooks/useEffectOnce";

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
  const { user, checkUser } = useAuth();

  // Use our custom hook to prevent double API calls in Strict Mode
  useEffectOnce(() => {
    // Only check user if not already loaded
    if (!user) {
      console.log("🔹 RoleGuard: Checking user...");
      checkUser();
    }
  }, []);

  // Handle user authentication and authorization
  useEffect(() => {
    // If checkUser has completed and there's no user, redirect to signin
    if (user === null) {
      console.log("🔹 RoleGuard: No user found, redirecting to signin");
      redirect("/signin");
      return;
    }

    // If user exists, check roles
    if (user) {
      const hasAllowedRole = user.userRoles?.some((userRole) =>
        allowedRoles.includes(userRole.role.name)
      );

      if (!hasAllowedRole) {
        console.log(
          `🔹 RoleGuard: User lacks required role, redirecting to ${redirectPath}`
        );
        redirect(redirectPath);
        return;
      }
    }
  }, [user, allowedRoles, redirectPath]);

  // Show loading state or children
  return user ? <>{children}</> : null;
}
