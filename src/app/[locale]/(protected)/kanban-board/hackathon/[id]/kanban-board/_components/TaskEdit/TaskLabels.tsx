// src/app/[locale]/hackathon/[id]/team/[teamId]/board/_components/TaskEdit/TaskLabels.tsx
"use client";

import { useState } from "react";
import { BoardLabel } from "@/types/entities/boardLabel";
import { taskLabelService } from "@/services/taskLabel.service";
import { TaskLabel } from "@/types/entities/taskLabel";
import { useTranslations } from "@/hooks/useTranslations";
import { useToast } from "@/hooks/use-toast";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

interface TaskLabelsProps {
  taskLabels: TaskLabel[];
  availableLabels: BoardLabel[];
  onChange: (taskLabels: TaskLabel[]) => void;
  taskId: string;
}

export default function TaskLabels({
  taskLabels,
  availableLabels,
  onChange,
  taskId,
}: TaskLabelsProps) {
  const t = useTranslations("task");
  const toast = useToast();
  const [isSelecting, setIsSelecting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Create a map of selected label IDs for quick lookup
  const selectedLabelIds = new Set(
    taskLabels.map((tl) => tl.boardLabel?.id).filter(Boolean)
  );

  const toggleLabel = async (label: BoardLabel) => {
    try {
      setIsUpdating(true);
      setError(null);

      const isSelected = selectedLabelIds.has(label.id);

      if (isSelected) {
        // Find the taskLabel to delete from our existing props
        const taskLabelToDelete = taskLabels.find(
          (tl) => tl.boardLabel?.id === label.id
        );

        if (taskLabelToDelete && taskLabelToDelete.id) {
          const { message } = await taskLabelService.deleteTaskLabel(
            taskLabelToDelete.id
          );

          // Update parent state by filtering out the deleted label
          const updatedTaskLabels = taskLabels.filter(
            (tl) => tl.boardLabel?.id !== label.id
          );
          onChange(updatedTaskLabels);

          // Show success toast
          toast.success(t("labelRemoved"));
        }
      } else {
        // Add new label
        const { data: newTaskLabel, message } =
          await taskLabelService.createTaskLabel({
            taskId,
            boardLabelId: label.id,
          });

        if (newTaskLabel) {
          // Make sure the new task label has the board label info
          newTaskLabel.boardLabel = label;

          // Update parent state by adding the new task label
          const updatedTaskLabels = [...taskLabels, newTaskLabel];
          onChange(updatedTaskLabels);

          // Show success toast
          toast.success(t("labelAdded"));
        }
      }
    } catch (err: any) {
      console.error("Error updating task label:", err);
      setError(err.message || t("failedToUpdateLabel"));
      toast.error(err.message || t("failedToUpdateLabel"));
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="transition-colors duration-200">
      <button
        className="w-full text-left text-sm py-1 px-2 text-gray-700 dark:text-gray-300 
        hover:bg-gray-200 dark:hover:bg-gray-700 rounded flex items-center transition-colors"
        onClick={() => setIsSelecting(!isSelecting)}
        disabled={isUpdating}
        aria-expanded={isSelecting}
        aria-controls="label-selector"
      >
        <span className="mr-2" aria-hidden="true">
          🏷️
        </span>
        <span>{t("labels")}</span>
        {isUpdating && <LoadingSpinner size="sm" className="ml-2" />}
      </button>

      {error && (
        <div className="mt-1 ml-7 text-xs text-red-500 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Display selected labels */}
      {taskLabels.length > 0 && !isSelecting && (
        <div className="flex flex-wrap mt-1 ml-7 gap-1">
          {taskLabels.map(
            (taskLabel) =>
              taskLabel.boardLabel && (
                <div
                  key={taskLabel.id}
                  className="h-2 sm:h-3 w-10 sm:w-12 rounded transition-transform hover:scale-105"
                  style={{ backgroundColor: taskLabel.boardLabel.color }}
                  title={taskLabel.boardLabel.name}
                />
              )
          )}
        </div>
      )}

      {/* Label selector */}
      {isSelecting && (
        <div
          id="label-selector"
          className="mt-2 p-2 bg-white dark:bg-gray-800 border border-gray-300 
          dark:border-gray-600 rounded-md shadow-sm transition-colors"
        >
          <div className="max-h-48 overflow-y-auto">
            {availableLabels.map((label) => {
              const isSelected = selectedLabelIds.has(label.id);
              return (
                <div
                  key={label.id}
                  className={`flex items-center mb-1 cursor-pointer 
                  hover:bg-gray-100 dark:hover:bg-gray-700 rounded p-1 transition-colors
                  ${isUpdating ? "opacity-50" : ""}`}
                  onClick={() => !isUpdating && toggleLabel(label)}
                  role="checkbox"
                  aria-checked={isSelected}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      !isUpdating && toggleLabel(label);
                    }
                  }}
                >
                  <div
                    className="w-8 h-6 sm:w-10 sm:h-8 rounded mr-2 transition-transform hover:scale-105"
                    style={{ backgroundColor: label.color }}
                    aria-hidden="true"
                  />
                  <span className="text-sm text-gray-800 dark:text-gray-200">
                    {label.name}
                  </span>
                  {isSelected && (
                    <span className="ml-auto" aria-hidden="true">
                      ✓
                    </span>
                  )}
                </div>
              );
            })}
          </div>
          <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setIsSelecting(false)}
              className="w-full text-center text-xs text-blue-600 hover:text-blue-800 
              dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
              disabled={isUpdating}
            >
              {t("close")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
