// src/types/entities/rolePermission.ts

import { AuditBase } from "./auditBase";
import { Role } from "./role";
import { Permission } from "./permission";

export interface RolePermission extends AuditBase {
  id: string;
  role?: Partial<Role>;
  roleId?: string;
  permission?: Partial<Permission>;
  permissionId?: string;
}
