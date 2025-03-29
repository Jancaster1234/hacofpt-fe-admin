// src/types/entities/auditUserBase.ts

import { User } from "./user";
import { AuditCreatedBase } from "./auditCreatedBase";

export interface AuditUserBase extends AuditCreatedBase {
  lastModifiedBy?: User;
  lastModifiedById?: string;
}
