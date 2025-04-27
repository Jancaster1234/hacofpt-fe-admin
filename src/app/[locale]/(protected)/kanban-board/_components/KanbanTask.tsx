// src/app/[locale]/(protected)/kanban-board/_components/KanbanTask.tsx
"use client";

import { Task } from "@/store/kanbanStore";
import { useDraggable } from "@dnd-kit/core";

interface KanbanTaskProps {
  task: Task;
}

export default function KanbanTask({ task }: KanbanTaskProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
    data: { task },
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className="bg-white p-4 rounded-lg shadow-md cursor-grab space-y-2"
      style={{
        transform: transform
          ? `translate(${transform.x}px, ${transform.y}px)`
          : undefined,
      }}
    >
      {/* Task Title */}
      <p className="font-medium">{task.title}</p>

      {/* Task Meta */}
      <div className="flex justify-between items-center text-sm text-gray-400">
        {/* Labels */}
        <div className="flex space-x-1">
          <span className="w-3 h-3 bg-yellow-400 rounded-full"></span>
          <span className="w-3 h-3 bg-blue-400 rounded-full"></span>
          <span className="w-3 h-3 bg-pink-400 rounded-full"></span>
        </div>
        {/* Icons */}
        <div className="flex space-x-2">
          <span>📎 4</span>
          <span>⏰ July 15</span>
        </div>
      </div>

      {/* Task Avatars */}
      <div className="flex -space-x-2">
        <img
          src="https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174669.jpg"
          alt="User"
          className="w-6 h-6 rounded-full border-2 border-white"
        />
        <img
          src="https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174669.jpg"
          alt="User"
          className="w-6 h-6 rounded-full border-2 border-white"
        />
        <img
          src="https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174669.jpg"
          alt="User"
          className="w-6 h-6 rounded-full border-2 border-white"
        />
      </div>
    </div>
  );
}
