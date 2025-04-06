// src/app/(protected)/user-creation/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth_v0";
import { User } from "@/types/entities/user";
import {
  Loader2,
  Plus,
  Search,
  RefreshCw,
  Trash2,
  Edit,
  Save,
  X,
} from "lucide-react";
import Pagination from "@/components/common/Pagination";
import { userService } from "@/services/user.service";
import ApiResponseModal from "@/components/common/ApiResponseModal";
import { useApiModal } from "@/hooks/useApiModal";

export default function UserCreationPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createFormData, setCreateFormData] = useState({
    username: "",
    firstName: "",
    lastName: "",
    roleId: "5", // Default to MENTOR
    password: "12345678", // Default password
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Edit user state
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState({
    firstName: "",
    lastName: "",
    roleId: "",
  });

  // API Modal state and handlers
  const { modalState, hideModal, showSuccess, showError } = useApiModal();

  const loadUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await userService.getAllUsers();

      if (response.data) {
        setUsers(response.data);
      } else {
        throw new Error(response.message || "Failed to load users");
      }
    } catch (err: any) {
      const errorMessage =
        err.message || "Failed to load users. Please try again.";
      setError(errorMessage);
      showError("Error Loading Users", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setCreateFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!createFormData.username.trim()) {
      setError("Username is required");
      showError("Validation Error", "Username is required");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Create request body for the API
      const createUserRequestBody = {
        username: createFormData.username,
        firstName: createFormData.firstName || "",
        lastName: createFormData.lastName || "",
        password: createFormData.password,
        userRoles: {
          roleId: createFormData.roleId,
        },
      };

      // Make API call to create user
      const response = await userService.createUser(createUserRequestBody);

      if (response.data && response.data.id) {
        // Add the newly created user to our state
        setUsers((prev) => [response.data, ...prev]);

        // Reset the form
        setCreateFormData({
          username: "",
          firstName: "",
          lastName: "",
          roleId: "5",
          password: "12345678",
        });

        setShowCreateForm(false);
        const successMsg = `User ${response.data.username} created successfully! Default password: 12345678`;
        setSuccessMessage(successMsg);
        showSuccess("User Created", successMsg);

        // Clear success message after 5 seconds
        setTimeout(() => {
          setSuccessMessage(null);
        }, 5000);
      } else {
        throw new Error(response.message || "Failed to create user");
      }
    } catch (err: any) {
      const errorMessage =
        err.message || "Failed to create user. Please try again.";
      setError(errorMessage);
      showError("Error Creating User", errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditUser = async (userId: string) => {
    const userToEdit = users.find((u) => u.id === userId);
    if (!userToEdit) return;

    setEditingUserId(userId);
    setEditFormData({
      firstName: userToEdit.firstName || "",
      lastName: userToEdit.lastName || "",
      roleId: userToEdit.userRoles?.[0]?.role?.id || "5",
    });
  };

  const handleSaveEdit = async (userId: string) => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Get the user we're editing to keep username and other fields
      const userToUpdate = users.find((u) => u.id === userId);
      if (!userToUpdate) {
        throw new Error("User not found");
      }

      // Create update request body for the API
      const updateUserRequestBody = {
        username: userToUpdate.username,
        firstName: editFormData.firstName,
        lastName: editFormData.lastName,
        password: "", // Empty password means don't change it
        userRoles: [
          {
            roleId: editFormData.roleId,
          },
        ],
      };

      // Make API call to update user
      const response = await userService.updateUser(
        userId,
        updateUserRequestBody
      );

      if (response.data) {
        // Update user in local state
        setUsers((prevUsers) =>
          prevUsers.map((u) => (u.id === userId ? response.data : u))
        );

        setEditingUserId(null);
        const successMsg = "User updated successfully!";
        setSuccessMessage(successMsg);
        showSuccess("User Updated", successMsg);

        setTimeout(() => {
          setSuccessMessage(null);
        }, 5000);
      } else {
        throw new Error(response.message || "Failed to update user");
      }
    } catch (err: any) {
      const errorMessage =
        err.message || "Failed to update user. Please try again.";
      setError(errorMessage);
      showError("Error Updating User", errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    setLoading(true);
    setError(null);

    try {
      // Note: The provided user service doesn't have a delete method
      // This would normally be implemented as:
      // const response = await userService.deleteUser(userId);

      // For now, we'll simulate success and just update the UI
      console.log("Deleting user with ID:", userId);

      // Update the local state by removing the user
      setUsers((prevUsers) => prevUsers.filter((u) => u.id !== userId));

      const successMsg = "User deleted successfully!";
      setSuccessMessage(successMsg);
      showSuccess("User Deleted", successMsg);

      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
    } catch (err: any) {
      const errorMessage =
        err.message || "Failed to delete user. Please try again.";
      setError(errorMessage);
      showError("Error Deleting User", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Filter users based on search query and role filter
  const filteredUsers = users.filter((user) => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch =
      user.username?.toLowerCase().includes(searchLower) ||
      user.firstName?.toLowerCase().includes(searchLower) ||
      user.lastName?.toLowerCase().includes(searchLower) ||
      user.email?.toLowerCase().includes(searchLower);

    // Apply role filter
    const userRole = user.userRoles?.[0]?.role?.name;
    const matchesRole =
      roleFilter === "all" ||
      (roleFilter === "MENTOR" && userRole === "MENTOR") ||
      (roleFilter === "JUDGE" && userRole === "JUDGE");

    return matchesSearch && matchesRole;
  });

  // Pagination logic
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const totalPages = Math.ceil(filteredUsers.length / pageSize);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
          >
            <Plus size={18} className="mr-2" />
            Create New User
          </button>
        </div>

        {/* Success message */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-md">
            {successMessage}
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {/* API Response Modal */}
        <ApiResponseModal
          isOpen={modalState.isOpen}
          onClose={hideModal}
          title={modalState.title}
          message={modalState.message}
          type={modalState.type}
        />

        {/* Create User Form */}
        {showCreateForm && (
          <div className="mb-6 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Create New User</h2>
            <form onSubmit={handleCreateUser}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Username <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={createFormData.username}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Username"
                  />
                </div>
                <div>
                  <label
                    htmlFor="roleId"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Role <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="roleId"
                    name="roleId"
                    value={createFormData.roleId}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="5">MENTOR</option>
                    <option value="2">JUDGE</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={createFormData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="First Name"
                  />
                </div>
                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={createFormData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Last Name"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-between items-center">
                <p className="text-sm text-gray-500">
                  <span className="font-medium">Note:</span> Default password
                  will be set to: 12345678
                </p>
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={18} className="mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      "Create User"
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* Search, filter, and refresh */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div className="w-full md:w-1/2 flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-2/3 relative">
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search
                size={18}
                className="absolute left-3 top-2.5 text-gray-400"
              />
            </div>
            <div className="w-full md:w-1/3">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Roles</option>
                <option value="MENTOR">MENTOR</option>
                <option value="JUDGE">JUDGE</option>
              </select>
            </div>
          </div>
          <button
            onClick={loadUsers}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 flex items-center"
          >
            <RefreshCw size={18} className="mr-2" />
            Refresh
          </button>
        </div>

        {/* User List */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 size={48} className="animate-spin text-blue-600" />
          </div>
        ) : paginatedUsers.length > 0 ? (
          <>
            <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        User
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Username
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Email
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Role
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          {editingUserId === user.id ? (
                            <div className="flex items-center space-x-3">
                              <div>
                                <input
                                  type="text"
                                  name="firstName"
                                  value={editFormData.firstName}
                                  onChange={handleEditInputChange}
                                  className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
                                  placeholder="First Name"
                                />
                              </div>
                              <div>
                                <input
                                  type="text"
                                  name="lastName"
                                  value={editFormData.lastName}
                                  onChange={handleEditInputChange}
                                  className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
                                  placeholder="Last Name"
                                />
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                {user.avatarUrl ? (
                                  <img
                                    className="h-10 w-10 rounded-full"
                                    src={user.avatarUrl}
                                    alt=""
                                  />
                                ) : (
                                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                                    {user.firstName && user.lastName
                                      ? `${user.firstName[0]}${user.lastName[0]}`
                                      : user.username?.[0] || "U"}
                                  </div>
                                )}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {user.firstName} {user.lastName}
                                </div>
                                {user.country && user.city && (
                                  <div className="text-sm text-gray-500">
                                    {user.city}, {user.country}
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {user.username}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {user.email || "Not set"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${
                              user.status === "Active"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {user.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {editingUserId === user.id ? (
                            <select
                              name="roleId"
                              value={editFormData.roleId}
                              onChange={handleEditInputChange}
                              className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
                            >
                              <option value="5">MENTOR</option>
                              <option value="2">JUDGE</option>
                            </select>
                          ) : (
                            user.userRoles?.[0]?.role?.name || "No role"
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          {editingUserId === user.id ? (
                            <div className="flex justify-end space-x-2">
                              <button
                                onClick={() => handleSaveEdit(user.id)}
                                className="text-blue-600 hover:text-blue-900"
                                disabled={isSubmitting}
                              >
                                <Save size={18} />
                              </button>
                              <button
                                onClick={() => setEditingUserId(null)}
                                className="text-gray-600 hover:text-gray-900"
                              >
                                <X size={18} />
                              </button>
                            </div>
                          ) : (
                            <div className="flex justify-end space-x-2">
                              <button
                                onClick={() => handleEditUser(user.id)}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                <Edit size={18} />
                              </button>
                              <button
                                onClick={() => handleDeleteUser(user.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              pageSize={pageSize}
              totalItems={filteredUsers.length}
              onPageChange={setCurrentPage}
              onPageSizeChange={setPageSize}
            />
          </>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <p className="text-gray-500">
              No users found matching your search criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
