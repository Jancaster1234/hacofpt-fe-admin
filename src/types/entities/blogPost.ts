import { AuditCreatedBase } from "./auditCreatedBase";
import { User } from "./user";

export type BlogPostStatus = "Draft" | "Published" | "Archived";

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  content: string;
  status: BlogPostStatus;
  reviewedBy?: User;
  reviewedById?: string;
  publishedAt?: string;
} & AuditCreatedBase;
