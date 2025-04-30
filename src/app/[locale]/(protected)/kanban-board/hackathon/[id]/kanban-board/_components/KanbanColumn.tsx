// src/app/[locale]/(protected)/kanban-board/hackathon/[id]/kanban-board/_components/KanbanColumn.tsx
"use client";

import { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import KanbanTask from "./KanbanTask";
import { Column } from "@/store/kanbanStore";
import { useKanbanStore } from "@/store/kanbanStore";
import { useTranslations } from "@/hooks/useTranslations";
import { useToast } from "@/hooks/use-toast";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

interface KanbanColumnProps {
  column: Column;
  isActive?: boolean;
  isLoading?: boolean;
}

export default function KanbanColumn({
  column,
  isActive,
  isLoading = false,
}: KanbanColumnProps) {
  const t = useTranslations("kanban");
  const toast = useToast();

  const [isEditing, setIsEditing] = useState(false);
  const [columnName, setColumnName] = useState(column.title);
  const [showMenu, setShowMenu] = useState(false);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [isUpdatingColumn, setIsUpdatingColumn] = useState(false);
  const [isDeletingColumn, setIsDeletingColumn] = useState(false);
  const [isCreatingTask, setIsCreatingTask] = useState(false);

  const { setNodeRef: droppableRef } = useDroppable({
    id: `column-${column.id}`,
  });

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: `column-${column.id}`,
      data: { type: "column", column },
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleSaveEdit = async () => {
    if (columnName.trim() === "") return;

    setIsUpdatingColumn(true);
    try {
      const result = await useKanbanStore
        .getState()
        .updateList(column.id, columnName);
      if (result && result.message) {
        toast.success(result.message);
      } else {
        toast.success(t("success.columnUpdated"));
      }
      setIsEditing(false);
    } catch (error: any) {
      toast.error(error.message || t("updateColumnError"));
    } finally {
      setIsUpdatingColumn(false);
    }
  };

  const handleDeleteColumn = async () => {
    if (!confirm(`${t("deleteColumnConfirm")} "${column.title}"?`)) {
      return;
    }

    setIsDeletingColumn(true);
    try {
      const result = await useKanbanStore.getState().deleteList(column.id);
      if (result && result.message) {
        toast.success(result.message);
      } else {
        toast.success(t("success.columnDeleted"));
      }
    } catch (error: any) {
      toast.error(error.message || t("deleteColumnError"));
    } finally {
      setIsDeletingColumn(false);
      setShowMenu(false);
    }
  };

  const handleCreateTask = async () => {
    if (newTaskTitle.trim() === "") return;

    setIsCreatingTask(true);
    try {
      const result = await useKanbanStore.getState().createTask(column.id, {
        title: newTaskTitle,
        description: newTaskDescription || undefined,
      });

      if (result && result.message) {
        toast.success(result.message);
      } else {
        toast.success(t("success.taskCreated"));
      }

      // Reset form
      setNewTaskTitle("");
      setNewTaskDescription("");
      setIsAddingTask(false);
    } catch (error: any) {
      toast.error(error.message || t("createTaskError"));
    } finally {
      setIsCreatingTask(false);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={`bg-gray-100 dark:bg-gray-800 p-3 sm:p-4 rounded-xl shadow-lg w-full min-w-[280px] md:min-w-[300px] min-h-[300px] sm:min-h-[400px] transition-colors duration-300 ${
        isActive ? "opacity-50" : ""
      }`}
    >
      {/* Column Header */}
      <div className="flex justify-between items-center mb-3 sm:mb-4">
        {isEditing ? (
          <div className="flex w-full space-x-2">
            <input
              type="text"
              value={columnName}
              onChange={(e) => setColumnName(e.target.value)}
              className="flex-1 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              autoFocus
              aria-label={t("editColumnName")}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSaveEdit();
                if (e.key === "Escape") {
                  setColumnName(column.title);
                  setIsEditing(false);
                }
              }}
            />
            <button
              onClick={handleSaveEdit}
              disabled={isUpdatingColumn}
              className="px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors duration-200 disabled:opacity-50"
              aria-label={t("saveColumnName")}
            >
              {isUpdatingColumn ? <LoadingSpinner size="sm" /> : t("save")}
            </button>
            <button
              onClick={() => {
                setColumnName(column.title);
                setIsEditing(false);
              }}
              className="px-2 py-1 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 rounded transition-colors duration-200"
              aria-label={t("cancelEditing")}
            >
              {t("cancel")}
            </button>
          </div>
        ) : (
          <div className="flex items-center">
            <h2
              className="text-base sm:text-lg font-bold cursor-pointer text-gray-900 dark:text-gray-100"
              onClick={() => setIsEditing(true)}
              {...listeners}
            >
              {column.title}
            </h2>
            <span className="ml-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              {column.tasks.length}
            </span>
          </div>
        )}

        <div className="relative">
          <button
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1 transition-colors duration-200"
            onClick={() => setShowMenu(!showMenu)}
            aria-label={t("columnMenu")}
          >
            •••
          </button>

          {showMenu && (
            <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-gray-700 rounded-md shadow-lg z-10 border border-gray-200 dark:border-gray-600">
              <div className="py-1">
                <button
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
                  onClick={() => {
                    setIsEditing(true);
                    setShowMenu(false);
                  }}
                >
                  {t("editList")}
                </button>
                <button
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
                  onClick={handleDeleteColumn}
                  disabled={isDeletingColumn}
                >
                  {isDeletingColumn ? (
                    <div className="flex items-center">
                      <LoadingSpinner size="sm" className="mr-2" />
                      {t("deleting")}
                    </div>
                  ) : (
                    t("deleteList")
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Droppable area for tasks */}
      <div
        ref={droppableRef}
        className="space-y-2 sm:space-y-3 min-h-[200px] sm:min-h-[300px] flex flex-col"
        style={{ flexGrow: 1 }}
      >
        {isLoading ? (
          // Skeleton cards when loading
          <>
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-16 sm:h-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
              ></div>
            ))}
          </>
        ) : (
          // Actual tasks
          <>
            <SortableContext
              items={column.tasks.map((task) => `task-${task.id}`)}
              strategy={verticalListSortingStrategy}
            >
              {column.tasks.map((task) => (
                <KanbanTask key={task.id} task={task} />
              ))}
            </SortableContext>
            {column.tasks.length === 0 && (
              <div className="h-full flex-grow flex items-center justify-center text-gray-400 dark:text-gray-500 text-xs sm:text-sm italic">
                {t("dropCardsHere")}
              </div>
            )}
          </>
        )}
      </div>

      {/* Add Card Button */}
      {isAddingTask ? (
        <div className="mt-3 sm:mt-4 p-2 bg-white dark:bg-gray-700 rounded-lg shadow transition-colors duration-300">
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder={t("taskTitle")}
            className="w-full mb-2 p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            autoFocus
            aria-label={t("taskTitle")}
          />
          <textarea
            value={newTaskDescription}
            onChange={(e) => setNewTaskDescription(e.target.value)}
            placeholder={t("taskDescriptionOptional")}
            className="w-full mb-2 p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            rows={2}
            aria-label={t("taskDescription")}
          />
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setIsAddingTask(false)}
              className="px-3 py-1 text-xs sm:text-sm bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 rounded transition-colors duration-200"
              aria-label={t("cancel")}
            >
              {t("cancel")}
            </button>
            <button
              onClick={handleCreateTask}
              disabled={isCreatingTask || !newTaskTitle.trim()}
              className="px-3 py-1 text-xs sm:text-sm bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors duration-200 disabled:opacity-50"
              aria-label={t("addTask")}
            >
              {isCreatingTask ? <LoadingSpinner size="sm" /> : t("add")}
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsAddingTask(true)}
          className="w-full text-gray-500 dark:text-gray-400 mt-3 sm:mt-4 flex items-center justify-center space-x-2 p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors duration-200"
          disabled={isLoading}
          aria-label={t("addCard")}
        >
          <span className="text-xl">+</span>
          <span>{t("addCard")}</span>
        </button>
      )}
    </div>
  );
}
