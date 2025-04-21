// src/app/(protected)/organizer-hackathon-management/[id]/resource-management/_components/DeviceManagement/UserDeviceForm.tsx
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
  const [formData, setFormData] = useState({
    userId: initialData?.userId || "",
    timeFrom: initialData?.timeFrom || new Date().toISOString().split("T")[0],
    timeTo: initialData?.timeTo || "",
    status: initialData?.status || "ASSIGNED",
    files: [] as File[],
  });

  const [organizers, setOrganizers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrganizers();
  }, []);

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
    setFormData({ ...formData, [name]: value });
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
      // Add deviceId to the form data
      const submitData = {
        ...formData,
        deviceId,
      };

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

      {/* User Selection */}
      <div>
        <label
          htmlFor="userId"
          className="block text-sm font-medium text-gray-700"
        >
          Assigned User
        </label>
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
        {isLoading && (
          <p className="text-sm text-gray-500 mt-1">Loading users...</p>
        )}
      </div>

      {/* Time From */}
      <div>
        <label
          htmlFor="timeFrom"
          className="block text-sm font-medium text-gray-700"
        >
          Start Date
        </label>
        <input
          type="date"
          id="timeFrom"
          name="timeFrom"
          value={formData.timeFrom}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          required
          disabled={isSubmitting}
        />
      </div>

      {/* Time To */}
      <div>
        <label
          htmlFor="timeTo"
          className="block text-sm font-medium text-gray-700"
        >
          End Date
        </label>
        <input
          type="date"
          id="timeTo"
          name="timeTo"
          value={formData.timeTo}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          required
          disabled={isSubmitting}
        />
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
