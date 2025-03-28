// src/types/entities/conversation.ts
import { AuditCreatedBase } from "./auditCreatedBase";
import { Team } from "./team";
import { ConversationUser } from "./conversationUser";
import { Message } from "./message";

export enum ConversationType {
  PRIVATE = "PRIVATE",
  PUBLIC = "PUBLIC",
}

export type Conversation = {
  id: string;
  team?: Team;
  teamId?: string;
  type: ConversationType;
  name?: string;
  conversationUsers?: ConversationUser[];
  messages?: Message[];
} & AuditCreatedBase;
