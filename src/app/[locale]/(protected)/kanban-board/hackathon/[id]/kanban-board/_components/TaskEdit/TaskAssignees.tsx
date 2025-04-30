// src/app/[locale]/(protected)/kanban-board/hackathon/[id]/kanban-board/_components/TaskEdit/TaskAssignees.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { User } from "@/types/entities/user";
import { taskAssigneeService } from "@/services/taskAssignee.service";
import { TaskAssignee } from "@/types/entities/taskAssignee";
import { useTranslations } from "@/hooks/useTranslations";
import { useToast } from "@/hooks/use-toast";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

interface TaskAssigneesProps {
  taskAssignees: TaskAssignee[];
  availableMembers: User[];
  onChange: (taskAssignees: TaskAssignee[]) => void;
  taskId: string;
}

export default function TaskAssignees({
  taskAssignees,
  availableMembers,
  onChange,
  taskId,
}: TaskAssigneesProps) {
  const t = useTranslations("task");
  const toast = useToast();
  const [isSelecting, setIsSelecting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Create a map of assigned user IDs for quick lookup
  const assignedUserIds = new Set(
    taskAssignees.map((ta) => ta.user?.id).filter(Boolean)
  );

  const toggleAssignee = async (user: User) => {
    try {
      setIsUpdating(true);
      setError(null);

      const isAssigned = assignedUserIds.has(user.id);

      if (isAssigned) {
        // Find the taskAssignee to delete from our existing props
        const assigneeToDelete = taskAssignees.find(
          (ta) => ta.user?.id === user.id
        );

        if (assigneeToDelete && assigneeToDelete.id) {
          const { message } = await taskAssigneeService.deleteTaskAssignee(
            assigneeToDelete.id
          );

          // Update parent state by filtering out the deleted assignee
          const updatedTaskAssignees = taskAssignees.filter(
            (ta) => ta.user?.id !== user.id
          );
          onChange(updatedTaskAssignees);

          // Show success toast
          toast.success(t("assigneeRemoved"));
        }
      } else {
        // Add new assignee
        const { data: newTaskAssignee, message } =
          await taskAssigneeService.createTaskAssignee({
            taskId,
            userId: user.id,
          });

        if (newTaskAssignee) {
          // Make sure the new task assignee has the user info
          newTaskAssignee.user = user;

          // Update parent state by adding the new task assignee
          const updatedTaskAssignees = [...taskAssignees, newTaskAssignee];
          onChange(updatedTaskAssignees);

          // Show success toast
          toast.success(t("assigneeAdded"));
        }
      }
    } catch (err: any) {
      console.error("Error updating task assignee:", err);
      setError(err.message || t("failedToUpdateAssignee"));
      toast.error(err.message || t("failedToUpdateAssignee"));
    } finally {
      setIsUpdating(false);
    }
  };

  const removeAssignee = async (taskAssignee: TaskAssignee) => {
    try {
      setIsUpdating(true);
      setError(null);

      if (taskAssignee.id) {
        const { message } = await taskAssigneeService.deleteTaskAssignee(
          taskAssignee.id
        );

        // Update parent state by filtering out the deleted assignee
        const updatedTaskAssignees = taskAssignees.filter(
          (ta) => ta.id !== taskAssignee.id
        );
        onChange(updatedTaskAssignees);

        // Show success toast
        toast.success(t("assigneeRemoved"));
      }
    } catch (err: any) {
      console.error("Error removing task assignee:", err);
      setError(err.message || t("failedToRemoveAssignee"));
      toast.error(err.message || t("failedToRemoveAssignee"));
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="mt-2 transition-colors duration-200">
      <button
        className="w-full text-left text-sm py-1 px-2 text-gray-700 dark:text-gray-300 
        hover:bg-gray-200 dark:hover:bg-gray-700 rounded flex items-center transition-colors"
        onClick={() => setIsSelecting(!isSelecting)}
        disabled={isUpdating}
        aria-expanded={isSelecting}
        aria-controls="member-selector"
      >
        <span className="mr-2" aria-hidden="true">
          👤
        </span>
        <span>{t("members")}</span>
        {isUpdating && <LoadingSpinner size="sm" className="ml-2" />}
      </button>

      {error && (
        <div className="mt-1 ml-7 text-xs text-red-500 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Display assigned members */}
      {taskAssignees.length > 0 && !isSelecting && (
        <div className="flex flex-wrap mt-1 ml-7 gap-2">
          {taskAssignees.map(
            (taskAssignee) =>
              taskAssignee.user && (
                <div key={taskAssignee.id} className="relative group">
                  <div className="relative w-6 h-6 sm:w-8 sm:h-8">
                    <Image
                      src={
                        taskAssignee.user.avatarUrl ||
                        "https://via.placeholder.com/30"
                      }
                      alt={`${taskAssignee.user.firstName} ${taskAssignee.user.lastName}`}
                      className="rounded-full border border-white dark:border-gray-700"
                      title={`${taskAssignee.user.firstName} ${taskAssignee.user.lastName}`}
                      fill
                      sizes="(max-width: 640px) 24px, 32px"
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                  {/* X button overlay that appears on hover */}
                  <button
                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full 
                    w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center text-xs 
                    opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeAssignee(taskAssignee);
                    }}
                    disabled={isUpdating}
                    title={t("removeAssignee")}
                    aria-label={t("removeAssignee")}
                  >
                    ×
                  </button>
                </div>
              )
          )}
        </div>
      )}

      {/* Member selector */}
      {isSelecting && (
        <div
          id="member-selector"
          className="mt-2 p-2 bg-white dark:bg-gray-800 border border-gray-300 
          dark:border-gray-600 rounded-md shadow-sm transition-colors"
        >
          <div className="max-h-48 overflow-y-auto">
            {availableMembers.map((user) => {
              const isAssigned = assignedUserIds.has(user.id);
              return (
                <div
                  key={user.id}
                  className={`flex items-center mb-1 cursor-pointer 
                  hover:bg-gray-100 dark:hover:bg-gray-700 rounded p-1 transition-colors
                  ${isUpdating ? "opacity-50" : ""}`}
                  onClick={() => !isUpdating && toggleAssignee(user)}
                  role="checkbox"
                  aria-checked={isAssigned}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      !isUpdating && toggleAssignee(user);
                    }
                  }}
                >
                  <div className="relative w-6 h-6 sm:w-8 sm:h-8 mr-2">
                    <Image
                      src={user.avatarUrl || "https://via.placeholder.com/30"}
                      alt={`${user.firstName} ${user.lastName}`}
                      className="rounded-full"
                      fill
                      sizes="(max-width: 640px) 24px, 32px"
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                  <span className="text-sm text-gray-800 dark:text-gray-200">{`${user.firstName} ${user.lastName}`}</span>
                  {isAssigned && (
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
