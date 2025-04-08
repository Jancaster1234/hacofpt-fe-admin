// src/app/(protected)/organizer-hackathon-management/[id]/resource-management/_components/SponsorshipDetailFiles.tsx
import React, { useState, useEffect } from "react";
import { fetchMockFileUrls } from "../_mocks/fetchMockFileUrls";
import { FileUrl } from "@/types/entities/fileUrl";
import { SponsorshipHackathonDetail } from "@/types/entities/sponsorshipHackathonDetail";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ErrorMessage from "@/components/common/ErrorMessage";
import { formatDate } from "@/utils/dateFormatter";

interface SponsorshipDetailFilesProps {
  sponsorshipHackathonDetailId: string;
  detail: SponsorshipHackathonDetail;
  onBack: () => void;
}

const SponsorshipDetailFiles: React.FC<SponsorshipDetailFilesProps> = ({
  sponsorshipHackathonDetailId,
  detail,
  onBack,
}) => {
  const [files, setFiles] = useState<FileUrl[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadFiles = async () => {
      try {
        setLoading(true);
        const data = await fetchMockFileUrls({
          sponsorshipHackathonDetailId,
        });
        setFiles(data);
        setError(null);
      } catch (err) {
        setError("Failed to load files. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadFiles();
  }, [sponsorshipHackathonDetailId]);

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "PLANNED":
        return "bg-blue-100 text-blue-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getFileTypeIcon = (fileType: string) => {
    if (fileType.startsWith("image/")) {
      return (
        <svg
          className="w-8 h-8 text-blue-500"
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
          className="w-8 h-8 text-red-500"
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
          className="w-8 h-8 text-blue-700"
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
          className="w-8 h-8 text-gray-500"
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

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <button
        onClick={onBack}
        className="mb-4 flex items-center text-blue-600 hover:text-blue-800"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-1"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
            clipRule="evenodd"
          />
        </svg>
        Back to Details
      </button>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">
          Files for {detail.content}
        </h3>
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span
            className={`px-2 py-1 text-xs rounded-full ${getStatusBadgeColor(
              detail.status
            )}`}
          >
            {detail.status}
          </span>
          <span className="text-sm text-gray-500">
            {formatDate(detail.timeFrom)} - {formatDate(detail.timeTo)}
          </span>
          <span className="text-sm text-gray-500">
            ${detail.moneySpent.toLocaleString()} spent
          </span>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <h4 className="text-md font-medium">Related Files</h4>
        <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700">
          Upload New File
        </button>
      </div>

      {files.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No files found for this detail.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {files.map((file) => (
            <div key={file.id} className="border rounded-lg p-4 flex flex-col">
              <div className="flex items-center mb-3">
                {getFileTypeIcon(file.fileType)}
                <div className="ml-3">
                  <p className="font-medium truncate" title={file.fileName}>
                    {file.fileName}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(file.fileSize / 1024).toFixed(0)} KB
                  </p>
                </div>
              </div>
              <div className="text-xs text-gray-500 mb-4">
                Uploaded by {file.createdByUserName} on{" "}
                {formatDate(file.createdAt)}
              </div>
              <div className="mt-auto flex justify-end gap-2">
                <a
                  href={file.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded hover:bg-gray-200"
                >
                  Download
                </a>
                <button className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded hover:bg-red-200">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SponsorshipDetailFiles;
