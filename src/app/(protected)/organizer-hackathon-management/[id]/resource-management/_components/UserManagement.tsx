// src/app/(protected)/organizer-hackathon-management/[id]/resource-management/_components/UserManagement.tsx
import { useEffect, useState } from "react";
import { UserHackathon } from "@/types/entities/userHackathon";
import { User } from "@/types/entities/user";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  PlusIcon,
  TrashIcon,
  XIcon,
} from "lucide-react";
import Image from "next/image";
import { userService } from "@/services/user.service";
import { userHackathonService } from "@/services/userHackathon.service";
import { useApiModal } from "@/hooks/useApiModal";

export default function UserManagement({
  hackathonId,
}: {
  hackathonId: string;
}) {
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
  const { showSuccess, showError } = useApiModal();

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
        showError(
          "Data Loading Error",
          "Failed to load user data. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [hackathonId, showError]);

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
      // Call the actual service instead of simulation
      const response = await userHackathonService.createUserHackathon(
        requestBody
      );

      // If successful, update the users list
      if (response.data) {
        // Refresh users list to get the updated data with proper IDs
        const userHackathonsResponse =
          await userHackathonService.getUserHackathonsByHackathonId(
            hackathonId
          );
        setUsers(userHackathonsResponse.data);

        // Show success message
        showSuccess(
          "User Added",
          `${selectedUser.firstName} ${
            selectedUser.lastName
          } has been added as a ${selectedRole.toLowerCase()}.`
        );
      }

      // Reset form
      setSelectedUser(null);
      setSearchTerm("");
      setIsAddingUser(false);
    } catch (error) {
      console.error("Failed to create user hackathon:", error);
      showError(
        "Add User Failed",
        "Unable to add the selected user. Please try again later."
      );
    } finally {
      setSubmitLoading(false);
    }
  };

  const deleteUserHackathon = async (userHackathon: UserHackathon) => {
    try {
      // We don't have a delete method in the service, so we'd need to implement it
      // For now, let's assume we have an endpoint that accepts userId and hackathonId
      // and removes the association

      // This is a placeholder for the actual API call
      await userHackathonService.deleteUserHackathon(userHackathon.id);

      // Since we don't have the delete method yet, we'll simulate it by filtering locally
      // setUsers((prev) => prev.filter((u) => u.id !== userHackathon.id));

      showSuccess(
        "User Removed",
        `${userHackathon.user?.firstName} ${userHackathon.user?.lastName} has been removed from this hackathon.`
      );
    } catch (error) {
      console.error("Failed to delete user hackathon:", error);
      showError(
        "Remove User Failed",
        "Unable to remove the selected user. Please try again later."
      );
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">User Management</h2>
        <button
          onClick={() => setIsAddingUser(true)}
          className="bg-blue-500 text-white px-3 py-1 rounded-md flex items-center"
        >
          <PlusIcon className="w-4 h-4 mr-1" /> Add User
        </button>
      </div>

      {isAddingUser && (
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Add New User</h3>
            <button
              onClick={() => setIsAddingUser(false)}
              className="text-gray-500"
            >
              <XIcon className="w-5 h-5" />
            </button>
          </div>

          <div className="mb-4">
            <label
              htmlFor="search"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Search User by Email
            </label>
            <input
              type="text"
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Type to search..."
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          {searchTerm && (
            <div className="max-h-60 overflow-y-auto mb-4 border border-gray-200 rounded-md">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className={`p-2 flex items-center cursor-pointer hover:bg-gray-100 ${
                      selectedUser?.id === user.id
                        ? "bg-blue-50 border-l-4 border-blue-500"
                        : ""
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
                      <p className="font-medium">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="p-3 text-gray-500">No matching users found</p>
              )}
            </div>
          )}

          {selectedUser && (
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-1">
                Selected User:
              </p>
              <div className="flex items-center p-2 bg-blue-50 rounded-md">
                <Image
                  src={selectedUser.avatarUrl || "/avatars/default.jpg"}
                  alt={`${selectedUser.firstName} ${selectedUser.lastName}`}
                  className="w-8 h-8 rounded-full mr-2"
                  width={32}
                  height={32}
                />
                <div>
                  <p className="font-medium">
                    {selectedUser.firstName} {selectedUser.lastName}
                  </p>
                  <p className="text-sm text-gray-600">{selectedUser.email}</p>
                </div>
              </div>
            </div>
          )}

          <div className="mb-4">
            <label
              htmlFor="role"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Assign Role
            </label>
            <select
              id="role"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="ORGANIZER">Organizer</option>
              <option value="JUDGE">Judge</option>
              <option value="MENTOR">Mentor</option>
            </select>
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => setIsAddingUser(false)}
              className="mr-2 px-4 py-2 text-gray-700 bg-gray-200 rounded-md"
            >
              Cancel
            </button>
            <button
              onClick={createUserHackathon}
              disabled={!selectedUser || submitLoading}
              className={`px-4 py-2 text-white bg-blue-500 rounded-md ${
                !selectedUser || submitLoading
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              {submitLoading ? "Adding..." : "Add User"}
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-gray-500">Loading users...</p>
      ) : (
        Object.entries(groupedUsers).map(([role, usersInRole]) => (
          <div key={role} className="mb-6">
            <div
              className="flex justify-between items-center cursor-pointer p-2 bg-gray-200 rounded-md"
              onClick={() => toggleRoleVisibility(role)}
            >
              <h3 className="text-lg font-medium text-gray-800 capitalize">
                {role.toLowerCase()}s ({usersInRole.length})
              </h3>
              {expandedRoles[role] ? (
                <ChevronUpIcon className="w-5 h-5 text-gray-600" />
              ) : (
                <ChevronDownIcon className="w-5 h-5 text-gray-600" />
              )}
            </div>
            {expandedRoles[role] &&
              (usersInRole.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
                  {usersInRole.map((userHackathon) => (
                    <div
                      key={userHackathon.id}
                      className="bg-white p-4 rounded-lg shadow-md flex items-center space-x-4 relative"
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
                        <p className="text-gray-800 font-medium">
                          {userHackathon.user?.firstName}{" "}
                          {userHackathon.user?.lastName}
                        </p>
                        <p className="text-gray-600 text-sm">
                          {userHackathon.user?.email}
                        </p>
                        <p className="text-gray-500 text-xs">
                          {userHackathon.user?.experienceLevel} -{" "}
                          {userHackathon.user?.skills?.join(", ")}
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteUserHackathon(userHackathon);
                        }}
                        className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                        title="Remove user"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 mt-2">
                  No {role.toLowerCase()}s found.
                </p>
              ))}
          </div>
        ))
      )}
    </div>
  );
}
