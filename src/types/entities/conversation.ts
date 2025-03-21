import { AuditCreatedBase } from "./auditCreatedBase";
import { Team } from "./team";
import { ConversationUser } from "./conversationUser";
import { Message } from "./message";

export type ConversationType = "DIRECT" | "GROUP" | "CHANNEL"; // Adjust according to your enum

export type Conversation = {
  id: string;
  team?: Team;
  teamId?: string;
  type: ConversationType;
  name?: string;
  conversationUsers?: ConversationUser[];
  messages?: Message[];
} & AuditCreatedBase;
