// src/components/common/FileUploader.tsx
import React, { useState, useRef } from "react";

interface FileUploaderProps {
  onFilesChange: (files: File[]) => void;
  maxFileSize?: number; // in bytes
  acceptedFileTypes?: string; // e.g. ".jpg,.jpeg,.png,.pdf"
  multiple?: boolean;
  initialFiles?: File[];
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  onFilesChange,
  maxFileSize = 5 * 1024 * 1024, // 5MB default
  acceptedFileTypes = "",
  multiple = false,
  initialFiles = [],
}) => {
  const [files, setFiles] = useState<File[]>(initialFiles);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);

    if (!e.target.files || e.target.files.length === 0) {
      return;
    }

    const selectedFiles = Array.from(e.target.files);

    // Validate file size
    const oversizedFiles = selectedFiles.filter(
      (file) => file.size > maxFileSize
    );
    if (oversizedFiles.length > 0) {
      setError(
        `Some files exceed the maximum size of ${formatFileSize(maxFileSize)}`
      );
      return;
    }

    const newFiles = multiple ? [...files, ...selectedFiles] : selectedFiles;
    setFiles(newFiles);
    onFilesChange(newFiles);

    // Reset the input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeFile = (index: number) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
    onFilesChange(newFiles);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-center w-full">
        <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg
              className="w-8 h-8 mb-2 text-gray-500"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 16"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
              />
            </svg>
            <p className="mb-1 text-sm text-gray-500">
              <span className="font-semibold">Click to upload</span> or drag and
              drop
            </p>
            <p className="text-xs text-gray-500">
              {acceptedFileTypes
                ? `Accepted file types: ${acceptedFileTypes
                    .split(",")
                    .join(", ")}`
                : "All file types supported"}
            </p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileChange}
            accept={acceptedFileTypes}
            multiple={multiple}
          />
        </label>
      </div>

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

      {files.length > 0 && (
        <div className="mt-2">
          <p className="text-sm font-medium text-gray-700 mb-1">
            Selected Files:
          </p>
          <ul className="space-y-1">
            {files.map((file, index) => (
              <li
                key={`${file.name}-${index}`}
                className="flex justify-between items-center text-sm bg-gray-50 p-2 rounded"
              >
                <div className="flex items-center">
                  <span className="truncate max-w-xs">{file.name}</span>
                  <span className="ml-2 text-xs text-gray-500">
                    ({formatFileSize(file.size)})
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
