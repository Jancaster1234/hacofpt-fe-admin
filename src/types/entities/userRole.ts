// src/types/entities/userRole.ts

import { AuditBase } from "./auditBase";
import { User } from "./user";
import { Role } from "./role";

export interface UserRole extends AuditBase {
  id: string;
  user?: Partial<User>;
  userId?: string;
  role?: Partial<Role>;
  roleId?: string;
}
