// src/types/entities/blogPost.ts
import { AuditCreatedBase } from "./auditCreatedBase";
import { User } from "./user";

export type BlogPostStatus =
  | "DRAFT"
  | "PENDING_REVIEW"
  | "APPROVED"
  | "PUBLISHED"
  | "REJECTED";

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  bannerImageUrl?: string;
  content: string;
  status: BlogPostStatus;
  reviewedBy?: User;
  reviewedById?: string;
  publishedAt?: string;
} & AuditCreatedBase;
