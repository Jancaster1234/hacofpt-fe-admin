// src/app/[locale]/hackathon/[id]/_components/HackathonTabs.tsx
"use client";

import { useState, useEffect } from "react";
import Head from "next/head";
import { useTranslations } from "@/hooks/useTranslations";
import { TeamParticipantsTab } from "./TeamParticipantsTab";
import { IndividualParticipantsTab } from "./IndividualParticipantsTab";
import TiptapRenderer from "@/components/TiptapRenderer/ClientRenderer";
import PostContent from "@/components/shared/PostContent";
import PostToc from "@/components/shared/PostToc";
import {
  FileText,
  FileImage,
  FileSpreadsheet,
  FileCode,
  File,
  FileArchive,
  FileVideo,
  FileAudio,
  // Replace missing icon imports with the correct ones
  Presentation, // Instead of FilePpt
  FileType, // Instead of FilePdf
} from "lucide-react";

type TabKey =
  | "information"
  | "description"
  | "participant"
  | "documentation"
  | "contact";

export default function HackathonTabs({
  content,
  hackathonId,
}: {
  content: Record<TabKey, string | string[]>;
  hackathonId: string;
}) {
  const t = useTranslations("hackathonTabs");
  const [activeTab, setActiveTab] = useState<TabKey>("information");
  const [participantSubTab, setParticipantSubTab] = useState<
    "teams" | "individuals"
  >("teams");

  const tabs: { key: TabKey; label: string }[] = [
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

  // Helper to determine if the tab should use the PostContent/PostToc layout
  const shouldUsePostLayout = (tabKey: TabKey) => {
    return ["information", "description", "contact"].includes(tabKey);
  };

  // Extract filename from URL
  const getFileName = (url: string) => {
    // Get the part after the last slash and before any query parameters
    const fullFileName = url.split("/").pop()?.split("?")[0] || "";

    // Remove any UUID or other identifiers (assuming they're separated by underscores)
    // This regex looks for patterns like: 682be3c2-aea3-4fa8-b0fe-c580102c3ec3_FileName.ext
    const cleanedName = fullFileName.replace(/^[0-9a-f-]+_/i, "");

    // URL decode the filename to handle any encoded characters
    return decodeURIComponent(cleanedName);
  };

  // Get file extension from URL
  const getFileExtension = (url: string) => {
    const fileName = url.split("/").pop()?.split("?")[0] || "";
    return fileName.split(".").pop()?.toLowerCase() || "";
  };

  // Get icon based on file extension
  const getFileIcon = (extension: string) => {
    switch (extension) {
      case "pdf":
        return <FileType className="text-red-500" size={20} />;
      case "doc":
      case "docx":
        return <FileText className="text-blue-500" size={20} />;
      case "xls":
      case "xlsx":
      case "csv":
        return <FileSpreadsheet className="text-green-500" size={20} />;
      case "ppt":
      case "pptx":
        return <Presentation className="text-orange-500" size={20} />;
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
      case "svg":
      case "webp":
        return <FileImage className="text-purple-500" size={20} />;
      case "mp4":
      case "mov":
      case "avi":
      case "webm":
        return <FileVideo className="text-pink-500" size={20} />;
      case "mp3":
      case "wav":
      case "ogg":
        return <FileAudio className="text-yellow-500" size={20} />;
      case "zip":
      case "rar":
      case "tar":
      case "7z":
        return <FileArchive className="text-gray-500" size={20} />;
      case "html":
      case "css":
      case "js":
      case "jsx":
      case "ts":
      case "tsx":
      case "json":
        return <FileCode className="text-blue-600" size={20} />;
      default:
        return <File className="text-gray-400" size={20} />;
    }
  };

  // Render content with PostContent and PostToc layout
  const renderPostLayout = (tabContent: string) => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8 w-full">
      {/* Main content area - takes full width on small screens, 2/3 on larger screens */}
      <div className="lg:col-span-2 lg:ml-8 md:ml-4 sm:ml-2 transition-all duration-300 overflow-x-auto">
        <PostContent>
          <div className="dark:prose-invert prose-img:rounded prose-headings:scroll-mt-28 max-w-full overflow-x-auto">
            <TiptapRenderer>{tabContent}</TiptapRenderer>
          </div>
        </PostContent>
      </div>

      {/* Table of Contents - only visible on larger screens */}
      <aside className="hidden lg:block">
        <div className="sticky top-24 overflow-auto max-h-[calc(100vh-6rem)]">
          <PostToc />
        </div>
      </aside>
    </div>
  );

  return (
    <>
      <Head>
        <style>{`
          /* Core styles to handle overflow content properly */
          table {
            max-width: 100%;
            overflow-x: auto;
            display: block;
          }
          
          @media (max-width: 640px) {
            .prose table {
              font-size: 0.8rem;
            }
          }
          
          /* Ensure all content stays within bounds */
          .prose img, .prose pre, .prose iframe {
            max-width: 100%;
          }
        `}</style>
      </Head>
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
        <div className="mt-4 p-3 sm:p-4 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700 shadow-sm transition-colors duration-300 overflow-visible">
          {activeTab === "participant" ? (
            <div>
              {/* Participant Subtabs */}
              <div className="flex mb-4 border-b dark:border-gray-700 overflow-x-auto scrollbar-hide">
                <button
                  onClick={() => setParticipantSubTab("teams")}
                  className={`px-3 py-2 sm:px-4 text-sm whitespace-nowrap transition-all duration-200 ${
                    participantSubTab === "teams"
                      ? "border-b-2 border-blue-500 dark:border-blue-400 font-medium text-gray-900 dark:text-gray-100"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
                >
                  {t("subtabs.teams")}
                </button>
                <button
                  onClick={() => setParticipantSubTab("individuals")}
                  className={`px-3 py-2 sm:px-4 text-sm whitespace-nowrap transition-all duration-200 ${
                    participantSubTab === "individuals"
                      ? "border-b-2 border-blue-500 dark:border-blue-400 font-medium text-gray-900 dark:text-gray-100"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
                >
                  {t("subtabs.individuals")}
                </button>
              </div>

              {/* Participant Content based on subtab */}
              {participantSubTab === "teams" ? (
                <TeamParticipantsTab hackathonId={hackathonId} />
              ) : (
                <IndividualParticipantsTab hackathonId={hackathonId} />
              )}
            </div>
          ) : shouldUsePostLayout(activeTab) &&
            typeof content[activeTab] === "string" ? (
            // Use PostContent/PostToc layout for information, description and contact tabs
            renderPostLayout(content[activeTab] as string)
          ) : Array.isArray(content[activeTab]) ? (
            // Documentation tab (list of files)
            <div className="lg:ml-8 md:ml-4 sm:ml-2 transition-all duration-300">
              <ul className="space-y-3">
                {(content[activeTab] as string[]).map((fileUrl, index) => {
                  const fileName = getFileName(fileUrl);
                  const extension = getFileExtension(fileUrl);
                  const fileIcon = getFileIcon(extension);

                  return (
                    <li key={index} className="flex items-center">
                      <a
                        href={fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 w-full transition-colors duration-200"
                      >
                        <div className="flex-shrink-0 mr-3">{fileIcon}</div>
                        <div className="flex flex-col">
                          <span className="text-sm sm:text-base font-medium text-gray-800 dark:text-gray-200 break-all">
                            {fileName}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400 uppercase">
                            {extension}
                          </span>
                        </div>
                      </a>
                    </li>
                  );
                })}
              </ul>
              {(content[activeTab] as string[]).length === 0 && (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                  {t("noDocuments", "No documents available")}
                </p>
              )}
            </div>
          ) : (
            // Fallback rendering for other content
            <div className="lg:ml-8 md:ml-4 sm:ml-2 transition-all duration-300 overflow-x-auto">
              <p className="text-gray-800 dark:text-gray-200 text-sm sm:text-base">
                {content[activeTab] as string}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
