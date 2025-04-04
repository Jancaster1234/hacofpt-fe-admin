// src/app/(protected)/mentor-team/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth_v0";
import { fetchMockMentorTeams } from "./_mocks/fetchMockMentorTeams";
import { MentorTeam } from "@/types/entities/mentorTeam";
import { MentorshipSessionRequest } from "@/types/entities/mentorshipSessionRequest";
import { ChevronDown, ChevronUp, Users, Info } from "lucide-react";

export default function MentorTeamsPage() {
  const { user } = useAuth();
  const [mentorTeams, setMentorTeams] = useState<MentorTeam[]>([]);
  const [expandedHackathons, setExpandedHackathons] = useState<
    Record<string, boolean>
  >({});
  const [expandedTeams, setExpandedTeams] = useState<Record<string, boolean>>(
    {}
  );
  const [expandedTeamInfo, setExpandedTeamInfo] = useState<
    Record<string, boolean>
  >({});

  useEffect(() => {
    if (user) {
      fetchMockMentorTeams(user.id).then(setMentorTeams);
    }
  }, [user]);

  // Group mentor teams by hackathon title
  const groupedByHackathon = mentorTeams.reduce((acc, mentorTeam) => {
    const hackathonTitle = mentorTeam.hackathon?.title || "Unknown Hackathon";
    if (!acc[hackathonTitle]) {
      acc[hackathonTitle] = [];
    }
    acc[hackathonTitle].push(mentorTeam);
    return acc;
  }, {} as Record<string, MentorTeam[]>);

  const toggleHackathon = (title: string) => {
    setExpandedHackathons((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const toggleTeam = (teamId: string) => {
    setExpandedTeams((prev) => ({
      ...prev,
      [teamId]: !prev[teamId],
    }));
  };

  const toggleTeamInfo = (teamId: string) => {
    setExpandedTeamInfo((prev) => ({
      ...prev,
      [teamId]: !prev[teamId],
    }));
  };

  // Add this function inside the MentorTeamsPage component
  const updateMentorshipSessionStatus = async (
    sessionId: string,
    newStatus: "approved" | "rejected"
  ) => {
    if (!user) return;

    // Find the session to update
    let updatedSession: MentorshipSessionRequest | null = null;
    let updatedTeams = [...mentorTeams];

    // Find and update the session in our state
    updatedTeams = updatedTeams.map((team) => {
      if (team.mentorshipSessionRequests) {
        const updatedRequests = team.mentorshipSessionRequests.map(
          (request) => {
            if (request.id === sessionId && request.status === "pending") {
              updatedSession = {
                ...request,
                status: newStatus,
                evaluatedById: user.id,
                evaluatedBy: {
                  id: user.id,
                  firstName: user.firstName || "Unknown",
                  lastName: user.lastName || "Unknown",
                },
                evaluatedAt: new Date().toISOString(),
              };
              return updatedSession;
            }
            return request;
          }
        );

        return {
          ...team,
          mentorshipSessionRequests: updatedRequests,
        };
      }
      return team;
    });

    if (updatedSession) {
      // Update the local state first for immediate UI feedback
      setMentorTeams(updatedTeams);

      try {
        // This would be replaced with your actual API call
        // Simulating API call with timeout
        await new Promise((resolve) => setTimeout(resolve, 500));

        // In a real implementation, you would have something like:
        // const response = await fetch(`/api/mentorship-sessions/${sessionId}`, {
        //   method: 'PATCH',
        //   headers: {
        //     'Content-Type': 'application/json',
        //   },
        //   body: JSON.stringify({
        //     status: newStatus,
        //     evaluatedById: user.id,
        //     evaluatedAt: new Date().toISOString()
        //   }),
        // });

        console.log(`Session ${sessionId} status updated to ${newStatus}`);
      } catch (error) {
        console.error("Failed to update session status:", error);
        // Revert state on error
        fetchMockMentorTeams(user.id).then(setMentorTeams);
      }
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-3xl font-bold text-gray-900 text-center mb-6">
        Mentor Teams
      </h1>

      {Object.keys(groupedByHackathon).length === 0 ? (
        <p className="text-center text-gray-600">No mentor teams found.</p>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedByHackathon).map(([hackathonTitle, teams]) => (
            <div
              key={hackathonTitle}
              className="bg-white p-4 rounded-lg shadow-md"
            >
              {/* Hackathon Title Header */}
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => toggleHackathon(hackathonTitle)}
              >
                <h2 className="text-xl font-semibold">{hackathonTitle}</h2>
                {expandedHackathons[hackathonTitle] ? (
                  <ChevronUp />
                ) : (
                  <ChevronDown />
                )}
              </div>

              {/* Mentor Teams (Expandable) */}
              {expandedHackathons[hackathonTitle] && (
                <div className="mt-4 space-y-4">
                  {teams.map((team) => (
                    <div
                      key={team.id}
                      className="border p-3 rounded-md bg-gray-50"
                    >
                      {/* Team Header */}
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <Users className="text-blue-600" />
                          <p className="text-lg font-medium">
                            {team.team?.name || "Unknown Team"}
                          </p>
                        </div>
                        {/* Expand Team Info Icon */}
                        <Info
                          className="text-gray-600 cursor-pointer hover:text-gray-900"
                          onClick={() => toggleTeamInfo(team.id)}
                        />
                      </div>

                      {/* Team Info (Expandable) */}
                      {expandedTeamInfo[team.id] && (
                        <div className="mt-2 p-3 bg-white shadow rounded-md">
                          <p>
                            <strong>Team Name:</strong>{" "}
                            {team.team?.name || "N/A"}
                          </p>

                          <p>
                            <strong>Created At:</strong>{" "}
                            {new Date(team.createdAt).toLocaleString()}
                          </p>
                        </div>
                      )}

                      {/* Mentorship Session Requests (Expandable) */}
                      <div
                        className="mt-2 cursor-pointer"
                        onClick={() => toggleTeam(team.id)}
                      >
                        <p className="text-blue-600 font-semibold">
                          {expandedTeams[team.id]
                            ? "Hide Sessions"
                            : "View Sessions"}
                        </p>
                      </div>
                      {expandedTeams[team.id] && (
                        <div className="mt-3 space-y-2">
                          {team.mentorshipSessionRequests?.length ? (
                            team.mentorshipSessionRequests.map((session) => (
                              <div
                                key={session.id}
                                className="border-l-4 border-blue-500 p-2 bg-white shadow-sm rounded-md"
                              >
                                <p>
                                  <strong>Location:</strong>{" "}
                                  {session.location || "N/A"}
                                </p>
                                <p>
                                  <strong>Description:</strong>{" "}
                                  {session.description}
                                </p>
                                <p>
                                  <strong>Time:</strong>{" "}
                                  {new Date(
                                    session.startTime || ""
                                  ).toLocaleString()}{" "}
                                  -{" "}
                                  {new Date(
                                    session.endTime || ""
                                  ).toLocaleString()}
                                </p>
                                <p>
                                  <strong>Status:</strong>{" "}
                                  <span
                                    className={`font-semibold ${
                                      session.status === "pending"
                                        ? "text-yellow-500"
                                        : session.status === "approved"
                                        ? "text-green-600"
                                        : "text-red-600"
                                    }`}
                                  >
                                    {session.status}
                                  </span>
                                </p>
                                {session.evaluatedBy && (
                                  <p>
                                    <strong>Evaluated By:</strong>{" "}
                                    {session.evaluatedBy.firstName}{" "}
                                    {session.evaluatedBy.lastName}
                                  </p>
                                )}
                                {/* Add action buttons for pending sessions */}
                                {session.status === "pending" && (
                                  <div className="mt-2 flex space-x-2">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        updateMentorshipSessionStatus(
                                          session.id,
                                          "approved"
                                        );
                                      }}
                                      className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 text-sm"
                                    >
                                      Approve
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        updateMentorshipSessionStatus(
                                          session.id,
                                          "rejected"
                                        );
                                      }}
                                      className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm"
                                    >
                                      Reject
                                    </button>
                                  </div>
                                )}
                              </div>
                            ))
                          ) : (
                            <p className="text-gray-600 text-sm">
                              No mentorship sessions available.
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
