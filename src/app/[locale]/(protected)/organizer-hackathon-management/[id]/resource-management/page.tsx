// src/app/[locale]/(protected)/organizer-hackathon-management/[id]/resource-management/page.tsx
"use client";
import React, { useState, use, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth_v0";
import Tabs from "./_components/Tabs";
import AssignJudgeToRound from "./_components/AssignJudgeToRound";
import JudgeAssign from "./_components/JudgeAssign";
import Rounds from "./_components/Rounds";
import UserManagement from "./_components/UserManagement";
import Submissions from "./_components/Submissions";
import HackathonResults from "./_components/HackathonResults";
import Locations from "./_components/Locations";
import Notifications from "./_components/Notifications";
import RoundMarkCriteria from "./_components/RoundMarkCriteria";
import TeamRequests from "./_components/TeamRequests";
import IndividualRegistrationRequests from "./_components/IndividualRegistrationRequests";
import TeamFormation from "./_components/TeamFormation";
import Feedback from "./_components/Feedback";
import DeviceManagement from "./_components/DeviceManagement";
import Sponsorship from "./_components/Sponsorship";
import ApiResponseModal from "@/components/common/ApiResponseModal";
import { useApiModal } from "@/hooks/useApiModal";
import { useTranslations } from "@/hooks/useTranslations";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useToast } from "@/hooks/use-toast";

// Define valid tab types
type TabType =
  | "round"
  | "location"
  | "roundMarkCriteria"
  | "teamRequest"
  | "individualRequest"
  | "teamFormation"
  | "userManagement"
  | "assignJudgeToRound"
  | "judge"
  | "submission"
  | "notification"
  | "hackathonResult"
  | "feedback"
  | "device"
  | "sponsorship";

// List of all valid tabs for type checking
const VALID_TABS: TabType[] = [
  "round",
  "location",
  "roundMarkCriteria",
  "teamRequest",
  "individualRequest",
  "teamFormation",
  "userManagement",
  "assignJudgeToRound",
  "judge",
  "submission",
  "notification",
  "hackathonResult",
  "feedback",
  "device",
  "sponsorship",
];

export default function ResourceManagementPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { user } = useAuth();
  const { id: hackathonId } = use(params);
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const t = useTranslations("resourceManagement");
  const toast = useToast();
  const { modalState, hideModal } = useApiModal();

  // Get tab from URL or default to "round"
  const initialTab = searchParams.get("tab") as TabType | null;
  const [activeTab, setActiveTab] = useState<TabType>(
    VALID_TABS.includes(initialTab as TabType)
      ? (initialTab as TabType)
      : "round"
  );

  // Update tab when URL changes
  useEffect(() => {
    const tabFromUrl = searchParams.get("tab") as TabType | null;
    if (tabFromUrl && VALID_TABS.includes(tabFromUrl)) {
      setActiveTab(tabFromUrl);
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-3 sm:p-4 md:p-6 transition-colors duration-200">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4 md:mb-6 transition-colors duration-200">
        {t("title")}
      </h1>

      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 transition-colors duration-200">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <LoadingSpinner size="lg" showText={true} />
          </div>
        ) : (
          <>
            {activeTab === "round" && <Rounds hackathonId={hackathonId} />}
            {activeTab === "location" && <Locations />}
            {activeTab === "roundMarkCriteria" && (
              <RoundMarkCriteria hackathonId={hackathonId} />
            )}
            {activeTab === "teamRequest" && (
              <TeamRequests hackathonId={hackathonId} />
            )}
            {activeTab === "individualRequest" && (
              <IndividualRegistrationRequests hackathonId={hackathonId} />
            )}
            {activeTab === "teamFormation" && (
              <TeamFormation hackathonId={hackathonId} />
            )}
            {activeTab === "userManagement" && (
              <UserManagement hackathonId={hackathonId} />
            )}
            {activeTab === "assignJudgeToRound" && (
              <AssignJudgeToRound hackathonId={hackathonId} />
            )}
            {activeTab === "judge" && <JudgeAssign hackathonId={hackathonId} />}
            {activeTab === "submission" && (
              <Submissions hackathonId={hackathonId} />
            )}
            {activeTab === "notification" && (
              <Notifications hackathonId={hackathonId} />
            )}
            {activeTab === "hackathonResult" && (
              <HackathonResults hackathonId={hackathonId} />
            )}
            {activeTab === "feedback" && <Feedback hackathonId={hackathonId} />}
            {activeTab === "device" && (
              <DeviceManagement hackathonId={hackathonId} />
            )}
            {activeTab === "sponsorship" && (
              <Sponsorship hackathonId={hackathonId} />
            )}
          </>
        )}
      </div>

      <ApiResponseModal
        isOpen={modalState.isOpen}
        onClose={hideModal}
        title={modalState.title}
        message={modalState.message}
        type={modalState.type}
      />
    </div>
  );
}
