// src/app/(protected)/organizer-hackathon-management/[id]/resource-management/_components/Rounds.tsx
import { useEffect, useState, useCallback } from "react";
import { Round } from "@/types/entities/round";
import { Location } from "@/types/entities/location";
import RoundForm from "./RoundForm";
import ApiResponseModal from "@/components/common/ApiResponseModal";
import { useApiModal } from "@/hooks/useApiModal";
import { roundService } from "@/services/round.service";
import { locationService } from "@/services/location.service";

export default function Rounds({ hackathonId }: { hackathonId: string }) {
  const [rounds, setRounds] = useState<Round[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchFailed, setFetchFailed] = useState(false);

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentRound, setCurrentRound] = useState<Partial<Round> | undefined>(
    undefined
  );

  // API Modal for handling responses
  const { modalState, showSuccess, showError, hideModal } = useApiModal();

  // Memoize the error handler to prevent recreating it on each render
  const handleError = useCallback(
    (title: string, message: string, error: any) => {
      // Only show the error if we haven't already marked fetch as failed
      if (!fetchFailed) {
        setFetchFailed(true);
        showError(title, message);
        console.error(message, error);
      }
    },
    [showError, fetchFailed]
  );

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      // Skip fetching if we've already failed to prevent infinite loops
      if (fetchFailed) return;

      try {
        const roundsPromise = roundService.getRoundsByHackathonId(hackathonId);
        const locationsPromise = locationService.getAllLocations();

        // Use Promise.allSettled to handle partial failures
        const [roundsResult, locationsResult] = await Promise.allSettled([
          roundsPromise,
          locationsPromise,
        ]);

        // Make sure the component is still mounted before updating state
        if (!isMounted) return;

        // Handle rounds result
        if (roundsResult.status === "fulfilled") {
          setRounds(roundsResult.value.data);
        } else {
          console.error("Error fetching rounds:", roundsResult.reason);
          // Don't show error modal here, just log it
        }

        // Handle locations result
        if (locationsResult.status === "fulfilled") {
          setLocations(locationsResult.value.data);
        } else {
          console.error("Error fetching locations:", locationsResult.reason);
          // Don't show error modal here, just log it
        }

        // If both failed, show a single error message
        if (
          roundsResult.status === "rejected" &&
          locationsResult.status === "rejected"
        ) {
          handleError(
            "Data Loading Error",
            "Failed to load rounds and locations.",
            { rounds: roundsResult.reason, locations: locationsResult.reason }
          );
        }
      } catch (error) {
        if (isMounted) {
          handleError(
            "Data Loading Error",
            "Failed to load rounds and locations.",
            error
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [hackathonId, handleError, fetchFailed]);

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
      let response;

      if (isEditing) {
        response = await roundService.updateRound({
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
          roundLocations: roundData.roundLocations,
        });

        // Update state with the updated round
        setRounds((prev) =>
          prev.map((round) =>
            round.id === response.data.id ? response.data : round
          )
        );

        showSuccess(
          "Round Updated",
          response.message || "Round updated successfully!"
        );
      } else {
        response = await roundService.createRound({
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
          roundLocations: roundData.roundLocations,
        });

        // Add new round to state
        setRounds((prev) => [...prev, response.data]);

        showSuccess(
          "Round Created",
          response.message || "Round created successfully!"
        );
      }

      resetForm();
    } catch (error: any) {
      showError(
        `${isEditing ? "Update" : "Create"} Failed`,
        error.message || `Failed to ${isEditing ? "update" : "create"} round.`
      );
      console.error(
        `Failed to ${isEditing ? "update" : "create"} round:`,
        error
      );
    }
  };

  // Delete a round
  const deleteRound = async (roundId: string) => {
    if (!confirm("Are you sure you want to delete this round?")) return;

    try {
      const response = await roundService.deleteRound(roundId);

      // Update state after successful deletion
      setRounds((prev) => prev.filter((round) => round.id !== roundId));

      showSuccess(
        "Round Deleted",
        response.message || "Round deleted successfully!"
      );
    } catch (error: any) {
      showError("Delete Failed", error.message || "Failed to delete round.");
      console.error("Failed to delete round:", error);
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

  // Function to retry fetching data
  const retryFetch = () => {
    setFetchFailed(false);
    setLoading(true);
    hideModal();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Rounds</h2>
        <div className="flex gap-2">
          {fetchFailed && (
            <button
              onClick={retryFetch}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
            >
              Retry Loading
            </button>
          )}
          <button
            onClick={() => (showForm ? resetForm() : openCreateForm())}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            disabled={loading || fetchFailed}
          >
            {showForm ? "Cancel" : "Add Round"}
          </button>
        </div>
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

      {/* API Response Modal */}
      <ApiResponseModal
        isOpen={modalState.isOpen}
        onClose={hideModal}
        title={modalState.title}
        message={modalState.message}
        type={modalState.type}
      />

      {/* Rounds List */}
      {loading ? (
        <p className="text-gray-500">Loading rounds...</p>
      ) : fetchFailed ? (
        <div className="bg-red-50 p-4 rounded-lg border border-red-200 text-red-700">
          <p>Failed to load rounds and locations. Please try again later.</p>
        </div>
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
