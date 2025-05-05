// src/hooks/useRoleCheck.ts
import { useAuth } from "@/hooks/useAuth_v0";

export function useRoleCheck() {
  const { user } = useAuth();

  const hasRole = (roleName: string | string[]): boolean => {
    if (!user || !user.userRoles) {
      return false;
    }

    const roleNames = Array.isArray(roleName) ? roleName : [roleName];

    return user.userRoles.some((userRole) =>
      roleNames.includes(userRole.role.name)
    );
  };

  const isAdmin = (): boolean => {
    return hasRole("ADMIN");
  };

  const isOrganizer = (): boolean => {
    return hasRole("ORGANIZER");
  };

  const isParticipant = (): boolean => {
    return hasRole("PARTICIPANT");
  };

  return {
    hasRole,
    isAdmin,
    isOrganizer,
    isParticipant,
  };
}
