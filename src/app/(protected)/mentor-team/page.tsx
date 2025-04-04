"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth_v0";
import { MentorTeam } from "@/types/entities/mentorTeam";
import { MentorshipSessionRequest } from "@/types/entities/mentorshipSessionRequest";
import { ChevronDown, ChevronUp, Users, Info } from "lucide-react";
import ApiResponseModal from "@/components/common/ApiResponseModal";
import { useApiModal } from "@/hooks/useApiModal";
import { mentorshipRequestService } from "@/services/mentorshipRequest.service";

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
      // Use the real service to fetch mentor teams by mentor ID
      const response =
        await mentorshipRequestService.getMentorshipRequestsByMentorId(user.id);

      if (response.data) {
        // Process the data to match the expected MentorTeam structure
        // This part depends on your API response structure and might need adjustment
        const formattedTeams = response.data.map((request) => ({
          id: request.id || "",
          createdAt: request.createdAt || new Date().toISOString(),
          hackathon: request.hackathon || { title: "Unknown Hackathon" },
          team: request.team || { name: "Unknown Team" },
          mentorshipSessionRequests: [
            {
              id: request.id || "",
              status: request.status.toLowerCase() as
                | "pending"
                | "approved"
                | "rejected",
              description: request.description || "",
              location: request.location || "",
              startTime: request.startTime || "",
              endTime: request.endTime || "",
              evaluatedById: request.evaluatedById || "",
              evaluatedBy: request.evaluatedBy || null,
              evaluatedAt: request.evaluatedAt || null,
            },
          ],
        }));

        setMentorTeams(formattedTeams);
      } else {
        showError("Error", response.message || "Failed to fetch mentor teams");
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

  // Update to use real service calls
  const updateMentorshipSessionStatus = async (
    sessionId: string,
    newStatus: "approved" | "rejected"
  ) => {
    if (!user) return;

    // Find the session to update
    let sessionToUpdate: MentorshipSessionRequest | null = null;
    let teamId = "";
    let hackathonId = "";

    // Find the session and its associated team and hackathon IDs
    mentorTeams.forEach((team) => {
      if (team.mentorshipSessionRequests) {
        team.mentorshipSessionRequests.forEach((request) => {
          if (request.id === sessionId) {
            sessionToUpdate = request;
            teamId = team.team?.id || "";
            hackathonId = team.hackathon?.id || "";
          }
        });
      }
    });

    if (!sessionToUpdate) return;

    // Update local state first for immediate UI feedback
    const updatedTeams = mentorTeams.map((team) => {
      if (team.mentorshipSessionRequests) {
        const updatedRequests = team.mentorshipSessionRequests.map(
          (request) => {
            if (request.id === sessionId && request.status === "pending") {
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
        );

        return {
          ...team,
          mentorshipSessionRequests: updatedRequests,
        };
      }
      return team;
    });

    setMentorTeams(updatedTeams);

    try {
      // Call the real service to update the mentorship request
      const response = await mentorshipRequestService.updateMentorshipRequest({
        id: sessionId,
        hackathonId: hackathonId,
        mentorId: user.id,
        teamId: teamId,
        status: newStatus.toUpperCase() as
          | "PENDING"
          | "APPROVED"
          | "REJECTED"
          | "DELETED"
          | "COMPLETED",
        evaluatedById: user.id,
      });

      if (response.data) {
        showSuccess(
          "Status Updated",
          `Session has been successfully ${
            newStatus === "approved" ? "approved" : "rejected"
          }.`
        );
      } else {
        // If the API call fails, revert the local state change
        showError(
          "Update Failed",
          response.message || "Failed to update session status."
        );
        fetchMentorTeams(); // Refresh data from server
      }
    } catch (error: any) {
      console.error("Failed to update session status:", error);
      showError(
        "Update Failed",
        error.message || "Failed to update session status. Please try again."
      );
      fetchMentorTeams(); // Refresh data from server
    }
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
                                  {session.startTime &&
                                    new Date(
                                      session.startTime
                                    ).toLocaleString()}{" "}
                                  {session.endTime &&
                                    "- " +
                                      new Date(
                                        session.endTime
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

      {/* Include the ApiResponseModal component at the bottom of the component */}
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
