// src/app/[locale]/(protected)/kanban-board/hackathon/[id]/kanban-board/_components/KanbanBoard.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import {
  DndContext,
  closestCorners,
  DragEndEvent,
  DragStartEvent,
  DragOverEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Board } from "@/types/entities/board";
import { UserHackathon } from "@/types/entities/userHackathon";
import KanbanColumn from "./KanbanColumn";
import BoardHeader from "./BoardHeader";
import { useAuth } from "@/hooks/useAuth_v0";
import BoardUserManagement from "./BoardUserManagement";
import { useKanbanStore } from "@/store/kanbanStore";
import { BoardLabel } from "@/types/entities/boardLabel";
import { boardLabelService } from "@/services/boardLabel.service";
import { boardListService } from "@/services/boardList.service";
import { boardUserService } from "@/services/boardUser.service";
import { taskService } from "@/services/task.service";
import { fileUrlService } from "@/services/fileUrl.service";
import { taskLabelService } from "@/services/taskLabel.service";
import { taskCommentService } from "@/services/taskComment.service";
import { taskAssigneeService } from "@/services/taskAssignee.service";
import { useTranslations } from "@/hooks/useTranslations";
import { useToast } from "@/hooks/use-toast";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

interface KanbanBoardProps {
  board: Board | null;
  userHackathons: UserHackathon[];
  isLoading: boolean;
}

