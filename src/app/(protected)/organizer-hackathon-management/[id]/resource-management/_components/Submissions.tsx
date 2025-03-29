// src/app/(protected)/organizer-hackathon-management/[id]/resource-management/_components/Submissions.tsx
// src/app/(protected)/organizer-hackathon-management/[id]/resource-management/_components/Submissions.tsx
import { useEffect, useState } from "react";
import { fetchMockRounds } from "../_mocks/fetchMockRounds";
import { fetchMockTeamRounds } from "../_mocks/fetchMockTeamRounds";
import { fetchMockSubmissions } from "../_mocks/fetchMockSubmissions";
import { RoundTabs } from "./RoundTabs";
import { TeamList } from "./TeamList";
import { NotePopup } from "./NotePopup";
import { Round } from "@/types/entities/round";
import { TeamRound } from "@/types/entities/teamRound";
import { Submission } from "@/types/entities/submission";

export default function Submissions({ hackathonId }: { hackathonId: string }) {
  const [rounds, setRounds] = useState<Round[]>([]);
  const [selectedRoundId, setSelectedRoundId] = useState<string | null>(null);
  const [teamRounds, setTeamRounds] = useState<{
    [roundId: string]: TeamRound[];
  }>({});
  const [teamSubmissions, setTeamSubmissions] = useState<{
    [teamId: string]: Submission[];
  }>({});
  const [activePopup, setActivePopup] = useState<{
    type: string;
    id: string;
    note: string;
  } | null>(null);

  useEffect(() => {
    // Fetch rounds
    fetchMockRounds(hackathonId).then((roundsData) => {
      // Sort rounds by roundNumber
      const sortedRounds = [...roundsData].sort(
        (a, b) => a.roundNumber - b.roundNumber
      );
      setRounds(sortedRounds);

      // Select the first round by default
      if (sortedRounds.length > 0) {
        setSelectedRoundId(sortedRounds[0].id);
      }

      // Fetch team rounds for each round
      sortedRounds.forEach((round) => {
        fetchMockTeamRounds(hackathonId, round.id).then((teamRoundsData) => {
          setTeamRounds((prev) => ({ ...prev, [round.id]: teamRoundsData }));

          // Fetch submissions for each team member
          teamRoundsData.forEach((teamRound) => {
            // For team leader
            if (teamRound.team.teamLeader) {
              fetchMockSubmissions(teamRound.team.teamLeader.id, round.id).then(
                (submissionsData) => {
                  setTeamSubmissions((prev) => ({
                    ...prev,
                    [teamRound.team.id]: [
                      ...(prev[teamRound.team.id] || []),
                      ...submissionsData,
                    ],
                  }));
                }
              );
            }

            // For each team member
            teamRound.team.teamMembers?.forEach((teamMember) => {
              if (teamMember.user.id !== teamRound.team.teamLeader.id) {
                fetchMockSubmissions(teamMember.user.id, round.id).then(
                  (submissionsData) => {
                    setTeamSubmissions((prev) => ({
                      ...prev,
                      [teamRound.team.id]: [
                        ...(prev[teamRound.team.id] || []),
                        ...submissionsData,
                      ],
                    }));
                  }
                );
              }
            });
          });
        });
      });
    });
  }, [hackathonId]);

  const showPopup = (type: string, id: string, note: string) => {
    setActivePopup({ type, id, note });
  };

  return (
    <div className="space-y-4">
      {/* Round tabs */}
      <RoundTabs
        rounds={rounds}
        selectedRoundId={selectedRoundId}
        setSelectedRoundId={setSelectedRoundId}
      />

      {/* Team List for Selected Round */}
      <TeamList
        selectedRoundId={selectedRoundId}
        teamRounds={teamRounds}
        teamSubmissions={teamSubmissions}
        showPopup={showPopup}
      />

      {/* Popup for Notes */}
      {activePopup && (
        <NotePopup activePopup={activePopup} setActivePopup={setActivePopup} />
      )}
    </div>
  );
}
