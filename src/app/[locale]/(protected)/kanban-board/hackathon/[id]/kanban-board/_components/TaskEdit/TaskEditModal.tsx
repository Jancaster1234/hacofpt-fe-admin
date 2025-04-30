// src/app/[locale]/hackathon/[id]/team/[teamId]/board/_components/TaskEdit/TaskEditModal.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import { Task } from "@/types/entities/task";
import TaskTitle from "./TaskTitle";
import TaskDescription from "./TaskDescription";
import TaskDueDate from "./TaskDueDate";
import TaskLabels from "./TaskLabels";
import TaskAssignees from "./TaskAssignees";
import TaskAttachments from "./TaskAttachments";
import TaskComments from "./TaskComments";
import { BoardLabel } from "@/types/entities/boardLabel";
import { User } from "@/types/entities/user";
import { useKanbanStore } from "@/store/kanbanStore";
import { taskService } from "@/services/task.service";
import { taskLabelService } from "@/services/taskLabel.service";
import { taskAssigneeService } from "@/services/taskAssignee.service";
import { taskCommentService } from "@/services/taskComment.service";
import { FileUrl } from "@/types/entities/fileUrl";
import { TaskComment } from "@/types/entities/taskComment";
import { fileUrlService } from "@/services/fileUrl.service";
import { TaskLabel } from "@/types/entities/taskLabel";
import { TaskAssignee } from "@/types/entities/taskAssignee";
import { useTranslations } from "@/hooks/useTranslations";
import { useToast } from "@/hooks/use-toast";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

interface TaskEditModalProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
  boardLabels?: BoardLabel[];
}

