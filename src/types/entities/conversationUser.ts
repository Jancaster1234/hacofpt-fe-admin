// src/types/entities/conversationUser.ts
import { AuditBase } from "./auditBase";
import { User } from "./user";
import { Conversation } from "./conversation";

export type ConversationUser = {
  id: string;
  user?: User;
  userId?: string;
  conversation?: Conversation;
  conversationId?: string;
  isDeleted: boolean;
  deletedBy?: User;
  deletedById?: string;
} & AuditBase;
