// src/app/[locale]/(protected)/organizer-hackathon-management/[id]/resource-management/_components/Locations.tsx
"use client";
import React, { useEffect, useState } from "react";
import { Location } from "@/types/entities/location";
import { locationService } from "@/services/location.service";
import { useApiModal } from "@/hooks/useApiModal";
import ApiResponseModal from "@/components/common/ApiResponseModal";
import { useTranslations } from "@/hooks/useTranslations";
import { useToast } from "@/hooks/use-toast";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function Locations() {
  const t = useTranslations("locations");
  const toast = useToast();
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    latitude: 0,
    longitude: 0,
  });

  // Use the API modal hook
  const { modalState, hideModal, showSuccess, showError } = useApiModal();

  useEffect(() => {
    loadLocations();
  }, []);

  const loadLocations = async () => {
    setIsLoading(true);
    try {
      const response = await locationService.getAllLocations();
      if (response.data) {
        setLocations(response.data);
      } else {
        showError("Error", "Failed to load locations. Please try again.");
        toast.error(t("loadError"));
      }
    } catch (error) {
      console.error("Failed to load locations:", error);
      showError("Error", "Failed to load locations. Please try again.");
      toast.error(t("loadError"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let parsedValue: string | number = value;

    // Parse numeric fields
    if (name === "latitude" || name === "longitude") {
      parsedValue = parseFloat(value) || 0;
    }

    setFormData({
      ...formData,
      [name]: parsedValue,
    });
  };

  const resetForm = () => {
    setFormData({
      name: "",
      address: "",
      latitude: 0,
      longitude: 0,
    });
    setEditingLocation(null);
    setShowCreateForm(false);
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const request = {
        name: formData.name,
        address: formData.address,
        latitude: formData.latitude,
        longitude: formData.longitude,
      };

      const response = await locationService.createLocation(request);

      if (response.data) {
        setLocations([...locations, response.data]);
        showSuccess(t("successTitle"), response.message || t("createSuccess"));
        toast.success(response.message || t("createSuccess"));
        resetForm();
      } else {
        showError(t("errorTitle"), t("createError"));
        toast.error(response.message || t("createError"));
      }
    } catch (error: any) {
      console.error("Error creating location:", error);
      showError(t("errorTitle"), error.message || t("createError"));
      toast.error(error.message || t("createError"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLocation) return;

    setIsLoading(true);

    try {
      const request = {
        id: editingLocation.id,
        name: formData.name,
        address: formData.address,
        latitude: formData.latitude,
        longitude: formData.longitude,
      };

      const response = await locationService.updateLocation(request);

      if (response.data) {
        // Update the locations array with the updated location
        const updatedLocations = locations.map((loc) =>
          loc.id === response.data.id ? response.data : loc
        );

        setLocations(updatedLocations);
        showSuccess(t("successTitle"), response.message || t("updateSuccess"));
        toast.success(response.message || t("updateSuccess"));
        resetForm();
      } else {
        showError(t("errorTitle"), t("updateError"));
        toast.error(response.message || t("updateError"));
      }
    } catch (error: any) {
      console.error("Error updating location:", error);
      showError(t("errorTitle"), error.message || t("updateError"));
      toast.error(error.message || t("updateError"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t("deleteConfirm"))) return;

    setIsLoading(true);

    try {
      const response = await locationService.deleteLocation(id);
      // Remove the deleted location from the state
      setLocations(locations.filter((loc) => loc.id !== id));
      showSuccess(t("successTitle"), response.message || t("deleteSuccess"));
      toast.success(response.message || t("deleteSuccess"));
    } catch (error: any) {
      console.error("Error deleting location:", error);
      showError(t("errorTitle"), error.message || t("deleteError"));
      toast.error(error.message || t("deleteError"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (location: Location) => {
    setEditingLocation(location);
    setFormData({
      name: location.name,
      address: location.address,
      latitude: location.latitude,
      longitude: location.longitude,
    });
    setShowCreateForm(false);
  };

  const renderForm = () => {
    const isEditing = !!editingLocation;

    return (
      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md border border-gray-200 dark:border-gray-700 mb-6 transition-colors duration-200">
        <h3 className="font-semibold text-lg mb-3 text-gray-800 dark:text-gray-200">
          {isEditing ? t("updateLocation") : t("createLocation")}
        </h3>

        <form
          onSubmit={isEditing ? handleUpdateSubmit : handleCreateSubmit}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t("name")}
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t("address")}
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              required
              className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t("latitude")}
              </label>
              <input
                type="number"
                name="latitude"
                value={formData.latitude}
                onChange={handleInputChange}
                step="any"
                required
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t("longitude")}
              </label>
              <input
                type="number"
                name="longitude"
                value={formData.longitude}
                onChange={handleInputChange}
                step="any"
                required
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 mt-4">
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200"
            >
              {t("cancel")}
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 dark:bg-indigo-700 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 dark:hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  {t("processing")}
                </>
              ) : isEditing ? (
                t("update")
              ) : (
                t("create")
              )}
            </button>
          </div>
        </form>
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-900 shadow-md dark:shadow-gray-800 p-4 rounded-lg transition-colors duration-300">
      {/* Modal for API responses */}
      <ApiResponseModal
        isOpen={modalState.isOpen}
        onClose={hideModal}
        title={modalState.title}
        message={modalState.message}
        type={modalState.type}
      />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          {t("availableLocations")}
        </h2>

        {!showCreateForm && !editingLocation && (
          <button
            onClick={() => setShowCreateForm(true)}
            className="px-3 py-1 text-sm text-white bg-green-600 dark:bg-green-700 rounded-md hover:bg-green-700 dark:hover:bg-green-800 transition-colors duration-200 shadow-sm"
          >
            {t("addLocation")}
          </button>
        )}
      </div>

      {(showCreateForm || editingLocation) && renderForm()}

      {isLoading && !editingLocation && !showCreateForm ? (
        <div className="flex justify-center py-8">
          <LoadingSpinner size="lg" showText={true} />
        </div>
      ) : (
        <ul className="space-y-3">
          {locations.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 py-4 text-center">
              {t("noLocations")}
            </p>
          ) : (
            locations.map((location) => (
              <li
                key={location.id}
                className="border dark:border-gray-700 p-3 sm:p-4 rounded-md shadow-sm bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors duration-200"
              >
                <div className="flex flex-col sm:flex-row justify-between gap-3">
                  <div className="flex-1">
                    <h3 className="font-medium text-lg text-gray-900 dark:text-gray-100">
                      {location.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {location.address}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {t("latitude")}: {location.latitude}, {t("longitude")}:{" "}
                      {location.longitude}
                    </p>
                    <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      <p>
                        {t("created")}:{" "}
                        {new Date(location.createdAt).toLocaleString()}
                      </p>
                      <p>
                        {t("updated")}:{" "}
                        {new Date(location.updatedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex space-x-2 sm:space-x-3 self-start sm:self-center mt-2 sm:mt-0">
                    <button
                      onClick={() => handleEdit(location)}
                      className="px-3 py-1 text-xs text-white bg-blue-600 dark:bg-blue-700 rounded-md hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors duration-200"
                      aria-label={t("editAriaLabel")}
                    >
                      {t("edit")}
                    </button>
                    <button
                      onClick={() => handleDelete(location.id)}
                      className="px-3 py-1 text-xs text-white bg-red-600 dark:bg-red-700 rounded-md hover:bg-red-700 dark:hover:bg-red-800 transition-colors duration-200"
                      aria-label={t("deleteAriaLabel")}
                    >
                      {t("delete")}
                    </button>
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
