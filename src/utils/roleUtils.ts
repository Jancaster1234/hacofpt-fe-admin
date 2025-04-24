// src/utils/roleUtils.ts
import { User } from "@/types/entities/user";

export const hasOrganizerRole = (user?: User | null): boolean => {
  if (!user || !user.userRoles || user.userRoles.length === 0) {
    return false;
  }

  return user.userRoles.some(
    (userRole) => userRole.role && userRole.role.name === "ORGANIZER"
  );
};