export default function TaskEditModal({
  task,
  isOpen,
  onClose,
  boardLabels = [],
}: TaskEditModalProps) {
  const [updatedTask, setUpdatedTask] = useState<Task>(task);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [comments, setComments] = useState<TaskComment[]>(task.comments || []);
  const [files, setFiles] = useState<FileUrl[]>(task.fileUrls || []);
  const [isDeleting, setIsDeleting] = useState(false);
  const updateTask = useKanbanStore((state) => state.updateTask);
  const removeTask = useKanbanStore((state) => state.removeTask);
  const toast = useToast();
  const t = useTranslations("taskEditModal");

  // Get the board users from the store
  const boardUsers = useKanbanStore((state) => state.board?.boardUsers);

  // Then use useMemo to derive teamMembers
  const teamMembers = useMemo(() => {
    return (
      boardUsers
        ?.filter((bu) => !bu.isDeleted)
        .map((bu) => bu.user)
        .filter(Boolean) || []
    );
  }, [boardUsers]);

  // Fetch comments and files when the modal opens
  useEffect(() => {
    if (isOpen) {
      fetchComments();
      fetchFiles();
    }
  }, [isOpen, task.id]);

  // Handle escape key to close the modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  // Sync the store on any change to task data
  useEffect(() => {
    if (isOpen) {
      // Create a comprehensive updated task object
      const completeUpdatedTask = {
        ...updatedTask,
        comments: comments || [],
        fileUrls: files || [],
      };

      // Update the store with the latest data without triggering API calls
      // This ensures the UI is always in sync with the state
      updateTask(completeUpdatedTask);
    }
  }, [updatedTask, comments, files]);

  const fetchComments = async () => {
    try {
      setIsLoading(true);
      const { data } = await taskCommentService.getTaskCommentsByTaskId(
        task.id
      );
      if (data) {
        setComments(data);

        // Update the task in the store with the fetched comments
        const updatedTaskWithComments = {
          ...updatedTask,
          comments: data,
        };
        updateTask(updatedTaskWithComments);
      }
    } catch (err) {
      console.error("Error fetching comments:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFiles = async () => {
    try {
      setIsLoading(true);
      const { data } = await fileUrlService.getFileUrlsByTaskId(task.id);
      if (data) {
        setFiles(data);

        // Update the task in the store with the fetched files
        const updatedTaskWithFiles = {
          ...updatedTask,
          fileUrls: data,
        };
        updateTask(updatedTaskWithFiles);
      }
    } catch (err) {
      console.error("Error fetching files:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const handleSaveChanges = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Update task information (title, description, dueDate)
      const { data: updatedTaskData, message } =
        await taskService.updateTaskInformation(task.id, {
          title: updatedTask.title,
          description: updatedTask.description || "",
          boardListId: updatedTask.boardListId,
          dueDate: updatedTask.dueDate || "",
        });

      if (updatedTaskData) {
        // Create a comprehensive task object with all updated data
        const completeUpdatedTask = {
          ...updatedTaskData,
          // Include all the additional data we're tracking
          taskLabels: updatedTask.taskLabels || [],
          assignees: updatedTask.assignees || [],
          comments: comments || [],
          fileUrls: files || [],
        };

        // Update the task in the store with ALL the data
        updateTask(completeUpdatedTask);

        // Show success toast
        toast.success(t("saveSuccess"));

        // Close the modal
        onClose();
      }
    } catch (err: any) {
      const errorMessage = err?.message || t("saveFailed");
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTask = async () => {
    if (!window.confirm(t("deleteConfirmation"))) {
      return;
    }

    try {
      setIsDeleting(true);
      setError(null);

      // Use the enhanced removeTask from the store
      const { success, message } = await removeTask(task.id);

      if (success) {
        // Show success toast
        toast.success(t("deleteSuccess"));

        // Close the modal
        onClose();
      } else {
        setError(message || t("deleteFailed"));
        toast.error(message || t("deleteFailed"));
      }
    } catch (err: any) {
      const errorMessage = err?.message || t("deleteFailed");
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAddComment = async (comment: TaskComment) => {
    try {
      // Check if this is a deleted comment (using the special flag from TaskComments)
      if ((comment as any)._isDeleted) {
        // Remove the comment from the local state
        const updatedComments = comments.filter((c) => c.id !== comment.id);
        setComments(updatedComments);

        // Update the task in the store to reflect the comment change
        const updatedTaskWithComments = {
          ...updatedTask,
          comments: updatedComments,
        };
        updateTask(updatedTaskWithComments);

        // Show success toast
        toast.success(t("commentDeleted"));
      } else {
        // If it's a new or edited comment, add/update it in the state
        const existingIndex = comments.findIndex((c) => c.id === comment.id);
        let updatedComments;

        if (existingIndex >= 0) {
          // Update existing comment
          updatedComments = [...comments];
          updatedComments[existingIndex] = comment;

          // Show success toast
          toast.success(t("commentUpdated"));
        } else {
          // Add new comment
          updatedComments = [...comments, comment];

          // Show success toast
          toast.success(t("commentAdded"));
        }

        setComments(updatedComments);

        // Update the task in the store with the new comments
        const updatedTaskWithComments = {
          ...updatedTask,
          comments: updatedComments,
        };
        updateTask(updatedTaskWithComments);
      }
    } catch (err: any) {
      const errorMessage = err?.message || t("commentError");
      toast.error(errorMessage);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      const updatedComments = comments.filter((c) => c.id !== commentId);
      setComments(updatedComments);

      // Update the task in the store
      const updatedTaskWithComments = {
        ...updatedTask,
        comments: updatedComments,
      };
      updateTask(updatedTaskWithComments);

      // Show success toast
      toast.success(t("commentDeleted"));
    } catch (err: any) {
      const errorMessage = err?.message || t("deleteCommentError");
      toast.error(errorMessage);
    }
  };

  const handleAddFile = (file: FileUrl | FileUrl[]) => {
    try {
      let updatedFiles;

      if (Array.isArray(file)) {
        updatedFiles = [...files, ...file];
        //toast.success(t("filesAdded"));
      } else {
        updatedFiles = [...files, file];
        //toast.success(t("fileAdded"));
      }

      setFiles(updatedFiles);

      // Update the task in the store
      const updatedTaskWithFiles = {
        ...updatedTask,
        fileUrls: updatedFiles,
      };
      updateTask(updatedTaskWithFiles);
    } catch (err: any) {
      const errorMessage = err?.message || t("fileAddError");
      toast.error(errorMessage);
    }
  };

  const handleRemoveFile = async (fileId: string) => {
    try {
      const updatedFiles = files.filter((file) => file.id !== fileId);
      setFiles(updatedFiles);

      // Update the task in the store
      const updatedTaskWithFiles = {
        ...updatedTask,
        fileUrls: updatedFiles,
      };
      updateTask(updatedTaskWithFiles);

      // Show success toast
      toast.success(t("fileRemoved"));
    } catch (err: any) {
      const errorMessage = err?.message || t("fileRemoveError");
      toast.error(errorMessage);
    }
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    toast.error(errorMessage);
  };

  // Add handlers for labels and assignees
  const handleLabelsChange = async (taskLabels: TaskLabel[]) => {
    try {
      // Update local state
      setUpdatedTask({
        ...updatedTask,
        taskLabels: taskLabels,
      });

      // Update the task in the store
      const updatedTaskWithLabels = {
        ...updatedTask,
        taskLabels: taskLabels,
        comments,
        fileUrls: files,
      };
      updateTask(updatedTaskWithLabels);

      // Show success toast
      toast.success(t("labelsUpdated"));
    } catch (err: any) {
      const errorMessage = err?.message || t("labelsUpdateError");
      toast.error(errorMessage);
    }
  };

  const handleAssigneesChange = async (assignees: TaskAssignee[]) => {
    try {
      // Update local state
      setUpdatedTask({
        ...updatedTask,
        assignees: assignees,
      });

      // Update the task in the store
      const updatedTaskWithAssignees = {
        ...updatedTask,
        assignees: assignees,
        comments,
        fileUrls: files,
      };
      updateTask(updatedTaskWithAssignees);

      // Show success toast
      toast.success(t("assigneesUpdated"));
    } catch (err: any) {
      const errorMessage = err?.message || t("assigneesUpdateError");
      toast.error(errorMessage);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 overflow-y-auto p-4 md:p-0">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto transition-colors duration-300 shadow-xl">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {t("editTask")}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            disabled={isLoading || isDeleting}
            aria-label={t("close")}
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="p-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm border-b border-red-100 dark:border-red-900/30">
            {error}
          </div>
        )}

        <div className="p-4">
          {/* Task Title */}
          <TaskTitle
            title={updatedTask.title}
            onChange={(title) => {
              const updated = { ...updatedTask, title };
              setUpdatedTask(updated);
              // Update the task in the store to reflect title change
              updateTask({
                ...updated,
                comments,
                fileUrls: files,
              });
            }}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 space-y-4">
              {/* Task Description */}
              <TaskDescription
                description={updatedTask.description || ""}
                onChange={(description) => {
                  const updated = { ...updatedTask, description };
                  setUpdatedTask(updated);
                  // Update the task in the store to reflect description change
                  updateTask({
                    ...updated,
                    comments,
                    fileUrls: files,
                  });
                }}
              />

              {/* Task Attachments */}
              <TaskAttachments
                files={files}
                taskId={task.id}
                onAddFile={handleAddFile}
                onRemoveFile={handleRemoveFile}
                onError={handleError}
              />

              {/* Task Comments */}
              <TaskComments
                comments={comments}
                taskId={task.id}
                onAddComment={handleAddComment}
                onDeleteComment={handleDeleteComment}
                onError={handleError}
              />
            </div>

            <div className="space-y-4">
              {/* Task Actions */}
              <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-md shadow-sm transition-colors">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t("addToCard")}
                </h3>

                {/* Task Labels */}
                <TaskLabels
                  taskLabels={updatedTask.taskLabels || []}
                  availableLabels={boardLabels}
                  taskId={task.id}
                  onChange={handleLabelsChange}
                />

                {/* Task Due Date */}
                <TaskDueDate
                  dueDate={updatedTask.dueDate}
                  onChange={(dueDate) => {
                    const updated = { ...updatedTask, dueDate };
                    setUpdatedTask(updated);
                    // Update the task in the store to reflect due date change
                    updateTask({
                      ...updated,
                      comments,
                      fileUrls: files,
                    });
                  }}
                />

                {/* Task Assignees */}
                <TaskAssignees
                  taskAssignees={updatedTask.assignees || []}
                  availableMembers={teamMembers}
                  taskId={task.id}
                  onChange={handleAssigneesChange}
                />
              </div>

              {/* Actions */}
              <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-md shadow-sm transition-colors">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t("actions")}
                </h3>
                <button
                  className="w-full text-left text-sm py-1 px-2 text-red-600 dark:text-red-400 hover:bg-gray-200 dark:hover:bg-gray-600/50 rounded transition-colors"
                  onClick={handleDeleteTask}
                  disabled={isLoading || isDeleting}
                  aria-label={t("delete")}
                >
                  {isDeleting ? (
                    <div className="flex items-center">
                      <LoadingSpinner size="sm" className="mr-2" />
                      {t("deleting")}
                    </div>
                  ) : (
                    t("delete")
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <button
              onClick={handleSaveChanges}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 disabled:bg-blue-300 dark:disabled:bg-blue-800/70 transition-colors shadow-sm"
              disabled={isLoading}
              aria-label={t("saveChanges")}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <LoadingSpinner size="sm" className="mr-2" />
                  {t("saving")}
                </div>
              ) : (
                t("saveChanges")
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
