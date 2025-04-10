// src/app/(protected)/mentor-team/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth_v0";
import { MentorTeam } from "@/types/entities/mentorTeam";
import { MentorshipSessionRequest } from "@/types/entities/mentorshipSessionRequest";
import { ChevronDown, ChevronUp, Users, Info } from "lucide-react";
import ApiResponseModal from "@/components/common/ApiResponseModal";
import { useApiModal } from "@/hooks/useApiModal";
import { mentorTeamService } from "@/services/mentorTeam.service";
import { mentorshipSessionRequestService } from "@/services/mentorshipSessionRequest.service";

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
  const [loading, setLoading] = useState<boolean>(true);
  const { modalState, hideModal, showSuccess, showError } = useApiModal();

  useEffect(() => {
    if (user) {
      fetchMentorTeams();
    }
  }, [user]);

  const fetchMentorTeams = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Use mentorTeamService to fetch mentor teams by mentor ID
      const response = await mentorTeamService.getMentorTeamsByMentorId(
        user.id
      );

      if (response.data && response.data.length > 0) {
        // Store teams but also fetch session requests for each team
        const teamsWithSessions = [...response.data];
        setMentorTeams(teamsWithSessions);

        // For each mentor team, fetch their session requests
        await Promise.all(
          teamsWithSessions.map(async (team) => {
            if (team.id) {
              await fetchSessionRequests(team.id);
            }
          })
        );
      } else {
        setMentorTeams([]);
        if (response.message) {
          showError("Notice", response.message);
        }
      }
    } catch (error) {
      console.error("Error fetching mentor teams:", error);
      showError(
        "Error",
        "Failed to fetch mentor teams. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchSessionRequests = async (mentorTeamId: string) => {
    try {
      const response =
        await mentorshipSessionRequestService.getMentorshipSessionRequestsByMentorTeamId(
          mentorTeamId
        );

      if (response.data) {
        // Update the mentor teams state with the session requests
        setMentorTeams((prevTeams) =>
          prevTeams.map((team) => {
            if (team.id === mentorTeamId) {
              return {
                ...team,
                mentorshipSessionRequests: response.data,
              };
            }
            return team;
          })
        );
      }
    } catch (error) {
      console.error(
        `Error fetching session requests for team ${mentorTeamId}:`,
        error
      );
      // Don't show an error modal here to avoid multiple error popups
    }
  };

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

  const updateMentorshipSessionStatus = async (
    sessionId: string,
    mentorTeamId: string,
    newStatus: "APPROVED" | "REJECTED"
  ) => {
    if (!user) return;

    // Find the session to update
    let sessionToUpdate: MentorshipSessionRequest | undefined;

    // Find the mentor team and session
    const mentorTeam = mentorTeams.find((team) => team.id === mentorTeamId);
    if (mentorTeam?.mentorshipSessionRequests) {
      sessionToUpdate = mentorTeam.mentorshipSessionRequests.find(
        (session) => session.id === sessionId
      ) as MentorshipSessionRequest;
    }

    if (!sessionToUpdate) return;

    // Update local state first for immediate UI feedback
    setMentorTeams((prevTeams) =>
      prevTeams.map((team) => {
        if (team.id === mentorTeamId && team.mentorshipSessionRequests) {
          return {
            ...team,
            mentorshipSessionRequests: team.mentorshipSessionRequests.map(
              (request) => {
                if (request.id === sessionId) {
                  return {
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
                }
                return request;
              }
            ),
          };
        }
        return team;
      })
    );

    try {
      // Call the real service to update the mentorship session request
      const response =
        await mentorshipSessionRequestService.updateMentorshipSessionRequest({
          id: sessionId,
          mentorTeamId: mentorTeamId,
          startTime: sessionToUpdate.startTime || new Date().toISOString(),
          endTime: sessionToUpdate.endTime || new Date().toISOString(),
          location: sessionToUpdate.location || "",
          description: sessionToUpdate.description,
          status: newStatus,
          evaluatedById: user.id,
          evaluatedAt: new Date().toISOString(),
        });

      if (response.data) {
        showSuccess(
          "Status Updated",
          `Session has been successfully ${
            newStatus === "APPROVED" ? "approved" : "rejected"
          }.`
        );
      } else {
        // If the API call fails, refresh the data
        showError(
          "Update Failed",
          response.message || "Failed to update session status."
        );
        fetchSessionRequests(mentorTeamId);
      }
    } catch (error: any) {
      console.error("Failed to update session status:", error);
      showError(
        "Update Failed",
        error.message || "Failed to update session status. Please try again."
      );
      fetchSessionRequests(mentorTeamId);
    }
  };

  // Function to format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString();
  };

  // Status label with appropriate color
  const StatusLabel = ({ status }: { status?: string }) => {
    let color = "text-gray-500";

    if (status) {
      const lowerStatus = status.toLowerCase();
      if (lowerStatus === "pending") color = "text-yellow-500";
      else if (lowerStatus === "approved") color = "text-green-600";
      else if (lowerStatus === "rejected") color = "text-red-600";
      else if (lowerStatus === "completed") color = "text-blue-600";
    }

    return (
      <span className={`font-semibold ${color}`}>
        {status?.toLowerCase() || "unknown"}
      </span>
    );
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-3xl font-bold text-gray-900 text-center mb-6">
        Mentor Teams
      </h1>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : Object.keys(groupedByHackathon).length === 0 ? (
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
                            <strong>Team ID:</strong> {team.team?.id || "N/A"}
                          </p>
                          <p>
                            <strong>Hackathon:</strong>{" "}
                            {team.hackathon?.title || "N/A"}
                          </p>
                          <p>
                            <strong>Created At:</strong>{" "}
                            {formatDate(team.createdAt)}
                          </p>
                        </div>
                      )}

                      {/* Mentorship Session Requests (Expandable) */}
                      <div
                        className="mt-2 cursor-pointer"
                        onClick={() => toggleTeam(team.id)}
                      >
                        <p className="text-blue-600 font-semibold flex items-center">
                          {expandedTeams[team.id] ? (
                            <>
                              Hide Sessions{" "}
                              <ChevronUp className="ml-1 h-4 w-4" />
                            </>
                          ) : (
                            <>
                              View Sessions{" "}
                              <ChevronDown className="ml-1 h-4 w-4" />
                            </>
                          )}
                        </p>
                      </div>

                      {expandedTeams[team.id] && (
                        <div className="mt-3 space-y-2">
                          {team.mentorshipSessionRequests?.length ? (
                            team.mentorshipSessionRequests.map((session) => (
                              <div
                                key={session.id}
                                className="border-l-4 border-blue-500 p-3 bg-white shadow-sm rounded-md"
                              >
                                <p>
                                  <strong>Location:</strong>{" "}
                                  {session.location || "N/A"}
                                </p>
                                <p>
                                  <strong>Description:</strong>{" "}
                                  {session.description ||
                                    "No description provided"}
                                </p>
                                <p>
                                  <strong>Start Time:</strong>{" "}
                                  {formatDate(session.startTime)}
                                </p>
                                <p>
                                  <strong>End Time:</strong>{" "}
                                  {formatDate(session.endTime)}
                                </p>
                                <p>
                                  <strong>Status:</strong>{" "}
                                  <StatusLabel status={session.status} />
                                </p>
                                {session.evaluatedBy && (
                                  <>
                                    <p>
                                      <strong>Evaluated By:</strong>{" "}
                                      {session.evaluatedBy.firstName}{" "}
                                      {session.evaluatedBy.lastName}
                                    </p>
                                    <p>
                                      <strong>Evaluated At:</strong>{" "}
                                      {formatDate(session.evaluatedAt)}
                                    </p>
                                  </>
                                )}

                                {/* Action buttons for pending sessions */}
                                {session.status?.toLowerCase() ===
                                  "pending" && (
                                  <div className="mt-3 flex space-x-2">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        updateMentorshipSessionStatus(
                                          session.id,
                                          team.id,
                                          "APPROVED"
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
                                          team.id,
                                          "REJECTED"
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
                            <p className="text-gray-600 text-sm p-2">
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

      {/* Include the ApiResponseModal component
      <ApiResponseModal
        isOpen={modalState.isOpen}
        onClose={hideModal}
        title={modalState.title}
        message={modalState.message}
        type={modalState.type}
      /> */}
    </div>
  );
}
