// src/types/entities/permission.ts

import { AuditUserBase } from "./auditUserBase";
import { RolePermission } from "./rolePermission";

export interface Permission extends AuditUserBase {
  id: string;
  name?: string;
  apiPath?: string;
  method?: string;
  module?: string;
  rolePermissions?: Partial<RolePermission>[];
}
