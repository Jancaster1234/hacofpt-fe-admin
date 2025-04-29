// src/app/[locale]/(protected)/organizer-hackathon-management/create/_components/HackathonCreateForm.tsx
"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "@/hooks/useTranslations";
import {
  FaFileWord,
  FaFilePdf,
  FaFileExcel,
  FaFileImage,
  FaFileAudio,
  FaFileVideo,
  FaFileArchive,
  FaFileAlt,
  FaFile,
  FaTimes,
} from "react-icons/fa";
import { fileUrlService } from "@/services/fileUrl.service";
import { useToast } from "@/hooks/use-toast";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

type TabKey =
  | "basic"
  | "information"
  | "description"
  | "participant"
  | "documentation"
  | "contact";

interface FormDataType {
  title: string;
  subTitle: string;
  bannerImageUrl: string;
  enrollStartDate: string;
  enrollEndDate: string;
  startDate: string;
  endDate: string;
  information: string;
  description: string;
  contact: string;
  category: string;
  organization: string;
  minimumTeamMembers: number;
  maximumTeamMembers: number;
  documentation: string[];
  showParticipants: boolean;
}

interface HackathonCreateFormProps {
  formData: FormDataType;
  setFormData: (data: FormDataType) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

export default function HackathonCreateForm({
  formData,
  setFormData,
  onSubmit,
  onCancel,
}: HackathonCreateFormProps) {
  const t = useTranslations("createHackathon");
  const [activeTab, setActiveTab] = useState<TabKey>("basic");
  const [isUploading, setIsUploading] = useState(false);
  const toast = useToast();

  // Available categories and organizations
  const CATEGORIES = [
    { value: "CODING", label: t("categories.coding") },
    { value: "EXTERNAL", label: t("categories.external") },
    { value: "INTERNAL", label: t("categories.internal") },
    { value: "DESIGN", label: t("categories.design") },
    { value: "OTHERS", label: t("categories.others") },
  ];

  const ORGANIZATIONS = [
    { value: "FPTU", label: t("organizations.fptu") },
    { value: "NASA", label: t("organizations.nasa") },
    { value: "IAI_HACKATHON", label: t("organizations.iaiHackathon") },
    { value: "CE_HACKATHON", label: t("organizations.ceHackathon") },
    { value: "OTHERS", label: t("organizations.others") },
  ];

  const tabs: { key: TabKey; label: string }[] = [
    { key: "basic", label: t("tabs.basic") },
    { key: "information", label: t("tabs.information") },
    { key: "description", label: t("tabs.description") },
    { key: "participant", label: t("tabs.participant") },
    { key: "documentation", label: t("tabs.documentation") },
    { key: "contact", label: t("tabs.contact") },
  ];

  useEffect(() => {
    const hash = window.location.hash.replace("#", "") as TabKey;
    if (tabs.some((tab) => tab.key === hash)) {
      setActiveTab(hash);
    }
  }, []);

  const handleTabClick = (key: TabKey) => {
    setActiveTab(key);
    window.location.hash = key; // Update URL hash
  };

  // Handle file upload for documentation
  const handleDocumentUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      const fileArray = Array.from(files);
      const response =
        await fileUrlService.uploadMultipleFilesCommunication(fileArray);

      if (response.data && response.data.length > 0) {
        // Extract fileUrls from the response
        const newFileUrls = response.data.map((file) => file.fileUrl);
        setFormData({
          ...formData,
          documentation: [...formData.documentation, ...newFileUrls],
        });
        toast.success(response.message || t("documentUploadSuccess"));
      } else {
        throw new Error(response.message || t("documentUploadError"));
      }
    } catch (error) {
      console.error("Error uploading documents:", error);
      toast.error(
        error instanceof Error ? error.message : t("documentUploadError")
      );
    } finally {
      setIsUploading(false);
    }
  };

  // Handle document deletion
  const handleDeleteDocument = (index: number) => {
    const updatedDocs = [...formData.documentation];
    updatedDocs.splice(index, 1);
    setFormData({
      ...formData,
      documentation: updatedDocs,
    });
    toast.info(t("documentDeleted"));
  };

  // Helper functions for file handling
  const getFileName = (fileUrl: string) => {
    const decodedUrl = decodeURIComponent(fileUrl);
    const parts = decodedUrl.split("/");
    const lastPart = parts[parts.length - 1];
    if (lastPart.includes("_")) {
      return lastPart.split("_").slice(1).join("_");
    }
    return lastPart;
  };

  const getFileIcon = (fileUrl: string) => {
    const extension = fileUrl.split(".").pop()?.toLowerCase();
    switch (extension) {
      case "doc":
      case "docx":
        return <FaFileWord size={16} className="text-blue-600" />;
      case "pdf":
        return <FaFilePdf size={16} className="text-red-600" />;
      case "xls":
      case "xlsx":
        return <FaFileExcel size={16} className="text-green-600" />;
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
        return <FaFileImage size={16} className="text-purple-600" />;
      case "mp3":
      case "wav":
      case "ogg":
        return <FaFileAudio size={16} className="text-yellow-600" />;
      case "mp4":
      case "avi":
      case "mov":
        return <FaFileVideo size={16} className="text-pink-600" />;
      case "zip":
      case "rar":
      case "7z":
        return <FaFileArchive size={16} className="text-orange-600" />;
      case "txt":
        return <FaFileAlt size={16} className="text-gray-600" />;
      default:
        return <FaFile size={16} className="text-gray-600" />;
    }
  };

  const isFormValid = () => {
    return (
      formData.title.trim() !== "" &&
      formData.enrollStartDate !== "" &&
      formData.enrollEndDate !== "" &&
      formData.startDate !== "" &&
      formData.endDate !== "" &&
      new Date(formData.enrollStartDate) < new Date(formData.enrollEndDate) &&
      new Date(formData.enrollEndDate) < new Date(formData.startDate) &&
      new Date(formData.startDate) < new Date(formData.endDate)
    );
  };

  return (
    <div className="mt-4 sm:mt-6 transition-all duration-300">
      {/* Tab Buttons - Enhanced with better responsiveness */}
      <div className="flex overflow-x-auto pb-1 scrollbar-hide border-b dark:border-gray-700">
        {tabs.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => handleTabClick(key)}
            className={`px-2 py-2 sm:px-4 text-xs sm:text-base md:text-lg whitespace-nowrap transition-all duration-200 ${
              activeTab === key
                ? "border-b-2 border-blue-500 dark:border-blue-400 font-semibold text-gray-900 dark:text-gray-100"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
            aria-selected={activeTab === key}
            role="tab"
          >
            {label}
          </button>
        ))}
      </div>

      {/* Tab Content - Enhanced with theme support */}
      <div className="mt-4 p-3 sm:p-4 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700 shadow-sm transition-colors duration-300">
        {activeTab === "basic" && (
          <div className="space-y-4">
            <div>
              <label className="block font-medium mb-1 text-gray-800 dark:text-gray-200">
                {t("fields.title")} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="w-full p-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors duration-200"
                placeholder={t("placeholders.title")}
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
            </div>

            <div>
              <label className="block font-medium mb-1 text-gray-800 dark:text-gray-200">
                {t("fields.subtitle")}
              </label>
              <textarea
                className="w-full p-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors duration-200"
                rows={3}
                placeholder={t("placeholders.subtitle")}
                value={formData.subTitle}
                onChange={(e) =>
                  setFormData({ ...formData, subTitle: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium mb-1 text-gray-800 dark:text-gray-200">
                  {t("fields.enrollStartDate")}{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  className="w-full p-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors duration-200"
                  value={formData.enrollStartDate}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      enrollStartDate: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div>
                <label className="block font-medium mb-1 text-gray-800 dark:text-gray-200">
                  {t("fields.enrollEndDate")}{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  className={`w-full p-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors duration-200 ${
                    formData.enrollStartDate &&
                    formData.enrollEndDate &&
                    new Date(formData.enrollStartDate) >=
                      new Date(formData.enrollEndDate)
                      ? "border-red-500 dark:border-red-400"
                      : ""
                  }`}
                  value={formData.enrollEndDate}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      enrollEndDate: e.target.value,
                    })
                  }
                  min={formData.enrollStartDate}
                  required
                />
                {formData.enrollStartDate &&
                  formData.enrollEndDate &&
                  new Date(formData.enrollStartDate) >=
                    new Date(formData.enrollEndDate) && (
                    <p className="text-red-500 dark:text-red-400 text-sm mt-1">
                      {t("validations.enrollEndAfterStart")}
                    </p>
                  )}
              </div>

              <div>
                <label className="block font-medium mb-1 text-gray-800 dark:text-gray-200">
                  {t("fields.startDate")}{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  className={`w-full p-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors duration-200 ${
                    formData.enrollEndDate &&
                    formData.startDate &&
                    new Date(formData.enrollEndDate) >=
                      new Date(formData.startDate)
                      ? "border-red-500 dark:border-red-400"
                      : ""
                  }`}
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      startDate: e.target.value,
                    })
                  }
                  min={formData.enrollEndDate}
                  required
                />
                {formData.enrollEndDate &&
                  formData.startDate &&
                  new Date(formData.enrollEndDate) >=
                    new Date(formData.startDate) && (
                    <p className="text-red-500 dark:text-red-400 text-sm mt-1">
                      {t("validations.startAfterEnrollEnd")}
                    </p>
                  )}
              </div>

              <div>
                <label className="block font-medium mb-1 text-gray-800 dark:text-gray-200">
                  {t("fields.endDate")} <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  className={`w-full p-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors duration-200 ${
                    formData.startDate &&
                    formData.endDate &&
                    new Date(formData.startDate) >= new Date(formData.endDate)
                      ? "border-red-500 dark:border-red-400"
                      : ""
                  }`}
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      endDate: e.target.value,
                    })
                  }
                  min={formData.startDate}
                  required
                />
                {formData.startDate &&
                  formData.endDate &&
                  new Date(formData.startDate) >=
                    new Date(formData.endDate) && (
                    <p className="text-red-500 dark:text-red-400 text-sm mt-1">
                      {t("validations.endAfterStart")}
                    </p>
                  )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium mb-1 text-gray-800 dark:text-gray-200">
                  {t("fields.category")}
                </label>
                <select
                  className="w-full p-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors duration-200"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium mb-1 text-gray-800 dark:text-gray-200">
                  {t("fields.organization")}
                </label>
                <select
                  className="w-full p-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors duration-200"
                  value={formData.organization}
                  onChange={(e) =>
                    setFormData({ ...formData, organization: e.target.value })
                  }
                >
                  {ORGANIZATIONS.map((org) => (
                    <option key={org.value} value={org.value}>
                      {org.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block font-medium mb-1 text-gray-800 dark:text-gray-200">
                {t("fields.teamSize")}
              </label>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="w-full sm:w-1/2">
                  <label className="text-sm text-gray-600 dark:text-gray-400">
                    {t("fields.minMembers")}
                  </label>
                  <input
                    type="number"
                    className="w-full p-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors duration-200"
                    min="1"
                    value={formData.minimumTeamMembers}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        minimumTeamMembers: Number(e.target.value),
                      })
                    }
                  />
                </div>

                <div className="w-full sm:w-1/2">
                  <label className="text-sm text-gray-600 dark:text-gray-400">
                    {t("fields.maxMembers")}
                  </label>
                  <input
                    type="number"
                    className="w-full p-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors duration-200"
                    min={formData.minimumTeamMembers}
                    value={formData.maximumTeamMembers}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        maximumTeamMembers: Number(e.target.value),
                      })
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "information" && (
          <div>
            <label className="block font-medium mb-2 text-gray-800 dark:text-gray-200">
              {t("fields.information")}
            </label>
            <textarea
              className="w-full p-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors duration-200"
              rows={10}
              placeholder={t("placeholders.information")}
              value={formData.information}
              onChange={(e) =>
                setFormData({ ...formData, information: e.target.value })
              }
            />
          </div>
        )}

        {activeTab === "description" && (
          <div>
            <label className="block font-medium mb-2 text-gray-800 dark:text-gray-200">
              {t("fields.description")}
            </label>
            <textarea
              className="w-full p-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors duration-200"
              rows={10}
              placeholder={t("placeholders.description")}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>
        )}

        {activeTab === "participant" && (
          <div>
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="showParticipants"
                checked={formData.showParticipants}
                onChange={() =>
                  setFormData({
                    ...formData,
                    showParticipants: !formData.showParticipants,
                  })
                }
                className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600"
              />
              <label
                htmlFor="showParticipants"
                className="text-gray-800 dark:text-gray-200"
              >
                {t("fields.showParticipants")}
              </label>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {t("participantDescription")}
            </p>
          </div>
        )}

        {activeTab === "documentation" && (
          <div>
            <label className="block font-medium mb-2 text-gray-800 dark:text-gray-200">
              {t("fields.documentation")}
            </label>
            <div className="relative">
              <input
                type="file"
                multiple
                onChange={handleDocumentUpload}
                className={`block w-full border p-2 rounded-md mb-4 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 dark:file:bg-blue-900 dark:file:text-blue-200 hover:file:bg-blue-100 dark:hover:file:bg-blue-800 transition-colors duration-200 ${
                  isUploading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={isUploading}
              />
              {isUploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 dark:bg-gray-800 dark:bg-opacity-70">
                  <LoadingSpinner size="sm" showText={true} />
                </div>
              )}
            </div>

            {formData.documentation.length > 0 ? (
              <ul className="border rounded-md divide-y border-gray-300 dark:border-gray-600 divide-gray-300 dark:divide-gray-600 bg-white dark:bg-gray-700 transition-colors duration-200">
                {formData.documentation.map((url, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center p-2 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200"
                  >
                    <span className="flex items-center gap-2 truncate max-w-[80%]">
                      {getFileIcon(url)}
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:underline truncate"
                        title={getFileName(url)}
                      >
                        {getFileName(url)}
                      </a>
                    </span>
                    <button
                      onClick={() => handleDeleteDocument(index)}
                      className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
                      aria-label={t("buttons.deleteDocument")}
                    >
                      <FaTimes />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 italic p-4 border border-dashed rounded-md border-gray-300 dark:border-gray-600 text-center">
                {t("noDocumentsUploaded")}
              </p>
            )}
          </div>
        )}

        {activeTab === "contact" && (
          <div>
            <label className="block font-medium mb-2 text-gray-800 dark:text-gray-200">
              {t("fields.contact")}
            </label>
            <textarea
              className="w-full p-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors duration-200"
              rows={5}
              placeholder={t("placeholders.contact")}
              value={formData.contact}
              onChange={(e) =>
                setFormData({ ...formData, contact: e.target.value })
              }
            />
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex flex-col sm:flex-row justify-end gap-3">
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-md text-gray-800 dark:text-gray-200 transition-colors duration-200 order-2 sm:order-1"
        >
          {t("buttons.cancel")}
        </button>
        <button
          onClick={onSubmit}
          disabled={!isFormValid()}
          className={`px-4 py-2 rounded-md text-white transition-colors duration-200 order-1 sm:order-2 ${
            isFormValid()
              ? "bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
              : "bg-blue-300 dark:bg-blue-400 cursor-not-allowed opacity-70"
          }`}
        >
          {t("buttons.create")}
        </button>
      </div>
    </div>
  );
}
