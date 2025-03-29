// src/app/(protected)/organizer-hackathon-management/[id]/resource-management/_components/Rounds.tsx
import { useEffect, useState } from "react";
import { fetchMockRounds } from "../_mocks/fetchMockRounds";
import { fetchMockLocations } from "../_mocks/fetchMockLocations";
import { Round } from "@/types/entities/round";
import { Location } from "@/types/entities/location";
import RoundForm from "./RoundForm";

export default function Rounds({ hackathonId }: { hackathonId: string }) {
  const [rounds, setRounds] = useState<Round[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentRound, setCurrentRound] = useState<Partial<Round> | undefined>(
    undefined
  );

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

  // Handle form submission
  const handleFormSubmit = async (roundData: Round) => {
    try {
      // Log the request body before sending
      console.log(`${isEditing ? "UPDATE" : "CREATE"} ROUND REQUEST:`, {
        endpoint: isEditing ? `/api/rounds/${roundData.id}` : "/api/rounds",
        method: isEditing ? "PUT" : "POST",
        payload: roundData,
      });

      // Simulate API call
      await simulateApiCall(roundData);

      if (isEditing) {
        // Update state
        setRounds(
          rounds.map((round) => (round.id === roundData.id ? roundData : round))
        );
        setOperationStatus({
          message: "Round updated successfully!",
          type: "success",
        });
      } else {
        // Add new round
        setRounds([...rounds, roundData]);
        setOperationStatus({
          message: "Round created successfully!",
          type: "success",
        });
      }
      resetForm();
    } catch (error) {
      console.error(
        `Failed to ${isEditing ? "update" : "create"} round:`,
        error
      );
      setOperationStatus({
        message: `Failed to ${isEditing ? "update" : "create"} round.`,
        type: "error",
      });
    }
  };

  // Delete a round
  const deleteRound = async (roundId: string) => {
    if (!confirm("Are you sure you want to delete this round?")) return;

    try {
      // Log the delete request before sending
      console.log("DELETE ROUND REQUEST:", {
        endpoint: `/api/rounds/${roundId}`,
        method: "DELETE",
        roundId,
      });

      // Simulate API call
      await simulateApiCall({ success: true });

      // Update state
      setRounds(rounds.filter((round) => round.id !== roundId));
      setOperationStatus({
        message: "Round deleted successfully!",
        type: "success",
      });
    } catch (error) {
      console.error("Failed to delete round:", error);
      setOperationStatus({
        message: "Failed to delete round.",
        type: "error",
      });
    }
  };

  // Reset form and hide it
  const resetForm = () => {
    setCurrentRound(undefined);
    setShowForm(false);
    setIsEditing(false);
  };

  // Prepare form for editing a round
  const editRound = (round: Round) => {
    setCurrentRound({
      ...round,
      startTime: new Date(round.startTime || "").toISOString().slice(0, 16),
      endTime: new Date(round.endTime || "").toISOString().slice(0, 16),
    });
    setIsEditing(true);
    setShowForm(true);
  };

  // Open form for creating a new round
  const openCreateForm = () => {
    setCurrentRound(undefined);
    setIsEditing(false);
    setShowForm(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Rounds</h2>
        <button
          onClick={() => (showForm ? resetForm() : openCreateForm())}
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
        <RoundForm
          isEditing={isEditing}
          locations={locations}
          initialData={currentRound}
          hackathonId={hackathonId}
          onSubmit={handleFormSubmit}
          onCancel={resetForm}
          renderLocationType={renderLocationType}
        />
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
