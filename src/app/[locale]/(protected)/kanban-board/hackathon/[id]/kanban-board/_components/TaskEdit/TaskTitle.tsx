// src/app/[locale]/(protected)/kanban-board/hackathon/[id]/kanban-board/_components/TaskEdit/TaskTitle.tsx
"use client";

import { useState } from "react";
import { useTranslations } from "@/hooks/useTranslations";

interface TaskTitleProps {
  title: string;
  onChange: (title: string) => void;
}

export default function TaskTitle({ title, onChange }: TaskTitleProps) {
  const t = useTranslations("task");
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);

  const handleSave = () => {
    if (editedTitle.trim()) {
      onChange(editedTitle);
      setIsEditing(false);
    }
  };

  return (
    <div className="mb-4 transition-colors duration-200">
      {isEditing ? (
        <div className="mb-2">
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md 
            bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
            focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            autoFocus
            aria-label={t("editTaskTitle")}
            onBlur={handleSave}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSave();
              if (e.key === "Escape") {
                setEditedTitle(title);
                setIsEditing(false);
              }
            }}
          />
        </div>
      ) : (
        <h3
          className="text-lg sm:text-xl font-semibold cursor-pointer hover:bg-gray-100 
          dark:hover:bg-gray-700 p-1 rounded transition-colors text-gray-900 dark:text-gray-100"
          onClick={() => setIsEditing(true)}
          role="button"
          aria-label={t("clickToEditTitle")}
        >
          {title}
        </h3>
      )}
      <div className="text-xs text-gray-500 dark:text-gray-400">
        {t("inList")} <span className="underline">{t("doing")}</span>
      </div>
    </div>
  );
}
