// src/app/[locale]/(protected)/grading-submission/[id]/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth_v0";
import { Round } from "@/types/entities/round";
import { TeamRound } from "@/types/entities/teamRound";
import { TeamRoundJudge } from "@/types/entities/teamRoundJudge";
import { Submission } from "@/types/entities/submission";
import Link from "next/link";
import { useParams } from "next/navigation";
import { FileDownloader } from "@/components/FileDownloader";
import { roundService } from "@/services/round.service";
import { teamRoundService } from "@/services/teamRound.service";
import { teamRoundJudgeService } from "@/services/teamRoundJudge.service";
import { submissionService } from "@/services/submission.service";
import { useApiModal } from "@/hooks/useApiModal";
import { useTranslations } from "@/hooks/useTranslations";
import { useToast } from "@/hooks/use-toast";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function GradingSubmissionPage() {
  const { user } = useAuth();
  const t = useTranslations("gradingSubmission");
  const toast = useToast();

  const [rounds, setRounds] = useState<Round[]>([]);
  const [activeRoundId, setActiveRoundId] = useState<string | null>(null);
  const [teamRounds, setTeamRounds] = useState<TeamRound[]>([]);
  const [teamRoundJudges, setTeamRoundJudges] = useState<
    Record<string, TeamRoundJudge[]>
  >({});
  const [submissions, setSubmissions] = useState<Record<string, Submission[]>>(
    {}
  );
  const [isLoading, setIsLoading] = useState(true);

  const params = useParams<{ id: string }>();
  const hackathonId = params.id;

  const { modalState, hideModal, showError } = useApiModal();

  // Helper function to check if round's end time has passed
  const hasRoundEnded = (endTime?: string): boolean => {
    if (!endTime) return false;

    const endDate = new Date(endTime);
    const now = new Date();

    return now > endDate;
  };

  // Helper function to format date for display
  const formatDateTime = (dateTimeStr?: string): string => {
    if (!dateTimeStr) return t("notSpecified");

    try {
      const date = new Date(dateTimeStr);
      return new Intl.DateTimeFormat("default", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date);
    } catch (e) {
      console.error("Error formatting date:", e);
      return dateTimeStr; // Return original string if formatting fails
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!user || !hackathonId) return;

      try {
        setIsLoading(true);

        // Fetch rounds for the hackathon
        const roundsResponse =
          await roundService.getRoundsByHackathonId(hackathonId);

        // More defensive approach
        if (roundsResponse?.data?.length > 0) {
          setRounds(roundsResponse.data);
          console.log("Rounds data:", roundsResponse.data);

          const firstRoundId = roundsResponse.data[0]?.id;
          if (firstRoundId) {
            setActiveRoundId(firstRoundId);

            // Fetch team rounds for the first round
            await fetchTeamRounds(firstRoundId);
          } else {
            showError("Error", t("invalidRoundDataStructure"));
          }
        } else {
          showError(t("noRoundsFound"), t("noRoundsAvailable"));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        showError(t("error"), t("failedToLoadHackathonData"));
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    // Intentionally excluding toast from dependencies to avoid infinite loops
  }, [user, hackathonId, showError, t]);

  const fetchTeamRounds = async (roundId: string) => {
    if (!user) return;

    try {
      // Fetch team rounds where the user is a judge
      const teamRoundsResponse =
        await teamRoundService.getTeamRoundsByJudgeAndRound(user.id, roundId);

      if (!teamRoundsResponse.data) {
        showError(t("error"), t("failedToLoadTeamData"));
        return;
      }

      setTeamRounds(teamRoundsResponse.data);

      // For each team round, fetch judges and submissions in parallel
      const teamRoundIds = teamRoundsResponse.data.map((tr) => tr.id);

      // Start fetching judges and submissions for each team round
      await Promise.all([
        fetchTeamRoundJudges(teamRoundIds),
        fetchSubmissions(teamRoundsResponse.data, roundId),
      ]);
    } catch (error) {
      console.error("Error fetching team rounds:", error);
      showError(t("error"), t("failedToLoadTeamData"));
    }
  };

  const fetchTeamRoundJudges = async (teamRoundIds: string[]) => {
    try {
      // Fetch judges for each team round
      const judgesPromises = teamRoundIds.map((trId) =>
        teamRoundJudgeService.getTeamRoundJudgesByTeamRoundId(trId)
      );

      const judgesResponses = await Promise.all(judgesPromises);

      // Create a map of team round ID to judges
      const judgesMap: Record<string, TeamRoundJudge[]> = {};
      teamRoundIds.forEach((trId, index) => {
        if (judgesResponses[index].data) {
          judgesMap[trId] = judgesResponses[index].data;
        }
      });

      setTeamRoundJudges(judgesMap);
    } catch (error) {
      console.error("Error fetching team round judges:", error);
    }
  };

  const fetchSubmissions = async (
    teamRoundsData: TeamRound[],
    roundId: string
  ) => {
    try {
      // Fetch submissions for each team
      const submissionsPromises = teamRoundsData.map((teamRound) =>
        submissionService.getSubmissionsByTeamAndRound(
          teamRound.team.id,
          roundId
        )
      );

      const submissionsResponses = await Promise.all(submissionsPromises);

      // Create a map of team ID to submissions
      const submissionsMap: Record<string, Submission[]> = {};
      teamRoundsData.forEach((teamRound, index) => {
        if (submissionsResponses[index].data) {
          submissionsMap[teamRound.team.id] = submissionsResponses[index].data;
        }
      });

      setSubmissions(submissionsMap);
    } catch (error) {
      console.error("Error fetching submissions:", error);
    }
  };

  const handleRoundChange = async (roundId: string) => {
    setActiveRoundId(roundId);
    setIsLoading(true);

    try {
      await fetchTeamRounds(roundId);
    } catch (error) {
      console.error("Error changing round:", error);
      toast.error(t("errorChangingRound"));
    } finally {
      setIsLoading(false);
    }
  };

  const renderTeamSubmissions = (roundId: string) => {
    // Find the active round
    const activeRound = rounds.find((round) => round.id === roundId);
    const isRoundEnded = hasRoundEnded(activeRound?.endTime);

    // Filter team rounds for the active round
    const roundTeams = teamRounds
      .filter((tr) => tr.round.id === roundId)
      .map((tr) => tr.team);

    if (roundTeams.length === 0) {
      return (
        <div className="text-center py-8 text-gray-600 dark:text-gray-400">
          {t("noTeamsAssigned")}
        </div>
      );
    }

    return (
      <>
        {!isRoundEnded && activeRound?.endTime && (
          <div className="bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-400 p-4 mb-4 rounded">
            <p className="text-yellow-700 dark:text-yellow-300">
              {t("roundStillActive")} {t("evaluationAvailableAfter")}{" "}
              {formatDateTime(activeRound.endTime)}
            </p>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-100 dark:bg-gray-800 border-b dark:border-gray-700">
              <tr>
                <th className="p-3">{t("team")}</th>
                <th className="p-3">{t("finalScore")}</th>
                <th className="p-3">{t("yourScore")}</th>
                <th className="p-3">{t("submission")}</th>
                <th className="p-3">{t("action")}</th>
              </tr>
            </thead>
            <tbody>
              {roundTeams.map((team) => {
                // Find the submission for this team
                const teamSubmissions = submissions[team.id] || [];
                const submission =
                  teamSubmissions.length > 0 ? teamSubmissions[0] : undefined;

                // Find the team round for this team
                const teamRound = teamRounds.find(
                  (tr) => tr.team.id === team.id && tr.round.id === roundId
                );

                // Get judges for this team round
                const judges = teamRound
                  ? teamRoundJudges[teamRound.id] || []
                  : [];

                // Check if current user is a judge for this team round
                const isJudge = judges.some(
                  (judge) => judge.judge.id === user?.id
                );

                // Get current judge's score for this submission
                const currentJudgeScore = submission?.judgeSubmissions?.find(
                  (js) => js.judge.id === user?.id
                )?.score;

                return (
                  <tr
                    key={team.id}
                    className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors duration-150"
                  >
                    <td className="p-3">{team.name}</td>
                    <td className="p-3">
                      {submission?.finalScore
                        ? `${submission.finalScore.toFixed(1)}/100`
                        : t("pendingFinalScore")}
                    </td>
                    <td className="p-3">
                      {currentJudgeScore !== undefined
                        ? `${currentJudgeScore.toFixed(1)}/100`
                        : t("notMarked")}
                    </td>
                    <td className="p-3">
                      {submission?.fileUrls &&
                      submission.fileUrls.length > 0 ? (
                        <FileDownloader
                          files={submission.fileUrls}
                          zipName={`${team.name}-submission-files.zip`}
                        />
                      ) : (
                        t("noFiles")
                      )}
                    </td>
                    <td className="p-3">
                      {submission && isJudge ? (
                        isRoundEnded ? (
                          <Link
                            href={`/grading-submission/${hackathonId}/round/${roundId}/submission/${submission.id}/judge-submission`}
                            className="text-blue-600 dark:text-blue-400 hover:underline transition-colors duration-150"
                          >
                            {currentJudgeScore !== undefined
                              ? t("editMark")
                              : t("mark")}
                          </Link>
                        ) : (
                          <span className="text-gray-500 dark:text-gray-400 cursor-not-allowed">
                            {t("evaluationNotAvailableYet")}
                          </span>
                        )
                      ) : (
                        t("noSubmissionOrNotAssigned")
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </>
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner size="lg" showText />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 transition-colors duration-300">
      <h1 className="text-xl md:text-2xl font-bold mb-4 text-gray-900 dark:text-white">
        {t("hackathonSubmissions")}
      </h1>

      <div className="flex flex-wrap border-b mb-4 dark:border-gray-700 overflow-x-auto">
        {rounds.map((round) => (
          <button
            key={round.id}
            onClick={() => handleRoundChange(round.id)}
            className={`px-3 md:px-4 py-2 whitespace-nowrap transition-colors duration-150 ${
              activeRoundId === round.id
                ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
                : "text-gray-500 dark:text-gray-400"
            }`}
          >
            {round.roundTitle}
          </button>
        ))}
      </div>

      {rounds.length === 0 && (
        <div className="bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-400 p-4 mb-4 rounded">
          <p className="text-yellow-700 dark:text-yellow-300">
            {t("noRoundsFound")}
          </p>
        </div>
      )}

      {activeRoundId && renderTeamSubmissions(activeRoundId)}
    </div>
  );
}
