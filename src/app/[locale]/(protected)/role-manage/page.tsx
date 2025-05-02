// src/app/[locale]/(protected)/role-manage/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth_v0";
import { Role } from "@/types/entities/role";
import { Permission } from "@/types/entities/permission";
import {
  Loader2,
  Plus,
  Search,
  RefreshCw,
  Trash2,
  Edit,
  Save,
  X,
  Check,
  ChevronDown,
  ChevronUp,
  Info,
} from "lucide-react";
import Pagination from "@/components/common/Pagination";
import { roleService } from "@/services/role.service";
import { permissionService } from "@/services/permission.service";
import ApiResponseModal from "@/components/common/ApiResponseModal";
import { useApiModal } from "@/hooks/useApiModal";

export default function RoleManagementPage() {
  const { user } = useAuth();
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createFormData, setCreateFormData] = useState({
    name: "",
    description: "",
    permissions: [] as string[],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedRoleId, setExpandedRoleId] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Edit role state
  const [editingRoleId, setEditingRoleId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState({
    description: "",
    permissions: [] as string[],
  });

  // Permission grouping
  const [permissionsByModule, setPermissionsByModule] = useState<
    Record<string, Permission[]>
  >({});

  // API Modal state and handlers
  const { modalState, hideModal, showSuccess, showError } = useApiModal();

  const loadRoles = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await roleService.getAllRoles();

      if (response.data) {
        setRoles(response.data);
      } else {
        throw new Error(response.message || "Failed to load roles");
      }
    } catch (err: any) {
      const errorMessage =
        err.message || "Failed to load roles. Please try again.";
      setError(errorMessage);
      showError("Error Loading Roles", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const loadPermissions = async () => {
    try {
      const response = await permissionService.getAllPermissions();

      if (response.data) {
        setPermissions(response.data);

        // Group permissions by module
        const grouped = response.data.reduce(
          (acc: Record<string, Permission[]>, permission) => {
            const module = permission.module || "OTHER";
            if (!acc[module]) {
              acc[module] = [];
            }
            acc[module].push(permission);
            return acc;
          },
          {}
        );

        setPermissionsByModule(grouped);
      } else {
        console.error("Failed to load permissions");
        showError(
          "Error Loading Permissions",
          "Failed to load permissions. Please try again."
        );
      }
    } catch (err: any) {
      console.error("Error loading permissions:", err);
      showError(
        "Error Loading Permissions",
        "Failed to load permissions. Please try again."
      );
    }
  };

  useEffect(() => {
    loadRoles();
    loadPermissions();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCreateFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePermissionToggle = (
    permissionId: string,
    isCreate: boolean = true
  ) => {
    if (isCreate) {
      setCreateFormData((prev) => {
        const newPermissions = prev.permissions.includes(permissionId)
          ? prev.permissions.filter((id) => id !== permissionId)
          : [...prev.permissions, permissionId];

        return {
          ...prev,
          permissions: newPermissions,
        };
      });
    } else {
      setEditFormData((prev) => {
        const newPermissions = prev.permissions.includes(permissionId)
          ? prev.permissions.filter((id) => id !== permissionId)
          : [...prev.permissions, permissionId];

        return {
          ...prev,
          permissions: newPermissions,
        };
      });
    }
  };

  const handleToggleAllModulePermissions = (
    module: string,
    isCheck: boolean,
    isCreate: boolean = true
  ) => {
    const modulePermissionIds =
      permissionsByModule[module]?.map((p) => p.id) || [];

    if (isCreate) {
      setCreateFormData((prev) => {
        let newPermissions = [...prev.permissions];

        if (isCheck) {
          // Add all module permissions that aren't already included
          modulePermissionIds.forEach((id) => {
            if (!newPermissions.includes(id)) {
              newPermissions.push(id);
            }
          });
        } else {
          // Remove all module permissions
          newPermissions = newPermissions.filter(
            (id) => !modulePermissionIds.includes(id)
          );
        }

        return {
          ...prev,
          permissions: newPermissions,
        };
      });
    } else {
      setEditFormData((prev) => {
        let newPermissions = [...prev.permissions];

        if (isCheck) {
          // Add all module permissions that aren't already included
          modulePermissionIds.forEach((id) => {
            if (!newPermissions.includes(id)) {
              newPermissions.push(id);
            }
          });
        } else {
          // Remove all module permissions
          newPermissions = newPermissions.filter(
            (id) => !modulePermissionIds.includes(id)
          );
        }

        return {
          ...prev,
          permissions: newPermissions,
        };
      });
    }
  };

  const isModuleFullySelected = (module: string, isCreate: boolean = true) => {
    const modulePermissionIds =
      permissionsByModule[module]?.map((p) => p.id) || [];
    if (modulePermissionIds.length === 0) return false;

    const selectedPermissions = isCreate
      ? createFormData.permissions
      : editFormData.permissions;
    return modulePermissionIds.every((id) => selectedPermissions.includes(id));
  };

  const isModulePartiallySelected = (
    module: string,
    isCreate: boolean = true
  ) => {
    const modulePermissionIds =
      permissionsByModule[module]?.map((p) => p.id) || [];
    if (modulePermissionIds.length === 0) return false;

    const selectedPermissions = isCreate
      ? createFormData.permissions
      : editFormData.permissions;
    const hasSelected = modulePermissionIds.some((id) =>
      selectedPermissions.includes(id)
    );
    return hasSelected && !isModuleFullySelected(module, isCreate);
  };

  const handleCreateRole = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!createFormData.name.trim()) {
      setError("Role name is required");
      showError("Validation Error", "Role name is required");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Create request body for the API
      const createRoleRequestBody = {
        name: createFormData.name.toUpperCase().replace(/\s+/g, "_"),
        description:
          createFormData.description || `${createFormData.name} role`,
        permissions: createFormData.permissions,
      };

      // Make API call to create role
      const response = await roleService.createRole(createRoleRequestBody);

      if (response.data && response.data.id) {
        // Add the newly created role to our state
        setRoles((prev) => [response.data, ...prev]);

        // Reset the form
        setCreateFormData({
          name: "",
          description: "",
          permissions: [],
        });

        setShowCreateForm(false);
        const successMsg = `Role ${response.data.name} created successfully!`;
        setSuccessMessage(successMsg);
        showSuccess("Role Created", successMsg);

        // Clear success message after 5 seconds
        setTimeout(() => {
          setSuccessMessage(null);
        }, 5000);
      } else {
        throw new Error(response.message || "Failed to create role");
      }
    } catch (err: any) {
      const errorMessage =
        err.message || "Failed to create role. Please try again.";
      setError(errorMessage);
      showError("Error Creating Role", errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditRole = (roleId: string) => {
    const roleToEdit = roles.find((r) => r.id === roleId);
    if (!roleToEdit) return;

    setEditingRoleId(roleId);
    setEditFormData({
      description: roleToEdit.description || "",
      permissions: roleToEdit.permissions?.map((p) => p.id) || [],
    });
  };

  const handleSaveEdit = async (roleId: string) => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Create update request body for the API
      const updateRoleRequestBody = {
        id: roleId,
        description: editFormData.description,
        permissions: editFormData.permissions,
      };

      // Make API call to update role
      const response = await roleService.updateRole(updateRoleRequestBody);

      if (response.data) {
        // Update role in local state
        setRoles((prevRoles) =>
          prevRoles.map((r) => (r.id === roleId ? response.data : r))
        );

        setEditingRoleId(null);
        const successMsg = "Role updated successfully!";
        setSuccessMessage(successMsg);
        showSuccess("Role Updated", successMsg);

        setTimeout(() => {
          setSuccessMessage(null);
        }, 5000);
      } else {
        throw new Error(response.message || "Failed to update role");
      }
    } catch (err: any) {
      const errorMessage =
        err.message || "Failed to update role. Please try again.";
      setError(errorMessage);
      showError("Error Updating Role", errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteRole = async (roleId: string) => {
    if (!confirm("Are you sure you want to delete this role?")) return;

    setLoading(true);
    setError(null);

    try {
      const response = await roleService.deleteRole(roleId);

      // Update the local state by removing the role
      setRoles((prevRoles) => prevRoles.filter((r) => r.id !== roleId));

      const successMsg = "Role deleted successfully!";
      setSuccessMessage(successMsg);
      showSuccess("Role Deleted", successMsg);

      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
    } catch (err: any) {
      const errorMessage =
        err.message || "Failed to delete role. Please try again.";
      setError(errorMessage);
      showError("Error Deleting Role", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const toggleRoleDetails = (roleId: string) => {
    setExpandedRoleId(expandedRoleId === roleId ? null : roleId);
  };

  // Filter roles based on search query
  const filteredRoles = roles.filter((role) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      role.name?.toLowerCase().includes(searchLower) ||
      role.description?.toLowerCase().includes(searchLower)
    );
  });

  // Pagination logic
  const paginatedRoles = filteredRoles.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const totalPages = Math.ceil(filteredRoles.length / pageSize);

  // Get permission name by id
  const getPermissionNameById = (id: string) => {
    const permission = permissions.find((p) => p.id === id);
    return permission?.name || id;
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Role Management</h1>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
          >
            <Plus size={18} className="mr-2" />
            Create New Role
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
        {/* Create Role Form */}
        {showCreateForm && (
          <div className="mb-6 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Create New Role</h2>
            <form onSubmit={handleCreateRole}>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Role Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={createFormData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Role Name"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Role name will be converted to uppercase with underscores
                    (e.g., "Team Leader" → "TEAM_LEADER").
                  </p>
                </div>
                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={createFormData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Role Description"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Permissions
                  </label>
                  <div className="border border-gray-300 rounded-md p-4 max-h-96 overflow-y-auto">
                    {Object.keys(permissionsByModule).length === 0 ? (
                      <div className="flex justify-center items-center py-4">
                        <Loader2
                          size={24}
                          className="animate-spin text-blue-600"
                        />
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {Object.entries(permissionsByModule).map(
                          ([module, modulePermissions]) => (
                            <div
                              key={module}
                              className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0"
                            >
                              <div className="flex items-center mb-2">
                                <div className="flex-1">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleToggleAllModulePermissions(
                                        module,
                                        !isModuleFullySelected(module, true),
                                        true
                                      )
                                    }
                                    className="flex items-center text-sm font-medium text-gray-800 hover:text-blue-600"
                                  >
                                    {isModuleFullySelected(module, true) ? (
                                      <Check
                                        size={18}
                                        className="mr-2 text-blue-600"
                                      />
                                    ) : isModulePartiallySelected(
                                        module,
                                        true
                                      ) ? (
                                      <div className="w-4 h-4 mr-2 border-2 border-blue-600 flex items-center justify-center">
                                        <div className="w-2 h-2 bg-blue-600"></div>
                                      </div>
                                    ) : (
                                      <div className="w-4 h-4 mr-2 border-2 border-gray-400"></div>
                                    )}
                                    <span className="font-bold">{module}</span>
                                  </button>
                                </div>
                              </div>
                              <div className="ml-6 grid grid-cols-1 md:grid-cols-2 gap-2">
                                {modulePermissions.map((permission) => (
                                  <div
                                    key={permission.id}
                                    className="flex items-center"
                                  >
                                    <input
                                      type="checkbox"
                                      id={`create-${permission.id}`}
                                      checked={createFormData.permissions.includes(
                                        permission.id
                                      )}
                                      onChange={() =>
                                        handlePermissionToggle(
                                          permission.id,
                                          true
                                        )
                                      }
                                      className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <label
                                      htmlFor={`create-${permission.id}`}
                                      className="text-sm text-gray-700 flex items-center"
                                    >
                                      <span className="mr-2">
                                        {permission.name}
                                      </span>
                                      <div className="group relative">
                                        <Info
                                          size={14}
                                          className="text-gray-400 cursor-pointer"
                                        />
                                        <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs p-2 rounded w-60 z-10">
                                          <p>
                                            <strong>Path:</strong>{" "}
                                            {permission.apiPath}
                                          </p>
                                          <p>
                                            <strong>Method:</strong>{" "}
                                            {permission.method}
                                          </p>
                                        </div>
                                      </div>
                                    </label>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end items-center space-x-3">
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
                    "Create Role"
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
        {/* Search and refresh */}
        <div className="flex justify-between items-center mb-6">
          <div className="w-full md:w-1/2 relative">
            <input
              type="text"
              placeholder="Search roles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search
              size={18}
              className="absolute left-3 top-2.5 text-gray-400"
            />
          </div>
          <button
            onClick={loadRoles}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 flex items-center"
          >
            <RefreshCw size={18} className="mr-2" />
            Refresh
          </button>
        </div>
        {/* Role List */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 size={48} className="animate-spin text-blue-600" />
          </div>
        ) : paginatedRoles.length > 0 ? (
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
                        Role Name
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Description
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Permissions
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Created At
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
                    {paginatedRoles.map((role) => (
                      <React.Fragment key={role.id}>
                        <tr className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            {editingRoleId === role.id ? (
                              <div>
                                <span className="text-sm font-medium text-gray-900">
                                  {role.name}
                                </span>
                                <p className="text-xs text-gray-500">
                                  Role name cannot be changed
                                </p>
                              </div>
                            ) : (
                              <div className="text-sm font-medium text-gray-900">
                                {role.name}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            {editingRoleId === role.id ? (
                              <textarea
                                name="description"
                                value={editFormData.description}
                                onChange={handleEditInputChange}
                                rows={2}
                                className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
                                placeholder="Role Description"
                              />
                            ) : (
                              <div className="text-sm text-gray-900">
                                {role.description || "No description"}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">
                              <span className="inline-flex items-center">
                                {role.permissions?.length || 0} permissions
                                <button
                                  onClick={() => toggleRoleDetails(role.id)}
                                  className="ml-2 text-blue-600 hover:text-blue-800"
                                >
                                  {expandedRoleId === role.id ? (
                                    <ChevronUp size={16} />
                                  ) : (
                                    <ChevronDown size={16} />
                                  )}
                                </button>
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {new Date(role.createdAt).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            {editingRoleId === role.id ? (
                              <div className="flex justify-end space-x-2">
                                <button
                                  onClick={() => handleSaveEdit(role.id)}
                                  className="text-blue-600 hover:text-blue-900"
                                  disabled={isSubmitting}
                                >
                                  <Save size={18} />
                                </button>
                                <button
                                  onClick={() => setEditingRoleId(null)}
                                  className="text-gray-600 hover:text-gray-900"
                                >
                                  <X size={18} />
                                </button>
                              </div>
                            ) : (
                              <div className="flex justify-end space-x-2">
                                <button
                                  onClick={() => handleEditRole(role.id)}
                                  className="text-blue-600 hover:text-blue-900"
                                >
                                  <Edit size={18} />
                                </button>
                                <button
                                  onClick={() => handleDeleteRole(role.id)}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  <Trash2 size={18} />
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                        {expandedRoleId === role.id && (
                          <tr>
                            <td colSpan={5} className="px-6 py-4 bg-gray-50">
                              {editingRoleId === role.id ? (
                                <div className="border border-gray-300 rounded-md p-4 max-h-96 overflow-y-auto">
                                  {Object.keys(permissionsByModule).length ===
                                  0 ? (
                                    <div className="flex justify-center items-center py-4">
                                      <Loader2
                                        size={24}
                                        className="animate-spin text-blue-600"
                                      />
                                    </div>
                                  ) : (
                                    <div className="space-y-4">
                                      {Object.entries(permissionsByModule).map(
                                        ([module, modulePermissions]) => (
                                          <div
                                            key={module}
                                            className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0"
                                          >
                                            <div className="flex items-center mb-2">
                                              <div className="flex-1">
                                                <button
                                                  type="button"
                                                  onClick={() =>
                                                    handleToggleAllModulePermissions(
                                                      module,
                                                      !isModuleFullySelected(
                                                        module,
                                                        false
                                                      ),
                                                      false
                                                    )
                                                  }
                                                  className="flex items-center text-sm font-medium text-gray-800 hover:text-blue-600"
                                                >
                                                  {isModuleFullySelected(
                                                    module,
                                                    false
                                                  ) ? (
                                                    <Check
                                                      size={18}
                                                      className="mr-2 text-blue-600"
                                                    />
                                                  ) : isModulePartiallySelected(
                                                      module,
                                                      false
                                                    ) ? (
                                                    <div className="w-4 h-4 mr-2 border-2 border-blue-600 flex items-center justify-center">
                                                      <div className="w-2 h-2 bg-blue-600"></div>
                                                    </div>
                                                  ) : (
                                                    <div className="w-4 h-4 mr-2 border-2 border-gray-400"></div>
                                                  )}
                                                  <span className="font-bold">
                                                    {module}
                                                  </span>
                                                </button>
                                              </div>
                                            </div>
                                            <div className="ml-6 grid grid-cols-1 md:grid-cols-2 gap-2">
                                              {modulePermissions.map(
                                                (permission) => (
                                                  <div
                                                    key={permission.id}
                                                    className="flex items-center"
                                                  >
                                                    <input
                                                      type="checkbox"
                                                      id={`edit-${permission.id}`}
                                                      checked={editFormData.permissions.includes(
                                                        permission.id
                                                      )}
                                                      onChange={() =>
                                                        handlePermissionToggle(
                                                          permission.id,
                                                          false
                                                        )
                                                      }
                                                      className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                    />
                                                    <label
                                                      htmlFor={`edit-${permission.id}`}
                                                      className="text-sm text-gray-700 flex items-center"
                                                    >
                                                      <span className="mr-2">
                                                        {permission.name}
                                                      </span>
                                                      <div className="group relative">
                                                        <Info
                                                          size={14}
                                                          className="text-gray-400 cursor-pointer"
                                                        />
                                                        <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs p-2 rounded w-60 z-10">
                                                          <p>
                                                            <strong>
                                                              Path:
                                                            </strong>{" "}
                                                            {permission.apiPath}
                                                          </p>
                                                          <p>
                                                            <strong>
                                                              Method:
                                                            </strong>{" "}
                                                            {permission.method}
                                                          </p>
                                                        </div>
                                                      </div>
                                                    </label>
                                                  </div>
                                                )
                                              )}
                                            </div>
                                          </div>
                                        )
                                      )}
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <div className="space-y-2">
                                  <h4 className="font-medium text-gray-900">
                                    Permissions:
                                  </h4>
                                  {role.permissions &&
                                  role.permissions.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                      {role.permissions.map((permission) => (
                                        <div
                                          key={permission.id}
                                          className="text-sm bg-gray-100 rounded p-2"
                                        >
                                          <div className="font-medium">
                                            {permission.name}
                                          </div>
                                          <div className="text-xs text-gray-500">
                                            {permission.method}{" "}
                                            {permission.apiPath}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <p className="text-sm text-gray-500">
                                      No permissions assigned to this role.
                                    </p>
                                  )}
                                </div>
                              )}
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}{" "}
                  </tbody>
                </table>
              </div>
            </div>
            {/* Pagination */}
            {filteredRoles.length > 0 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                pageSize={pageSize}
                totalItems={filteredRoles.length}
                onPageChange={setCurrentPage}
                onPageSizeChange={setPageSize}
              />
            )}
          </>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <p className="text-gray-500">No roles found.</p>
          </div>
        )}{" "}
      </div>{" "}
    </div>
  );
}
