// src/app/(protected)/organizer-hackathon-management/[id]/resource-management/_components/TeamList.tsx
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
      {teamRounds[selectedRoundId].map((teamRound) => (
        <TeamCard
          key={teamRound.id}
          teamRound={teamRound}
          judges={teamRoundJudges[teamRound.id] || []}
          submissions={teamSubmissions[teamRound.team.id] || []}
          showPopup={showPopup}
          refreshData={refreshData}
        />
      ))}
    </div>
  );
}
