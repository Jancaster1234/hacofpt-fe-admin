// src/types/entities/permission.ts

import { AuditCreatedBase } from "./auditCreatedBase";
import { RolePermission } from "./rolePermission";

export type Permission = {
  id: string;
  name?: string;
  apiPath?: string;
  method?: string;
  module?: string;
  rolePermissions?: Partial<RolePermission>[];
} & AuditCreatedBase;
