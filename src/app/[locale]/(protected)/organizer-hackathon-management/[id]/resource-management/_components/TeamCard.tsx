// src/app/[locale]/(protected)/organizer-hackathon-management/[id]/resource-management/_components/TeamCard.tsx
import { useState } from "react";
import { TeamRound } from "@/types/entities/teamRound";
import { Submission } from "@/types/entities/submission";
import { TeamRoundJudge } from "@/types/entities/teamRoundJudge";
import { TeamInfo } from "./TeamInfo";
import { LatestSubmission } from "./LatestSubmission";
import { AllSubmissions } from "./AllSubmissions";
import { JudgesList } from "./JudgesList";
import { useTranslations } from "@/hooks/useTranslations";

interface TeamCardProps {
  teamRound: TeamRound;
  judges: TeamRoundJudge[];
  submissions: Submission[];
  showPopup: (type: string, id: string, note: string) => void;
  refreshData: () => void;
}

export function TeamCard({
  teamRound,
  judges,
  submissions,
  showPopup,
  refreshData,
}: TeamCardProps) {
  const [expandedTeamInfo, setExpandedTeamInfo] = useState(false);
  const [expandedSubmissions, setExpandedSubmissions] = useState(false);
  const [expandedJudges, setExpandedJudges] = useState(false);
  const t = useTranslations("teamManagement");

  const toggleTeamInfoExpand = () => {
    setExpandedTeamInfo(!expandedTeamInfo);
  };

  const toggleSubmissionsExpand = () => {
    setExpandedSubmissions(!expandedSubmissions);
  };

  const toggleJudgesExpand = () => {
    setExpandedJudges(!expandedJudges);
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-lg shadow-md transition-colors duration-200">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
        <div>
          <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
            {teamRound.team.name}
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            {t("status")}:{" "}
            <span className="font-semibold">{teamRound.status}</span>
          </p>
        </div>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={toggleTeamInfoExpand}
            className="px-2 sm:px-3 py-1 text-xs sm:text-sm bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 transition-colors duration-200"
            aria-expanded={expandedTeamInfo}
          >
            {expandedTeamInfo ? t("hideInfo") : t("teamInfo")}
          </button>
          <button
            onClick={toggleJudgesExpand}
            className="px-2 sm:px-3 py-1 text-xs sm:text-sm bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 transition-colors duration-200"
            aria-expanded={expandedJudges}
          >
            {expandedJudges
              ? t("hideJudges")
              : `${t("judges")} (${judges.length})`}
          </button>
          <button
            onClick={toggleSubmissionsExpand}
            className="px-2 sm:px-3 py-1 text-xs sm:text-sm bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 transition-colors duration-200"
            aria-expanded={expandedSubmissions}
          >
            {expandedSubmissions ? t("hideSubmissions") : t("allSubmissions")}
          </button>
        </div>
      </div>

      {/* Team Info Section */}
      {expandedTeamInfo && <TeamInfo team={teamRound.team} />}

      {/* Judges Section */}
      {expandedJudges && <JudgesList judges={judges} />}

      {/* Latest Submission Section */}
      <LatestSubmission
        submissions={submissions}
        teamRound={teamRound}
        showPopup={showPopup}
        refreshData={refreshData}
      />

      {/* All Submissions Section */}
      {expandedSubmissions && (
        <AllSubmissions submissions={submissions} roundId={teamRound.roundId} />
      )}
    </div>
  );
}
