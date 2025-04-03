"use client";
import React, { useEffect, useState } from "react";
import { Location } from "@/types/entities/location";
import { locationService } from "@/services/location.service";
import { useApiModal } from "@/hooks/useApiModal";
import ApiResponseModal from "@/components/common/ApiResponseModal";

export default function Locations() {
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
      }
    } catch (error) {
      console.error("Failed to load locations:", error);
      showError("Error", "Failed to load locations. Please try again.");
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
        showSuccess(
          "Success",
          response.message || "Location created successfully"
        );
        resetForm();
      } else {
        showError("Error", "Failed to create location");
      }
    } catch (error: any) {
      console.error("Error creating location:", error);
      showError("Error", error.message || "Failed to create location");
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
        showSuccess(
          "Success",
          response.message || "Location updated successfully"
        );
        resetForm();
      } else {
        showError("Error", "Failed to update location");
      }
    } catch (error: any) {
      console.error("Error updating location:", error);
      showError("Error", error.message || "Failed to update location");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this location?")) return;

    setIsLoading(true);

    try {
      const response = await locationService.deleteLocation(id);
      // Remove the deleted location from the state
      setLocations(locations.filter((loc) => loc.id !== id));
      showSuccess(
        "Success",
        response.message || "Location deleted successfully"
      );
    } catch (error: any) {
      console.error("Error deleting location:", error);
      showError("Error", error.message || "Failed to delete location");
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
      <div className="bg-gray-50 p-4 rounded-md border mb-6">
        <h3 className="font-semibold text-lg mb-3">
          {isEditing ? "Update Location" : "Create New Location"}
        </h3>

        <form onSubmit={isEditing ? handleUpdateSubmit : handleCreateSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Latitude
                </label>
                <input
                  type="number"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleInputChange}
                  step="any"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Longitude
                </label>
                <input
                  type="number"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleInputChange}
                  step="any"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {isLoading ? "Processing..." : isEditing ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  };

  return (
    <div className="bg-white shadow-md p-4 rounded-lg">
      {/* Modal for API responses */}
      <ApiResponseModal
        isOpen={modalState.isOpen}
        onClose={hideModal}
        title={modalState.title}
        message={modalState.message}
        type={modalState.type}
      />

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Available Locations</h2>

        {!showCreateForm && !editingLocation && (
          <button
            onClick={() => setShowCreateForm(true)}
            className="px-3 py-1 text-sm text-white bg-green-600 rounded-md hover:bg-green-700"
          >
            Add Location
          </button>
        )}
      </div>

      {(showCreateForm || editingLocation) && renderForm()}

      {isLoading && !editingLocation && !showCreateForm ? (
        <p>Loading locations...</p>
      ) : (
        <ul className="space-y-2">
          {locations.length === 0 ? (
            <p className="text-gray-500">
              No locations available. Add a new location to get started.
            </p>
          ) : (
            locations.map((location) => (
              <li
                key={location.id}
                className="border p-3 rounded-md shadow-sm bg-gray-50"
              >
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-medium text-lg">{location.name}</h3>
                    <p className="text-gray-600">{location.address}</p>
                    <p className="text-sm text-gray-500">
                      Latitude: {location.latitude}, Longitude:{" "}
                      {location.longitude}
                    </p>
                    <p className="text-xs text-gray-400">
                      Created: {new Date(location.createdAt).toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-400">
                      Updated: {new Date(location.updatedAt).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(location)}
                      className="px-3 py-1 text-xs text-white bg-blue-600 rounded-md hover:bg-blue-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(location.id)}
                      className="px-3 py-1 text-xs text-white bg-red-600 rounded-md hover:bg-red-700"
                    >
                      Delete
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
