import { Round } from "@/types/entities/round";
import { TeamRound } from "@/types/entities/teamRound";
import { Submission } from "@/types/entities/submission";
import { HackathonResult } from "@/types/entities/hackathonResult";

export const calculateTeamTotalScores = (
  rounds: Round[],
  teamRounds: { [roundId: string]: TeamRound[] },
  teamSubmissions: { [teamId: string]: Submission[] }
): {
  teamScores: { teamId: string; teamName: string; totalScore: number }[];
  teamsWithMissingScores: string[];
} => {
  const finalRound = [...rounds].sort(
    (a, b) => b.roundNumber - a.roundNumber
  )[0];
  if (!finalRound) return { teamScores: [], teamsWithMissingScores: [] };

  const finalRoundTeams = teamRounds[finalRound.id] || [];
  const teamScores: { teamId: string; teamName: string; totalScore: number }[] =
    [];
  const teamsWithMissingScores: string[] = [];

  // For each team in the final round
  finalRoundTeams.forEach((teamRound) => {
    const teamId = teamRound.team.id;
    const teamName = teamRound.team.name;
    let totalScore = 0;
    let hasMissingScore = false;

    // Check all rounds for this team
    rounds.forEach((round) => {
      const roundTeams = teamRounds[round.id] || [];
      const isTeamInRound = roundTeams.some((tr) => tr.team.id === teamId);

      if (isTeamInRound) {
        // Filter submissions for this team and round
        const teamSubmissionsForRound = (teamSubmissions[teamId] || []).filter(
          (submission) => submission.round && submission.round.id === round.id
        );

        // Find the latest submitted submission for this round
        const latestSubmission = teamSubmissionsForRound
          .filter(
            (submission) =>
              submission.status === "SUBMITTED" && submission.submittedAt
          )
          .sort(
            (a, b) =>
              new Date(b.submittedAt).getTime() -
              new Date(a.submittedAt).getTime()
          )[0];

        if (
          !latestSubmission ||
          latestSubmission.finalScore === undefined ||
          latestSubmission.finalScore === null
        ) {
          hasMissingScore = true;
        } else {
          totalScore += latestSubmission.finalScore;
        }
      }
    });

    if (hasMissingScore) {
      teamsWithMissingScores.push(teamName);
    } else {
      teamScores.push({ teamId, teamName, totalScore });
    }
  });

  // Sort by total score in descending order to determine placement
  return {
    teamScores: teamScores.sort((a, b) => b.totalScore - a.totalScore),
    teamsWithMissingScores,
  };
};

export const prepareHackathonResults = (
  hackathonId: string,
  teamScores: { teamId: string; teamName: string; totalScore: number }[]
): Omit<
  HackathonResult,
  "id" | "createdAt" | "updatedAt" | "createdBy" | "updatedBy"
>[] => {
  return teamScores.map((team, index) => ({
    hackathonId,
    teamId: team.teamId,
    totalScore: team.totalScore,
    placement: index + 1, // Placement starts from 1 for highest score
    award: "none",
  }));
};
