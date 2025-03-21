import { AuditCreatedBase } from "./auditCreatedBase";
import { ForumThread } from "./forumThread";
import { User } from "./user";

export type ThreadPost = {
  id: string;
  forumThread?: ForumThread;
  forumThreadId?: string;
  content: string;
  isDeleted: boolean;
  deletedBy?: User;
  deletedById?: string;
} & AuditCreatedBase;
