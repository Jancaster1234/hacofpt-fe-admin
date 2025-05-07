// src/app/[locale]/(protected)/kanban-board/hackathon/[id]/kanban-board/_components/BoardUserManagement.tsx
"use client";

import { Fragment, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Image from "next/image";
import { Board } from "@/types/entities/board";
import { BoardUser, BoardUserRole } from "@/types/entities/boardUser";
import { Team } from "@/types/entities/team";
import { UserHackathon } from "@/types/entities/userHackathon";
import { useAuth } from "@/hooks/useAuth_v0";
import { useKanbanStore } from "@/store/kanbanStore";
import { useTranslations } from "@/hooks/useTranslations";
import { useToast } from "@/hooks/use-toast";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

interface BoardUserManagementProps {
  board: Board;
  team?: Team | null; // Make team optional as we'll use userHackathons
  userHackathons: UserHackathon[]; // Add the new userHackathons prop
  isOpen: boolean;
  onClose: () => void;
  isOwner: boolean;
}

export default function BoardUserManagement({
  board,
  team,
  userHackathons,
  isOpen,
  onClose,
  isOwner,
}: BoardUserManagementProps) {
  const { user } = useAuth();
  const t = useTranslations("boardUserManagement");
  const toast = useToast();
  const [selectedTeamMember, setSelectedTeamMember] = useState<string>("");
  const [selectedRole, setSelectedRole] = useState<BoardUserRole>("MEMBER");
  const [error, setError] = useState<string | null>(null);

  // Use KanbanStore for state management
  const {
    createBoardUser,
    updateBoardUserRole,
    deleteBoardUser,
    isLoading,
    setError: setStoreError,
  } = useKanbanStore();

  // Get ALL boardUsers from the KanbanStore's board object (including deleted ones)
  const boardUsers = useKanbanStore((state) => state.board?.boardUsers || []);

  useEffect(() => {
    // Clear any errors when opening/closing modal
    setError(null);
    setStoreError(null);
  }, [isOpen, setStoreError]);

  // Extract users from userHackathons instead of team.teamMembers
  const hackathonUsers = userHackathons.map((uh) => uh.user).filter(Boolean);

  // Filter hackathon users who are not already active board users
  const availableTeamMembers = hackathonUsers.filter(
    (hackathonUser) =>
      hackathonUser && // Ensure user exists
      !boardUsers.some(
        (bu) => !bu.isDeleted && bu.user?.id === hackathonUser.id
      )
  );

  const handleAddUser = async () => {
    if (!selectedTeamMember || !isOwner) return;

    setError(null);
    try {
      // Show loading toast
      toast.info(t("addingUser"));

      // Check if this user was previously deleted (soft-deleted)
      const existingBoardUser = boardUsers.find(
        (bu) => bu.user?.id === selectedTeamMember && bu.isDeleted
      );

      if (existingBoardUser) {
        // If the user was previously soft-deleted, update their role and isDeleted status
        await updateBoardUserRole(existingBoardUser.id, selectedRole);
        toast.success(t("userReinstated"));
      } else {
        // Create a new board user if they didn't exist before
        await createBoardUser(selectedTeamMember, selectedRole);
        toast.success(t("userAdded"));
      }

      // Reset the selection
      setSelectedTeamMember("");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(errorMessage);
      toast.error(t("errorAddingUser"));
      console.error("Error adding user:", err);
    }
  };

  const handleUpdateRole = async (
    boardUser: BoardUser,
    newRole: BoardUserRole
  ) => {
    if (!isOwner) return;

    setError(null);
    try {
      toast.info(t("updatingRole"));
      await updateBoardUserRole(boardUser.id, newRole);
      toast.success(t("roleUpdated"));
      // The store already updates the state
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(errorMessage);
      toast.error(t("errorUpdatingRole"));
      console.error("Error updating user role:", err);
    }
  };

  const handleRemoveUser = async (boardUser: BoardUser) => {
    // Don't allow removing the owner/yourself or if not owner
    if (
      !isOwner ||
      boardUser.user?.id === board.owner?.id ||
      boardUser.user?.id === user?.id
    ) {
      return;
    }

    setError(null);
    try {
      toast.info(t("removingUser"));
      await deleteBoardUser(boardUser.id);
      toast.success(t("userRemoved"));
      // The store already updates the state
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(errorMessage);
      toast.error(t("errorRemovingUser"));
      console.error("Error removing user:", err);
    }
  };

  // Filter out deleted users for display
  const activeBoardUsers = boardUsers.filter((bu) => !bu.isDeleted);

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          // enterFrom="opacity-0"
          // enterTo="opacity-100"
          leave="ease-in duration-200"
          // leaveFrom="opacity-100"
          // leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30 dark:bg-black/50" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              // enterFrom="opacity-0 scale-95"
              // enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              // leaveFrom="opacity-100 scale-100"
              // leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-xl w-full max-w-md transition-all transform">
                <Dialog.Title className="text-lg font-semibold text-gray-900 dark:text-white">
                  {isOwner ? t("manageUsers") : t("boardUsers")}
                </Dialog.Title>

                {!isOwner && (
                  <p className="mt-2 text-gray-500 dark:text-gray-400 italic">
                    {t("viewOnlyMode")}
                  </p>
                )}

                {(error || useKanbanStore.getState().error) && (
                  <div className="mt-2 p-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded">
                    {error || useKanbanStore.getState().error}
                  </div>
                )}

                <div className="mt-4 space-y-6">
                  {/* Current board users */}
                  <div>
                    <h3 className="font-medium mb-2 text-gray-900 dark:text-gray-200">
                      {t("currentUsers")}
                    </h3>
                    {isLoading ? (
                      <div className="text-center py-4">
                        <LoadingSpinner size="md" showText={true} />
                      </div>
                    ) : activeBoardUsers.length === 0 ? (
                      <div className="text-gray-500 dark:text-gray-400 italic">
                        {t("noUsers")}
                      </div>
                    ) : (
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {activeBoardUsers.map((boardUser) => (
                          <div
                            key={boardUser.id}
                            className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-2 border dark:border-gray-700 rounded bg-white dark:bg-gray-900 transition-colors"
                          >
                            <div className="flex items-center space-x-3 mb-2 sm:mb-0">
                              <div className="relative w-8 h-8 rounded-full overflow-hidden ring-1 ring-gray-200 dark:ring-gray-700">
                                <Image
                                  src={
                                    boardUser.user?.avatarUrl ||
                                    "https://via.placeholder.com/40"
                                  }
                                  alt={`${boardUser.user?.firstName} ${boardUser.user?.lastName}`}
                                  fill
                                  sizes="32px"
                                  className="object-cover"
                                  priority
                                />
                              </div>
                              <span className="dark:text-white">
                                {boardUser.user?.firstName}{" "}
                                {boardUser.user?.lastName}
                                {boardUser.user?.id === board.owner?.id &&
                                  ` (${t("owner")})`}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2 w-full sm:w-auto">
                              {boardUser.user?.id !== board.owner?.id &&
                              isOwner ? (
                                <>
                                  <select
                                    value={boardUser.role}
                                    onChange={(e) =>
                                      handleUpdateRole(
                                        boardUser,
                                        e.target.value as BoardUserRole
                                      )
                                    }
                                    disabled={isLoading}
                                    className="border dark:border-gray-600 rounded px-2 py-1 text-sm bg-white dark:bg-gray-800 dark:text-white"
                                  >
                                    <option value="ADMIN">
                                      {t("roles.admin")}
                                    </option>
                                    <option value="MEMBER">
                                      {t("roles.member")}
                                    </option>
                                  </select>
                                  {boardUser.user?.id !== user?.id && (
                                    <button
                                      onClick={() =>
                                        handleRemoveUser(boardUser)
                                      }
                                      disabled={isLoading}
                                      className="px-2 py-1 text-red-600 dark:text-red-400 hover:underline disabled:text-red-300 dark:disabled:text-red-600/50 transition-colors"
                                      aria-label={t("removeUser")}
                                    >
                                      {t("remove")}
                                    </button>
                                  )}
                                </>
                              ) : (
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                  {boardUser.role === "ADMIN"
                                    ? t("roles.admin")
                                    : t("roles.member")}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Add new user - Only shown to owner */}
                  {isOwner && availableTeamMembers.length > 0 && (
                    <div>
                      <h3 className="font-medium mb-2 text-gray-900 dark:text-gray-200">
                        {t("addTeamMember")}
                      </h3>
                      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                        <select
                          value={selectedTeamMember}
                          onChange={(e) =>
                            setSelectedTeamMember(e.target.value)
                          }
                          disabled={isLoading}
                          className="flex-1 border dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-800 dark:text-white"
                          aria-label={t("selectTeamMember")}
                        >
                          <option value="">{t("selectTeamMember")}</option>
                          {availableTeamMembers.map((member) => (
                            <option key={member.id} value={member.id}>
                              {member.firstName} {member.lastName}
                            </option>
                          ))}
                        </select>

                        <select
                          value={selectedRole}
                          onChange={(e) =>
                            setSelectedRole(e.target.value as BoardUserRole)
                          }
                          disabled={isLoading}
                          className="border dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-800 dark:text-white"
                          aria-label={t("selectRole")}
                        >
                          <option value="ADMIN">{t("roles.admin")}</option>
                          <option value="MEMBER">{t("roles.member")}</option>
                        </select>

                        <button
                          onClick={handleAddUser}
                          disabled={!selectedTeamMember || isLoading}
                          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded disabled:bg-blue-300 dark:disabled:bg-blue-700/50 transition-colors"
                          aria-label={t("add")}
                        >
                          {isLoading ? (
                            <div className="flex items-center justify-center">
                              <LoadingSpinner size="sm" className="mr-2" />
                              <span>{t("adding")}</span>
                            </div>
                          ) : (
                            t("add")
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 dark:text-white rounded transition-colors"
                    disabled={isLoading}
                    aria-label={t("close")}
                  >
                    {t("close")}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
