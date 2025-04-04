// src/app/(protected)/grading-submission/[id]/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth_v0";
import { fetchMockRounds } from "./_mocks/fetchMockRounds";
import { fetchMockTeamRounds } from "./_mocks/fetchMockTeamRounds";
import { fetchMockSubmissions } from "./_mocks/fetchMockSubmissions";
import { Round } from "@/types/entities/round";
import { TeamRound } from "@/types/entities/teamRound";
import { Submission } from "@/types/entities/submission";
import Link from "next/link";
import { useParams } from "next/navigation";
import { FileDownloader } from "@/components/FileDownloader";

export default function GradingSubmissionPage() {
  const { user } = useAuth();
  const [rounds, setRounds] = useState<Round[]>([]);
  const [activeRoundId, setActiveRoundId] = useState<string | null>(null);
  const [teamRounds, setTeamRounds] = useState<TeamRound[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const params = useParams<{ id: string }>();
  const hackathonId = params.id;

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        const fetchedRounds = await fetchMockRounds("hackathon1");
        setRounds(fetchedRounds);

        if (fetchedRounds.length > 0) {
          setActiveRoundId(fetchedRounds[0].id);
        }

        const teamRoundsPromises = fetchedRounds.map((round) =>
          fetchMockTeamRounds(user.id, round.id)
        );
        const allTeamRounds = await Promise.all(teamRoundsPromises);
        setTeamRounds(allTeamRounds.flat());

        const submissionsPromises = allTeamRounds
          .flat()
          .map((teamRound) =>
            teamRound.team.teamMembers.map((member) =>
              fetchMockSubmissions(member.user.username, teamRound.round.id)
            )
          )
          .flat();

        const allSubmissions = await Promise.all(submissionsPromises);
        setSubmissions(allSubmissions.flat());

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const renderTeamSubmissions = (roundId: string) => {
    // Associate submissions with the correct round
    const teamSubmissionMap = new Map<string, Submission>();
    submissions.forEach((submission) => {
      teamSubmissionMap.set(submission.createdByUserName, submission);
    });

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
            const submission = teamSubmissionMap.get(
              team.teamMembers[0]?.user.username
            );

            // Get current judge's score for this submission
            const currentJudgeScore = submission?.judgeSubmissions?.find(
              (js) => js.judge.id === user?.id
            )?.score;

            // Debug information
            console.log(`Team: ${team.name}`);
            console.log(
              `Team Member Username: ${team.teamMembers[0]?.user.username}`
            );
            console.log(`User ID: ${user?.id}`);
            console.log(`Found Submission:`, submission);
            console.log(`Judge Score:`, currentJudgeScore);

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
                  {submission && (
                    <Link
                      href={`/grading-submission/${hackathonId}/round/${roundId}/submission/${submission.id}/judge-submission`}
                      className="text-blue-600 hover:underline"
                    >
                      {currentJudgeScore !== undefined ? "Edit Mark" : "Mark"}
                    </Link>
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
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Hackathon Submissions</h1>

      <div className="flex border-b mb-4">
        {rounds.map((round) => (
          <button
            key={round.id}
            onClick={() => setActiveRoundId(round.id)}
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
    </div>
  );
}
