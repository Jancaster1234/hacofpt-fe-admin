// src/app/[locale]/hackathon/[id]/team/[teamId]/board/_components/TaskEdit/TaskAttachments.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { FileUrl } from "@/types/entities/fileUrl";
import { formatDistance } from "date-fns";
import { fileUrlService } from "@/services/fileUrl.service";
import { taskService } from "@/services/task.service";
import { useTranslations } from "@/hooks/useTranslations";
import { useToast } from "@/hooks/use-toast";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

interface TaskAttachmentsProps {
  files: FileUrl[];
  taskId: string;
  onAddFile?: (file: FileUrl | FileUrl[]) => void;
  onRemoveFile?: (fileId: string) => void;
  onError?: (error: string) => void;
}

export default function TaskAttachments({
  files,
  taskId,
  onAddFile,
  onRemoveFile,
  onError,
}: TaskAttachmentsProps) {
  const t = useTranslations("taskEdit");
  const toast = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [isRemoving, setIsRemoving] = useState<string | null>(null);

  const handleFileUpload = async (selectedFiles: File[]) => {
    if (!selectedFiles.length) return;

    try {
      setIsUploading(true);
      toast.info(t("attachments.uploading"));

      // 1. Upload files to get FileUrl objects
      const { data: uploadedFiles, message } =
        await fileUrlService.uploadMultipleFilesCommunication(selectedFiles);

      if (!uploadedFiles || uploadedFiles.length === 0) {
        throw new Error(message || t("attachments.uploadFailed"));
      }

      // 2. Get the fileUrl strings from the response
      const fileUrls = uploadedFiles.map((file) => file.fileUrl);

      // 3. Associate files with the task
      const { data: allTaskFiles, message: taskFilesMessage } =
        await taskService.createTaskFiles(taskId, fileUrls);

      // 4. Filter out newly added files by comparing URLs with existing files
      if (allTaskFiles && allTaskFiles.length > 0) {
        const existingFileUrls = files.map((file) => file.fileUrl);
        const newlyAddedFiles = allTaskFiles.filter(
          (file) => !existingFileUrls.includes(file.fileUrl)
        );

        // 5. Notify parent component if callback is provided
        if (newlyAddedFiles.length > 0 && onAddFile) {
          onAddFile(newlyAddedFiles);
          toast.success(t("attachments.uploadSuccess"));
        }
      }

      return allTaskFiles;
    } catch (error: any) {
      console.error("Error uploading files:", error);
      const errorMessage = error.message || t("attachments.uploadFailed");
      if (onError) onError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveFile = async (fileId: string) => {
    try {
      setIsRemoving(fileId);
      const { message } = await fileUrlService.deleteFileUrl(fileId);

      if (onRemoveFile) {
        onRemoveFile(fileId);
        toast.success(t("attachments.removeSuccess"));
      }
    } catch (error: any) {
      console.error("Error removing file:", error);
      const errorMessage = error.message || t("attachments.removeFailed");
      if (onError) onError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsRemoving(null);
    }
  };

  // Always render the component, even with no files
  return (
    <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md transition-colors duration-300">
      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 flex items-center">
        <span className="mr-2">📎</span>
        {t("attachments.title")} ({files.length})
      </h3>

      {files.length > 0 && (
        <div className="space-y-2 max-h-[300px] overflow-y-auto sm:max-h-[400px] scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
          {files.map((file) => (
            <div
              key={file.id}
              className="flex flex-wrap sm:flex-nowrap items-center border-b border-gray-200 dark:border-gray-700 pb-2 transition-colors duration-300"
            >
              {/* File preview/icon */}
              <div className="mr-3 mt-1">
                {file.fileType.startsWith("image/") ? (
                  <div className="relative w-10 h-10 rounded overflow-hidden">
                    <Image
                      src={file.fileUrl}
                      alt={file.fileName}
                      fill
                      sizes="(max-width: 640px) 40px, 40px"
                      className="object-cover rounded"
                    />
                  </div>
                ) : (
                  <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 flex items-center justify-center rounded transition-colors duration-300">
                    <span className="text-xs text-gray-700 dark:text-gray-300">
                      {t("attachments.file")}
                    </span>
                  </div>
                )}
              </div>

              {/* File details */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row justify-between">
                  <span className="font-medium text-sm text-gray-800 dark:text-gray-200 truncate transition-colors duration-300">
                    {file.fileName}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 sm:ml-2 transition-colors duration-300">
                    {formatDistance(
                      new Date(file.createdAt || ""),
                      new Date(),
                      {
                        addSuffix: true,
                      }
                    )}
                  </span>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300">
                  {(file.fileSize / 1024).toFixed(1)} KB
                </div>
                <div className="mt-1 flex space-x-2">
                  <a
                    href={file.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-500 dark:text-blue-400 hover:underline transition-colors duration-300"
                  >
                    {t("attachments.download")}
                  </a>
                  <button
                    onClick={() => handleRemoveFile(file.id)}
                    disabled={isRemoving === file.id}
                    className="text-xs text-red-500 dark:text-red-400 hover:underline disabled:opacity-50 transition-colors duration-300 flex items-center"
                  >
                    {isRemoving === file.id ? (
                      <>
                        <LoadingSpinner
                          size="sm"
                          className="mr-1"
                          showText={false}
                        />
                        {t("attachments.removing")}
                      </>
                    ) : (
                      t("attachments.remove")
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {files.length === 0 && !isUploading && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 transition-colors duration-300">
          {t("attachments.noAttachments")}
        </p>
      )}

      {isUploading && (
        <div className="flex items-center justify-center py-2">
          <LoadingSpinner size="sm" />
          <span className="ml-2 text-sm text-gray-600 dark:text-gray-300 transition-colors duration-300">
            {t("attachments.uploading")}
          </span>
        </div>
      )}

      <div className="mt-3">
        <label className="cursor-pointer inline-block">
          <div className="px-3 py-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded text-sm text-gray-800 dark:text-gray-200 transition-colors duration-300">
            {t("attachments.addButton")}
          </div>
          <input
            type="file"
            className="hidden"
            multiple
            disabled={isUploading}
            onChange={(e) => {
              const files = e.target.files ? Array.from(e.target.files) : [];
              if (files.length > 0) handleFileUpload(files);
            }}
            aria-label={t("attachments.addButton")}
          />
        </label>
      </div>
    </div>
  );
}
