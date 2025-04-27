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
import ApiResponseModal from "@/components/common/ApiResponseModal";
import { useApiModal } from "@/hooks/useApiModal";

export default function GradingSubmissionPage() {
  const { user } = useAuth();
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

  useEffect(() => {
    const fetchData = async () => {
      if (!user || !hackathonId) return;

      try {
        setIsLoading(true);

        // Fetch rounds for the hackathon
        const roundsResponse = await roundService.getRoundsByHackathonId(
          hackathonId
        );

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
            showError("Error", "Invalid round data structure");
          }
        } else {
          showError(
            "No Rounds Found",
            "No rounds available for this hackathon"
          );
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        showError("Error", "Failed to load hackathon data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user, hackathonId, showError]);

  const fetchTeamRounds = async (roundId: string) => {
    if (!user) return;

    try {
      // Fetch team rounds where the user is a judge
      const teamRoundsResponse =
        await teamRoundService.getTeamRoundsByJudgeAndRound(user.id, roundId);

      if (!teamRoundsResponse.data) {
        showError("Error", "Failed to load team data");
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
      showError("Error", "Failed to load team data");
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
    await fetchTeamRounds(roundId);
    setIsLoading(false);
  };

  const renderTeamSubmissions = (roundId: string) => {
    // Filter team rounds for the active round
    const roundTeams = teamRounds
      .filter((tr) => tr.round.id === roundId)
      .map((tr) => tr.team);

    return (
      <table className="w-full text-sm text-left">
        <thead className="bg-gray-100 border-b">
          <tr>
            <th className="p-3">Team</th>
            <th className="p-3">Final Score</th>
            <th className="p-3">Your Score</th>
            <th className="p-3">Submission</th>
            <th className="p-3">Action</th>
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
            const judges = teamRound ? teamRoundJudges[teamRound.id] || [] : [];

            // Check if current user is a judge for this team round
            const isJudge = judges.some((judge) => judge.judge.id === user?.id);

            // Get current judge's score for this submission
            const currentJudgeScore = submission?.judgeSubmissions?.find(
              (js) => js.judge.id === user?.id
            )?.score;

            return (
              <tr key={team.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{team.name}</td>
                <td className="p-3">
                  {submission?.finalScore
                    ? `${submission.finalScore.toFixed(1)}/100`
                    : "Pending Final Score"}
                </td>
                <td className="p-3">
                  {currentJudgeScore !== undefined
                    ? `${currentJudgeScore.toFixed(1)}/100`
                    : "Not Marked"}
                </td>
                <td className="p-3">
                  {submission?.fileUrls && submission.fileUrls.length > 0 ? (
                    <FileDownloader
                      files={submission.fileUrls}
                      zipName={`${team.name}-submission-files.zip`}
                    />
                  ) : (
                    "No files"
                  )}
                </td>
                <td className="p-3">
                  {submission && isJudge ? (
                    <Link
                      href={`/grading-submission/${hackathonId}/round/${roundId}/submission/${submission.id}/judge-submission`}
                      className="text-blue-600 hover:underline"
                    >
                      {currentJudgeScore !== undefined ? "Edit Mark" : "Mark"}
                    </Link>
                  ) : (
                    "No submission or not assigned"
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-700"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Hackathon Submissions</h1>

      <div className="flex border-b mb-4">
        {rounds.map((round) => (
          <button
            key={round.id}
            onClick={() => handleRoundChange(round.id)}
            className={`px-4 py-2 ${
              activeRoundId === round.id
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500"
            }`}
          >
            {round.roundTitle}
          </button>
        ))}
      </div>

      {activeRoundId && renderTeamSubmissions(activeRoundId)}

      {/* API Response Modal */}
      {/* <ApiResponseModal
        isOpen={modalState.isOpen}
        onClose={hideModal}
        title={modalState.title}
        message={modalState.message}
        type={modalState.type}
      /> */}
    </div>
  );
}
