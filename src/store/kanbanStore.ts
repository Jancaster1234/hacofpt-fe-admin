// src/store/kanbanStore.ts
import { create } from "zustand";

export type Task = {
  id: string;
  title: string;
  status: "todo" | "in-progress" | "done";
};

export type Column = {
  id: string;
  title: string;
  tasks: Task[];
};

interface KanbanState {
  columns: Column[];
  moveTask: (taskId: string, from: string, to: string) => void;
}

export const useKanbanStore = create<KanbanState>((set) => ({
  columns: [
    {
      id: "todo",
      title: "To Do",
      tasks: [{ id: "1", title: "Sample Task", status: "todo" }],
    },
    { id: "in-progress", title: "In Progress", tasks: [] },
    { id: "done", title: "Done", tasks: [] },
  ],
  moveTask: (taskId, from, to) => {
    set((state) => {
      const sourceColumn = state.columns.find((col) => col.id === from);
      const targetColumn = state.columns.find((col) => col.id === to);
      if (!sourceColumn || !targetColumn) return state;

      const task = sourceColumn.tasks.find((t) => t.id === taskId);
      if (!task) return state;

      sourceColumn.tasks = sourceColumn.tasks.filter((t) => t.id !== taskId);
      targetColumn.tasks.push({ ...task, status: to as Task["status"] });

      return { columns: [...state.columns] };
    });
  },
}));
