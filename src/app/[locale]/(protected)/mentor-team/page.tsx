// src/app/[locale]/(protected)/mentor-team/page.tsx
"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth_v0";
import { MentorTeam } from "@/types/entities/mentorTeam";
import { MentorshipSessionRequest } from "@/types/entities/mentorshipSessionRequest";
import { ChevronDown, ChevronUp, Users, Info, Moon, Sun } from "lucide-react";
import { useApiModal } from "@/hooks/useApiModal";
import { mentorTeamService } from "@/services/mentorTeam.service";
import { mentorshipSessionRequestService } from "@/services/mentorshipSessionRequest.service";
import { useTranslations } from "@/hooks/useTranslations";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

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
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const { modalState, hideModal, showSuccess, showError } = useApiModal();
  const t = useTranslations("mentorTeam");
  const toast = useToast();

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

        toast.success(response.message || t("teamsLoadedSuccess"));
      } else {
        setMentorTeams([]);
        if (response.message) {
          toast.info(response.message);
        }
      }
    } catch (error) {
      console.error("Error fetching mentor teams:", error);
      toast.error(t("fetchTeamsError"));
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
      // Don't show an error toast here to avoid multiple error popups
    }
  };

  // Group mentor teams by hackathon title
  const groupedByHackathon = mentorTeams.reduce(
    (acc, mentorTeam) => {
      const hackathonTitle =
        mentorTeam.hackathon?.title || t("unknownHackathon");
      if (!acc[hackathonTitle]) {
        acc[hackathonTitle] = [];
      }
      acc[hackathonTitle].push(mentorTeam);
      return acc;
    },
    {} as Record<string, MentorTeam[]>
  );

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

    setIsUpdating(true);
    toast.info(t("updatingStatus"));

    // Find the session to update
    let sessionToUpdate: MentorshipSessionRequest | undefined;

    // Find the mentor team and session
    const mentorTeam = mentorTeams.find((team) => team.id === mentorTeamId);
    if (mentorTeam?.mentorshipSessionRequests) {
      sessionToUpdate = mentorTeam.mentorshipSessionRequests.find(
        (session) => session.id === sessionId
      ) as MentorshipSessionRequest;
    }

    if (!sessionToUpdate) {
      setIsUpdating(false);
      return;
    }

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
                      firstName: user.firstName || t("unknown"),
                      lastName: user.lastName || t("unknown"),
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
        toast.success(
          newStatus === "APPROVED" ? t("sessionApproved") : t("sessionRejected")
        );
      } else {
        // If the API call fails, refresh the data
        toast.error(response.message || t("updateFailed"));
        fetchSessionRequests(mentorTeamId);
      }
    } catch (error: any) {
      console.error("Failed to update session status:", error);
      toast.error(error.message || t("updateFailedRetry"));
      fetchSessionRequests(mentorTeamId);
    } finally {
      setIsUpdating(false);
    }
  };

  // Function to format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return t("notAvailable");
    return new Date(dateString).toLocaleString();
  };

  // Status label with appropriate color
  const StatusLabel = ({ status }: { status?: string }) => {
    let color = "text-gray-500 dark:text-gray-400";

    if (status) {
      const lowerStatus = status.toLowerCase();
      if (lowerStatus === "pending")
        color = "text-yellow-500 dark:text-yellow-400";
      else if (lowerStatus === "approved")
        color = "text-green-600 dark:text-green-400";
      else if (lowerStatus === "rejected")
        color = "text-red-600 dark:text-red-400";
      else if (lowerStatus === "completed")
        color = "text-blue-600 dark:text-blue-400";
      else if (lowerStatus === "deleted")
        color = "text-gray-600 dark:text-gray-500";
    }

    return (
      <span className={`font-semibold ${color} transition-colors duration-300`}>
        {status?.toLowerCase() === "pending"
          ? t("pending")
          : status?.toLowerCase() === "approved"
            ? t("approved")
            : status?.toLowerCase() === "rejected"
              ? t("rejected")
              : status?.toLowerCase() === "completed"
                ? t("completed")
                : status?.toLowerCase() === "deleted"
                  ? t("deleted")
                  : t("unknown")}
      </span>
    );
  };

  return (
    <div className="min-h-screen p-3 md:p-6 bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white text-center md:text-left transition-colors duration-300">
          {t("mentorTeams")}
        </h1>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="lg" showText={true} />
        </div>
      ) : Object.keys(groupedByHackathon).length === 0 ? (
        <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md transition-colors duration-300">
          <p className="text-gray-600 dark:text-gray-300">
            {t("noTeamsFound")}
          </p>
        </div>
      ) : (
        <div className="space-y-4 md:space-y-6">
          {Object.entries(groupedByHackathon).map(([hackathonTitle, teams]) => (
            <div
              key={hackathonTitle}
              className="bg-white dark:bg-gray-800 p-3 md:p-4 rounded-lg shadow-md transition-all duration-300"
            >
              {/* Hackathon Title Header */}
              <div
                className="flex justify-between items-center cursor-pointer p-2"
                onClick={() => toggleHackathon(hackathonTitle)}
              >
                <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white transition-colors duration-300">
                  {hackathonTitle}
                </h2>
                {expandedHackathons[hackathonTitle] ? (
                  <ChevronUp className="text-gray-700 dark:text-gray-300 transition-colors duration-300" />
                ) : (
                  <ChevronDown className="text-gray-700 dark:text-gray-300 transition-colors duration-300" />
                )}
              </div>

              {/* Mentor Teams (Expandable) */}
              {expandedHackathons[hackathonTitle] && (
                <div className="mt-3 md:mt-4 space-y-3 md:space-y-4">
                  {teams.map((team) => (
                    <div
                      key={team.id}
                      className="border border-gray-200 dark:border-gray-700 p-2 md:p-3 rounded-md bg-gray-50 dark:bg-gray-850 transition-all duration-300"
                    >
                      {/* Team Header */}
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <Users className="text-blue-600 dark:text-blue-400 transition-colors duration-300" />
                          <p className="text-md md:text-lg font-medium text-gray-900 dark:text-white transition-colors duration-300">
                            {team.team?.name || t("unknownTeam")}
                          </p>
                        </div>
                        {/* Expand Team Info Icon */}
                        <Info
                          className="text-gray-600 dark:text-gray-400 cursor-pointer hover:text-gray-900 dark:hover:text-white transition-colors duration-300"
                          onClick={() => toggleTeamInfo(team.id)}
                        />
                      </div>

                      {/* Team Info (Expandable) */}
                      {expandedTeamInfo[team.id] && (
                        <div className="mt-2 p-2 md:p-3 bg-white dark:bg-gray-800 shadow rounded-md transition-all duration-300">
                          <p className="text-gray-800 dark:text-gray-200 transition-colors duration-300">
                            <strong>{t("teamName")}:</strong>{" "}
                            {team.team?.name || t("notAvailable")}
                          </p>
                          <p className="text-gray-800 dark:text-gray-200 transition-colors duration-300">
                            <strong>{t("teamId")}:</strong>{" "}
                            {team.team?.id || t("notAvailable")}
                          </p>
                          <p className="text-gray-800 dark:text-gray-200 transition-colors duration-300">
                            <strong>{t("hackathon")}:</strong>{" "}
                            {team.hackathon?.title || t("notAvailable")}
                          </p>
                          <p className="text-gray-800 dark:text-gray-200 transition-colors duration-300">
                            <strong>{t("createdAt")}:</strong>{" "}
                            {formatDate(team.createdAt)}
                          </p>
                        </div>
                      )}

                      {/* Mentorship Session Requests (Expandable) */}
                      <div
                        className="mt-2 cursor-pointer"
                        onClick={() => toggleTeam(team.id)}
                      >
                        <p className="text-blue-600 dark:text-blue-400 font-semibold flex items-center transition-colors duration-300">
                          {expandedTeams[team.id] ? (
                            <>
                              {t("hideSessions")}{" "}
                              <ChevronUp className="ml-1 h-4 w-4" />
                            </>
                          ) : (
                            <>
                              {t("viewSessions")}{" "}
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
                                className="border-l-4 border-blue-500 dark:border-blue-400 p-2 md:p-3 bg-white dark:bg-gray-800 shadow-sm rounded-md transition-all duration-300"
                              >
                                <p className="text-gray-800 dark:text-gray-200 transition-colors duration-300">
                                  <strong>{t("location")}:</strong>{" "}
                                  {session.location || t("notAvailable")}
                                </p>
                                <p className="text-gray-800 dark:text-gray-200 transition-colors duration-300">
                                  <strong>{t("description")}:</strong>{" "}
                                  {session.description || t("noDescription")}
                                </p>
                                <p className="text-gray-800 dark:text-gray-200 transition-colors duration-300">
                                  <strong>{t("startTime")}:</strong>{" "}
                                  {formatDate(session.startTime)}
                                </p>
                                <p className="text-gray-800 dark:text-gray-200 transition-colors duration-300">
                                  <strong>{t("endTime")}:</strong>{" "}
                                  {formatDate(session.endTime)}
                                </p>
                                <p className="text-gray-800 dark:text-gray-200 transition-colors duration-300">
                                  <strong>{t("status")}:</strong>{" "}
                                  <StatusLabel status={session.status} />
                                </p>
                                {session.evaluatedBy && (
                                  <>
                                    <p className="text-gray-800 dark:text-gray-200 transition-colors duration-300">
                                      <strong>{t("evaluatedBy")}:</strong>{" "}
                                      {session.evaluatedBy.firstName}{" "}
                                      {session.evaluatedBy.lastName}
                                    </p>
                                    <p className="text-gray-800 dark:text-gray-200 transition-colors duration-300">
                                      <strong>{t("evaluatedAt")}:</strong>{" "}
                                      {formatDate(session.evaluatedAt)}
                                    </p>
                                  </>
                                )}

                                {/* Action buttons for pending sessions */}
                                {session.status?.toLowerCase() ===
                                  "pending" && (
                                  <div className="mt-3 flex flex-col sm:flex-row justify-center sm:justify-start gap-2 sm:gap-4">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        updateMentorshipSessionStatus(
                                          session.id,
                                          team.id,
                                          "APPROVED"
                                        );
                                      }}
                                      disabled={isUpdating}
                                      className="px-4 py-1.5 bg-blue-500 dark:bg-blue-600 text-white rounded-md hover:bg-blue-600 dark:hover:bg-blue-700 text-sm transition-colors duration-300 disabled:opacity-50 w-full sm:w-auto sm:min-w-24"
                                    >
                                      {isUpdating
                                        ? t("processing")
                                        : t("approve")}
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
                                      disabled={isUpdating}
                                      className="px-4 py-1.5 bg-red-500 dark:bg-red-600 text-white rounded-md hover:bg-red-600 dark:hover:bg-red-700 text-sm transition-colors duration-300 disabled:opacity-50 w-full sm:w-auto sm:min-w-24"
                                    >
                                      {isUpdating
                                        ? t("processing")
                                        : t("reject")}
                                    </button>
                                  </div>
                                )}
                              </div>
                            ))
                          ) : (
                            <p className="text-gray-600 dark:text-gray-400 text-sm p-2 transition-colors duration-300">
                              {t("noSessions")}
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
