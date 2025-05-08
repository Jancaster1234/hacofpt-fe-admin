// src/app/[locale]/(protected)/organizer-hackathon-management/[id]/resource-management/_components/SponsorshipDetailFiles.tsx
import React, { useState, useEffect } from "react";
import { FileUrl } from "@/types/entities/fileUrl";
import { SponsorshipHackathonDetail } from "@/types/entities/sponsorshipHackathonDetail";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ErrorMessage from "@/components/common/ErrorMessage";
import { formatDate } from "@/utils/dateFormatter";
import { fileUrlService } from "@/services/fileUrl.service";
import { sponsorshipHackathonDetailService } from "@/services/sponsorshipHackathonDetail.service";
import { useToast } from "@/hooks/use-toast";
import { useTranslations } from "@/hooks/useTranslations";
import Image from "next/image";

interface SponsorshipDetailFilesProps {
  sponsorshipHackathonDetailId: string;
  detail: SponsorshipHackathonDetail;
  onBack: () => void;
  isCreator: boolean;
}

const SponsorshipDetailFiles: React.FC<SponsorshipDetailFilesProps> = ({
  sponsorshipHackathonDetailId,
  detail,
  onBack,
  isCreator,
}) => {
  const t = useTranslations("sponsorshipFiles");
  const [files, setFiles] = useState<FileUrl[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [uploading, setUploading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const toast = useToast();

  useEffect(() => {
    loadFiles();
    // Don't include toast in dependency array to avoid loops
  }, [sponsorshipHackathonDetailId]);

  const loadFiles = async () => {
    try {
      setLoading(true);
      const response =
        await fileUrlService.getFileUrlsBySponsorshipHackathonDetailId(
          sponsorshipHackathonDetailId
        );

      if (response.data) {
        setFiles(response.data);
      }
      setError(null);
    } catch (err) {
      setError(t("failedToLoadFiles"));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!isCreator) {
      toast.warning(t("onlyCreatorCanUpload"));
      return;
    }

    const selectedFiles = event.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;

    try {
      setUploadError(null);
      setUploading(true);
      toast.info(t("uploading"));

      // Upload the files to communication service
      const filesArray = Array.from(selectedFiles);
      const uploadResponse =
        await fileUrlService.uploadMultipleFilesCommunication(filesArray);

      if (!uploadResponse.data || uploadResponse.data.length === 0) {
        throw new Error(uploadResponse.message || t("failedToUploadFiles"));
      }

      // Get file URLs from the response
      const fileUrls = uploadResponse.data.map((file) => file.fileUrl);

      // Create sponsorship hackathon detail files
      const detailFilesResponse =
        await sponsorshipHackathonDetailService.createSponsorshipHackathonDetailFiles(
          sponsorshipHackathonDetailId,
          fileUrls
        );

      if (detailFilesResponse.data) {
        // Show success toast with response message
        toast.success(
          detailFilesResponse.message || t("filesUploadedSuccessfully")
        );

        // Refresh files list
        loadFiles();
      }

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err: any) {
      const errorMessage = err.message || t("failedToUploadFiles");
      setUploadError(errorMessage);
      toast.error(errorMessage);
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleDeleteFile = async (fileId: string) => {
    if (!isCreator) {
      toast.warning(t("onlyCreatorCanDelete"));
      return;
    }

    if (!window.confirm(t("confirmDeleteFile"))) {
      return;
    }

    try {
      setLoading(true);
      const response = await fileUrlService.deleteFileUrl(fileId);

      // Show success toast with response message
      toast.success(response.message || t("fileDeletedSuccessfully"));

      // Refresh the files list
      loadFiles();
    } catch (err: any) {
      const errorMessage = err.message || t("failedToDeleteFile");
      setError(errorMessage);
      toast.error(errorMessage);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "PLANNED":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "CANCELLED":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
    }
  };

  const getFileTypeIcon = (fileType: string) => {
    if (fileType.startsWith("image/")) {
      return (
        <svg
          className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500 dark:text-blue-400"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
            clipRule="evenodd"
          />
        </svg>
      );
    } else if (fileType.includes("pdf")) {
      return (
        <svg
          className="w-6 h-6 sm:w-8 sm:h-8 text-red-500 dark:text-red-400"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
            clipRule="evenodd"
          />
        </svg>
      );
    } else if (fileType.includes("word") || fileType.includes("doc")) {
      return (
        <svg
          className="w-6 h-6 sm:w-8 sm:h-8 text-blue-700 dark:text-blue-500"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
            clipRule="evenodd"
          />
        </svg>
      );
    } else {
      return (
        <svg
          className="w-6 h-6 sm:w-8 sm:h-8 text-gray-500 dark:text-gray-400"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
            clipRule="evenodd"
          />
        </svg>
      );
    }
  };

  if (loading && !uploading) {
    return <LoadingSpinner size="md" showText={true} />;
  }

  if (error && !uploading) {
    return <ErrorMessage message={error} />;
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 sm:p-6 transition-colors duration-200">
      <button
        onClick={onBack}
        className="mb-4 flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 rounded-md"
        aria-label={t("backToDetails")}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 h-4 sm:h-5 sm:w-5 mr-1"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
            clipRule="evenodd"
          />
        </svg>
        {t("backToDetails")}
      </button>

      <div className="mb-6">
        <h3 className="text-base sm:text-lg font-semibold mb-2 dark:text-white">
          {t("filesFor")} {detail.content}
        </h3>
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span
            className={`px-2 py-1 text-xs rounded-full ${getStatusBadgeColor(
              detail.status
            )} transition-colors duration-200`}
          >
            {t(detail.status.toLowerCase())}
          </span>
          <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            {formatDate(detail.timeFrom)} - {formatDate(detail.timeTo)}
          </span>
          <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            (VND) {detail.moneySpent.toLocaleString()} {t("spent")}
          </span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
        <h4 className="text-sm sm:text-md font-medium dark:text-white">
          {t("relatedFiles")}
        </h4>
        {isCreator && (
          <div>
            <input
              type="file"
              multiple
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
              aria-label={t("uploadFile")}
            />
            <button
              className={`px-3 py-1 ${
                uploading
                  ? "bg-gray-400 dark:bg-gray-600"
                  : "bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
              } text-white text-xs sm:text-sm rounded-md flex items-center transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400`}
              onClick={handleUploadClick}
              disabled={uploading}
              aria-busy={uploading}
            >
              {uploading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-3 w-3 sm:h-4 sm:w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  {t("uploading")}
                </>
              ) : (
                t("uploadNewFile")
              )}
            </button>
          </div>
        )}
      </div>

      {uploadError && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded text-sm transition-colors duration-200">
          {uploadError}
        </div>
      )}

      {files.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">
            {t("noFilesFound")}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {files.map((file) => (
            <div
              key={file.id}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 sm:p-4 flex flex-col bg-white dark:bg-gray-800 hover:shadow-md transition-shadow duration-200"
              aria-label={file.fileName}
            >
              <div className="flex items-center mb-3">
                {getFileTypeIcon(file.fileType)}
                <div className="ml-2 sm:ml-3 overflow-hidden">
                  <p
                    className="font-medium text-sm sm:text-base truncate dark:text-white"
                    title={file.fileName}
                  >
                    {file.fileName}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {(file.fileSize / 1024).toFixed(0)} KB
                  </p>
                </div>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                {t("uploadedBy")} {file.createdByUserName} {t("on")}{" "}
                {formatDate(file.createdAt)}
              </div>
              <div className="mt-auto flex justify-end gap-2">
                <a
                  href={file.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-xs rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400"
                  aria-label={`${t("download")} ${file.fileName}`}
                >
                  {t("download")}
                </a>
                {isCreator && (
                  <button
                    onClick={() => handleDeleteFile(file.id)}
                    className="px-2 py-1 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 text-xs rounded hover:bg-red-200 dark:hover:bg-red-800 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400"
                    aria-label={`${t("delete")} ${file.fileName}`}
                  >
                    {t("delete")}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SponsorshipDetailFiles;
