// src/app/[locale]/(protected)/organizer-hackathon-management/[id]/resource-management/_components/TeamList.tsx
import { useState } from "react";
import { TeamRound } from "@/types/entities/teamRound";
import { Submission } from "@/types/entities/submission";
import { TeamRoundJudge } from "@/types/entities/teamRoundJudge";
import { TeamCard } from "./TeamCard";

interface TeamListProps {
  selectedRoundId: string | null;
  teamRounds: {
    [roundId: string]: TeamRound[];
  };
  teamSubmissions: {
    [teamId: string]: Submission[];
  };
  teamRoundJudges: {
    [teamRoundId: string]: TeamRoundJudge[];
  };
  showPopup: (type: string, id: string, note: string) => void;
  refreshData: () => void;
}

export function TeamList({
  selectedRoundId,
  teamRounds,
  teamSubmissions,
  teamRoundJudges,
  showPopup,
  refreshData,
}: TeamListProps) {
  if (!selectedRoundId || !teamRounds[selectedRoundId]?.length) {
    return (
      <p className="text-gray-500">
        {selectedRoundId
          ? "No teams found for this round."
          : "Please select a round to view teams."}
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {teamRounds[selectedRoundId].map((teamRound) => {
        // Create the same composite key
        const teamIdString = String(teamRound.team.id);
        const roundIdString = String(teamRound.roundId);
        const key = `${teamIdString}-${roundIdString}`;

        // Get submissions using the composite key
        const submissions = teamSubmissions[key] || [];

        return (
          <TeamCard
            key={teamRound.id}
            teamRound={teamRound}
            judges={teamRoundJudges[teamRound.id] || []}
            submissions={submissions}
            showPopup={showPopup}
            refreshData={refreshData}
          />
        );
      })}
    </div>
  );
}
