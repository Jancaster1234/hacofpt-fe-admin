// src/app/[locale]/(protected)/organizer-hackathon-management/[id]/resource-management/_components/DeviceManagement/UserDeviceForm.tsx
import React, { useState, useEffect } from "react";
import { User } from "@/types/entities/user";
import { UserHackathon } from "@/types/entities/userHackathon";
import { userHackathonService } from "@/services/userHackathon.service";

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
      setError("Failed to load organizers. Please try again.");
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

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
      console.log(
        "🔹🔹🔹🔹🔹🔹🔹🔹🔹🔹🔹🔹🔹🔹🔹🔹🔹🔹🔹Submitting form data:",
        submitData
      );
      await onSubmit(submitData);
    } catch (error) {
      console.error("Error submitting form:", error);
      setError("Failed to submit form. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 text-red-600 text-sm rounded">
          {error}
        </div>
      )}

      {/* User Selection - shown as dropdown in create mode, read-only text in edit mode */}
      <div>
        <label
          htmlFor="userId"
          className="block text-sm font-medium text-gray-700"
        >
          Assigned User
        </label>

        {isEditMode ? (
          // In edit mode, show read-only user information
          <div className="mt-1 py-2 px-3 bg-gray-100 border border-gray-300 rounded-md text-gray-700">
            {selectedUserName || "Loading user information..."}
            <p className="text-xs text-gray-500 mt-1">
              User assignments cannot be changed after creation
            </p>
          </div>
        ) : (
          // In create mode, show dropdown selector
          <select
            id="userId"
            name="userId"
            value={formData.userId}
            onChange={handleChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            required
            disabled={isLoading || isSubmitting}
          >
            <option value="">Select a user</option>
            {organizers.map((user) => (
              <option key={user.id} value={user.id}>
                {user.firstName} {user.lastName}
              </option>
            ))}
          </select>
        )}

        {!isEditMode && isLoading && (
          <p className="text-sm text-gray-500 mt-1">Loading users...</p>
        )}
      </div>

      {/* Time From - date and time */}
      <div>
        <label
          htmlFor="timeFrom.date"
          className="block text-sm font-medium text-gray-700"
        >
          Start Date & Time
        </label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="date"
            id="timeFrom.date"
            name="timeFrom.date"
            value={formData.timeFrom.date}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
            disabled={isSubmitting}
          />
          <input
            type="time"
            id="timeFrom.time"
            name="timeFrom.time"
            value={formData.timeFrom.time}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
            disabled={isSubmitting}
          />
        </div>
      </div>

      {/* Time To - date and time */}
      <div>
        <label
          htmlFor="timeTo.date"
          className="block text-sm font-medium text-gray-700"
        >
          End Date & Time
        </label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="date"
            id="timeTo.date"
            name="timeTo.date"
            value={formData.timeTo.date}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
            disabled={isSubmitting}
          />
          <input
            type="time"
            id="timeTo.time"
            name="timeTo.time"
            value={formData.timeTo.time}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
            disabled={isSubmitting}
          />
        </div>
      </div>

      {/* Status */}
      <div>
        <label
          htmlFor="status"
          className="block text-sm font-medium text-gray-700"
        >
          Status
        </label>
        <select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          required
          disabled={isSubmitting}
        >
          <option value="ASSIGNED">Assigned</option>
          <option value="RETURNED">Returned</option>
          <option value="LOST">Lost</option>
          <option value="DAMAGED">Damaged</option>
        </select>
      </div>

      {/* File Upload */}
      <div>
        <label
          htmlFor="files"
          className="block text-sm font-medium text-gray-700"
        >
          Upload Files (optional)
        </label>
        <input
          type="file"
          id="files"
          name="files"
          onChange={handleFileChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          multiple
          disabled={isSubmitting}
        />
        {isEditMode && (
          <p className="text-xs text-gray-500 mt-1">
            Upload new files to add to this assignment. Existing files will be
            preserved.
          </p>
        )}
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : submitButtonText}
        </button>
      </div>
    </form>
  );
};

export default UserDeviceForm;
