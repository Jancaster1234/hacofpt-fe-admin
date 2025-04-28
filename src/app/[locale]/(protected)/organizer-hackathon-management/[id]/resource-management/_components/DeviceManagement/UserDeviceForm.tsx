// src/app/[locale]/(protected)/organizer-hackathon-management/[id]/resource-management/_components/DeviceManagement/UserDeviceForm.tsx
import React, { useState, useEffect } from "react";
import { User } from "@/types/entities/user";
import { UserHackathon } from "@/types/entities/userHackathon";
import { userHackathonService } from "@/services/userHackathon.service";
import { useTranslations } from "@/hooks/useTranslations";
import { useToast } from "@/hooks/use-toast";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

interface UserDeviceFormProps {
  hackathonId: string;
  deviceId: string;
  initialData?: {
    id?: string;
    userId: string;
    timeFrom: string;
    timeTo: string;
    status: "ASSIGNED" | "RETURNED" | "LOST" | "DAMAGED";
    files?: File[];
  };
  onSubmit: (formData: any) => Promise<void>;
  onCancel: () => void;
  submitButtonText: string;
}

const UserDeviceForm: React.FC<UserDeviceFormProps> = ({
  hackathonId,
  deviceId,
  initialData,
  onSubmit,
  onCancel,
  submitButtonText,
}) => {
  const t = useTranslations("deviceManagement");
  const toast = useToast();

  // Determine if we're in edit mode (when initialData has an id)
  const isEditMode = !!initialData?.userId;

  // Format initial date and time
  const formatInitialDateTime = (dateTimeString: string) => {
    if (!dateTimeString) return { date: "", time: "" };

    try {
      const dateTime = new Date(dateTimeString);
      const date = dateTime.toISOString().split("T")[0];
      const time = dateTime.toISOString().split("T")[1].substring(0, 5);
      return { date, time };
    } catch (e) {
      return { date: "", time: "" };
    }
  };

  const initialTimeFrom = formatInitialDateTime(
    initialData?.timeFrom || new Date().toISOString()
  );
  const initialTimeTo = formatInitialDateTime(initialData?.timeTo || "");

  const [formData, setFormData] = useState({
    userId: initialData?.userId || "",
    timeFrom: {
      date: initialTimeFrom.date,
      time: initialTimeFrom.time || "08:00",
    },
    timeTo: {
      date: initialTimeTo.date,
      time: initialTimeTo.time || "18:00",
    },
    status: initialData?.status || "ASSIGNED",
    files: initialData?.files || ([] as File[]),
  });

  const [organizers, setOrganizers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedUserName, setSelectedUserName] = useState<string>("");

  useEffect(() => {
    fetchOrganizers();
  }, []);

  // Effect to find and set the selected user's name when in edit mode
  useEffect(() => {
    if (isEditMode && formData.userId && organizers.length > 0) {
      const selectedUser = organizers.find(
        (user) => user.id === formData.userId
      );
      if (selectedUser) {
        setSelectedUserName(
          `${selectedUser.firstName} ${selectedUser.lastName}`
        );
      }
    }
  }, [formData.userId, organizers, isEditMode]);

  const fetchOrganizers = async () => {
    setIsLoading(true);
    try {
      const response = await userHackathonService.getUserHackathonsByRole(
        hackathonId,
        "ORGANIZER"
      );

      if (response.data) {
        // Extract user data from userHackathons
        const users = response.data.map((uh: UserHackathon) => uh.user);
        setOrganizers(users);
      }
    } catch (error) {
      console.error("Error fetching organizers:", error);
      setError(t("errors.failedToLoadOrganizers"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    // Handle date and time inputs
    if (name.includes(".")) {
      const [fieldName, subField] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [fieldName]: {
          ...prev[fieldName as keyof typeof prev],
          [subField]: value,
        },
      }));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData({
        ...formData,
        files: Array.from(e.target.files),
      });
    }
  };

  const validateForm = (): boolean => {
    // Check if user is selected
    if (!formData.userId) {
      setError(t("errors.userRequired"));
      return false;
    }

    // Check if dates are valid
    if (!formData.timeFrom.date || !formData.timeTo.date) {
      setError(t("errors.datesRequired"));
      return false;
    }

    // Check if time from is before time to
    const timeFromDate = new Date(
      `${formData.timeFrom.date}T${formData.timeFrom.time}`
    );
    const timeToDate = new Date(
      `${formData.timeTo.date}T${formData.timeTo.time}`
    );

    if (timeFromDate >= timeToDate) {
      setError(t("errors.invalidTimeRange"));
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Combine date and time into ISO strings
      const timeFromISO = `${formData.timeFrom.date}T${formData.timeFrom.time}:00`;
      const timeToISO = `${formData.timeTo.date}T${formData.timeTo.time}:00`;

      // Add deviceId to the form data
      const submitData = {
        ...formData,
        deviceId,
        timeFrom: timeFromISO,
        timeTo: timeToISO,
      };

      const result = await onSubmit(submitData);

      // Show success toast only after successful submission
      toast.success(
        isEditMode
          ? t("toasts.deviceAssignmentUpdated")
          : t("toasts.deviceAssignmentCreated")
      );
    } catch (error: any) {
      console.error("Error submitting form:", error);
      // Show error toast with the message from the API if available
      toast.error(error?.message || t("errors.failedToSubmit"));
      setError(error?.message || t("errors.failedToSubmit"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "ASSIGNED":
        return t("status.assigned");
      case "RETURNED":
        return t("status.returned");
      case "LOST":
        return t("status.lost");
      case "DAMAGED":
        return t("status.damaged");
      default:
        return status;
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 w-full max-w-2xl mx-auto transition-colors duration-200 ease-in-out"
    >
      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded">
          {error}
        </div>
      )}

      {/* User Selection - shown as dropdown in create mode, read-only text in edit mode */}
      <div>
        <label
          htmlFor="userId"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          {t("form.assignedUser")}
        </label>

        {isEditMode ? (
          // In edit mode, show read-only user information
          <div className="mt-1 py-2 px-3 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md text-gray-700 dark:text-gray-300">
            {selectedUserName || t("form.loadingUserInfo")}
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {t("form.userAssignmentWarning")}
            </p>
          </div>
        ) : (
          // In create mode, show dropdown selector
          <select
            id="userId"
            name="userId"
            value={formData.userId}
            onChange={handleChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md text-gray-900 dark:text-gray-100 transition-colors duration-200 ease-in-out"
            required
            disabled={isLoading || isSubmitting}
            aria-label={t("form.assignedUser")}
          >
            <option value="">{t("form.selectUser")}</option>
            {organizers.map((user) => (
              <option key={user.id} value={user.id}>
                {user.firstName} {user.lastName}
              </option>
            ))}
          </select>
        )}

        {!isEditMode && isLoading && (
          <div className="flex items-center mt-2 text-sm text-gray-500 dark:text-gray-400">
            <LoadingSpinner size="sm" showText={false} className="mr-2" />
            {t("form.loadingUsers")}
          </div>
        )}
      </div>

      {/* Time From - date and time */}
      <div>
        <label
          htmlFor="timeFrom.date"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          {t("form.startDateTime")}
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <input
            type="date"
            id="timeFrom.date"
            name="timeFrom.date"
            value={formData.timeFrom.date}
            onChange={handleChange}
            className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900 dark:text-gray-100 transition-colors duration-200 ease-in-out"
            required
            disabled={isSubmitting}
            aria-label={t("form.startDate")}
          />
          <input
            type="time"
            id="timeFrom.time"
            name="timeFrom.time"
            value={formData.timeFrom.time}
            onChange={handleChange}
            className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900 dark:text-gray-100 transition-colors duration-200 ease-in-out"
            required
            disabled={isSubmitting}
            aria-label={t("form.startTime")}
          />
        </div>
      </div>

      {/* Time To - date and time */}
      <div>
        <label
          htmlFor="timeTo.date"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          {t("form.endDateTime")}
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <input
            type="date"
            id="timeTo.date"
            name="timeTo.date"
            value={formData.timeTo.date}
            onChange={handleChange}
            className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900 dark:text-gray-100 transition-colors duration-200 ease-in-out"
            required
            disabled={isSubmitting}
            aria-label={t("form.endDate")}
          />
          <input
            type="time"
            id="timeTo.time"
            name="timeTo.time"
            value={formData.timeTo.time}
            onChange={handleChange}
            className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900 dark:text-gray-100 transition-colors duration-200 ease-in-out"
            required
            disabled={isSubmitting}
            aria-label={t("form.endTime")}
          />
        </div>
      </div>

      {/* Status */}
      <div>
        <label
          htmlFor="status"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          {t("form.status")}
        </label>
        <select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md text-gray-900 dark:text-gray-100 transition-colors duration-200 ease-in-out"
          required
          disabled={isSubmitting}
          aria-label={t("form.status")}
        >
          <option value="ASSIGNED">{t("status.assigned")}</option>
          <option value="RETURNED">{t("status.returned")}</option>
          <option value="LOST">{t("status.lost")}</option>
          <option value="DAMAGED">{t("status.damaged")}</option>
        </select>
      </div>

      {/* File Upload */}
      <div>
        <label
          htmlFor="files"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          {t("form.uploadFiles")}
        </label>
        <input
          type="file"
          id="files"
          name="files"
          onChange={handleFileChange}
          className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900 dark:text-gray-100 transition-colors duration-200 ease-in-out file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900/20 dark:file:text-blue-300"
          multiple
          disabled={isSubmitting}
          aria-label={t("form.uploadFiles")}
        />
        {isEditMode && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {t("form.uploadFilesNote")}
          </p>
        )}
      </div>

      {/* Form Actions */}
      <div className="flex flex-col sm:flex-row justify-end gap-2 sm:space-x-2 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 ease-in-out order-2 sm:order-1"
          disabled={isSubmitting}
        >
          {t("form.cancel")}
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 dark:bg-blue-700 border border-transparent rounded-md shadow-sm hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 ease-in-out w-full sm:w-auto flex justify-center items-center gap-2 order-1 sm:order-2"
          disabled={isSubmitting}
        >
          {isSubmitting && (
            <LoadingSpinner size="sm" showText={false} className="text-white" />
          )}
          {isSubmitting ? t("form.submitting") : submitButtonText}
        </button>
      </div>
    </form>
  );
};

export default UserDeviceForm;