export default function KanbanBoard({
  board,
  userHackathons,
  isLoading,
}: KanbanBoardProps) {
  const { user } = useAuth();
  const toast = useToast();
  const t = useTranslations("kanban");
  const [isInviteModalOpen, setInviteModalOpen] = useState(false);
  const [isEditingBoard, setIsEditingBoard] = useState(false);
  const [boardName, setBoardName] = useState("");
  const [boardDescription, setBoardDescription] = useState("");
  const [activeId, setActiveId] = useState<string | null>(null);
  const { setBoard, setColumns, moveTask, moveList } = useKanbanStore();
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [currentLoadingList, setCurrentLoadingList] = useState<string | null>(
    null
  );
  // Add state for the enhanced board with labels
  const [enhancedBoard, setEnhancedBoard] = useState<Board | null>(null);

  // Check if current user is board owner
  const isOwner = board?.ownerId == user?.id;

  // Load board data progressively
  useEffect(() => {
    if (!board || isLoading || !userHackathons.length) return;

    const loadBoardData = async () => {
      setLoading(true);
      setBoardName(board.name);
      setBoardDescription(board.description || "");
      setBoard(board);

      try {
        // Create a user map from userHackathons for quick access
        const teamUsersMap = {};

        // Add all users from userHackathons to the map
        userHackathons.forEach((userHackathon) => {
          if (userHackathon.user) {
            teamUsersMap[userHackathon.user.id] = userHackathon.user;
          }
        });

        // Load board users first (for header display)
        const { data: boardUsers, message } =
          await boardUserService.getBoardUsersByBoardId(board.id);

        // Update boardUsers in the store with ALL users (including deleted ones)
        useKanbanStore.getState().setBoardUsers(boardUsers);

        // Load board labels (needed for task labels and BoardHeader)
        const { data: boardLabels } =
          await boardLabelService.getBoardLabelsByBoardId(board.id);

        // When updating the enhanced board, use active board users for display
        const activeBoardUsers = boardUsers.filter((bu) => !bu.isDeleted);

        // Update the enhanced board with users and labels
        const updatedBoard = {
          ...board,
          boardUsers: boardUsers, // Only include active (non-deleted) board users
          boardLabels, // Add the labels to the board object
        };

        // Update both states
        setBoard(updatedBoard);
        setEnhancedBoard(updatedBoard);

        const boardLabelsMap = boardLabels.reduce(
          (map, label) => {
            map[label.id] = label;
            return map;
          },
          {} as Record<string, BoardLabel>
        );

        // Load board lists (structure only)
        const { data: boardLists } =
          await boardListService.getBoardListsByBoardId(board.id);

        // Sort board lists by position before mapping to columns
        const sortedBoardLists = [...boardLists].sort(
          (a, b) => a.position - b.position
        );

        // Set initial columns with empty tasks (to show skeleton UI)
        const initialColumns = sortedBoardLists.map((list) => ({
          id: list.id,
          title: list.name,
          position: list.position,
          tasks: [],
        }));

        setColumns(initialColumns);
        setLoading(false);

        // Load tasks for each list progressively
        for (const list of sortedBoardLists) {
          setCurrentLoadingList(list.id);
          const { data: baseTasks } = await taskService.getTasksByBoardListId(
            list.id
          );

          // Process tasks in smaller batches if there are many
          const batchSize = 5;
          const enhancedTasks = [];

          for (let i = 0; i < baseTasks.length; i += batchSize) {
            const batch = baseTasks.slice(i, i + batchSize);
            const batchResults = await Promise.all(
              batch.map(async (task) => {
                // Fetch detailed information for each task
                const [
                  { data: fileUrls },
                  { data: taskLabels },
                  { data: comments },
                  { data: taskAssignees },
                ] = await Promise.all([
                  fileUrlService.getFileUrlsByTaskId(task.id),
                  taskLabelService.getTaskLabelsByTaskId(task.id),
                  taskCommentService.getTaskCommentsByTaskId(task.id),
                  taskAssigneeService.getTaskAssigneesByTaskId(task.id),
                ]);

                // UPDATED: Keep taskLabels as an array of TaskLabel objects
                // with an additional boardLabel property containing the full board label data
                const enhancedTaskLabels = taskLabels.map((taskLabel) => ({
                  id: taskLabel.id,
                  taskId: taskLabel.taskId,
                  boardLabelId: taskLabel.boardLabelId,
                  createdAt: taskLabel.createdAt,
                  updatedAt: taskLabel.updatedAt,
                  boardLabel: taskLabel.boardLabelId
                    ? boardLabelsMap[taskLabel.boardLabelId]
                    : undefined,
                }));

                // UPDATED: Keep taskAssignees as an array of TaskAssignee objects
                // with an additional user property containing the full user data
                const enhancedAssignees = taskAssignees.map((assignee) => ({
                  id: assignee.id,
                  taskId: assignee.taskId,
                  userId: assignee.userId,
                  createdAt: assignee.createdAt,
                  updatedAt: assignee.updatedAt,
                  user: assignee.userId
                    ? teamUsersMap[assignee.userId]
                    : undefined,
                }));

                // Return formatted task for Kanban display
                return {
                  id: task.id,
                  title: task.title,
                  status: list.name.toLowerCase().replace(/\s+/g, "-"),
                  description: task.description || "",
                  dueDate: task.dueDate,
                  position: task.position, // Make sure the position is included
                  // UPDATED: Use the enhanced arrays
                  assignees: enhancedAssignees,
                  taskLabels: enhancedTaskLabels,
                  fileUrls,
                  comments,
                };
              })
            );

            enhancedTasks.push(...batchResults);

            // Sort tasks by position before updating the column
            const sortedEnhancedTasks = [...enhancedTasks].sort(
              (a, b) => a.position - b.position
            );

            // Update the column with the tasks processed so far
            const updatedColumns = useKanbanStore
              .getState()
              .columns.map((col) =>
                col.id === list.id
                  ? { ...col, tasks: sortedEnhancedTasks }
                  : col
              );
            setColumns(updatedColumns);
          }
        }

        setCurrentLoadingList(null);
      } catch (error) {
        console.error("Error loading board data:", error);
      }
    };

    loadBoardData();
  }, [board, isLoading, userHackathons, setBoard, setColumns]);

  // Update the handleDragStart function
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    // Extract the actual ID without the prefix
    const activeId = active.id.toString();
    setActiveId(activeId);
  };

  // Update the handleDragOver function to handle empty columns better:
  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    if (!over) return;

    // Extract the actual IDs without prefixes
    const activeIdWithPrefix = active.id.toString();
    const overIdWithPrefix = over.id.toString();

    // Check if we're dealing with columns or tasks
    const isActiveColumn = activeIdWithPrefix.startsWith("column-");
    const isOverColumn = overIdWithPrefix.startsWith("column-");

    // Extract the actual IDs
    const activeId = isActiveColumn
      ? activeIdWithPrefix.replace("column-", "")
      : activeIdWithPrefix.replace("task-", "");
    const overId = isOverColumn
      ? overIdWithPrefix.replace("column-", "")
      : overIdWithPrefix.replace("task-", "");

    // If we're dragging a column over another column, it's handled elsewhere
    if (isActiveColumn && isOverColumn) return;

    // Find the active task
    const activeTask = useKanbanStore
      .getState()
      .columns.flatMap((col) => col.tasks)
      .find((task) => `task-${task.id}` === activeIdWithPrefix);

    // If no active task is found, return
    if (!activeTask) return;

    // If we're dragging over a column directly
    if (isOverColumn) {
      // Find the source column that contains the task
      const sourceColumnId = useKanbanStore
        .getState()
        .columns.find((column) =>
          column.tasks.some((task) => `task-${task.id}` === activeIdWithPrefix)
        )?.id;

      // Only move if we have a source column and it's different from the target
      if (sourceColumnId && sourceColumnId !== overId) {
        // Move the task to the target column
        useKanbanStore.getState().moveTask(activeId, sourceColumnId, overId);
      }
      return;
    }

    // Find the task we're dragging over
    const overTask = useKanbanStore
      .getState()
      .columns.flatMap((col) => col.tasks)
      .find((task) => `task-${task.id}` === overIdWithPrefix);

    // If we're not dragging over another task, return
    if (!overTask) return;

    // Find the columns for both tasks
    const overColumn = useKanbanStore
      .getState()
      .columns.find((col) =>
        col.tasks.some((task) => `task-${task.id}` === overIdWithPrefix)
      );

    const activeColumn = useKanbanStore
      .getState()
      .columns.find((col) =>
        col.tasks.some((task) => `task-${task.id}` === activeIdWithPrefix)
      );

    if (!overColumn || !activeColumn) return;

    // If tasks are in different columns, move the task to the new column
    if (activeColumn.id !== overColumn.id) {
      useKanbanStore
        .getState()
        .moveTask(activeId, activeColumn.id, overColumn.id);
      return;
    }

    // If tasks are in the same column, reorder tasks
    const overTaskIndex = overColumn.tasks.findIndex(
      (task) => `task-${task.id}` === overIdWithPrefix
    );

    // Reorder tasks in the column
    useKanbanStore
      .getState()
      .reorderTasksInColumn(overColumn.id, activeId, overTaskIndex);
  };

  // Update the handleDragEnd function to be consistent with handleDragOver
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    // Extract the actual IDs without prefixes
    const activeIdWithPrefix = active.id.toString();
    const overIdWithPrefix = over.id.toString();

    // Check if we're dealing with columns or tasks
    const isActiveColumn = activeIdWithPrefix.startsWith("column-");
    const isOverColumn = overIdWithPrefix.startsWith("column-");

    // Extract the actual IDs
    const activeId = isActiveColumn
      ? activeIdWithPrefix.replace("column-", "")
      : activeIdWithPrefix.replace("task-", "");
    const overId = isOverColumn
      ? overIdWithPrefix.replace("column-", "")
      : overIdWithPrefix.replace("task-", "");

    if (isActiveColumn) {
      // Find current and target index
      const columns = useKanbanStore.getState().columns;
      const currentIndex = columns.findIndex((col) => col.id === activeId);
      const targetIndex = columns.findIndex((col) => col.id === overId);

      if (currentIndex !== targetIndex) {
        try {
          setIsSaving(true);
          const result = await moveList(activeId, targetIndex);
          if (result?.message) {
            toast.success(result.message);
          } else {
            toast.success(t("success.listMoved"));
          }
        } catch (error: any) {
          toast.error(error.message || t("errors.listMoveFailed"));
        } finally {
          setIsSaving(false);
        }
      }
      return;
    }

    // Find the active task
    const activeTask = useKanbanStore
      .getState()
      .columns.flatMap((col) => col.tasks)
      .find((task) => `task-${task.id}` === activeIdWithPrefix);

    if (!activeTask) return;

    // Check if we're dropping on a column
    if (isOverColumn) {
      // This is a task being dragged to a column
      const sourceColumnId = useKanbanStore
        .getState()
        .columns.find((column) =>
          column.tasks.some((task) => `task-${task.id}` === activeIdWithPrefix)
        )?.id;

      if (sourceColumnId && sourceColumnId !== overId) {
        try {
          setIsSaving(true);
          const result = await moveTask(activeId, sourceColumnId, overId);
          if (result?.message) {
            toast.success(result.message);
          } else {
            toast.success(t("success.taskMoved"));
          }
        } catch (error: any) {
          toast.error(error.message || t("errors.taskMoveFailed"));
        } finally {
          setIsSaving(false);
        }
      }
    }
    // The reordering within the same column is handled in handleDragOver
  };

  // Add a new list with proper API handling
  const handleAddNewList = useCallback(async () => {
    try {
      setIsSaving(true);
      const nextPosition = useKanbanStore.getState().columns.length;
      const result = await useKanbanStore
        .getState()
        .createList(t("newList"), nextPosition);

      if (result?.message) {
        toast.success(result.message);
      }
    } catch (error: any) {
      toast.error(error.message || t("errors.createListFailed"));
    } finally {
      setIsSaving(false);
    }
  }, [toast, t]);

  // Save board details with proper API handling
  const handleSaveBoardDetails = useCallback(async () => {
    if (!board) return;

    try {
      setIsSaving(true);
      const updatedBoard = await useKanbanStore
        .getState()
        .updateBoardDetails(
          boardName,
          boardDescription,
          board.teamId,
          board.hackathonId,
          board.ownerId
        );

      if (updatedBoard) {
        // Update both board states
        setBoard(updatedBoard);
        setEnhancedBoard({
          ...updatedBoard,
          boardUsers: enhancedBoard?.boardUsers || [],
          boardLabels: enhancedBoard?.boardLabels || [],
        });
        toast.success(t("success.boardUpdated"));
      }
      setIsEditingBoard(false);
    } catch (error: any) {
      toast.error(error.message || t("errors.updateBoardFailed"));
      console.error("Error updating board details:", error);
    } finally {
      setIsSaving(false);
    }
  }, [board, boardName, boardDescription, enhancedBoard, setBoard, toast, t]);

  // Show loading skeleton if board data is still loading
  if (!board || isLoading) {
    return (
      <div className="space-y-6 transition-colors duration-300 dark:bg-gray-900">
        {/* Skeleton Header */}
        <div className="flex justify-between items-center">
          <div className="flex-1">
            <div className="h-8 w-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
            <div className="h-4 w-96 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>
        </div>

        {/* Skeleton Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-gray-100 dark:bg-gray-800 p-3 md:p-4 rounded-xl shadow-lg w-full min-h-[300px] md:min-h-[400px] transition-all duration-300"
            >
              <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-4"></div>
              <div className="space-y-3">
                {[1, 2, 3].map((j) => (
                  <div
                    key={j}
                    className="h-16 md:h-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
                  ></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Sort columns by position before rendering
  const sortedColumns = [...useKanbanStore.getState().columns].sort(
    (a, b) => a.position - b.position
  );

  return (
    <div className="space-y-6 transition-colors duration-300 dark:bg-gray-900">
      {/* Header - now passing the enhanced board with labels */}
      <BoardHeader
        board={enhancedBoard || board}
        isOwner={isOwner}
        onOpenUserManagement={() => setInviteModalOpen(true)}
        onEdit={() => setIsEditingBoard(true)}
      />

      {/* Kanban Board */}
      <DndContext
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={sortedColumns.map((col) => `column-${col.id}`)}
          strategy={horizontalListSortingStrategy}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 overflow-x-auto">
            {sortedColumns.map((column) => (
              <KanbanColumn
                key={column.id}
                column={column}
                isActive={activeId === `column-${column.id}`}
                isLoading={loading || currentLoadingList === column.id}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {/* Add New List Button */}
      <div className="mt-4">
        <button
          onClick={handleAddNewList}
          disabled={isSaving}
          className="bg-blue-500 dark:bg-blue-600 text-white hover:bg-blue-600 dark:hover:bg-blue-700 font-medium py-2 px-4 rounded-lg flex items-center transition-colors duration-300 disabled:opacity-50"
          aria-label={t("addNewList")}
        >
          {isSaving ? (
            <LoadingSpinner size="sm" className="mr-2" />
          ) : (
            <span className="mr-2">+</span>
          )}
          <span>{t("addNewList")}</span>
        </button>
      </div>

      {/* User Management Modal */}
      {isInviteModalOpen && (
        <BoardUserManagement
          board={useKanbanStore.getState().board || board}
          userHackathons={userHackathons} // Pass the userHackathons prop
          isOpen={isInviteModalOpen}
          onClose={() => setInviteModalOpen(false)}
          isOwner={isOwner}
        />
      )}

      {/* Board Edit Modal */}
      {isEditingBoard && (
        <BoardEditModal
          boardName={boardName}
          boardDescription={boardDescription}
          onSave={handleSaveBoardDetails}
          onCancel={() => {
            setBoardName(board.name);
            setBoardDescription(board.description || "");
            setIsEditingBoard(false);
          }}
          onChangeName={setBoardName}
          onChangeDescription={setBoardDescription}
          isLoading={isSaving}
        />
      )}
    </div>
  );
}

interface BoardEditModalProps {
  boardName: string;
  boardDescription: string;
  onSave: () => void;
  onCancel: () => void;
  onChangeName: (name: string) => void;
  onChangeDescription: (description: string) => void;
  isLoading?: boolean;
}

function BoardEditModal({
  boardName,
  boardDescription,
  onSave,
  onCancel,
  onChangeName,
  onChangeDescription,
  isLoading = false,
}: BoardEditModalProps) {
  const t = useTranslations("kanban");

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 md:p-6 w-full max-w-lg mx-4 transition-all duration-300">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
          {t("editBoard")}
        </h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t("boardName")}
          </label>
          <input
            type="text"
            value={boardName}
            onChange={(e) => onChangeName(e.target.value)}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300"
            disabled={isLoading}
            aria-label={t("boardName")}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t("description")}
          </label>
          <textarea
            value={boardDescription}
            onChange={(e) => onChangeDescription(e.target.value)}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300"
            rows={4}
            disabled={isLoading}
            aria-label={t("description")}
          />
        </div>

        <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300"
          >
            {t("cancel")}
          </button>
          <button
            onClick={onSave}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors duration-300 flex items-center justify-center"
          >
            {isLoading ? <LoadingSpinner size="sm" className="mr-2" /> : null}
            {t("saveChanges")}
          </button>
        </div>
      </div>
    </div>
  );
}
