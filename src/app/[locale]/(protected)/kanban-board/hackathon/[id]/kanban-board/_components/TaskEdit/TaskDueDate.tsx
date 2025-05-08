// src/app/[locale]/(protected)/kanban-board/hackathon/[id]/kanban-board/_components/TaskEdit/TaskDueDate.tsx
"use client";

import { format, isPast, parseISO } from "date-fns";
import { useState, useEffect } from "react";
import { useTranslations } from "@/hooks/useTranslations";

interface TaskDueDateProps {
  dueDate?: string;
  onChange: (dueDate?: string) => void;
}

export default function TaskDueDate({ dueDate, onChange }: TaskDueDateProps) {
  const [isSelecting, setIsSelecting] = useState(false);
  const t = useTranslations("taskDueDate");

  // For displaying formatted date/time when not editing
  const formattedDate = dueDate ? format(parseISO(dueDate), "MMM d, yyyy") : "";
  const formattedTime = dueDate ? format(parseISO(dueDate), "h:mm a") : "";
  const isPastDue = dueDate && isPast(parseISO(dueDate));

  // For datetime-local input value (requires YYYY-MM-DDThh:mm format)
  const datetimeValue = dueDate ? dueDate.substring(0, 16) : ""; // Trim seconds from ISO string

  const handleDateTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    if (!value) {
      // If date is cleared, remove the whole due date
      onChange(undefined);
      return;
    }

    // Convert to full ISO string format required by the API
    const selectedDateTime = new Date(value);
    const formattedISODate = selectedDateTime.toISOString().split(".")[0]; // Remove milliseconds
    onChange(formattedISODate);
  };

  return (
    <div className="mt-2">
      <button
        className="w-full text-left text-sm py-1 px-2 text-gray-700 dark:text-gray-200 
                 hover:bg-gray-200 dark:hover:bg-gray-700 rounded flex items-center 
                 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        onClick={() => setIsSelecting(!isSelecting)}
        aria-expanded={isSelecting}
        aria-label={t("dueDate")}
      >
        <span className="mr-2">🗓️</span>
        <span>{t("dueDate")}</span>
      </button>

      {isSelecting && (
        <div
          className="mt-2 p-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 
                    rounded-md shadow-sm transition-colors duration-200"
        >
          <div className="mb-2">
            <label className="block text-xs text-gray-700 dark:text-gray-300 mb-1">
              {t("dateAndTime")}
            </label>
            <input
              type="datetime-local"
              value={datetimeValue}
              onChange={handleDateTimeChange}
              className="w-full p-1 border border-gray-300 dark:border-gray-600 rounded text-sm 
                      bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 
                      focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
              aria-label={t("selectDateTime")}
            />
          </div>

          <div className="mt-2 flex justify-between">
            <button
              onClick={() => onChange(undefined)}
              className="text-xs text-gray-600 dark:text-gray-300 
                      hover:text-gray-800 dark:hover:text-gray-100 transition-colors duration-200"
              aria-label={t("remove")}
            >
              {t("remove")}
            </button>
            <button
              onClick={() => setIsSelecting(false)}
              className="text-xs text-blue-600 dark:text-blue-400 
                      hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200"
              aria-label={t("close")}
            >
              {t("close")}
            </button>
          </div>
        </div>
      )}

      {dueDate && !isSelecting && (
        <div className="mt-1 ml-7 text-xs">
          <span
            className={`${
              isPastDue
                ? "text-red-500 dark:text-red-400"
                : "text-gray-600 dark:text-gray-400"
            } transition-colors duration-200`}
          >
            {formattedDate} {t("at")} {formattedTime}
            {isPastDue && (
              <span className="ml-1 text-red-500 dark:text-red-400">
                ({t("overdue")})
              </span>
            )}
          </span>
        </div>
      )}
    </div>
  );
}
