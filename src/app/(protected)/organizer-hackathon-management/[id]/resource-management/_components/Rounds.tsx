// src/app/(protected)/organizer-hackathon-management/[id]/resource-management/_components/Rounds.tsx
import { useEffect, useState } from "react";
import { Round } from "@/types/entities/round";
import { Location } from "@/types/entities/location";
import RoundForm from "./RoundForm";
import { roundService } from "@/services/round.service";
import { locationService } from "@/services/location.service";
import ApiResponseModal from "@/components/common/ApiResponseModal";
import { useApiModal } from "@/hooks/useApiModal";

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

  // Use the API modal hook
  const { modalState, hideModal, showSuccess, showError } = useApiModal();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch rounds and locations using the service
        const [roundsResponse, locationsResponse] = await Promise.all([
          roundService.getRoundsByHackathonId(hackathonId),
          locationService.getAllLocations(),
        ]);

        setRounds(roundsResponse.data);
        setLocations(locationsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        showError(
          "Data Loading Error",
          "Failed to load rounds and locations. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [hackathonId, showError]);

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

  // Handle form submission
  const handleFormSubmit = async (roundData: Round) => {
    try {
      // Extract location data correctly for API call
      const locationData = roundData.roundLocations?.map((rl) => ({
        locationId: rl.locationId,
        type: rl.type,
      }));

      if (isEditing) {
        // Update existing round
        const response = await roundService.updateRound({
          id: roundData.id,
          hackathonId: roundData.hackathonId,
          startTime: roundData.startTime,
          endTime: roundData.endTime,
          roundNumber: roundData.roundNumber,
          roundTitle: roundData.roundTitle,
          status: roundData.status as
            | "UPCOMING"
            | "ONGOING"
            | "COMPLETED"
            | "CANCELLED",
          roundLocations: locationData,
        });

        // Update state with the response data
        setRounds(
          rounds.map((round) =>
            round.id === response.data.id ? response.data : round
          )
        );

        showSuccess(
          "Success",
          response.message || "Round updated successfully!"
        );
      } else {
        // Create new round
        const response = await roundService.createRound({
          hackathonId: roundData.hackathonId,
          startTime: roundData.startTime,
          endTime: roundData.endTime,
          roundNumber: roundData.roundNumber,
          roundTitle: roundData.roundTitle,
          status: roundData.status as
            | "UPCOMING"
            | "ONGOING"
            | "COMPLETED"
            | "CANCELLED",
          roundLocations: locationData,
        });

        // Add new round to state
        setRounds([...rounds, response.data]);

        showSuccess(
          "Success",
          response.message || "Round created successfully!"
        );
      }

      resetForm();
    } catch (error: any) {
      console.error(
        `Failed to ${isEditing ? "update" : "create"} round:`,
        error
      );

      showError(
        `${isEditing ? "Update" : "Create"} Failed`,
        error.message || `Failed to ${isEditing ? "update" : "create"} round.`
      );
    }
  };

  // Delete a round
  const deleteRound = async (roundId: string) => {
    if (!confirm("Are you sure you want to delete this round?")) return;

    try {
      const response = await roundService.deleteRound(roundId);

      // Update state
      setRounds(rounds.filter((round) => round.id !== roundId));

      showSuccess("Success", response.message || "Round deleted successfully!");
    } catch (error: any) {
      console.error("Failed to delete round:", error);

      showError("Delete Failed", error.message || "Failed to delete round.");
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

      {/* API Response Modal */}
      <ApiResponseModal
        isOpen={modalState.isOpen}
        onClose={hideModal}
        title={modalState.title}
        message={modalState.message}
        type={modalState.type}
      />
    </div>
  );
}
