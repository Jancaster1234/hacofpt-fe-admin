// src/app/(protected)/organizer-hackathon-management/[id]/resource-management/_components/Submissions.tsx
import { useEffect, useState } from "react";
import { roundService } from "@/services/round.service";
import { teamRoundService } from "@/services/teamRound.service";
import { submissionService } from "@/services/submission.service";
import { RoundTabs } from "./RoundTabs";
import { TeamList } from "./TeamList";
import { NotePopup } from "./NotePopup";
import { HackathonResultsButton } from "./HackathonResultsButton";
import { Round } from "@/types/entities/round";
import { TeamRound } from "@/types/entities/teamRound";
import { Submission } from "@/types/entities/submission";
import { useApiModal } from "@/hooks/useApiModal";

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
  const [isLoading, setIsLoading] = useState(true);
  const { showError } = useApiModal();

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        // Fetch rounds
        const roundsResponse = await roundService.getRoundsByHackathonId(
          hackathonId
        );

        if (!roundsResponse.data.length) {
          setIsLoading(false);
          return;
        }

        // Sort rounds by roundNumber
        const sortedRounds = [...roundsResponse.data].sort(
          (a, b) => a.roundNumber - b.roundNumber
        );
        setRounds(sortedRounds);

        // Select the first round by default
        if (sortedRounds.length > 0) {
          setSelectedRoundId(sortedRounds[0].id);
          await fetchTeamRoundsAndSubmissions(sortedRounds[0].id);
        }

        // Fetch team rounds for each round
        for (const round of sortedRounds) {
          if (round.id !== sortedRounds[0].id) {
            // Skip the first round as it's already fetched
            await fetchTeamRoundsAndSubmissions(round.id);
          }
        }
      } catch (error) {
        console.error("Error fetching submissions data:", error);
        showError(
          "Data Loading Error",
          "Failed to load submission data. Please try again later."
        );
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [hackathonId, showError]);

  const fetchTeamRoundsAndSubmissions = async (roundId: string) => {
    try {
      // Fetch team rounds for the round
      const teamRoundsResponse = await teamRoundService.getTeamRoundsByRoundId(
        roundId
      );
      setTeamRounds((prev) => ({
        ...prev,
        [roundId]: teamRoundsResponse.data,
      }));

      // Fetch submissions for each team
      for (const teamRound of teamRoundsResponse.data) {
        // For team leader
        if (teamRound.team.teamLeader) {
          await fetchAndSetSubmissions(
            teamRound.team.id,
            teamRound.team.teamLeader.id,
            roundId
          );
        }

        // For each team member
        if (teamRound.team.teamMembers) {
          for (const teamMember of teamRound.team.teamMembers) {
            if (teamMember.user.id !== teamRound.team.teamLeader.id) {
              await fetchAndSetSubmissions(
                teamRound.team.id,
                teamMember.user.id,
                roundId
              );
            }
          }
        }
      }
    } catch (error) {
      console.error(`Error fetching team rounds for round ${roundId}:`, error);
      showError(
        "Data Loading Error",
        `Failed to load team data for round ${roundId}`
      );
    }
  };

  const fetchAndSetSubmissions = async (
    teamId: string,
    userId: string,
    roundId: string
  ) => {
    try {
      const submissionsResponse =
        await submissionService.getSubmissionsByRoundAndCreator(
          roundId,
          userId
        );

      setTeamSubmissions((prev) => ({
        ...prev,
        [teamId]: [...(prev[teamId] || []), ...submissionsResponse.data],
      }));
    } catch (error) {
      console.error(
        `Error fetching submissions for user ${userId} in round ${roundId}:`,
        error
      );
      // We don't show error modal here to avoid multiple error messages for the same team
    }
  };

  const showPopup = (type: string, id: string, note: string) => {
    setActivePopup({ type, id, note });
  };

  if (isLoading) {
    return <div className="py-8 text-center">Loading submissions data...</div>;
  }

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

      {/* Hackathon Results Button */}
      <div className="border-t border-gray-200 pt-4 mt-8">
        <h3 className="text-lg font-medium text-gray-800 mb-2">
          Hackathon Results
        </h3>
        <HackathonResultsButton
          hackathonId={hackathonId}
          rounds={rounds}
          teamRounds={teamRounds}
          teamSubmissions={teamSubmissions}
        />
      </div>

      {/* Popup for Notes */}
      {activePopup && (
        <NotePopup activePopup={activePopup} setActivePopup={setActivePopup} />
      )}
    </div>
  );
}
