// src/types/entities/messageRead.ts
import { AuditBase } from "./auditBase";
import { Message } from "./message";
import { User } from "./user";

export type MessageRead = {
  id: string;
  message?: Message;
  messageId?: string;
  user?: User;
  userId?: string;
} & AuditBase;
