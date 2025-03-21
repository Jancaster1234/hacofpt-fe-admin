import { AuditCreatedBase } from "./auditCreatedBase";
import { Conversation } from "./conversation";
import { FileUrl } from "./fileUrl";
import { MessageReaction } from "./messageReaction";
import { MessageRead } from "./messageRead";

export type Message = {
  id: string;
  conversation?: Conversation;
  conversationId?: string;
  content: string;
  isDeleted: boolean;
  fileUrls: FileUrl[];
  reactions?: MessageReaction[];
  reads?: MessageRead[];
} & AuditCreatedBase;
