// src/types/entities/auditUserBase.ts
import { AuditCreatedBase } from "./auditCreatedBase";

export interface AuditUserBase extends AuditCreatedBase {
  lastModifiedByUserName?: string;
}
