// src/app/(protected)/organizer-hackathon-management/[id]/resource-management/_components/Submissions.tsx
import { useEffect, useState } from "react";
import { roundService } from "@/services/round.service";
import { teamRoundService } from "@/services/teamRound.service";
import { submissionService } from "@/services/submission.service";
import { teamRoundJudgeService } from "@/services/teamRoundJudge.service";
import { RoundTabs } from "./RoundTabs";
import { TeamList } from "./TeamList";
import { NotePopup } from "./NotePopup";
import { HackathonResultsButton } from "./HackathonResultsButton";
import { Round } from "@/types/entities/round";
import { TeamRound } from "@/types/entities/teamRound";
import { Submission } from "@/types/entities/submission";
import { TeamRoundJudge } from "@/types/entities/teamRoundJudge";
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
  const [teamRoundJudges, setTeamRoundJudges] = useState<{
    [teamRoundId: string]: TeamRoundJudge[];
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

      // Fetch team round judges and submissions for each team round
      for (const teamRound of teamRoundsResponse.data) {
        // Fetch team round judges
        await fetchTeamRoundJudges(teamRound.id);

        // Fetch submissions for the team
        await fetchTeamSubmissions(teamRound.team.id, roundId);
      }
    } catch (error) {
      console.error(`Error fetching team rounds for round ${roundId}:`, error);
      showError(
        "Data Loading Error",
        `Failed to load team data for round ${roundId}`
      );
    }
  };

  const fetchTeamRoundJudges = async (teamRoundId: string) => {
    try {
      const judgesResponse =
        await teamRoundJudgeService.getTeamRoundJudgesByTeamRoundId(
          teamRoundId
        );

      setTeamRoundJudges((prev) => ({
        ...prev,
        [teamRoundId]: judgesResponse.data,
      }));
    } catch (error) {
      console.error(
        `Error fetching judges for team round ${teamRoundId}:`,
        error
      );
      // Don't show error modal to avoid multiple messages
    }
  };

  const fetchTeamSubmissions = async (teamId: string, roundId: string) => {
    try {
      const submissionsResponse =
        await submissionService.getSubmissionsByTeamAndRound(teamId, roundId);

      setTeamSubmissions((prev) => ({
        ...prev,
        [teamId]: submissionsResponse.data,
      }));
    } catch (error) {
      console.error(
        `Error fetching submissions for team ${teamId} in round ${roundId}:`,
        error
      );
      // Don't show error modal to avoid multiple error messages
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
        teamRoundJudges={teamRoundJudges}
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
