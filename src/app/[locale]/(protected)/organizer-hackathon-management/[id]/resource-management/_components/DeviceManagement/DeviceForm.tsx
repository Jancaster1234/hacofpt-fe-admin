// src/app/[locale]/(protected)/organizer-hackathon-management/[id]/resource-management/_components/DeviceManagement/DeviceForm.tsx
import React, { useState, useEffect } from "react";
import { DeviceStatus } from "@/types/entities/device";
import { Round } from "@/types/entities/round";
import { roundService } from "@/services/round.service";
import { useTranslations } from "@/hooks/useTranslations";
import { useToast } from "@/hooks/use-toast";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

interface DeviceFormProps {
  hackathonId: string;
  initialData?: {
    id?: string;
    name: string;
    description: string;
    status: DeviceStatus;
    quantity: number;
    roundId?: string;
    roundLocationId?: string;
    files?: File[];
  };
  activeRound?: Round | null;
  activeRoundLocationId?: string | null;
  onSubmit: (formData: any) => Promise<void>;
  onCancel: () => void;
  submitButtonText?: string;
}

const DeviceForm: React.FC<DeviceFormProps> = ({
  hackathonId,
  initialData,
  activeRound: propActiveRound,
  activeRoundLocationId: propActiveLocationId,
  onSubmit,
  onCancel,
  submitButtonText = "Create Device",
}) => {
  const t = useTranslations("deviceForm");
  const toast = useToast();
  const [rounds, setRounds] = useState<Round[]>([]);
  const [loadingRounds, setLoadingRounds] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const defaultFormData = {
    name: "",
    description: "",
    status: "AVAILABLE" as DeviceStatus,
    files: [] as File[],
    quantity: 1,
    roundId: "",
    roundLocationId: "",
  };

  const [formData, setFormData] = useState(initialData || defaultFormData);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Load rounds for the form
  useEffect(() => {
    const loadRounds = async () => {
      setLoadingRounds(true);
      try {
        const roundsResponse =
          await roundService.getRoundsByHackathonId(hackathonId);
        if (roundsResponse.data) {
          setRounds(roundsResponse.data);

          // If we have initialData with roundId, use it
          // Otherwise if we have propActiveRound, set it as the selected round
          if (initialData?.roundId) {
            setFormData((prev) => ({
              ...prev,
              roundId: initialData.roundId,
            }));
          } else if (propActiveRound && !formData.roundId) {
            setFormData((prev) => ({
              ...prev,
              roundId: propActiveRound.id,
            }));
          }

          // If we have initialData with roundLocationId, use it
          // Otherwise if we have propActiveLocationId, set it as the selected location
          if (initialData?.roundLocationId) {
            setFormData((prev) => ({
              ...prev,
              roundLocationId: initialData.roundLocationId,
            }));
          } else if (propActiveLocationId && !formData.roundLocationId) {
            setFormData((prev) => ({
              ...prev,
              roundLocationId: propActiveLocationId,
            }));
          }
        }
      } catch (error) {
        console.error("Error loading rounds:", error);
        setErrors({
          ...errors,
          form: t("errorLoadingRounds"),
        });
      } finally {
        setLoadingRounds(false);
      }
    };

    loadRounds();
  }, [hackathonId]); // Intentionally not including toast in dependencies

  // Get the active round
  const activeRound = formData.roundId
    ? rounds.find((round) => round.id === formData.roundId)
    : null;

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    // If changing round, reset location selection
    if (name === "roundId") {
      setFormData({
        ...formData,
        roundId: value,
        roundLocationId: "", // Reset location when round changes
      });
    } else {
      setFormData({
        ...formData,
        [name]: name === "quantity" ? parseInt(value) || 1 : value,
      });
    }

    // Clear error for this field when user changes input
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({
        ...formData,
        files: Array.from(e.target.files),
      });
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = t("nameRequired");
    }

    if (formData.quantity <= 0) {
      newErrors.quantity = t("quantityMinimum");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      // Create a copy of formData to send to API
      const submissionData = { ...formData };

      // We're already using the correct roundLocationId directly in the form
      // No need for conversion between location.id and roundLocation.id

      await onSubmit(submissionData);
      toast.success(initialData?.id ? t("deviceUpdated") : t("deviceCreated"));
    } catch (error: any) {
      console.error("Error submitting device form:", error);
      const errorMessage = error?.message || t("failedToSaveDevice");
      toast.error(errorMessage);
      setErrors({
        ...errors,
        form: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md transition-colors duration-300">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t("deviceName")}*
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border ${
                errors.name
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-600"
              } rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 transition-colors duration-200`}
              placeholder={t("enterDeviceName")}
              disabled={isSubmitting}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t("status")}
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
              disabled={isSubmitting}
            >
              <option value="AVAILABLE">{t("statusAvailable")}</option>
              <option value="IN_USE">{t("statusInUse")}</option>
              <option value="DAMAGED">{t("statusDamaged")}</option>
              <option value="LOST">{t("statusLost")}</option>
              <option value="RETIRED">{t("statusRetired")}</option>
              <option value="PENDING">{t("statusPending")}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t("quantity")}
            </label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleInputChange}
              min="1"
              className={`w-full px-3 py-2 border ${
                errors.quantity
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-600"
              } rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 transition-colors duration-200`}
              disabled={isSubmitting}
            />
            {errors.quantity && (
              <p className="text-red-500 text-xs mt-1">{errors.quantity}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t("round")}
            </label>
            <select
              name="roundId"
              value={formData.roundId}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
              disabled={loadingRounds || isSubmitting}
            >
              <option value="">{t("noneGeneralHackathonDevice")}</option>
              {rounds.map((round) => (
                <option key={round.id} value={round.id}>
                  {round.roundTitle}
                </option>
              ))}
            </select>
            {loadingRounds && (
              <div className="flex items-center mt-1 text-gray-500 dark:text-gray-400 text-xs">
                <LoadingSpinner size="sm" />
                <span className="ml-2">{t("loadingRounds")}</span>
              </div>
            )}
          </div>

          {activeRound &&
            activeRound.roundLocations &&
            activeRound.roundLocations.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t("location")}
                </label>
                <select
                  name="roundLocationId"
                  value={formData.roundLocationId}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                  disabled={isSubmitting}
                >
                  <option value="">{t("noneGeneralRoundDevice")}</option>
                  {activeRound.roundLocations.map((roundLocation) => (
                    <option
                      key={roundLocation.id}
                      value={roundLocation.id} // Use roundLocation.id directly
                    >
                      {roundLocation.location?.name || t("unknownLocation")}
                    </option>
                  ))}
                </select>
              </div>
            )}

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t("description")}
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
              rows={3}
              placeholder={t("enterDeviceDescription")}
              disabled={isSubmitting}
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t("deviceFiles")}
            </label>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 transition-colors duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 dark:file:bg-gray-700 dark:file:text-blue-300 hover:file:bg-blue-100 dark:hover:file:bg-gray-600"
              disabled={isSubmitting}
            />
            {initialData?.id && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {t("uploadNewFilesInfo")}
              </p>
            )}
            {!initialData?.id && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {t("uploadDeviceFilesInfo")}
              </p>
            )}
          </div>
        </div>

        {activeRound && formData.roundLocationId && (
          <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 text-sm rounded transition-colors duration-300">
            <p>
              {t("deviceAssignedToSpecificLocation", {
                roundTitle: activeRound.roundTitle,
              })}
            </p>
          </div>
        )}

        {activeRound && !formData.roundLocationId && (
          <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 text-sm rounded transition-colors duration-300">
            <p>
              {t("deviceAssignedToRound", {
                roundTitle: activeRound.roundTitle,
              })}
            </p>
          </div>
        )}

        {errors.form && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-300 text-sm rounded transition-colors duration-300">
            {errors.form}
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="mr-2 px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 disabled:opacity-50"
            disabled={isSubmitting}
          >
            {t("cancel")}
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors duration-200 disabled:opacity-50 flex items-center"
            disabled={isSubmitting}
          >
            {isSubmitting && <LoadingSpinner size="sm" className="mr-2" />}
            {isSubmitting ? t("submitting") : submitButtonText}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DeviceForm;
