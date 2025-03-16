// src/app/(protected)/kanban-board/_components/KanbanColumn.tsx
"use client";

import { Column } from "@/store/kanbanStore";
import { useDroppable } from "@dnd-kit/core";
import KanbanTask from "./KanbanTask";

interface KanbanColumnProps {
  column: Column;
}

export default function KanbanColumn({ column }: KanbanColumnProps) {
  const { setNodeRef } = useDroppable({ id: column.id });

  return (
    <div
      ref={setNodeRef}
      className="bg-gray-100 p-4 rounded-xl shadow-lg w-full min-h-[400px]"
    >
      {/* Column Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">{column.title}</h2>
        <button className="text-gray-400 hover:text-gray-600">•••</button>
      </div>

      {/* Task Cards */}
      <div className="space-y-3">
        {column.tasks.map((task) => (
          <KanbanTask key={task.id} task={task} />
        ))}
      </div>

      {/* Add Card */}
      <button className="w-full text-gray-500 mt-4 flex items-center space-x-2">
        <span className="text-xl">+</span> <span>Add a card</span>
      </button>
    </div>
  );
}
