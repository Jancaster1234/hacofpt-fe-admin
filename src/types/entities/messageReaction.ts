// src/types/entities/messageReaction.ts
import { AuditCreatedBase } from "./auditCreatedBase";
import { Message } from "./message";

export type MessageReaction = {
  id: string;
  message?: Message;
  messageId?: string;
  reaction: string;
} & AuditCreatedBase;
