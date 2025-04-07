// src/app/(protected)/organizer-hackathon-management/[id]/resource-management/_components/DeviceManagement/FilesList.tsx
import React from "react";
import { FileUrl } from "@/types/entities/fileUrl";
import {
  formatFileSize,
  formatDate,
  getFileIcon,
} from "../../_utils/formatters";

interface FilesListProps {
  files: FileUrl[];
  compact?: boolean;
}

const FilesList: React.FC<FilesListProps> = ({ files, compact = false }) => {
  if (compact) {
    return (
      <ul className="grid grid-cols-2 gap-2 mt-1">
        {files.map((file) => (
          <li
            key={file.id}
            className="flex items-center p-2 bg-white rounded border border-gray-200"
          >
            <div className="flex-shrink-0 h-8 w-8 bg-gray-100 rounded flex items-center justify-center">
              {getFileIcon(file.fileType)}
            </div>
            <div className="ml-2 overflow-hidden">
              <p className="text-xs font-medium text-gray-900 truncate">
                {file.fileName}
              </p>
              <p className="text-xs text-gray-500">
                {formatFileSize(file.fileSize)}
              </p>
            </div>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <ul className="divide-y divide-gray-200">
      {files.map((file) => (
        <li key={file.id} className="py-2 flex items-center">
          <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded flex items-center justify-center">
            {getFileIcon(file.fileType)}
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">{file.fileName}</p>
            <p className="text-xs text-gray-500">
              {formatFileSize(file.fileSize)} • {formatDate(file.createdAt)}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default FilesList;
