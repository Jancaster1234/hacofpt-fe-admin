import { AuditCreatedBase } from "./auditCreatedBase";
import { User } from "./user";

export enum BlogPostStatus {
  DRAFT = "DRAFT",
  PENDING_REVIEW = "PENDING_REVIEW",
  PUBLISHED = "PUBLISHED",
  REJECTED = "REJECTED",
}

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
