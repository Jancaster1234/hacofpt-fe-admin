// app/chat/page.tsx
import { Metadata } from 'next';
import ChatClient from './_components/ChatClient';

export const metadata: Metadata = {
  title: "Chat Page",
  description: "This is the chat page where users can communicate.",
};

export default function ChatPage() {
  return <ChatClient />;
}