// src/app/(protected)/organizer-hackathon-management/[id]/resource-management/_components/Submissions.tsx
import { useEffect, useState } from "react";
import { fetchMockRounds } from "../_mocks/fetchMockRounds";
import { fetchMockTeamRounds } from "../_mocks/fetchMockTeamRounds";
import { fetchMockSubmissions } from "../_mocks/fetchMockSubmissions";
import { Round } from "@/types/entities/round";
import { TeamRound } from "@/types/entities/teamRound";
import { Submission } from "@/types/entities/submission";
import Image from "next/image";
import { JudgeSubmission } from "@/types/entities/judgeSubmission";

export default function Submissions({ hackathonId }: { hackathonId: string }) {
  const [rounds, setRounds] = useState<Round[]>([]);
  const [selectedRoundId, setSelectedRoundId] = useState<string | null>(null);
  const [teamRounds, setTeamRounds] = useState<{
    [roundId: string]: TeamRound[];
  }>({});
  const [teamSubmissions, setTeamSubmissions] = useState<{
    [teamId: string]: Submission[];
  }>({});
  const [expandedTeams, setExpandedTeams] = useState<{
    [key: string]: boolean;
  }>({});
  const [expandedTeamInfo, setExpandedTeamInfo] = useState<{
    [key: string]: boolean;
  }>({});
  const [expandedSubmissions, setExpandedSubmissions] = useState<{
    [key: string]: boolean;
  }>({});
  const [expandedJudgeSubmissions, setExpandedJudgeSubmissions] = useState<{
    [key: string]: boolean;
  }>({});
  const [expandedJudgeDetails, setExpandedJudgeDetails] = useState<{
    [key: string]: boolean;
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

  const toggleTeamExpand = (teamId: string) => {
    setExpandedTeams((prev) => ({
      ...prev,
      [teamId]: !prev[teamId],
    }));
  };

  const toggleTeamInfoExpand = (teamId: string) => {
    setExpandedTeamInfo((prev) => ({
      ...prev,
      [teamId]: !prev[teamId],
    }));
  };

  const toggleSubmissionsExpand = (teamId: string) => {
    setExpandedSubmissions((prev) => ({
      ...prev,
      [teamId]: !prev[teamId],
    }));
  };

  const toggleJudgeSubmissionsExpand = (submissionId: string) => {
    setExpandedJudgeSubmissions((prev) => ({
      ...prev,
      [submissionId]: !prev[submissionId],
    }));
  };

  const toggleJudgeDetailsExpand = (judgeSubmissionId: string) => {
    setExpandedJudgeDetails((prev) => ({
      ...prev,
      [judgeSubmissionId]: !prev[judgeSubmissionId],
    }));
  };

  const showPopup = (type: string, id: string, note: string) => {
    setActivePopup({ type, id, note });
  };

  const getLatestSubmission = (submissions: Submission[]) => {
    if (!submissions || submissions.length === 0) return null;

    const submittedSubmissions = submissions.filter(
      (sub) => sub.status === "SUBMITTED" && sub.submittedAt
    );

    if (submittedSubmissions.length === 0) return null;

    return submittedSubmissions.sort((a, b) => {
      return (
        new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
      );
    })[0];
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  return (
    <div className="space-y-4">
      {/* Round tabs */}
      <div className="flex space-x-2 overflow-x-auto border-b mb-4">
        {rounds.map((round) => (
          <button
            key={round.id}
            className={`p-2 ${
              selectedRoundId === round.id
                ? "border-b-2 border-green-500 text-green-500"
                : "text-gray-600"
            }`}
            onClick={() => setSelectedRoundId(round.id)}
          >
            {round.roundTitle}
          </button>
        ))}
      </div>

      {/* Team List for Selected Round */}
      {selectedRoundId && teamRounds[selectedRoundId]?.length > 0 ? (
        <div className="space-y-4">
          {teamRounds[selectedRoundId].map((teamRound) => (
            <div
              key={teamRound.id}
              className="bg-white p-4 rounded-lg shadow-md"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium text-gray-800">
                    {teamRound.team.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Status:{" "}
                    <span className="font-semibold">{teamRound.status}</span>
                  </p>
                </div>
                <div className="space-x-2">
                  <button
                    onClick={() => toggleTeamInfoExpand(teamRound.team.id)}
                    className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
                  >
                    {expandedTeamInfo[teamRound.team.id]
                      ? "Hide Info"
                      : "Team Info"}
                  </button>
                  <button
                    onClick={() => toggleSubmissionsExpand(teamRound.team.id)}
                    className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
                  >
                    {expandedSubmissions[teamRound.team.id]
                      ? "Hide Submissions"
                      : "All Submissions"}
                  </button>
                </div>
              </div>

              {/* Team Info Section */}
              {expandedTeamInfo[teamRound.team.id] && (
                <div className="mt-4 p-3 bg-gray-50 rounded-md">
                  <h4 className="font-semibold mb-2">Team Information</h4>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Team Leader:</span>{" "}
                    {teamRound.team.teamLeader.firstName}{" "}
                    {teamRound.team.teamLeader.lastName} (
                    {teamRound.team.teamLeader.email})
                  </p>

                  {teamRound.team.teamMembers &&
                    teamRound.team.teamMembers.length > 0 && (
                      <div className="mt-2">
                        <p className="font-medium text-sm">Team Members:</p>
                        <ul className="pl-5 list-disc text-sm text-gray-700">
                          {teamRound.team.teamMembers
                            .filter(
                              (member) =>
                                member.user.id !== teamRound.team.teamLeader.id
                            )
                            .map((member) => (
                              <li key={member.id}>
                                {member.user.firstName} {member.user.lastName} (
                                {member.user.email})
                              </li>
                            ))}
                        </ul>
                      </div>
                    )}
                </div>
              )}

              {/* Latest Submission Section */}
              {teamSubmissions[teamRound.team.id] && (
                <div className="mt-4">
                  <h4 className="font-medium text-gray-800">
                    Latest Submission
                  </h4>
                  {(() => {
                    const latestSubmission = getLatestSubmission(
                      teamSubmissions[teamRound.team.id]
                    );

                    if (!latestSubmission) {
                      return (
                        <p className="text-sm text-gray-500 italic">
                          No submissions yet.
                        </p>
                      );
                    }

                    return (
                      <div className="p-3 bg-blue-50 rounded-md mt-2">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm">
                              <span className="font-medium">Submitted:</span>{" "}
                              {formatDate(latestSubmission.submittedAt)}
                            </p>
                            <p className="text-sm">
                              <span className="font-medium">Status:</span>{" "}
                              {latestSubmission.status}
                            </p>
                            {latestSubmission.finalScore !== undefined && (
                              <p className="text-sm">
                                <span className="font-medium">
                                  Final Score:
                                </span>{" "}
                                {latestSubmission.finalScore}
                              </p>
                            )}
                          </div>
                          <button
                            onClick={() =>
                              toggleJudgeSubmissionsExpand(latestSubmission.id)
                            }
                            className="px-3 py-1 text-sm bg-blue-200 rounded hover:bg-blue-300"
                          >
                            {expandedJudgeSubmissions[latestSubmission.id]
                              ? "Hide Judgements"
                              : `Judge Evaluations (${latestSubmission.judgeSubmissions.length})`}
                          </button>
                        </div>

                        {/* Files */}
                        {latestSubmission.fileUrls &&
                          latestSubmission.fileUrls.length > 0 && (
                            <div className="mt-2">
                              <p className="font-medium text-sm">Files:</p>
                              <ul className="text-sm text-gray-700">
                                {latestSubmission.fileUrls.map((file) => (
                                  <li
                                    key={file.id}
                                    className="flex items-center"
                                  >
                                    <svg
                                      className="w-4 h-4 mr-1 text-gray-500"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                      ></path>
                                    </svg>
                                    {file.fileName}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                        {/* Judge Submissions */}
                        {expandedJudgeSubmissions[latestSubmission.id] && (
                          <div className="mt-3 space-y-3">
                            <h5 className="font-medium text-sm border-b pb-1">
                              Judge Evaluations
                            </h5>

                            {latestSubmission.judgeSubmissions.length === 0 ? (
                              <p className="text-sm text-gray-500 italic">
                                No judge evaluations yet.
                              </p>
                            ) : (
                              latestSubmission.judgeSubmissions.map(
                                (judgeSubmission: JudgeSubmission) => (
                                  <div
                                    key={judgeSubmission.id}
                                    className="p-2 bg-white rounded border border-gray-200"
                                  >
                                    <div className="flex justify-between items-center">
                                      <div className="flex items-center">
                                        <div className="w-8 h-8 flex items-center justify-center bg-gray-300 text-xs rounded-full mr-2">
                                          {judgeSubmission.judge.firstName[0]}
                                          {judgeSubmission.judge.lastName[0]}
                                        </div>
                                        <div>
                                          <p className="text-sm font-medium">
                                            {judgeSubmission.judge.firstName}{" "}
                                            {judgeSubmission.judge.lastName}
                                          </p>
                                          <p className="text-xs text-gray-500">
                                            {judgeSubmission.judge.email}
                                          </p>
                                        </div>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <span className="font-bold text-lg">
                                          {judgeSubmission.score}
                                        </span>
                                        <button
                                          onClick={() =>
                                            showPopup(
                                              "judgeNote",
                                              judgeSubmission.id,
                                              judgeSubmission.note
                                            )
                                          }
                                          className="p-1 text-gray-500 hover:text-blue-500"
                                          title="View Judge Note"
                                        >
                                          <svg
                                            className="w-5 h-5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                          >
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeWidth="2"
                                              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                            ></path>
                                          </svg>
                                        </button>
                                        <button
                                          onClick={() =>
                                            toggleJudgeDetailsExpand(
                                              judgeSubmission.id
                                            )
                                          }
                                          className="p-1 text-gray-500 hover:text-blue-500"
                                          title="View Scoring Details"
                                        >
                                          {expandedJudgeDetails[
                                            judgeSubmission.id
                                          ] ? (
                                            <svg
                                              className="w-5 h-5"
                                              fill="none"
                                              stroke="currentColor"
                                              viewBox="0 0 24 24"
                                              xmlns="http://www.w3.org/2000/svg"
                                            >
                                              <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M5 15l7-7 7 7"
                                              ></path>
                                            </svg>
                                          ) : (
                                            <svg
                                              className="w-5 h-5"
                                              fill="none"
                                              stroke="currentColor"
                                              viewBox="0 0 24 24"
                                              xmlns="http://www.w3.org/2000/svg"
                                            >
                                              <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M19 9l-7 7-7-7"
                                              ></path>
                                            </svg>
                                          )}
                                        </button>
                                      </div>
                                    </div>

                                    {/* Judge Submission Details */}
                                    {expandedJudgeDetails[judgeSubmission.id] &&
                                      judgeSubmission.judgeSubmissionDetails && (
                                        <div className="mt-3 pl-10">
                                          <h6 className="text-xs font-medium text-gray-500 mb-2">
                                            Scoring Details
                                          </h6>
                                          <div className="space-y-2">
                                            {judgeSubmission.judgeSubmissionDetails.map(
                                              (detail) => (
                                                <div
                                                  key={detail.id}
                                                  className="flex justify-between items-center py-1 border-b border-gray-100"
                                                >
                                                  <div className="flex items-center">
                                                    <p className="text-sm">
                                                      {
                                                        detail
                                                          .roundMarkCriterion
                                                          .name
                                                      }
                                                      <button
                                                        onClick={() =>
                                                          showPopup(
                                                            "criterionNote",
                                                            detail
                                                              .roundMarkCriterion
                                                              .id,
                                                            detail
                                                              .roundMarkCriterion
                                                              .note
                                                          )
                                                        }
                                                        className="ml-1 text-gray-400 hover:text-blue-500"
                                                      >
                                                        <svg
                                                          className="w-4 h-4 inline"
                                                          fill="none"
                                                          stroke="currentColor"
                                                          viewBox="0 0 24 24"
                                                          xmlns="http://www.w3.org/2000/svg"
                                                        >
                                                          <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="2"
                                                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                          ></path>
                                                        </svg>
                                                      </button>
                                                    </p>
                                                  </div>
                                                  <div className="flex items-center space-x-2">
                                                    <span className="text-sm font-medium">
                                                      {detail.score} /{" "}
                                                      {
                                                        detail
                                                          .roundMarkCriterion
                                                          .maxScore
                                                      }
                                                    </span>
                                                    <button
                                                      onClick={() =>
                                                        showPopup(
                                                          "detailNote",
                                                          detail.id,
                                                          detail.note
                                                        )
                                                      }
                                                      className="text-gray-400 hover:text-blue-500"
                                                    >
                                                      <svg
                                                        className="w-4 h-4"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                      >
                                                        <path
                                                          strokeLinecap="round"
                                                          strokeLinejoin="round"
                                                          strokeWidth="2"
                                                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                        ></path>
                                                      </svg>
                                                    </button>
                                                  </div>
                                                </div>
                                              )
                                            )}
                                          </div>
                                        </div>
                                      )}
                                  </div>
                                )
                              )
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* All Submissions Section */}
              {expandedSubmissions[teamRound.team.id] && (
                <div className="mt-4 p-3 bg-gray-50 rounded-md">
                  <h4 className="font-medium mb-2">All Submissions</h4>
                  {!teamSubmissions[teamRound.team.id] ||
                  teamSubmissions[teamRound.team.id].length === 0 ? (
                    <p className="text-sm text-gray-500 italic">
                      No submissions found for this team.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {teamSubmissions[teamRound.team.id]
                        .sort((a, b) => {
                          // Sort by submittedAt, with SUBMITTED items first
                          if (
                            a.status === "SUBMITTED" &&
                            b.status !== "SUBMITTED"
                          )
                            return -1;
                          if (
                            a.status !== "SUBMITTED" &&
                            b.status === "SUBMITTED"
                          )
                            return 1;
                          if (a.submittedAt && b.submittedAt)
                            return (
                              new Date(b.submittedAt).getTime() -
                              new Date(a.submittedAt).getTime()
                            );
                          return 0;
                        })
                        .map((submission) => (
                          <div
                            key={submission.id}
                            className="p-2 bg-white rounded border border-gray-200"
                          >
                            <div className="flex justify-between">
                              <div>
                                <p className="text-sm">
                                  <span className="font-medium">Status:</span>{" "}
                                  {submission.status}
                                </p>
                                <p className="text-sm">
                                  <span className="font-medium">
                                    Created by:
                                  </span>{" "}
                                  {submission.createdBy.firstName}{" "}
                                  {submission.createdBy.lastName}
                                </p>
                                {submission.submittedAt && (
                                  <p className="text-sm">
                                    <span className="font-medium">
                                      Submitted:
                                    </span>{" "}
                                    {formatDate(submission.submittedAt)}
                                  </p>
                                )}
                                {submission.finalScore !== undefined && (
                                  <p className="text-sm">
                                    <span className="font-medium">
                                      Final Score:
                                    </span>{" "}
                                    {submission.finalScore}
                                  </p>
                                )}
                              </div>
                              <div>
                                {submission.fileUrls && (
                                  <p className="text-sm">
                                    <span className="font-medium">Files:</span>{" "}
                                    {submission.fileUrls.length}
                                  </p>
                                )}
                                {submission.judgeSubmissions && (
                                  <p className="text-sm">
                                    <span className="font-medium">
                                      Judge evaluations:
                                    </span>{" "}
                                    {submission.judgeSubmissions.length}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">
          {selectedRoundId
            ? "No teams found for this round."
            : "Please select a round to view teams."}
        </p>
      )}

      {/* Popup for Notes */}
      {activePopup && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">
                {activePopup.type === "judgeNote"
                  ? "Judge Note"
                  : activePopup.type === "criterionNote"
                  ? "Criterion Description"
                  : "Evaluation Note"}
              </h3>
              <button
                onClick={() => setActivePopup(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </button>
            </div>
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="text-gray-800">
                {activePopup.note || "No additional notes provided."}
              </p>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setActivePopup(null)}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
