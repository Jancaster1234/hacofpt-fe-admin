// src/app/(protected)/grading-submission/[id]/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth_v0";
import { Round } from "@/types/entities/round";
import { TeamRound } from "@/types/entities/teamRound";
import { Submission } from "@/types/entities/submission";
import Link from "next/link";
import { useParams } from "next/navigation";
import { FileDownloader } from "@/components/FileDownloader";
import { roundService } from "@/services/round.service";
import { teamRoundService } from "@/services/teamRound.service";
import { submissionService } from "@/services/submission.service";
import ApiResponseModal from "@/components/common/ApiResponseModal";
import { useApiModal } from "@/hooks/useApiModal";

export default function GradingSubmissionPage() {
  const { user } = useAuth();
  const [rounds, setRounds] = useState<Round[]>([]);
  const [activeRoundId, setActiveRoundId] = useState<string | null>(null);
  const [teamRounds, setTeamRounds] = useState<TeamRound[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
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

        if (!roundsResponse.data || roundsResponse.data.length === 0) {
          showError(
            "No Rounds Found",
            "No rounds available for this hackathon"
          );
          setIsLoading(false);
          return;
        }

        setRounds(roundsResponse.data);

        // Set the first round as the active round
        const firstRoundId = roundsResponse.data[0].id;
        setActiveRoundId(firstRoundId);

        // Fetch team rounds for the first round
        await fetchTeamRoundsAndSubmissions(firstRoundId);
      } catch (error) {
        console.error("Error fetching data:", error);
        showError("Error", "Failed to load hackathon data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user, hackathonId, showError]);

  const fetchTeamRoundsAndSubmissions = async (roundId: string) => {
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

      // Fetch submissions for each team
      const submissionsPromises = teamRoundsResponse.data.map((teamRound) => {
        // Using the username of the first team member for demonstration
        // In a real app, you might want to fetch by team ID instead
        const username = teamRound.team.teamMembers[0]?.user.username;
        return username
          ? submissionService.getSubmissionsByRoundAndCreator(roundId, username)
          : Promise.resolve({ data: [] });
      });

      const submissionsResponses = await Promise.all(submissionsPromises);
      const allSubmissions = submissionsResponses
        .filter((response) => response.data)
        .flatMap((response) => response.data);

      setSubmissions(allSubmissions);
    } catch (error) {
      console.error("Error fetching team rounds and submissions:", error);
      showError("Error", "Failed to load team and submission data");
    }
  };

  const handleRoundChange = async (roundId: string) => {
    setActiveRoundId(roundId);
    await fetchTeamRoundsAndSubmissions(roundId);
  };

  const renderTeamSubmissions = (roundId: string) => {
    // Create a map of submissions by team
    const teamSubmissionMap = new Map<string, Submission>();

    // Associate submissions with teams based on team members' usernames
    submissions.forEach((submission) => {
      teamRounds.forEach((tr) => {
        if (
          tr.team.teamMembers.some(
            (member) => member.user.username === submission.createdByUserName
          )
        ) {
          teamSubmissionMap.set(tr.team.id, submission);
        }
      });
    });

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
            const submission = teamSubmissionMap.get(team.id);

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
                  {submission ? (
                    <Link
                      href={`/grading-submission/${hackathonId}/round/${roundId}/submission/${submission.id}/judge-submission`}
                      className="text-blue-600 hover:underline"
                    >
                      {currentJudgeScore !== undefined ? "Edit Mark" : "Mark"}
                    </Link>
                  ) : (
                    "No submission"
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
      <ApiResponseModal
        isOpen={modalState.isOpen}
        onClose={hideModal}
        title={modalState.title}
        message={modalState.message}
        type={modalState.type}
      />
    </div>
  );
}
