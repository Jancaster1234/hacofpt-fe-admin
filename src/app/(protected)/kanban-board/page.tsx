// src/app/(protected)/kanban-board/page.tsx
import { Metadata } from "next";
import KanbanBoard from "./_components/KanbanBoard";

export const metadata: Metadata = {
  title: "Kanban Board Page",
  description: "This is the Kanban Board Page.",
};

export default function KanbanBoardPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Kanban Board</h1>
      <div className="border rounded-lg bg-white shadow p-4">
        <KanbanBoard />
      </div>
    </div>
  );
}
