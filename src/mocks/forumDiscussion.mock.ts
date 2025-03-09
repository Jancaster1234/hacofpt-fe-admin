// src/mocks/forumDiscussion.mock.ts
import { ForumDiscussion } from "@/types/entities/forumDiscussion";

export const mockForumDiscussions: ForumDiscussion[] = [
  {
    id: "1",
    threadId: "1001", // Updated to match actual thread ID
    authorId: "1",
    content: "I think this is a great idea! What do you all think?",
    createdAt: "2025-03-06T12:00:00Z",
  },
  {
    id: "2",
    threadId: "1001",
    authorId: "2",
    content: "I agree! We should plan how to implement it.",
    createdAt: "2025-03-06T12:30:00Z",
  },
  {
    id: "3",
    threadId: "1002",
    authorId: "3",
    content: "Does anyone have experience with this approach?",
    createdAt: "2025-03-07T09:15:00Z",
  },
  {
    id: "4",
    threadId: "1002",
    authorId: "1",
    content: "Here's a useful resource on the topic: [link]",
    createdAt: "2025-03-07T14:45:00Z",
  },
];
