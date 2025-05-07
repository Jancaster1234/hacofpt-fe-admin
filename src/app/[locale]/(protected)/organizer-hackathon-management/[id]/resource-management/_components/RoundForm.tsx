// src/app/[locale]/(protected)/organizer-hackathon-management/[id]/resource-management/_components/RoundForm.tsx
import { useState, useEffect } from "react";
import { Round } from "@/types/entities/round";
import { Location } from "@/types/entities/location";
import {
  RoundLocation,
  RoundLocationType,
} from "@/types/entities/roundLocation";
import { useTranslations } from "@/hooks/useTranslations";
import { useToast } from "@/hooks/use-toast";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

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
  const t = useTranslations("roundForm");
  const toast = useToast();

  // Form state
  const [formData, setFormData] = useState<Partial<Round>>(
    initialData || {
      roundTitle: "",
      roundNumber: 1,
      startTime: "",
      endTime: "",
      status: "UPCOMING",
      totalTeam: 0,
      roundLocations: [],
    }
  );

  // Validation state
  const [formErrors, setFormErrors] = useState<{
    startTime?: string;
    endTime?: string;
    totalTeam?: string;
  }>({});

  // Loading state for form submission
  const [submitting, setSubmitting] = useState(false);

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "totalTeam" ? parseInt(value) || 0 : value,
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
        endTime: t("errors.endTimeAfterStartTime"),
      });
    } else if (startDate && endDate) {
      setFormErrors({
        ...formErrors,
        startTime: undefined,
        endTime: undefined,
      });
    }
  }, [formData.startTime, formData.endTime]);

  // Validate totalTeam when it changes
  useEffect(() => {
    if (formData.totalTeam !== undefined && formData.totalTeam < 0) {
      setFormErrors({
        ...formErrors,
        totalTeam: t("errors.negativeTotalTeams"),
      });
    } else {
      setFormErrors({
        ...formErrors,
        totalTeam: undefined,
      });
    }
  }, [formData.totalTeam]);

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
        id: `temp_${Date.now()}_${locationId}`, // The API will assign a proper ID
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
    setSubmitting(true);

    try {
      // Validate start and end times
      const startDate = new Date(formData.startTime || "");
      const endDate = new Date(formData.endTime || "");

      if (startDate >= endDate) {
        setFormErrors({
          ...formErrors,
          endTime: t("errors.endTimeAfterStartTime"),
        });
        setSubmitting(false);
        return;
      }

      // Validate totalTeam
      if (formData.totalTeam !== undefined && formData.totalTeam < 0) {
        setFormErrors({
          ...formErrors,
          totalTeam: t("errors.negativeTotalTeams"),
        });
        setSubmitting(false);
        return;
      }

      // Create round data object
      const roundData: Round = {
        ...formData,
        id: formData.id || `temp_round_${Date.now()}`, // The API will assign a proper ID for new rounds
        hackathonId,
        status: formData.status || "UPCOMING",
        roundLocations: formData.roundLocations || [],
        createdAt: formData.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as Round;

      // Submit the form and handle the response
      await onSubmit(roundData);

      // REMOVED: Success toast here because it's already shown in the parent Rounds component
      // This prevents duplicate success messages
    } catch (error: any) {
      // Show error toast with the error message
      toast.error(error.message || t("notifications.error"));
      console.error("Form submission error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md mb-6 transition-colors duration-300">
      <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-gray-100">
        {isEditing ? t("title.edit") : t("title.create")}
      </h3>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-1">
              {t("fields.roundTitle")}
            </label>
            <input
              type="text"
              name="roundTitle"
              value={formData.roundTitle}
              onChange={handleInputChange}
              className="w-full p-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 transition-colors duration-300"
              required
              disabled={submitting}
            />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-1">
              {t("fields.roundNumber")}
            </label>
            <input
              type="number"
              name="roundNumber"
              value={formData.roundNumber}
              onChange={handleInputChange}
              className="w-full p-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 transition-colors duration-300"
              min="1"
              required
              disabled={submitting}
            />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-1">
              {t("fields.startTime")}
            </label>
            <input
              type="datetime-local"
              name="startTime"
              value={formData.startTime}
              onChange={handleInputChange}
              className={`w-full p-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 transition-colors duration-300 ${
                formErrors.startTime ? "border-red-500 dark:border-red-400" : ""
              }`}
              required
              disabled={submitting}
            />
            {formErrors.startTime && (
              <p className="text-red-500 dark:text-red-400 text-sm mt-1">
                {formErrors.startTime}
              </p>
            )}
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-1">
              {t("fields.endTime")}
            </label>
            <input
              type="datetime-local"
              name="endTime"
              value={formData.endTime}
              onChange={handleInputChange}
              className={`w-full p-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 transition-colors duration-300 ${
                formErrors.endTime ? "border-red-500 dark:border-red-400" : ""
              }`}
              required
              disabled={submitting}
            />
            {formErrors.endTime && (
              <p className="text-red-500 dark:text-red-400 text-sm mt-1">
                {formErrors.endTime}
              </p>
            )}
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-1">
              {t("fields.status")}
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="w-full p-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 transition-colors duration-300"
              required
              disabled={submitting}
            >
              <option value="UPCOMING">{t("status.upcoming")}</option>
              <option value="ONGOING">{t("status.ongoing")}</option>
              <option value="COMPLETED">{t("status.completed")}</option>
              <option value="CANCELLED">{t("status.cancelled")}</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-1">
              {t("fields.totalTeam")}
            </label>
            <input
              type="number"
              name="totalTeam"
              value={formData.totalTeam || ""}
              onChange={handleInputChange}
              className={`w-full p-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 transition-colors duration-300 ${
                formErrors.totalTeam ? "border-red-500 dark:border-red-400" : ""
              }`}
              min="0"
              disabled={submitting}
            />
            {formErrors.totalTeam && (
              <p className="text-red-500 dark:text-red-400 text-sm mt-1">
                {formErrors.totalTeam}
              </p>
            )}
          </div>
        </div>

        {/* Locations Selection */}
        <div className="mb-4">
          <h4 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t("locations.addLocations")}
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
                  className={`p-3 rounded-md border transition-all duration-300 ${
                    isSelected
                      ? "border-blue-300 dark:border-blue-500 bg-blue-50 dark:bg-blue-900/30"
                      : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <div>
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {location.name}
                      </span>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {location.address}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <select
                        value={selectedType || ""}
                        onChange={(e) =>
                          handleLocationChange(
                            location.id,
                            e.target.value as RoundLocationType
                          )
                        }
                        className="p-1 border rounded text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 transition-colors duration-300 flex-grow sm:flex-grow-0"
                        disabled={submitting}
                        aria-label={t("locations.selectType")}
                      >
                        <option value="">{t("locations.selectType")}</option>
                        <option value="ONLINE">
                          {t("locationType.online")}
                        </option>
                        <option value="OFFLINE">
                          {t("locationType.offline")}
                        </option>
                        <option value="HYBRID">
                          {t("locationType.hybrid")}
                        </option>
                      </select>
                      {isSelected && !submitting && (
                        <button
                          type="button"
                          onClick={() => removeLocation(location.id)}
                          className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors duration-300"
                          aria-label={t("locations.remove")}
                        >
                          {t("locations.remove")}
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
            <h4 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t("locations.selectedLocations")}
            </h4>
            <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-md border border-gray-200 dark:border-gray-700 transition-colors duration-300">
              <ul className="list-disc pl-5 text-gray-800 dark:text-gray-200">
                {formData.roundLocations.map((rl) => (
                  <li key={rl.id} className="mb-1">
                    {rl.location?.name} - {renderLocationType(rl.type)}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-end gap-2 mt-6">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border rounded text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-600 transition-colors duration-300"
            disabled={submitting}
          >
            {t("buttons.cancel")}
          </button>
          <button
            type="submit"
            className={`px-4 py-2 bg-blue-500 dark:bg-blue-600 text-white rounded hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors duration-300 ${
              submitting ? "opacity-70 cursor-not-allowed" : ""
            }`}
            disabled={
              !!formErrors.startTime ||
              !!formErrors.endTime ||
              !!formErrors.totalTeam ||
              submitting
            }
          >
            {submitting ? (
              <span className="flex items-center justify-center">
                <LoadingSpinner size="sm" className="mr-2" />
                {t("buttons.processing")}
              </span>
            ) : isEditing ? (
              t("buttons.update")
            ) : (
              t("buttons.create")
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
