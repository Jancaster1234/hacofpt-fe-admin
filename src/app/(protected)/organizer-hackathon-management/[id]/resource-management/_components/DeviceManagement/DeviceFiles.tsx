// src/app/(protected)/organizer-hackathon-management/[id]/resource-management/_components/DeviceManagement/DeviceFiles.tsx
import React from "react";
import { FileUrl } from "@/types/entities/fileUrl";
import FilesList from "./FilesList";

interface DeviceFilesProps {
  files: FileUrl[];
  isLoading: boolean;
}

const DeviceFiles: React.FC<DeviceFilesProps> = ({ files, isLoading }) => {
  if (isLoading) {
    return <p className="text-gray-500 ml-8">Loading files...</p>;
  }

  if (files.length === 0) {
    return (
      <p className="text-gray-500 ml-8 italic">
        No files associated with this device
      </p>
    );
  }

  return (
    <div className="ml-8 mt-2">
      <h4 className="font-medium text-sm">Associated Files:</h4>
      <FilesList files={files} />
    </div>
  );
};

export default DeviceFiles;
