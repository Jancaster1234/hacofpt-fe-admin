// src/app/[locale]/(protected)/organizer-hackathon-management/[id]/resource-management/_components/DeviceManagement/DeviceFiles.tsx
import React from "react";
import { FileUrl } from "@/types/entities/fileUrl";
import FilesList from "./FilesList";
import { useTranslations } from "@/hooks/useTranslations";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

interface DeviceFilesProps {
  files: FileUrl[];
  isLoading: boolean;
}

const DeviceFiles: React.FC<DeviceFilesProps> = ({ files, isLoading }) => {
  const t = useTranslations("deviceManagement");

  if (isLoading) {
    return (
      <div className="flex items-center text-gray-500 dark:text-gray-400 ml-4 sm:ml-8 mt-4 transition-colors duration-200">
        <LoadingSpinner size="sm" className="mr-2" />
        <p>{t("loadingFiles")}</p>
      </div>
    );
  }

  if (files.length === 0) {
    return (
      <p className="text-gray-500 dark:text-gray-400 ml-4 sm:ml-8 mt-4 italic transition-colors duration-200">
        {t("noFilesAssociated")}
      </p>
    );
  }

  return (
    <div className="ml-4 sm:ml-8 mt-4 transition-all duration-200">
      <h4 className="font-medium text-sm text-gray-800 dark:text-gray-200 mb-2 transition-colors duration-200">
        {t("associatedFiles")}:
      </h4>
      <FilesList files={files} />
    </div>
  );
};

export default DeviceFiles;
