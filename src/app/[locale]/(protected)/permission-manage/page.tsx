// src/app/[locale]/(protected)/permission-manage/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth_v0";
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
} from "lucide-react";
import Pagination from "@/components/common/Pagination";
import { permissionService } from "@/services/permission.service";
import ApiResponseModal from "@/components/common/ApiResponseModal";
import { useApiModal } from "@/hooks/useApiModal";

export default function PermissionManagePage() {
  const { user } = useAuth();
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createFormData, setCreateFormData] = useState({
    name: "",
    apiPath: "",
    method: "GET",
    module: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [moduleFilter, setModuleFilter] = useState<string>("all");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Edit permission state
  const [editingPermissionId, setEditingPermissionId] = useState<string | null>(
    null
  );
  const [editFormData, setEditFormData] = useState({
    name: "",
    apiPath: "",
    method: "GET",
    module: "",
  });

  // HTTP Methods for dropdown
  const httpMethods = ["GET", "POST", "PUT", "DELETE", "PATCH"];

  // API Modal state and handlers
  const { modalState, hideModal, showSuccess, showError } = useApiModal();

  const loadPermissions = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await permissionService.getAllPermissions();

      if (response.data) {
        setPermissions(response.data);
      } else {
        throw new Error(response.message || "Failed to load permissions");
      }
    } catch (err: any) {
      const errorMessage =
        err.message || "Failed to load permissions. Please try again.";
      setError(errorMessage);
      showError("Error Loading Permissions", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPermissions();
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

  const handleCreatePermission = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!createFormData.name.trim()) {
      setError("Permission name is required");
      showError("Validation Error", "Permission name is required");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Create request body for the API
      const createPermissionRequestBody = {
        name: createFormData.name,
        apiPath: createFormData.apiPath || "",
        method: createFormData.method || "GET",
        module: createFormData.module || "",
      };

      // Make API call to create permission
      const response = await permissionService.createPermission(
        createPermissionRequestBody
      );

      if (response.data && response.data.id) {
        // Add the newly created permission to our state
        setPermissions((prev) => [response.data, ...prev]);

        // Reset the form
        setCreateFormData({
          name: "",
          apiPath: "",
          method: "GET",
          module: "",
        });

        setShowCreateForm(false);
        const successMsg = `Permission ${response.data.name} created successfully!`;
        setSuccessMessage(successMsg);
        showSuccess("Permission Created", successMsg);

        // Clear success message after 5 seconds
        setTimeout(() => {
          setSuccessMessage(null);
        }, 5000);
      } else {
        throw new Error(response.message || "Failed to create permission");
      }
    } catch (err: any) {
      const errorMessage =
        err.message || "Failed to create permission. Please try again.";
      setError(errorMessage);
      showError("Error Creating Permission", errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditPermission = async (permissionId: string) => {
    const permissionToEdit = permissions.find((p) => p.id === permissionId);
    if (!permissionToEdit) return;

    setEditingPermissionId(permissionId);
    setEditFormData({
      name: permissionToEdit.name || "",
      apiPath: permissionToEdit.apiPath || "",
      method: permissionToEdit.method || "GET",
      module: permissionToEdit.module || "",
    });
  };

  const handleSaveEdit = async (permissionId: string) => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Create update request body for the API
      const updatePermissionRequestBody = {
        id: permissionId,
        name: editFormData.name,
        apiPath: editFormData.apiPath,
        method: editFormData.method,
        module: editFormData.module,
      };

      // Make API call to update permission
      const response = await permissionService.updatePermission(
        updatePermissionRequestBody
      );

      if (response.data) {
        // Update permission in local state
        setPermissions((prevPermissions) =>
          prevPermissions.map((p) =>
            p.id === permissionId ? response.data : p
          )
        );

        setEditingPermissionId(null);
        const successMsg = "Permission updated successfully!";
        setSuccessMessage(successMsg);
        showSuccess("Permission Updated", successMsg);

        setTimeout(() => {
          setSuccessMessage(null);
        }, 5000);
      } else {
        throw new Error(response.message || "Failed to update permission");
      }
    } catch (err: any) {
      const errorMessage =
        err.message || "Failed to update permission. Please try again.";
      setError(errorMessage);
      showError("Error Updating Permission", errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePermission = async (permissionId: string) => {
    if (!confirm("Are you sure you want to delete this permission?")) return;

    setLoading(true);
    setError(null);

    try {
      const response = await permissionService.deletePermission(permissionId);

      // Update the local state by removing the permission
      setPermissions((prevPermissions) =>
        prevPermissions.filter((p) => p.id !== permissionId)
      );

      const successMsg = "Permission deleted successfully!";
      setSuccessMessage(successMsg);
      showSuccess("Permission Deleted", successMsg);

      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
    } catch (err: any) {
      const errorMessage =
        err.message || "Failed to delete permission. Please try again.";
      setError(errorMessage);
      showError("Error Deleting Permission", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Get unique modules for filters
  const getModuleOptions = () => {
    const modules = new Set<string>();
    permissions.forEach((permission) => {
      if (permission.module) {
        modules.add(permission.module);
      }
    });

    const moduleOptions = [{ id: "all", name: "All Modules" }];
    modules.forEach((module) => {
      moduleOptions.push({ id: module, name: module });
    });

    return moduleOptions;
  };

  // Filter permissions based on search query and module filter
  const filteredPermissions = permissions.filter((permission) => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch =
      permission.name?.toLowerCase().includes(searchLower) ||
      permission.apiPath?.toLowerCase().includes(searchLower) ||
      permission.method?.toLowerCase().includes(searchLower) ||
      permission.module?.toLowerCase().includes(searchLower);

    // Apply module filter
    const matchesModule =
      moduleFilter === "all" ||
      (permission.module && moduleFilter === permission.module);

    return matchesSearch && matchesModule;
  });

  // Pagination logic
  const paginatedPermissions = filteredPermissions.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const totalPages = Math.ceil(filteredPermissions.length / pageSize);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Permission Management
          </h1>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
          >
            <Plus size={18} className="mr-2" />
            Create New Permission
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

        {/* Create Permission Form */}
        {showCreateForm && (
          <div className="mb-6 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">
              Create New Permission
            </h2>
            <form onSubmit={handleCreatePermission}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={createFormData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Permission Name"
                  />
                </div>
                <div>
                  <label
                    htmlFor="module"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Module
                  </label>
                  <input
                    type="text"
                    id="module"
                    name="module"
                    value={createFormData.module}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Module Name"
                  />
                </div>
                <div>
                  <label
                    htmlFor="apiPath"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    API Path
                  </label>
                  <input
                    type="text"
                    id="apiPath"
                    name="apiPath"
                    value={createFormData.apiPath}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="/api/v1/resource"
                  />
                </div>
                <div>
                  <label
                    htmlFor="method"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    HTTP Method
                  </label>
                  <select
                    id="method"
                    name="method"
                    value={createFormData.method}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {httpMethods.map((method) => (
                      <option key={method} value={method}>
                        {method}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
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
                    "Create Permission"
                  )}
                </button>
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
                placeholder="Search permissions..."
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
                value={moduleFilter}
                onChange={(e) => setModuleFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {getModuleOptions().map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button
            onClick={loadPermissions}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 flex items-center"
          >
            <RefreshCw size={18} className="mr-2" />
            Refresh
          </button>
        </div>

        {/* Permission List */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 size={48} className="animate-spin text-blue-600" />
          </div>
        ) : paginatedPermissions.length > 0 ? (
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
                        Name
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Module
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        API Path
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Method
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Created By
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
                    {paginatedPermissions.map((permission) => (
                      <tr key={permission.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          {editingPermissionId === permission.id ? (
                            <input
                              type="text"
                              name="name"
                              value={editFormData.name}
                              onChange={handleEditInputChange}
                              className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
                              placeholder="Permission Name"
                            />
                          ) : (
                            <div className="text-sm font-medium text-gray-900">
                              {permission.name}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {editingPermissionId === permission.id ? (
                            <input
                              type="text"
                              name="module"
                              value={editFormData.module}
                              onChange={handleEditInputChange}
                              className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
                              placeholder="Module"
                            />
                          ) : (
                            <div className="text-sm text-gray-900">
                              {permission.module || "-"}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {editingPermissionId === permission.id ? (
                            <input
                              type="text"
                              name="apiPath"
                              value={editFormData.apiPath}
                              onChange={handleEditInputChange}
                              className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
                              placeholder="API Path"
                            />
                          ) : (
                            <div className="text-sm text-gray-900">
                              {permission.apiPath || "-"}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {editingPermissionId === permission.id ? (
                            <select
                              name="method"
                              value={editFormData.method}
                              onChange={handleEditInputChange}
                              className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
                            >
                              {httpMethods.map((method) => (
                                <option key={method} value={method}>
                                  {method}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                              ${
                                permission.method === "GET"
                                  ? "bg-blue-100 text-blue-800"
                                  : permission.method === "POST"
                                    ? "bg-green-100 text-green-800"
                                    : permission.method === "PUT"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : permission.method === "DELETE"
                                        ? "bg-red-100 text-red-800"
                                        : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {permission.method || "-"}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {permission.createdByUserName || "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {permission.createdAt
                            ? new Date(
                                permission.createdAt
                              ).toLocaleDateString()
                            : "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          {editingPermissionId === permission.id ? (
                            <div className="flex justify-end space-x-2">
                              <button
                                onClick={() => handleSaveEdit(permission.id)}
                                className="text-blue-600 hover:text-blue-900"
                                disabled={isSubmitting}
                              >
                                <Save size={18} />
                              </button>
                              <button
                                onClick={() => setEditingPermissionId(null)}
                                className="text-gray-600 hover:text-gray-900"
                              >
                                <X size={18} />
                              </button>
                            </div>
                          ) : (
                            <div className="flex justify-end space-x-2">
                              <button
                                onClick={() =>
                                  handleEditPermission(permission.id)
                                }
                                className="text-blue-600 hover:text-blue-900"
                              >
                                <Edit size={18} />
                              </button>
                              <button
                                onClick={() =>
                                  handleDeletePermission(permission.id)
                                }
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
              totalItems={filteredPermissions.length}
              onPageChange={setCurrentPage}
              onPageSizeChange={setPageSize}
            />
          </>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <p className="text-gray-500">
              No permissions found matching your search criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
