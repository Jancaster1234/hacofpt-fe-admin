// src/app/[locale]/(protected)/organizer-hackathon-management/[id]/resource-management/_components/Rounds.tsx
import { useEffect, useState } from "react";
import { Round } from "@/types/entities/round";
import { Location } from "@/types/entities/location";
import RoundForm from "./RoundForm";
import { roundService } from "@/services/round.service";
import { locationService } from "@/services/location.service";
import ApiResponseModal from "@/components/common/ApiResponseModal";
import { useApiModal } from "@/hooks/useApiModal";
import { useTranslations } from "@/hooks/useTranslations";
import { useToast } from "@/hooks/use-toast";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function Rounds({ hackathonId }: { hackathonId: string }) {
  const t = useTranslations("rounds");
  const toast = useToast();
  const [rounds, setRounds] = useState<Round[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentRound, setCurrentRound] = useState<Partial<Round> | undefined>(
    undefined
  );

  // API processing states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

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

        // Don't show toast for initial data loading
      } catch (error) {
        console.error("Error fetching data:", error);
        showError(t("dataLoadingError"), t("failedToLoadRoundsAndLocations"));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [hackathonId, showError, t]);

  // Helper function to format location type badge
  const renderLocationType = (type: string) => {
    return (
      <span
        className={`text-xs font-medium px-2 py-1 rounded-full transition-colors ${
          type === "ONLINE"
            ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
            : type === "HYBRID"
              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
              : "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
        }`}
      >
        {t(`locationType.${type.toLowerCase()}`)}
      </span>
    );
  };

  // Handle form submission
  const handleFormSubmit = async (roundData: Round) => {
    setIsSubmitting(true);
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
          totalTeam: roundData.totalTeam,
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

        // Show success toast
        toast.success(response.message || t("roundUpdatedSuccessfully"));

        // Also show in modal for consistency with existing code
        showSuccess(
          t("success"),
          response.message || t("roundUpdatedSuccessfully")
        );
      } else {
        // Create new round
        const response = await roundService.createRound({
          hackathonId: roundData.hackathonId,
          startTime: roundData.startTime,
          endTime: roundData.endTime,
          roundNumber: roundData.roundNumber,
          roundTitle: roundData.roundTitle,
          totalTeam: roundData.totalTeam,
          status: roundData.status as
            | "UPCOMING"
            | "ONGOING"
            | "COMPLETED"
            | "CANCELLED",
          roundLocations: locationData,
        });

        // Add new round to state
        setRounds([...rounds, response.data]);

        // Show success toast
        toast.success(response.message || t("roundCreatedSuccessfully"));

        // Also show in modal for consistency with existing code
        showSuccess(
          t("success"),
          response.message || t("roundCreatedSuccessfully")
        );
      }

      resetForm();
    } catch (error: any) {
      console.error(
        `Failed to ${isEditing ? "update" : "create"} round:`,
        error
      );

      // Show error toast
      toast.error(
        error.message ||
          t(isEditing ? "failedToUpdateRound" : "failedToCreateRound")
      );

      // Also show in modal for consistency with existing code
      showError(
        t(isEditing ? "updateFailed" : "createFailed"),
        error.message ||
          t(isEditing ? "failedToUpdateRound" : "failedToCreateRound")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete a round
  const deleteRound = async (roundId: string) => {
    if (!confirm(t("confirmDeleteRound"))) return;

    setIsDeleting(roundId);
    try {
      const response = await roundService.deleteRound(roundId);

      // Update state
      setRounds(rounds.filter((round) => round.id !== roundId));

      // Show success toast
      toast.success(response.message || t("roundDeletedSuccessfully"));

      // Also show in modal for consistency with existing code
      showSuccess(
        t("success"),
        response.message || t("roundDeletedSuccessfully")
      );
    } catch (error: any) {
      console.error("Failed to delete round:", error);

      // Show error toast
      toast.error(error.message || t("failedToDeleteRound"));

      // Also show in modal for consistency with existing code
      showError(t("deleteFailed"), error.message || t("failedToDeleteRound"));
    } finally {
      setIsDeleting(null);
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
    <div className="transition-colors duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
          {t("rounds")}
        </h2>
        <button
          onClick={() => (showForm ? resetForm() : openCreateForm())}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600 w-full sm:w-auto"
          disabled={isSubmitting}
        >
          {showForm ? t("cancel") : t("addRound")}
        </button>
      </div>

      {/* Round Form */}
      {showForm && (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md mb-6 transition-colors duration-300">
          <RoundForm
            isEditing={isEditing}
            locations={locations}
            initialData={currentRound}
            hackathonId={hackathonId}
            onSubmit={handleFormSubmit}
            onCancel={resetForm}
            renderLocationType={renderLocationType}
            isSubmitting={isSubmitting}
          />
        </div>
      )}

      {/* Rounds List */}
      {loading ? (
        <div className="flex justify-center items-center py-10">
          <LoadingSpinner size="md" showText={true} />
        </div>
      ) : rounds.length > 0 ? (
        <div className="space-y-4">
          {rounds.map((round) => (
            <div
              key={round.id}
              className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md mb-4 transition-colors duration-300"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100">
                  {round.roundTitle}
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => editRound(round)}
                    className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600 rounded px-2 py-1"
                    disabled={isDeleting === round.id}
                  >
                    {t("edit")}
                  </button>
                  <button
                    onClick={() => deleteRound(round.id)}
                    className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-red-400 dark:focus:ring-red-600 rounded px-2 py-1 disabled:opacity-50"
                    disabled={isDeleting === round.id}
                  >
                    {isDeleting === round.id ? (
                      <LoadingSpinner size="sm" />
                    ) : (
                      t("delete")
                    )}
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <p className="text-gray-600 dark:text-gray-300">
                  <strong>{t("roundNumber")}:</strong> {round.roundNumber}
                </p>
                <span
                  className={`ml-2 text-sm px-2 py-1 rounded transition-colors duration-300 ${
                    round.status === "UPCOMING"
                      ? "bg-yellow-300 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200"
                      : round.status === "ONGOING"
                        ? "bg-green-300 dark:bg-green-800 text-green-800 dark:text-green-200"
                        : round.status === "COMPLETED"
                          ? "bg-blue-300 dark:bg-blue-800 text-blue-800 dark:text-blue-200"
                          : "bg-red-300 dark:bg-red-800 text-red-800 dark:text-red-200"
                  }`}
                >
                  {t(`status.${round.status.toLowerCase()}`)}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3">
                <p className="text-gray-600 dark:text-gray-300">
                  <strong>{t("start")}:</strong>{" "}
                  {new Date(round.startTime || "").toLocaleString()}
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  <strong>{t("end")}:</strong>{" "}
                  {new Date(round.endTime || "").toLocaleString()}
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  <strong>{t("maxTeams")}:</strong>{" "}
                  {round.totalTeam || t("notSpecified")}
                </p>
              </div>

              {/* Locations Section */}
              <div className="mt-4">
                <h4 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t("locations")}
                </h4>
                {round.roundLocations && round.roundLocations.length > 0 ? (
                  <div className="space-y-3">
                    {round.roundLocations.map((location) => (
                      <div
                        key={location.id}
                        className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md border border-gray-200 dark:border-gray-600 transition-colors duration-300"
                      >
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-1 gap-2">
                          <span className="font-medium text-gray-800 dark:text-gray-100">
                            {location.location?.name}
                          </span>
                          {renderLocationType(location.type)}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {location.location?.address}
                        </p>
                        {location.location?.latitude !== 0 &&
                          location.location?.longitude !== 0 && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {t("coordinates")}: {location.location?.latitude},{" "}
                              {location.location?.longitude}
                            </p>
                          )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 text-sm italic">
                    {t("noLocationsAssigned")}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-center transition-colors duration-300">
          <p className="text-gray-500 dark:text-gray-400">
            {t("noRoundsAvailable")}
          </p>
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
    </div>
  );
}
