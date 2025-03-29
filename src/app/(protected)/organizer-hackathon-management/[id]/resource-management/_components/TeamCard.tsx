// src/app/(protected)/organizer-hackathon-management/[id]/resource-management/_components/TeamCard.tsx
import { useState } from "react";
import { TeamRound } from "@/types/entities/teamRound";
import { Submission } from "@/types/entities/submission";
import { TeamInfo } from "./TeamInfo";
import { LatestSubmission } from "./LatestSubmission";
import { AllSubmissions } from "./AllSubmissions";

interface TeamCardProps {
  teamRound: TeamRound;
  submissions: Submission[];
  showPopup: (type: string, id: string, note: string) => void;
}

export function TeamCard({ teamRound, submissions, showPopup }: TeamCardProps) {
  const [expandedTeamInfo, setExpandedTeamInfo] = useState(false);
  const [expandedSubmissions, setExpandedSubmissions] = useState(false);

  const toggleTeamInfoExpand = () => {
    setExpandedTeamInfo(!expandedTeamInfo);
  };

  const toggleSubmissionsExpand = () => {
    setExpandedSubmissions(!expandedSubmissions);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium text-gray-800">
            {teamRound.team.name}
          </h3>
          <p className="text-sm text-gray-600">
            Status: <span className="font-semibold">{teamRound.status}</span>
          </p>
        </div>
        <div className="space-x-2">
          <button
            onClick={toggleTeamInfoExpand}
            className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
          >
            {expandedTeamInfo ? "Hide Info" : "Team Info"}
          </button>
          <button
            onClick={toggleSubmissionsExpand}
            className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
          >
            {expandedSubmissions ? "Hide Submissions" : "All Submissions"}
          </button>
        </div>
      </div>

      {/* Team Info Section */}
      {expandedTeamInfo && <TeamInfo team={teamRound.team} />}

      {/* Latest Submission Section */}
      <LatestSubmission submissions={submissions} showPopup={showPopup} />

      {/* All Submissions Section */}
      {expandedSubmissions && <AllSubmissions submissions={submissions} />}
    </div>
  );
}
