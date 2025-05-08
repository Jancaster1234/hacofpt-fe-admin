// src/app/[locale]/(protected)/organizer-hackathon-management/[id]/resource-management/_components/DeviceManagement/UserDeviceTrackForm.tsx
import React, { useState } from "react";
import { UserDevice } from "@/types/entities/userDevice";
import { FileUploader } from "../../../../../../../../components/common/FileUploader";
import { useTranslations } from "@/hooks/useTranslations";
import { useToast } from "@/hooks/use-toast";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

interface UserDeviceTrackFormProps {
  userDeviceId: string;
  initialData?: {
    deviceQualityStatus?: "GOOD" | "FAIR" | "DAMAGED" | "REPAIRED";
    note?: string;
  };
  onSubmit: (formData: {
    userDeviceId: string;
    deviceQualityStatus: "GOOD" | "FAIR" | "DAMAGED" | "REPAIRED";
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
  const t = useTranslations("deviceManagement");
  const toast = useToast();

  const [deviceQualityStatus, setDeviceQualityStatus] = useState<
    "GOOD" | "FAIR" | "DAMAGED" | "REPAIRED"
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
      toast.success(t("deviceStatusUpdateSuccess"));
    } catch (err: any) {
      const errorMessage = err.message || t("deviceStatusUpdateError");
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (newFiles: File[]) => {
    setFiles(newFiles);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 transition-colors duration-300"
    >
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {t("deviceQualityStatus")}
        </label>
        <select
          value={deviceQualityStatus}
          onChange={(e) => setDeviceQualityStatus(e.target.value as any)}
          className="w-full border-gray-300 dark:border-gray-700 rounded-md shadow-sm 
          focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white
          transition-colors duration-300"
          required
        >
          <option value="GOOD">{t("good")}</option>
          <option value="FAIR">{t("fair")}</option>
          <option value="DAMAGED">{t("damaged")}</option>
          <option value="REPAIRED">{t("repaired")}</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {t("note")}
        </label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-full border-gray-300 dark:border-gray-700 rounded-md shadow-sm 
          focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white
          transition-colors duration-300"
          rows={3}
          placeholder={t("addNoteAboutDevice")}
        ></textarea>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {t("attachFiles")}
        </label>
        <FileUploader
          onFilesChange={handleFileChange}
          maxFileSize={5 * 1024 * 1024} // 5MB
          acceptedFileTypes=".jpg,.jpeg,.png,.pdf,.doc,.docx"
          multiple={true}
        />
      </div>

      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm rounded transition-colors duration-300">
          {error}
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm 
          text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 
          hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300"
          disabled={isSubmitting}
        >
          {t("cancel")}
        </button>
        <button
          type="submit"
          className="px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium 
          text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 
          dark:focus:ring-offset-gray-800 transition-colors duration-300"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center">
              <LoadingSpinner size="sm" className="mr-2" />
              <span>{t("submitting")}</span>
            </div>
          ) : (
            submitButtonText
          )}
        </button>
      </div>
    </form>
  );
};

export default UserDeviceTrackForm;
