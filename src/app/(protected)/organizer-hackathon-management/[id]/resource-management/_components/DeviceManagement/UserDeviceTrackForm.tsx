// src/app/(protected)/organizer-hackathon-management/[id]/resource-management/_components/DeviceManagement/UserDeviceTrackForm.tsx
import React, { useState } from "react";
import { UserDevice } from "@/types/entities/userDevice";
import { FileUploader } from "../../../../../../../components/common/FileUploader";

interface UserDeviceTrackFormProps {
  userDeviceId: string;
  initialData?: {
    deviceQualityStatus?:
      | "EXCELLENT"
      | "GOOD"
      | "FAIR"
      | "DAMAGED"
      | "NEEDS_REPAIR"
      | "REPAIRING"
      | "REPAIRED"
      | "LOST";
    note?: string;
  };
  onSubmit: (formData: {
    userDeviceId: string;
    deviceQualityStatus:
      | "EXCELLENT"
      | "GOOD"
      | "FAIR"
      | "DAMAGED"
      | "NEEDS_REPAIR"
      | "REPAIRING"
      | "REPAIRED"
      | "LOST";
    note: string;
    files: File[];
  }) => Promise<void>;
  onCancel: () => void;
  submitButtonText: string;
}

const UserDeviceTrackForm: React.FC<UserDeviceTrackFormProps> = ({
  userDeviceId,
  initialData = {},
  onSubmit,
  onCancel,
  submitButtonText,
}) => {
  const [deviceQualityStatus, setDeviceQualityStatus] = useState<
    | "EXCELLENT"
    | "GOOD"
    | "FAIR"
    | "DAMAGED"
    | "NEEDS_REPAIR"
    | "REPAIRING"
    | "REPAIRED"
    | "LOST"
  >(initialData.deviceQualityStatus || "GOOD");
  const [note, setNote] = useState<string>(initialData.note || "");
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await onSubmit({
        userDeviceId,
        deviceQualityStatus,
        note,
        files,
      });
    } catch (err: any) {
      setError(err.message || "Failed to submit form. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (newFiles: File[]) => {
    setFiles(newFiles);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Device Quality Status
        </label>
        <select
          value={deviceQualityStatus}
          onChange={(e) => setDeviceQualityStatus(e.target.value as any)}
          className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          required
        >
          <option value="EXCELLENT">Excellent</option>
          <option value="GOOD">Good</option>
          <option value="FAIR">Fair</option>
          <option value="DAMAGED">Damaged</option>
          <option value="NEEDS_REPAIR">Needs Repair</option>
          <option value="REPAIRING">Repairing</option>
          <option value="REPAIRED">Repaired</option>
          <option value="LOST">Lost</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Note
        </label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          rows={3}
          placeholder="Add any additional notes about the device condition"
        ></textarea>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Attach Files
        </label>
        <FileUploader
          onFilesChange={handleFileChange}
          maxFileSize={5 * 1024 * 1024} // 5MB
          acceptedFileTypes=".jpg,.jpeg,.png,.pdf,.doc,.docx"
          multiple={true}
        />
      </div>

      {error && (
        <div className="p-3 bg-red-50 text-red-600 text-sm rounded">
          {error}
        </div>
      )}

      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : submitButtonText}
        </button>
      </div>
    </form>
  );
};

export default UserDeviceTrackForm;
