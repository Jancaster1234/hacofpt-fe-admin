// src/app/[locale]/(protected)/organizer-hackathon-management/[id]/resource-management/_components/UserManagement.tsx
import { useEffect, useState } from "react";
import { UserHackathon } from "@/types/entities/userHackathon";
import { User } from "@/types/entities/user";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  PlusIcon,
  TrashIcon,
  XIcon,
  MoonIcon,
  SunIcon,
  SearchIcon,
} from "lucide-react";
import Image from "next/image";
import { userService } from "@/services/user.service";
import { userHackathonService } from "@/services/userHackathon.service";
import { useApiModal } from "@/hooks/useApiModal";
import { useTranslations } from "@/hooks/useTranslations";
import { useToast } from "@/hooks/use-toast";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function UserManagement({
  hackathonId,
}: {
  hackathonId: string;
}) {
  const t = useTranslations("userManagement");
  const { showSuccess, showError } = useApiModal();
  const toast = useToast();

  const [users, setUsers] = useState<UserHackathon[]>([]);
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedRoles, setExpandedRoles] = useState<{
    [key: string]: boolean;
  }>({});
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>("MENTOR");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch user hackathons for this hackathon
        const userHackathonsResponse =
          await userHackathonService.getUserHackathonsByHackathonId(
            hackathonId
          );

        // Fetch all available users
        const usersResponse = await userService.getAllUsers();

        setUsers(userHackathonsResponse.data);
        setAvailableUsers(usersResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        showError(t("errorLoadingTitle"), t("errorLoadingMessage"));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [hackathonId, showError, t]);

  const groupedUsers = {
    ORGANIZER: users.filter((u) => u.role === "ORGANIZER"),
    JUDGE: users.filter((u) => u.role === "JUDGE"),
    MENTOR: users.filter((u) => u.role === "MENTOR"),
  };

  const toggleRoleVisibility = (role: string) => {
    setExpandedRoles((prev) => ({ ...prev, [role]: !prev[role] }));
  };

  const filteredUsers = availableUsers.filter((user) => {
    // Filter by email or name matching search term
    const searchMatch =
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${user.firstName} ${user.lastName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    // Filter out users who are already assigned to this hackathon
    const notAssigned = !users.some((u) => u.userId === user.id);

    return searchMatch && notAssigned;
  });

  const createUserHackathon = async () => {
    if (!selectedUser) return;

    setSubmitLoading(true);

    // Create request body
    const requestBody = {
      userId: selectedUser.id,
      hackathonId,
      role: selectedRole,
    };

    try {
      // Call the service
      const response =
        await userHackathonService.createUserHackathon(requestBody);

      // If successful, update the users list
      if (response.data) {
        // Refresh users list to get the updated data with proper IDs
        const userHackathonsResponse =
          await userHackathonService.getUserHackathonsByHackathonId(
            hackathonId
          );
        setUsers(userHackathonsResponse.data);

        // Show success toast
        toast.success(
          response.message ||
            t("userAddedSuccess", {
              name: `${selectedUser.firstName} ${selectedUser.lastName}`,
              role: t(`roles.${selectedRole.toLowerCase()}`),
            })
        );
      }

      // Reset form
      setSelectedUser(null);
      setSearchTerm("");
      setIsAddingUser(false);
    } catch (error: any) {
      console.error("Failed to create user hackathon:", error);
      toast.error(error.message || t("addUserFailed"));
    } finally {
      setSubmitLoading(false);
    }
  };

  const deleteUserHackathon = async (userHackathon: UserHackathon) => {
    setDeleteLoading(userHackathon.id);
    try {
      const response = await userHackathonService.deleteUserHackathon(
        userHackathon.id
      );

      // Update local state after successful deletion
      setUsers((prev) => prev.filter((u) => u.id !== userHackathon.id));

      // Show success toast
      toast.success(
        response.message ||
          t("userRemovedSuccess", {
            name: `${userHackathon.user?.firstName} ${userHackathon.user?.lastName}`,
          })
      );
    } catch (error: any) {
      console.error("Failed to delete user hackathon:", error);
      toast.error(error.message || t("removeUserFailed"));
    } finally {
      setDeleteLoading(null);
    }
  };

  const getRoleTranslation = (role: string) => {
    return t(`roles.${role.toLowerCase()}`);
  };

  return (
    <div className="transition-colors duration-300 dark:text-gray-200">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
        <h2 className="text-xl font-semibold dark:text-white">{t("title")}</h2>
        <button
          onClick={() => setIsAddingUser(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md flex items-center transition-colors duration-200 text-sm sm:text-base w-full sm:w-auto justify-center"
        >
          <PlusIcon className="w-4 h-4 mr-1" /> {t("addUserButton")}
        </button>
      </div>

      {isAddingUser && (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md mb-6 transition-colors duration-300">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium dark:text-white">
              {t("addNewUser")}
            </h3>
            <button
              onClick={() => setIsAddingUser(false)}
              className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
              aria-label={t("close")}
            >
              <XIcon className="w-5 h-5" />
            </button>
          </div>

          <div className="mb-4">
            <label
              htmlFor="search"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              {t("searchByEmail")}
            </label>
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
              <input
                type="text"
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t("searchPlaceholder")}
                className="w-full p-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          {searchTerm && (
            <div className="max-h-60 overflow-y-auto mb-4 border border-gray-200 dark:border-gray-700 rounded-md">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className={`p-2 flex items-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                      selectedUser?.id === user.id
                        ? "bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500"
                        : "border-l-4 border-transparent"
                    }`}
                    onClick={() => setSelectedUser(user)}
                  >
                    <Image
                      src={user.avatarUrl || "/avatars/default.jpg"}
                      alt={`${user.firstName} ${user.lastName}`}
                      className="w-8 h-8 rounded-full mr-2"
                      width={32}
                      height={32}
                    />
                    <div>
                      <p className="font-medium dark:text-white">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {user.email}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="p-3 text-gray-500 dark:text-gray-400">
                  {t("noMatchingUsers")}
                </p>
              )}
            </div>
          )}

          {selectedUser && (
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t("selectedUser")}:
              </p>
              <div className="flex items-center p-2 bg-blue-50 dark:bg-blue-900/30 rounded-md">
                <Image
                  src={selectedUser.avatarUrl || "/avatars/default.jpg"}
                  alt={`${selectedUser.firstName} ${selectedUser.lastName}`}
                  className="w-8 h-8 rounded-full mr-2"
                  width={32}
                  height={32}
                />
                <div>
                  <p className="font-medium dark:text-white">
                    {selectedUser.firstName} {selectedUser.lastName}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedUser.email}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="mb-4">
            <label
              htmlFor="role"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              {t("assignRole")}
            </label>
            <select
              id="role"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="ORGANIZER">{t("roles.organizer")}</option>
              <option value="JUDGE">{t("roles.judge")}</option>
              <option value="MENTOR">{t("roles.mentor")}</option>
            </select>
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-2">
            <button
              onClick={() => setIsAddingUser(false)}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors order-2 sm:order-1"
            >
              {t("cancel")}
            </button>
            <button
              onClick={createUserHackathon}
              disabled={!selectedUser || submitLoading}
              className={`px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-colors order-1 sm:order-2 ${
                !selectedUser || submitLoading
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              {submitLoading ? (
                <span className="flex items-center justify-center">
                  <LoadingSpinner size="sm" className="mr-2" /> {t("adding")}
                </span>
              ) : (
                t("addUser")
              )}
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-8">
          <LoadingSpinner size="md" showText={true} />
        </div>
      ) : (
        Object.entries(groupedUsers).map(([role, usersInRole]) => (
          <div key={role} className="mb-6">
            <div
              className="flex justify-between items-center cursor-pointer p-2 bg-gray-200 dark:bg-gray-700 rounded-md transition-colors"
              onClick={() => toggleRoleVisibility(role)}
              role="button"
              aria-expanded={expandedRoles[role]}
              aria-controls={`role-section-${role}`}
            >
              <h3 className="text-lg font-medium text-gray-800 dark:text-white">
                {getRoleTranslation(role)} ({usersInRole.length})
              </h3>
              {expandedRoles[role] ? (
                <ChevronUpIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              ) : (
                <ChevronDownIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              )}
            </div>
            {expandedRoles[role] && (
              <div id={`role-section-${role}`} className="mt-2">
                {usersInRole.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {usersInRole.map((userHackathon) => (
                      <div
                        key={userHackathon.id}
                        className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md flex items-center space-x-4 relative transition-colors hover:shadow-lg"
                      >
                        <Image
                          src={
                            userHackathon.user?.avatarUrl ||
                            "/avatars/default.jpg"
                          }
                          alt={`${userHackathon.user?.firstName} ${userHackathon.user?.lastName}`}
                          className="w-12 h-12 rounded-full"
                          width={48}
                          height={48}
                        />
                        <div className="flex-grow">
                          <p className="text-gray-800 dark:text-white font-medium">
                            {userHackathon.user?.firstName}{" "}
                            {userHackathon.user?.lastName}
                          </p>
                          <p className="text-gray-600 dark:text-gray-400 text-sm">
                            {userHackathon.user?.email}
                          </p>
                          <p className="text-gray-500 dark:text-gray-500 text-xs">
                            {userHackathon.user?.experienceLevel} -{" "}
                            {userHackathon.user?.skills?.join(", ")}
                          </p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteUserHackathon(userHackathon);
                          }}
                          disabled={deleteLoading === userHackathon.id}
                          className={`absolute top-2 right-2 text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors ${
                            deleteLoading === userHackathon.id
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                          title={t("removeUser")}
                          aria-label={t("removeUser")}
                        >
                          {deleteLoading === userHackathon.id ? (
                            <LoadingSpinner size="sm" />
                          ) : (
                            <TrashIcon className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 mt-2">
                    {t("noUsersFound", {
                      role: getRoleTranslation(role).toLowerCase(),
                    })}
                  </p>
                )}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
