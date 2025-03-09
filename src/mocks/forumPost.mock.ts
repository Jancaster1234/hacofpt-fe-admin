// src/mocks/forumPost.mock.ts
import { ForumPost } from "@/types/entities/forumPost";
export const mockForumPosts: ForumPost[] = [
  {
    id: "p1",
    threadId: "1001",
    authorId: "1",
    content: "The next hackathon is in June 2025!",
    createdAt: "Today",
  },
  {
    id: "p2",
    threadId: "1001",
    authorId: "2",
    content: "Looking forward to it!",
    createdAt: "1 hour ago",
  },
];
