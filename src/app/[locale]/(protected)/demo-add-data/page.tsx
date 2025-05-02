// src/app/[locale]/(protected)/demo-add-data/page.tsx
"use client";
import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth_v0";
import TabsComponent from "./_components/TabsComponent";
import BulkRegistrationTab from "./_components/BulkRegistrationTab";
import CreateSubmissionTab from "./_components/CreateSubmissionTab";
import CreateJudgeSubmissionTab from "./_components/CreateJudgeSubmissionTab";

export default function DemoAddDataPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("bulkRegistration");

  const tabs = [
    { id: "bulkRegistration", label: "Bulk Registration" },
    { id: "createSubmission", label: "Create Submission" },
    { id: "createJudgeSubmission", label: "Create Judge Submission" },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "bulkRegistration":
        return <BulkRegistrationTab />;
      case "createSubmission":
        return <CreateSubmissionTab />;
      case "createJudgeSubmission":
        return <CreateJudgeSubmissionTab />;
      default:
        return <BulkRegistrationTab />;
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-100 p-6">
      <h1 className="mb-6 text-3xl font-bold text-gray-900">
        Demo Data Management
      </h1>
      <p className="mb-6 text-gray-600">
        Welcome, {user ? `${user.firstName} ${user.lastName}` : "Guest"}! Use
        these tools to manage demo data.
      </p>

      <div className="rounded-lg bg-white p-6 shadow-md">
        <TabsComponent
          tabs={tabs}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        <div className="mt-6">{renderTabContent()}</div>
      </div>
    </div>
  );
}
