"use client";

import { useState } from "react";
import Image from "next/image";
import { FaImage, FaUpload } from "react-icons/fa";
import { fileUrlService } from "@/services/fileUrl.service";
import { useTranslations } from "@/hooks/useTranslations";
import { useToast } from "@/hooks/use-toast";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

interface HackathonCreateBannerProps {
  bannerImageUrl: string;
  onBannerUpdate: (url: string) => void;
}

export default function HackathonCreateBanner({
  bannerImageUrl,
  onBannerUpdate,
}: HackathonCreateBannerProps) {
  const t = useTranslations("createHackathon");
  const toast = useToast();
  const [isUploading, setIsUploading] = useState(false);

  // Handle Banner Image Upload
  const handleBannerUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
      toast.error(t("imageTypeError"));
      return;
    }

    setIsUploading(true);
    toast.info(t("uploadingBanner"));

    try {
      const response = await fileUrlService.uploadMultipleFilesCommunication([
        file,
      ]);

      if (response.data && response.data.length > 0) {
        onBannerUpdate(response.data[0].fileUrl);
        toast.success(response.message || t("bannerUploadSuccess"));
      } else {
        throw new Error("No file URL returned from server");
      }
    } catch (error) {
      console.error("Error uploading banner image:", error);
      toast.error(
        error instanceof Error ? error.message : t("bannerUploadError")
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="relative w-full aspect-[16/9] bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden mb-4 transition-colors duration-300 shadow-md">
      {bannerImageUrl ? (
        <>
          <div className="relative w-full h-full">
            <Image
              src={bannerImageUrl}
              alt={t("hackathonBannerAlt")}
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="absolute bottom-0 right-0 p-2 sm:p-3">
            <label
              htmlFor="banner-upload"
              className="cursor-pointer flex items-center gap-1 sm:gap-2 bg-white dark:bg-gray-800 bg-opacity-80 dark:bg-opacity-80 px-2 sm:px-3 py-1 sm:py-2 rounded-md shadow-md hover:bg-opacity-100 dark:hover:bg-opacity-100 transition-all text-xs sm:text-sm text-gray-800 dark:text-gray-200"
            >
              <FaUpload className="text-gray-600 dark:text-gray-300" />
              {t("changeBanner")}
            </label>
            <input
              id="banner-upload"
              type="file"
              accept="image/jpeg, image/png, image/jpg"
              onChange={handleBannerUpload}
              className="hidden"
              disabled={isUploading}
            />
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-full">
          <FaImage
            size={30}
            className="text-gray-400 dark:text-gray-500 mb-2 sm:mb-3"
          />
          <label
            htmlFor="banner-upload"
            className="cursor-pointer flex items-center gap-1 sm:gap-2 bg-white dark:bg-gray-800 px-3 sm:px-4 py-1 sm:py-2 rounded-md shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-all text-xs sm:text-sm text-gray-800 dark:text-gray-200"
          >
            <FaUpload className="text-gray-600 dark:text-gray-300" />
            {t("uploadBanner")}
          </label>
          <input
            id="banner-upload"
            type="file"
            accept="image/jpeg, image/png, image/jpg"
            onChange={handleBannerUpload}
            className="hidden"
            disabled={isUploading}
            aria-label={t("uploadBanner")}
          />
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-xs sm:text-sm text-center px-2">
            {t("recommendedSize", {
              defaultValue: "Optimal size: 1920×1080px (16:9)",
            })}
          </p>
        </div>
      )}

      {isUploading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg transition-colors duration-300">
            <LoadingSpinner size="md" showText={false} />
            <p className="mt-2 text-sm text-center text-gray-700 dark:text-gray-300">
              {t("uploadingBanner")}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
