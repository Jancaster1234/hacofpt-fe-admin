import { User } from "./user";
import { AuditBase } from "./auditBase";

export interface AuditCreatedBase extends AuditBase {
  createdBy?: User;
  createdById?: string;
}
