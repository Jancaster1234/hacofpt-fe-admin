// src/app/hackathon/[id]/board/page.tsx
"use client";
import { useState } from "react";
import SubmissionAndResultTab from "./_components/SubmissionAndResultTab";
const TABS = ["Task Board", "Submission and Result", "Schedule", "Analytics"];

export default function HackathonBoardPage() {
  const [activeTab, setActiveTab] = useState(TABS[0]);

  return (
    <div className="p-6">
      {/* Tabs Navigation */}
      <div className="flex border-b border-gray-200">
        {TABS.map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === tab
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-4 p-4 border rounded-lg bg-white shadow">
        {activeTab === "Task Board" && <p>This is the Kanban board.</p>}
        {activeTab === "Submission and Result" && <SubmissionAndResultTab />}
        {activeTab === "Schedule" && <p>Placeholder for schedule.</p>}
        {activeTab === "Analytics" && <p>Placeholder for analytics.</p>}
      </div>
    </div>
  );
}
