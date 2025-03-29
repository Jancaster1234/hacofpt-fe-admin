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
    | "userManagement"
    | "assignJudgeToRound"
    | "judge"
    | "submission"
    | "hackathonResult"
    | "device"
    | "sponsorship"
  >("round"); // Default to "round"

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Hackathon Resource Management
      </h1>
      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {activeTab === "round" && <Rounds hackathonId={hackathonId} />}
      {activeTab === "location" && <Locations />}
      {activeTab === "userManagement" && (
        <UserManagement hackathonId={hackathonId} />
      )}
      {activeTab === "assignJudgeToRound" && (
        <AssignJudgeToRound hackathonId={hackathonId} />
      )}
      {activeTab === "judge" && <JudgeAssign hackathonId={hackathonId} />}
      {activeTab === "submission" && <Submissions hackathonId={hackathonId} />}
      {activeTab === "hackathonResult" && (
        <HackathonResults hackathonId={hackathonId} />
      )}
      {activeTab === "device" && (
        <p>Device Management Feature Coming Soon...</p>
      )}
      {activeTab === "sponsorship" && <p>Sponsorship Feature Coming Soon...</p>}
    </div>
  );
}
