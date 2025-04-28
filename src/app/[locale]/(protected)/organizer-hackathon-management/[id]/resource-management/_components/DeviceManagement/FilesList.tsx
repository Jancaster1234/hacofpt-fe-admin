// src/app/[locale]/(protected)/organizer-hackathon-management/[id]/resource-management/_components/DeviceManagement/FilesList.tsx
import React from "react";
import { FileUrl } from "@/types/entities/fileUrl";
import Image from "next/image";
import {
  formatFileSize,
  formatDate,
  getFileIcon,
} from "../../_utils/formatters";
import { useTranslations } from "@/hooks/useTranslations";

interface FilesListProps {
  files: FileUrl[];
  compact?: boolean;
}

const FilesList: React.FC<FilesListProps> = ({ files, compact = false }) => {
  const t = useTranslations("filesList");

  if (compact) {
    return (
      <ul className="grid grid-cols-1 xs:grid-cols-2 gap-2 mt-1 transition-colors duration-200">
        {files.map((file) => (
          <li
            key={file.id}
            className="flex items-center p-2 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex-shrink-0 h-8 w-8 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center transition-colors duration-200">
              {getFileIcon(file.fileType)}
            </div>
            <div className="ml-2 overflow-hidden">
              <p className="text-xs font-medium text-gray-900 dark:text-gray-100 truncate transition-colors duration-200">
                {file.fileName}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-200">
                {formatFileSize(file.fileSize)}
              </p>
            </div>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <ul className="divide-y divide-gray-200 dark:divide-gray-700 transition-colors duration-200">
      {files.map((file) => (
        <li
          key={file.id}
          className="py-2 md:py-3 flex items-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
        >
          <div className="flex-shrink-0 h-10 w-10 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center transition-colors duration-200">
            {getFileIcon(file.fileType)}
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 transition-colors duration-200">
              {file.fileName}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-200">
              {formatFileSize(file.fileSize)} • {formatDate(file.createdAt)}
            </p>
          </div>
          <div className="ml-auto">
            <a
              href="#"
              aria-label={t("download")}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 p-2 rounded transition-colors duration-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
            </a>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default FilesList;
