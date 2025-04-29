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
import { toast } from "sonner";

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

  // Available categories and organizations
  const CATEGORIES = [
    { value: "CODING", label: "Coding Hackathons" },
    { value: "EXTERNAL", label: "External Hackathons" },
    { value: "INTERNAL", label: "Internal Hackathons" },
    { value: "DESIGN", label: "Design Hackathons" },
    { value: "OTHERS", label: "Others" },
  ];

  const ORGANIZATIONS = [
    { value: "FPTU", label: "FPTU" },
    { value: "NASA", label: "NASA" },
    { value: "IAI_HACKATHON", label: "IAI HACKATHON" },
    { value: "CE_HACKATHON", label: "CE Hackathon" },
    { value: "OTHERS", label: "Others" },
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
        toast.success(t("documentUploadSuccess"));
      } else {
        throw new Error("No file URLs returned from server");
      }
    } catch (error) {
      console.error("Error uploading documents:", error);
      toast.error(
        error instanceof Error ? error.message : t("documentUploadError")
      );
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
        return <FaFileWord size={16} />;
      case "pdf":
        return <FaFilePdf size={16} />;
      case "xls":
      case "xlsx":
        return <FaFileExcel size={16} />;
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
        return <FaFileImage size={16} />;
      case "mp3":
      case "wav":
      case "ogg":
        return <FaFileAudio size={16} />;
      case "mp4":
      case "avi":
      case "mov":
        return <FaFileVideo size={16} />;
      case "zip":
      case "rar":
      case "7z":
        return <FaFileArchive size={16} />;
      case "txt":
        return <FaFileAlt size={16} />;
      default:
        return <FaFile size={16} />;
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
      {/* Tab Buttons */}
      <div className="flex overflow-x-auto scrollbar-hide border-b dark:border-gray-700">
        {tabs.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => handleTabClick(key)}
            className={`px-3 py-2 sm:px-4 text-sm sm:text-lg whitespace-nowrap transition-all duration-200 ${
              activeTab === key
                ? "border-b-2 border-blue-500 dark:border-blue-400 font-semibold text-gray-900 dark:text-gray-100"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-4 p-3 sm:p-4 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700 shadow-sm transition-colors duration-300">
        {activeTab === "basic" && (
          <div className="space-y-4">
            <div>
              <label className="block font-medium mb-1">
                {t("fields.title")} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="w-full p-2 border rounded-md"
                placeholder={t("placeholders.title")}
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
            </div>

            <div>
              <label className="block font-medium mb-1">
                {t("fields.subtitle")}
              </label>
              <textarea
                className="w-full p-2 border rounded-md"
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
                <label className="block font-medium mb-1">
                  {t("fields.enrollStartDate")}{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  className="w-full p-2 border rounded-md"
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
                <label className="block font-medium mb-1">
                  {t("fields.enrollEndDate")}{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  className={`w-full p-2 border rounded-md ${
                    formData.enrollStartDate &&
                    formData.enrollEndDate &&
                    new Date(formData.enrollStartDate) >=
                      new Date(formData.enrollEndDate)
                      ? "border-red-500"
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
                    <p className="text-red-500 text-sm mt-1">
                      {t("validations.enrollEndAfterStart")}
                    </p>
                  )}
              </div>

              <div>
                <label className="block font-medium mb-1">
                  {t("fields.startDate")}{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  className={`w-full p-2 border rounded-md ${
                    formData.enrollEndDate &&
                    formData.startDate &&
                    new Date(formData.enrollEndDate) >=
                      new Date(formData.startDate)
                      ? "border-red-500"
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
                    <p className="text-red-500 text-sm mt-1">
                      {t("validations.startAfterEnrollEnd")}
                    </p>
                  )}
              </div>

              <div>
                <label className="block font-medium mb-1">
                  {t("fields.endDate")} <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  className={`w-full p-2 border rounded-md ${
                    formData.startDate &&
                    formData.endDate &&
                    new Date(formData.startDate) >= new Date(formData.endDate)
                      ? "border-red-500"
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
                    <p className="text-red-500 text-sm mt-1">
                      {t("validations.endAfterStart")}
                    </p>
                  )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium mb-1">
                  {t("fields.category")}
                </label>
                <select
                  className="w-full p-2 border rounded-md"
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
                <label className="block font-medium mb-1">
                  {t("fields.organization")}
                </label>
                <select
                  className="w-full p-2 border rounded-md"
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
              <label className="block font-medium mb-1">
                {t("fields.teamSize")}
              </label>
              <div className="flex gap-4">
                <div className="w-1/2">
                  <label className="text-sm text-gray-600">
                    {t("fields.minMembers")}
                  </label>
                  <input
                    type="number"
                    className="w-full p-2 border rounded-md"
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

                <div className="w-1/2">
                  <label className="text-sm text-gray-600">
                    {t("fields.maxMembers")}
                  </label>
                  <input
                    type="number"
                    className="w-full p-2 border rounded-md"
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
            <label className="block font-medium mb-2">
              {t("fields.information")}
            </label>
            <textarea
              className="w-full p-2 border rounded-md"
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
            <label className="block font-medium mb-2">
              {t("fields.description")}
            </label>
            <textarea
              className="w-full p-2 border rounded-md"
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
                className="mr-2"
              />
              <label htmlFor="showParticipants">
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
            <label className="block font-medium mb-2">
              {t("fields.documentation")}
            </label>
            <input
              type="file"
              multiple
              onChange={handleDocumentUpload}
              className="block w-full border p-2 rounded-md mb-4"
            />

            {formData.documentation.length > 0 ? (
              <ul className="border rounded-md divide-y">
                {formData.documentation.map((url, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center p-2"
                  >
                    <span className="flex items-center gap-2">
                      {getFileIcon(url)}
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {getFileName(url)}
                      </a>
                    </span>
                    <button
                      onClick={() => handleDeleteDocument(index)}
                      className="text-red-500 hover:text-red-700"
                      aria-label="Delete document"
                    >
                      <FaTimes />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 italic">{t("noDocumentsUploaded")}</p>
            )}
          </div>
        )}

        {activeTab === "contact" && (
          <div>
            <label className="block font-medium mb-2">
              {t("fields.contact")}
            </label>
            <textarea
              className="w-full p-2 border rounded-md"
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
      <div className="mt-6 flex justify-end gap-3">
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-800 transition-colors"
        >
          {t("buttons.cancel")}
        </button>
        <button
          onClick={onSubmit}
          disabled={!isFormValid()}
          className={`px-4 py-2 rounded-md text-white transition-colors ${
            isFormValid()
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-blue-300 cursor-not-allowed"
          }`}
        >
          {t("buttons.create")}
        </button>
      </div>
    </div>
  );
}
