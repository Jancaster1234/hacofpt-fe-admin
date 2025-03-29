// src/app/(protected)/organizer-hackathon-management/[id]/resource-management/_components/Rounds.tsx
import { useEffect, useState } from "react";
import { fetchMockRounds } from "../_mocks/fetchMockRounds";
import { fetchMockLocations } from "../_mocks/fetchMockLocations";
import { Round } from "@/types/entities/round";
import { Location } from "@/types/entities/location";
import {
  RoundLocation,
  RoundLocationType,
} from "@/types/entities/roundLocation";

export default function Rounds({ hackathonId }: { hackathonId: string }) {
  const [rounds, setRounds] = useState<Round[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Round>>({
    roundTitle: "",
    roundNumber: 1,
    startTime: "",
    endTime: "",
    status: "UPCOMING",
    roundLocations: [],
  });

  // Status for operation feedback
  const [operationStatus, setOperationStatus] = useState<{
    message: string;
    type: "success" | "error" | null;
  }>({ message: "", type: null });

  useEffect(() => {
    Promise.all([fetchMockRounds(hackathonId), fetchMockLocations()]).then(
      ([roundsData, locationsData]) => {
        setRounds(roundsData);
        setLocations(locationsData);
        setLoading(false);
      }
    );
  }, [hackathonId]);

  // Helper function to format location type badge
  const renderLocationType = (type: string) => {
    return (
      <span
        className={`text-xs font-medium px-2 py-1 rounded-full ${
          type === "ONLINE"
            ? "bg-blue-100 text-blue-800"
            : type === "HYBRID"
            ? "bg-green-100 text-green-800"
            : "bg-purple-100 text-purple-800"
        }`}
      >
        {type}
      </span>
    );
  };

  // Helper to simulate API call
  const simulateApiCall = <T,>(data: T, delay = 800): Promise<T> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(data);
      }, delay);
    });
  };

  // Create a new round
  const createRound = async () => {
    try {
      const newRound: Round = {
        ...formData,
        id: `round_${Date.now()}`,
        hackathonId,
        status: "UPCOMING",
        roundLocations: formData.roundLocations || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Simulate API call
      await simulateApiCall(newRound);

      // Update state
      setRounds([...rounds, newRound]);
      setOperationStatus({
        message: "Round created successfully!",
        type: "success",
      });
      resetForm();
    } catch (error) {
      setOperationStatus({
        message: "Failed to create round.",
        type: "error",
      });
    }
  };

  // Update an existing round
  const updateRound = async () => {
    try {
      const updatedRound: Round = {
        ...formData,
        updatedAt: new Date().toISOString(),
      } as Round;

      // Simulate API call
      await simulateApiCall(updatedRound);

      // Update state
      setRounds(
        rounds.map((round) =>
          round.id === updatedRound.id ? updatedRound : round
        )
      );
      setOperationStatus({
        message: "Round updated successfully!",
        type: "success",
      });
      resetForm();
    } catch (error) {
      setOperationStatus({
        message: "Failed to update round.",
        type: "error",
      });
    }
  };

  // Delete a round
  const deleteRound = async (roundId: string) => {
    if (!confirm("Are you sure you want to delete this round?")) return;

    try {
      // Simulate API call
      await simulateApiCall({ success: true });

      // Update state
      setRounds(rounds.filter((round) => round.id !== roundId));
      setOperationStatus({
        message: "Round deleted successfully!",
        type: "success",
      });
    } catch (error) {
      setOperationStatus({
        message: "Failed to delete round.",
        type: "error",
      });
    }
  };

  // Reset form and hide it
  const resetForm = () => {
    setFormData({
      roundTitle: "",
      roundNumber: 1,
      startTime: "",
      endTime: "",
      status: "UPCOMING",
      roundLocations: [],
    });
    setShowForm(false);
    setIsEditing(false);
  };

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Prepare form for editing a round
  const editRound = (round: Round) => {
    setFormData({
      ...round,
      startTime: new Date(round.startTime || "").toISOString().slice(0, 16),
      endTime: new Date(round.endTime || "").toISOString().slice(0, 16),
    });
    setIsEditing(true);
    setShowForm(true);
  };

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
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing) {
      updateRound();
    } else {
      createRound();
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Rounds</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          {showForm ? "Cancel" : "Add Round"}
        </button>
      </div>

      {/* Operation status message */}
      {operationStatus.type && (
        <div
          className={`mb-4 p-3 rounded ${
            operationStatus.type === "success"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {operationStatus.message}
        </div>
      )}

      {/* Round Form */}
      {showForm && (
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
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">End Time</label>
                <input
                  type="datetime-local"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
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
                onClick={resetForm}
                className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                {isEditing ? "Update Round" : "Create Round"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Rounds List */}
      {loading ? (
        <p className="text-gray-500">Loading rounds...</p>
      ) : rounds.length > 0 ? (
        rounds.map((round) => (
          <div
            key={round.id}
            className="bg-white p-4 rounded-lg shadow-md mb-4"
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-medium text-gray-800">
                {round.roundTitle}
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={() => editRound(round)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteRound(round.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <p className="text-gray-600">
                <strong>Round Number:</strong> {round.roundNumber}
              </p>
              <span
                className={`ml-2 text-sm px-2 py-1 rounded ${
                  round.status === "UPCOMING"
                    ? "bg-yellow-300 text-yellow-800"
                    : round.status === "ONGOING"
                    ? "bg-green-300 text-green-800"
                    : round.status === "COMPLETED"
                    ? "bg-blue-300 text-blue-800"
                    : "bg-red-300 text-red-800"
                }`}
              >
                {round.status}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-3">
              <p className="text-gray-600">
                <strong>Start:</strong>{" "}
                {new Date(round.startTime || "").toLocaleString()}
              </p>
              <p className="text-gray-600">
                <strong>End:</strong>{" "}
                {new Date(round.endTime || "").toLocaleString()}
              </p>
            </div>

            {/* Locations Section */}
            <div className="mt-4">
              <h4 className="text-md font-medium text-gray-700 mb-2">
                Locations
              </h4>
              {round.roundLocations && round.roundLocations.length > 0 ? (
                <div className="space-y-3">
                  {round.roundLocations.map((location) => (
                    <div
                      key={location.id}
                      className="bg-gray-50 p-3 rounded-md border border-gray-200"
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium">
                          {location.location?.name}
                        </span>
                        {renderLocationType(location.type)}
                      </div>
                      <p className="text-sm text-gray-600">
                        {location.location?.address}
                      </p>
                      {location.location?.latitude !== 0 &&
                        location.location?.longitude !== 0 && (
                          <p className="text-xs text-gray-500 mt-1">
                            Coordinates: {location.location?.latitude},{" "}
                            {location.location?.longitude}
                          </p>
                        )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm italic">
                  No locations assigned to this round.
                </p>
              )}
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-500">No rounds available.</p>
      )}
    </div>
  );
}
