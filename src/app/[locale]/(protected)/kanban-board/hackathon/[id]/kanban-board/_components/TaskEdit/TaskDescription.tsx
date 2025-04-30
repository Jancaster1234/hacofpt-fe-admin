// src/app/[locale]/hackathon/[id]/team/[teamId]/board/_components/TaskEdit/TaskDescription.tsx
"use client";

import { useState } from "react";
import { useTranslations } from "@/hooks/useTranslations";

interface TaskDescriptionProps {
  description: string;
  onChange: (description: string) => void;
}

export default function TaskDescription({
  description,
  onChange,
}: TaskDescriptionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedDescription, setEditedDescription] = useState(description);
  const t = useTranslations("taskDescription");

  const handleSave = () => {
    onChange(editedDescription);
    setIsEditing(false);
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-800 p-3 sm:p-4 rounded-md transition-colors duration-200">
      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 flex items-center">
        <span className="mr-2">📝</span>
        {t("description")}
      </h3>

      {isEditing ? (
        <div>
          <textarea
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md min-h-[100px] sm:min-h-[120px]
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
            placeholder={t("addDetailedDescription")}
            autoFocus
            aria-label={t("descriptionTextarea")}
          />
          <div className="mt-2 flex flex-wrap gap-2">
            <button
              onClick={handleSave}
              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 
                       transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-700"
              aria-label={t("save")}
            >
              {t("save")}
            </button>
            <button
              onClick={() => {
                setEditedDescription(description);
                setIsEditing(false);
              }}
              className="px-3 py-1 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 
                       rounded hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors duration-200
                       focus:outline-none focus:ring-2 focus:ring-gray-500"
              aria-label={t("cancel")}
            >
              {t("cancel")}
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => setIsEditing(true)}
          className="cursor-pointer min-h-[60px] sm:min-h-[80px] p-2 rounded 
                   hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200
                   border border-transparent hover:border-gray-200 dark:hover:border-gray-600"
          role="button"
          tabIndex={0}
          aria-label={t("clickToEdit")}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              setIsEditing(true);
            }
          }}
        >
          {description ? (
            <p className="text-gray-700 dark:text-gray-200 whitespace-pre-wrap transition-colors duration-200">
              {description}
            </p>
          ) : (
            <p className="text-gray-400 dark:text-gray-500 italic transition-colors duration-200">
              {t("addDetailedDescription")}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
