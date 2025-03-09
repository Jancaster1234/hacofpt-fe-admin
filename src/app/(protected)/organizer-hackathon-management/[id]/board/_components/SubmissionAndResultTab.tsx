// src/app/hackathon/[id]/board/_components/SubmissionAndResultTab.tsx
"use client";

import { useState } from "react";
import SubmissionTab from "./SubmissionTab";
import ResultTab from "./ResultTab";
import RewardListTab from "./RewardListTab";

// Mock Data
const numberOfRounds = 3;
const roundTabs = Array.from(
  { length: numberOfRounds },
  (_, i) => `Round ${i + 1}`
);

export default function SubmissionAndResultTab() {
  const [activeRoundTab, setActiveRoundTab] = useState(roundTabs[0]);
  const [activeSubTab, setActiveSubTab] = useState("Submission");

  return (
    <div>
      {/* Round Navigation */}
      <div className="flex border-b border-gray-200 space-x-4">
        {roundTabs.map((round) => (
          <button
            key={round}
            className={`px-4 py-2 text-sm font-medium ${
              activeRoundTab === round
                ? "border-b-2 border-blue-500 text-blue-600 font-semibold"
                : "text-gray-500"
            }`}
            onClick={() => setActiveRoundTab(round)}
          >
            {round}
          </button>
        ))}
        <button
          className={`px-4 py-2 text-sm font-medium ${
            activeRoundTab === "Reward Recipient List"
              ? "border-b-2 border-blue-500 text-blue-600 font-semibold"
              : "text-gray-500"
          }`}
          onClick={() => setActiveRoundTab("Reward Recipient List")}
        >
          Reward Recipient List
        </button>
      </div>

      {/* Conditionally Show Submission & Result Tabs */}
      {roundTabs.includes(activeRoundTab) ? (
        <div className="flex space-x-4 mt-4">
          <button
            className={`px-4 py-2 text-sm font-medium ${
              activeSubTab === "Submission"
                ? "bg-gray-300 text-black font-semibold"
                : "text-gray-600"
            }`}
            onClick={() => setActiveSubTab("Submission")}
          >
            Submission
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium ${
              activeSubTab === "Result"
                ? "bg-gray-300 text-black font-semibold"
                : "text-gray-600"
            }`}
            onClick={() => setActiveSubTab("Result")}
          >
            Result
          </button>
        </div>
      ) : null}

      {/* Display Content Based on Active Tab */}
      <div className="mt-4 p-4 border rounded-lg bg-white shadow">
        {activeRoundTab === "Reward Recipient List" ? (
          <RewardListTab />
        ) : activeSubTab === "Submission" ? (
          <SubmissionTab round={activeRoundTab} />
        ) : (
          <ResultTab round={activeRoundTab} />
        )}
      </div>
    </div>
  );
}
