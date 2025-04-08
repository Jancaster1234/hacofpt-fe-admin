// src/app/(protected)/organizer-hackathon-management/[id]/resource-management/page.tsx
"use client";
import React, { useState, use } from "react";
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
import DeviceManagement from "./_components/DeviceManagement";
import Sponsorship from "./_components/Sponsorship";
import ApiResponseModal from "@/components/common/ApiResponseModal";
import { useApiModal } from "@/hooks/useApiModal";

export default function ResourceManagementPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { user } = useAuth();
  const { id: hackathonId } = use(params);
  const [activeTab, setActiveTab] = useState<
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
    | "device"
    | "sponsorship"
  >("round"); // Default to "round"
  const { modalState, hideModal } = useApiModal();

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Hackathon Resource Management
      </h1>
      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

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
      {activeTab === "submission" && <Submissions hackathonId={hackathonId} />}
      {activeTab === "notification" && (
        <Notifications hackathonId={hackathonId} />
      )}
      {activeTab === "hackathonResult" && (
        <HackathonResults hackathonId={hackathonId} />
      )}
      {activeTab === "device" && <DeviceManagement hackathonId={hackathonId} />}
      {activeTab === "sponsorship" && <Sponsorship hackathonId={hackathonId} />}
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
