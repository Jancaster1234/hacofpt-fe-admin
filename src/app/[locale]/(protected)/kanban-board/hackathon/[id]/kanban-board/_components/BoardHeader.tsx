// src/app/[locale]/(protected)/kanban-board/hackathon/[id]/kanban-board/_components/BoardHeader.tsx
"use client";

import { useState, useEffect } from "react";
import { Board } from "@/types/entities/board";
import { BoardLabel } from "@/types/entities/boardLabel";
import { useKanbanStore } from "@/store/kanbanStore";
import { useTranslations } from "@/hooks/useTranslations";
import { useToast } from "@/hooks/use-toast";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Image from "next/image";

interface BoardHeaderProps {
  board: Board;
  isOwner: boolean;
  onOpenUserManagement: () => void;
  onEdit: () => void;
}

export default function BoardHeader({
  board: initialBoard,
  isOwner,
  onOpenUserManagement,
  onEdit,
}: BoardHeaderProps) {
  const [isLabelModalOpen, setIsLabelModalOpen] = useState(false);
  const t = useTranslations("boardHeader");

  // Get the board from kanban store instead of using the prop directly
  const storeBoard = useKanbanStore((state) => state.board);

  // Use the store's board if available, otherwise fall back to the prop
  const board = storeBoard || initialBoard;

  useEffect(() => {
    // Update any local state when board details change
    // For example, if you have any local state derived from board name/description
  }, [board.name, board.description]);

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 transition-colors duration-300">
      <div className="flex-1">
        <div className="flex items-center space-x-2">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
            {board.name}
          </h1>
          {isOwner && (
            <button
              onClick={onEdit}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200"
              title={t("editBoard")}
              aria-label={t("editBoard")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
            </button>
          )}
        </div>

        <p className="text-gray-600 dark:text-gray-300 mt-1 text-sm sm:text-base">
          {board.description}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center mt-4 md:mt-0 w-full md:w-auto">
        {/* Avatars */}
        <div className="flex -space-x-2 mr-2 sm:mr-4 mb-2 sm:mb-0">
          {board.boardUsers
            ?.filter((bu) => !bu.isDeleted)
            .slice(0, 3)
            .map((boardUser) => (
              <div
                key={boardUser.id}
                className="h-8 w-8 rounded-full bg-gray-300 dark:bg-gray-600 border-2 border-white dark:border-gray-800 flex items-center justify-center text-sm font-medium transition-all duration-200"
                title={boardUser.user?.username || t("user")}
              >
                {boardUser.user?.avatarUrl ? (
                  <Image
                    src={boardUser.user.avatarUrl}
                    alt={boardUser.user.username || t("user")}
                    width={32}
                    height={32}
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : (
                  boardUser.user?.username?.charAt(0) || t("userInitial")
                )}
              </div>
            ))}
          {(board.boardUsers?.filter((bu) => !bu.isDeleted).length || 0) >
            3 && (
            <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 border-2 border-white dark:border-gray-800 flex items-center justify-center text-xs font-medium text-gray-700 dark:text-gray-200 transition-colors duration-200">
              +
              {(board.boardUsers?.filter((bu) => !bu.isDeleted).length || 0) -
                3}
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex flex-col xs:flex-row space-y-2 xs:space-y-0 xs:space-x-2 w-full sm:w-auto">
          {/* Label Management Button */}
          <button
            onClick={() => setIsLabelModalOpen(true)}
            className="flex items-center justify-center px-3 py-2 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-200 hover:bg-purple-200 dark:hover:bg-purple-800 rounded-md text-xs sm:text-sm font-medium transition-colors duration-200"
            aria-label={t("manageLabels")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
              />
            </svg>
            {t("manageLabels")}
          </button>

          {/* Manage Users Button */}
          <button
            onClick={onOpenUserManagement}
            className="flex items-center justify-center px-3 py-2 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-800 rounded-md text-xs sm:text-sm font-medium transition-colors duration-200"
            aria-label={t("manageUsers")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
            {t("manageUsers")}
          </button>
        </div>
      </div>

      {/* Label Management Modal */}
      {isLabelModalOpen && (
        <BoardLabelManagement
          board={board}
          isOpen={isLabelModalOpen}
          onClose={() => setIsLabelModalOpen(false)}
          isOwner={isOwner}
        />
      )}
    </div>
  );
}

interface BoardLabelManagementProps {
  board: Board;
  isOpen: boolean;
  onClose: () => void;
  isOwner: boolean;
}

function BoardLabelManagement({
  board,
  isOpen,
  onClose,
  isOwner,
}: BoardLabelManagementProps) {
  const [labels, setLabels] = useState<BoardLabel[]>(board.boardLabels || []);
  const [newLabelName, setNewLabelName] = useState("");
  const [newLabelColor, setNewLabelColor] = useState("#3b82f6"); // Default blue color
  const [editingLabel, setEditingLabel] = useState<BoardLabel | null>(null);
  const { createLabel, updateLabel, deleteLabel } = useKanbanStore();
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const t = useTranslations("boardLabels");

  // Color options for labels
  const colorOptions = [
    { name: t("blue"), value: "#3b82f6" },
    { name: t("green"), value: "#10b981" },
    { name: t("red"), value: "#ef4444" },
    { name: t("yellow"), value: "#f59e0b" },
    { name: t("purple"), value: "#8b5cf6" },
    { name: t("pink"), value: "#ec4899" },
    { name: t("gray"), value: "#6b7280" },
  ];

  const handleAddLabel = async () => {
    if (!newLabelName.trim()) return;
    setIsLoading(true);

    try {
      // Make sure the board ID is passed to the createLabel function
      const result = await createLabel(newLabelName, newLabelColor);
      if (result) {
        setLabels([...labels, result.label]);
        setNewLabelName("");
        toast.success(result.message || t("labelAddedSuccess"));
      }
    } catch (error: any) {
      console.error("Error adding label:", error);
      // Use the error message from the API if available
      const errorMessage = error?.message || t("labelAddedError");
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateLabel = async () => {
    if (!editingLabel || !newLabelName.trim()) return;
    setIsLoading(true);

    try {
      const result = await updateLabel(
        editingLabel.id,
        newLabelName,
        newLabelColor
      );
      if (result) {
        setLabels(
          labels.map((label) =>
            label.id === editingLabel.id
              ? { ...label, name: newLabelName, color: newLabelColor }
              : label
          )
        );
        setEditingLabel(null);
        setNewLabelName("");
        setNewLabelColor(colorOptions[0].value);
        toast.success(result.message || t("labelUpdatedSuccess"));
      }
    } catch (error: any) {
      console.error("Error updating label:", error);
      // Use the error message from the API if available
      const errorMessage = error?.message || t("labelUpdatedError");
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteLabel = async (labelId: string) => {
    if (!confirm(t("confirmDeleteLabel"))) return;
    setIsLoading(true);

    try {
      const success = await deleteLabel(labelId);
      if (success) {
        setLabels(labels.filter((label) => label.id !== labelId));
        toast.success(t("labelDeletedSuccess"));
      }
    } catch (error) {
      console.error("Error deleting label:", error);
      toast.error(t("labelDeletedError"));
    } finally {
      setIsLoading(false);
    }
  };

  const startEditLabel = (label: BoardLabel) => {
    setEditingLabel(label);
    setNewLabelName(label.name);
    setNewLabelColor(label.color);
  };

  const cancelEdit = () => {
    setEditingLabel(null);
    setNewLabelName("");
    setNewLabelColor(colorOptions[0].value);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 dark:bg-black/50 bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 w-full max-w-md shadow-xl transition-all duration-300">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">
            {t("manageBoardLabels")}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200"
            aria-label={t("close")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Label Form */}
        <div className="mb-6 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <div className="mb-3">
            <label
              htmlFor="labelName"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
            >
              {editingLabel ? t("updateLabel") : t("addNewLabel")}
            </label>
            <input
              id="labelName"
              type="text"
              value={newLabelName}
              onChange={(e) => setNewLabelName(e.target.value)}
              placeholder={t("labelNamePlaceholder")}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-md mb-2 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
              disabled={isLoading}
            />
          </div>

          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              {t("color")}
            </label>
            <div className="flex flex-wrap gap-2">
              {colorOptions.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => setNewLabelColor(color.value)}
                  className={`h-8 w-8 rounded-full border-2 ${
                    newLabelColor === color.value
                      ? "border-black dark:border-white"
                      : "border-transparent"
                  } transition-all duration-200`}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                  disabled={isLoading}
                  aria-label={color.name}
                >
                  <span className="sr-only">{color.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col xs:flex-row space-y-2 xs:space-y-0 xs:space-x-2">
            {editingLabel ? (
              <>
                <button
                  onClick={handleUpdateLabel}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md flex-1 disabled:bg-blue-300 dark:disabled:bg-blue-800 transition-colors duration-200 flex justify-center items-center"
                  disabled={!isOwner || isLoading || !newLabelName.trim()}
                >
                  {isLoading ? (
                    <LoadingSpinner size="sm" className="mr-2" />
                  ) : null}
                  {isLoading ? t("updating") : t("updateLabel")}
                </button>
                <button
                  onClick={cancelEdit}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-md disabled:bg-gray-100 dark:disabled:bg-gray-800 transition-colors duration-200"
                  disabled={isLoading}
                >
                  {t("cancel")}
                </button>
              </>
            ) : (
              <button
                onClick={handleAddLabel}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md w-full disabled:bg-blue-300 dark:disabled:bg-blue-800 transition-colors duration-200 flex justify-center items-center"
                disabled={!isOwner || !newLabelName.trim() || isLoading}
              >
                {isLoading ? (
                  <LoadingSpinner size="sm" className="mr-2" />
                ) : null}
                {isLoading ? t("adding") : t("addLabel")}
              </button>
            )}
          </div>
        </div>

        {/* Labels List */}
        <div className="max-h-60 sm:max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
          <h3 className="font-medium text-gray-700 dark:text-gray-200 mb-2">
            {t("currentLabels")}
          </h3>
          {labels.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-sm italic">
              {t("noLabelsAvailable")}
            </p>
          ) : (
            <ul className="space-y-2">
              {labels.map((label) => (
                <li
                  key={label.id}
                  className="p-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md flex justify-between items-center transition-colors duration-200"
                >
                  <div className="flex items-center">
                    <div
                      className="h-4 w-4 rounded-full mr-2"
                      style={{ backgroundColor: label.color }}
                      aria-hidden="true"
                    ></div>
                    <span className="text-gray-900 dark:text-gray-100">
                      {label.name}
                    </span>
                  </div>
                  {isOwner && (
                    <div className="flex space-x-1">
                      <button
                        onClick={() => startEditLabel(label)}
                        className="text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400 transition-colors duration-200"
                        disabled={isLoading}
                        aria-label={t("editLabel")}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteLabel(label.id)}
                        className="text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 transition-colors duration-200"
                        disabled={isLoading}
                        aria-label={t("deleteLabel")}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
