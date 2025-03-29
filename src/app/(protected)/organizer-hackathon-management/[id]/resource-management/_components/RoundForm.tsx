// src/app/(protected)/organizer-hackathon-management/[id]/resource-management/_components/RoundForm.tsx
import { useState, useEffect } from "react";
import { Round } from "@/types/entities/round";
import { Location } from "@/types/entities/location";
import {
  RoundLocation,
  RoundLocationType,
} from "@/types/entities/roundLocation";

interface RoundFormProps {
  isEditing: boolean;
  locations: Location[];
  initialData?: Partial<Round>;
  hackathonId: string;
  onSubmit: (round: Round) => Promise<void>;
  onCancel: () => void;
  renderLocationType: (type: string) => JSX.Element;
}

export default function RoundForm({
  isEditing,
  locations,
  initialData,
  hackathonId,
  onSubmit,
  onCancel,
  renderLocationType,
}: RoundFormProps) {
  // Form state
  const [formData, setFormData] = useState<Partial<Round>>(
    initialData || {
      roundTitle: "",
      roundNumber: 1,
      startTime: "",
      endTime: "",
      status: "UPCOMING",
      roundLocations: [],
    }
  );

  // Validation state
  const [formErrors, setFormErrors] = useState<{
    startTime?: string;
    endTime?: string;
  }>({});

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear validation errors when field is updated
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors({
        ...formErrors,
        [name]: undefined,
      });
    }
  };

  // Validate dates when they change
  useEffect(() => {
    const startDate = formData.startTime ? new Date(formData.startTime) : null;
    const endDate = formData.endTime ? new Date(formData.endTime) : null;

    if (startDate && endDate && startDate >= endDate) {
      setFormErrors({
        ...formErrors,
        endTime: "End time must be after start time",
      });
    } else if (startDate && endDate) {
      setFormErrors({
        ...formErrors,
        startTime: undefined,
        endTime: undefined,
      });
    }
  }, [formData.startTime, formData.endTime]);

  // Handle location selection for the round
  const handleLocationChange = (
    locationId: string,
    locationType: RoundLocationType
  ) => {
    // Find if this location is already in the roundLocations
    const existingIndex = formData.roundLocations?.findIndex(
      (rl) => rl.locationId === locationId
    );

    if (existingIndex !== undefined && existingIndex >= 0) {
      // If it exists, update the type
      const updatedLocations = [...(formData.roundLocations || [])];
      updatedLocations[existingIndex] = {
        ...updatedLocations[existingIndex],
        type: locationType,
      };
      setFormData({
        ...formData,
        roundLocations: updatedLocations,
      });
    } else {
      // If it doesn't exist, add it
      const location = locations.find((loc) => loc.id === locationId);
      if (!location) return;

      const newRoundLocation: RoundLocation = {
        id: `rl_${Date.now()}_${locationId}`,
        locationId,
        location,
        type: locationType,
        createdAt: new Date().toISOString(),
      };

      setFormData({
        ...formData,
        roundLocations: [...(formData.roundLocations || []), newRoundLocation],
      });
    }
  };

  // Remove a location from the round
  const removeLocation = (locationId: string) => {
    setFormData({
      ...formData,
      roundLocations: formData.roundLocations?.filter(
        (rl) => rl.locationId !== locationId
      ),
    });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate start and end times
    const startDate = new Date(formData.startTime || "");
    const endDate = new Date(formData.endTime || "");

    if (startDate >= endDate) {
      setFormErrors({
        ...formErrors,
        endTime: "End time must be after start time",
      });
      return;
    }

    // Create round data object
    const roundData: Round = {
      ...formData,
      id: formData.id || `round_${Date.now()}`,
      hackathonId,
      status: formData.status || "UPCOMING",
      roundLocations: formData.roundLocations || [],
      createdAt: formData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as Round;

    // Log detailed form submission data
    console.log("ROUND FORM SUBMISSION:", {
      action: isEditing ? "UPDATE" : "CREATE",
      requestBody: roundData,
      validationPassed: true,
      formattedTimestamps: {
        startTime: new Date(roundData.startTime || "").toLocaleString(),
        endTime: new Date(roundData.endTime || "").toLocaleString(),
        createdAt: new Date(roundData.createdAt).toLocaleString(),
        updatedAt: new Date(roundData.updatedAt).toLocaleString(),
      },
      metadata: {
        totalLocations: roundData.roundLocations.length,
        locationTypes: roundData.roundLocations.map((rl) => rl.type),
      },
    });

    await onSubmit(roundData);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h3 className="text-lg font-medium mb-4">
        {isEditing ? "Edit Round" : "Create New Round"}
      </h3>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 mb-1">Round Title</label>
            <input
              type="text"
              name="roundTitle"
              value={formData.roundTitle}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Round Number</label>
            <input
              type="number"
              name="roundNumber"
              value={formData.roundNumber}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              min="1"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Start Time</label>
            <input
              type="datetime-local"
              name="startTime"
              value={formData.startTime}
              onChange={handleInputChange}
              className={`w-full p-2 border rounded ${
                formErrors.startTime ? "border-red-500" : ""
              }`}
              required
            />
            {formErrors.startTime && (
              <p className="text-red-500 text-sm mt-1">
                {formErrors.startTime}
              </p>
            )}
          </div>
          <div>
            <label className="block text-gray-700 mb-1">End Time</label>
            <input
              type="datetime-local"
              name="endTime"
              value={formData.endTime}
              onChange={handleInputChange}
              className={`w-full p-2 border rounded ${
                formErrors.endTime ? "border-red-500" : ""
              }`}
              required
            />
            {formErrors.endTime && (
              <p className="text-red-500 text-sm mt-1">{formErrors.endTime}</p>
            )}
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="UPCOMING">Upcoming</option>
              <option value="ONGOING">Ongoing</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Locations Selection */}
        <div className="mb-4">
          <h4 className="text-md font-medium text-gray-700 mb-2">
            Add Locations
          </h4>
          <div className="space-y-3">
            {locations.map((location) => {
              const isSelected = formData.roundLocations?.some(
                (rl) => rl.locationId === location.id
              );
              const selectedType = formData.roundLocations?.find(
                (rl) => rl.locationId === location.id
              )?.type;

              return (
                <div
                  key={location.id}
                  className={`p-3 rounded-md border ${
                    isSelected
                      ? "border-blue-300 bg-blue-50"
                      : "border-gray-200 bg-gray-50"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-medium">{location.name}</span>
                      <p className="text-sm text-gray-600">
                        {location.address}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <select
                        value={selectedType || ""}
                        onChange={(e) =>
                          handleLocationChange(
                            location.id,
                            e.target.value as RoundLocationType
                          )
                        }
                        className="p-1 border rounded text-sm"
                      >
                        <option value="">-- Select type --</option>
                        <option value="ONLINE">Online</option>
                        <option value="OFFLINE">Offline</option>
                        <option value="HYBRID">Hybrid</option>
                      </select>
                      {isSelected && (
                        <button
                          type="button"
                          onClick={() => removeLocation(location.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Locations */}
        {formData.roundLocations && formData.roundLocations.length > 0 && (
          <div className="mb-4">
            <h4 className="text-md font-medium text-gray-700 mb-2">
              Selected Locations
            </h4>
            <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
              <ul className="list-disc pl-5">
                {formData.roundLocations.map((rl) => (
                  <li key={rl.id} className="mb-1">
                    {rl.location?.name} - {renderLocationType(rl.type)}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            disabled={!!formErrors.startTime || !!formErrors.endTime}
          >
            {isEditing ? "Update Round" : "Create Round"}
          </button>
        </div>
      </form>
    </div>
  );
}
