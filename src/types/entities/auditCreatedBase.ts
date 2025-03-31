// src/types/entities/auditCreatedBase.ts
import { AuditBase } from "./auditBase";

export interface AuditCreatedBase extends AuditBase {
  createdByUserName?: string;
}
