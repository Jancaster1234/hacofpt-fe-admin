// src/components/FileDownloader.tsx
import React from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";

interface FileInfo {
  id: string;
  fileUrl: string;
  fileName: string;
}

interface FileDownloaderProps {
  files: FileInfo[];
  zipName?: string;
  className?: string;
}

export const FileDownloader: React.FC<FileDownloaderProps> = ({
  files,
  zipName = "submission-files.zip",
  className = "text-blue-600 hover:underline cursor-pointer",
}) => {
  // Download a single file
  const downloadSingleFile = async (fileUrl: string, fileName: string) => {
    try {
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      saveAs(blob, fileName);
    } catch (error) {
      console.error("Error downloading file:", error);
      alert("Failed to download file. Please try again later.");
    }
  };

  // Download multiple files as a zip
  const downloadFilesAsZip = async () => {
    if (files.length === 0) return;

    try {
      const zip = new JSZip();

      // Add each file to the zip
      const filePromises = files.map(async (file) => {
        try {
          const response = await fetch(file.fileUrl);
          const blob = await response.blob();
          zip.file(file.fileName, blob);
          return true;
        } catch (error) {
          console.error(`Error fetching file ${file.fileName}:`, error);
          return false;
        }
      });

      // Wait for all files to be processed
      await Promise.all(filePromises);

      // Generate the zip file
      const zipBlob = await zip.generateAsync({ type: "blob" });
      saveAs(zipBlob, zipName);
    } catch (error) {
      console.error("Error creating zip file:", error);
      alert("Failed to download files. Please try again later.");
    }
  };

  // Handle click based on number of files
  const handleDownloadClick = () => {
    if (files.length === 1) {
      downloadSingleFile(files[0].fileUrl, files[0].fileName);
    } else if (files.length > 1) {
      downloadFilesAsZip();
    }
  };

  return (
    <span className={className} onClick={handleDownloadClick}>
      {files.length === 0
        ? "No files"
        : files.length === 1
        ? "Download file"
        : "Download all files"}
    </span>
  );
};
