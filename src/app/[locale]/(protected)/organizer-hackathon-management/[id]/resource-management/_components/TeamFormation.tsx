// src/app/[locale]/(protected)/organizer-hackathon-management/[id]/resource-management/_components/TeamFormation.tsx
import React, { useState, useEffect } from "react";
import { User } from "@/types/entities/user";
import { useApiModal } from "@/hooks/useApiModal";
import { userService } from "@/services/user.service";
import { individualRegistrationRequestService } from "@/services/individualRegistrationRequest.service";
import { teamService } from "@/services/team.service";
import { useTranslations } from "@/hooks/useTranslations";
import { useToast } from "@/hooks/use-toast";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Image from "next/image";

// Types
interface TeamMember {
  id: string;
  fullName: string;
  username: string;
  avatarUrl?: string;
}

interface FormattedTeam {
  id: string;
  teamLeaderId: string;
  teamMembers: TeamMember[];
}

export default function TeamFormation({
  hackathonId,
}: {
  hackathonId: string;
}) {
  const t = useTranslations("teamFormation");
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [participants, setParticipants] = useState<TeamMember[]>([]);
  const [teams, setTeams] = useState<FormattedTeam[]>([]);
  const [unassignedUsers, setUnassignedUsers] = useState<TeamMember[]>([]);
  const [minTeamSize, setMinTeamSize] = useState(3);
  const [maxTeamSize, setMaxTeamSize] = useState(5);
  const [submitLoading, setSubmitLoading] = useState(false);
  const { showModal } = useApiModal();

  // Fetch approved registrations and related user data
  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        setLoading(true);

        // Get all approved individual registrations for this hackathon
        const approvedRegistrations =
          await individualRegistrationRequestService.getIndividualRegistrationsByHackathonIdAndStatus(
            hackathonId,
            "APPROVED"
          );

        if (
          !approvedRegistrations.data ||
          approvedRegistrations.data.length === 0
        ) {
          setLoading(false);
          return;
        }

        // For each registration, get user details
        const userPromises = approvedRegistrations.data.map(async (reg) => {
          try {
            const userResponse = await userService.getUserByUsername(
              reg.createdByUserName
            );
            const user = userResponse.data;

            return {
              id: user?.id || `temp-${reg.id}`,
              fullName:
                `${user?.firstName || ""} ${user?.lastName || ""}`.trim() ||
                reg.createdByUserName,
              username: user?.username || reg.createdByUserName,
              avatarUrl: user?.avatarUrl,
            };
          } catch (error) {
            // If user fetch fails, use registration data
            return {
              id: `temp-${reg.id}`,
              fullName: reg.createdByUserName,
              username: reg.createdByUserName,
              avatarUrl: undefined,
            };
          }
        });

        const fetchedParticipants = await Promise.all(userPromises);
        setParticipants(fetchedParticipants);
        setUnassignedUsers(fetchedParticipants);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching participants:", error);
        showModal({
          type: "error",
          title: t("error"),
          message: t("failedToLoadParticipants"),
        });
        setLoading(false);
      }
    };

    fetchParticipants();
  }, [hackathonId, showModal, t]);

  // Function to form teams based on min and max team size
  const formTeams = () => {
    if (participants.length === 0) {
      showModal({
        type: "warning",
        title: t("noParticipants"),
        message: t("noParticipantsToFormTeams"),
      });
      return;
    }

    // Validate inputs
    if (minTeamSize < 2) {
      showModal({
        type: "warning",
        title: t("invalidTeamSize"),
        message: t("minTeamSizeAtLeastTwo"),
      });
      return;
    }

    if (maxTeamSize < minTeamSize) {
      showModal({
        type: "warning",
        title: t("invalidTeamSize"),
        message: t("maxSizeShouldBeGreater"),
      });
      return;
    }

    // Clone and shuffle participants
    const shuffledParticipants = [...participants].sort(
      () => Math.random() - 0.5
    );

    const teamCount = Math.ceil(shuffledParticipants.length / maxTeamSize);
    const formattedTeams: FormattedTeam[] = [];
    const remainingUsers: TeamMember[] = [];

    // First, try to form teams of max size
    let currentIndex = 0;
    for (let i = 0; i < teamCount; i++) {
      const teamMembers = shuffledParticipants.slice(
        currentIndex,
        currentIndex + maxTeamSize
      );
      currentIndex += maxTeamSize;

      // If team size is less than minimum, add these users to remaining users
      if (teamMembers.length < minTeamSize) {
        remainingUsers.push(...teamMembers);
      } else {
        // Randomly select a team leader
        const leaderIndex = Math.floor(Math.random() * teamMembers.length);
        const teamLeaderId = teamMembers[leaderIndex].id;

        formattedTeams.push({
          id: `team-${i + 1}`,
          teamLeaderId,
          teamMembers,
        });
      }
    }

    // Distribute remaining users to teams
    let teamIndex = 0;
    while (remainingUsers.length > 0 && formattedTeams.length > 0) {
      formattedTeams[teamIndex].teamMembers.push(remainingUsers.pop()!);
      teamIndex = (teamIndex + 1) % formattedTeams.length;
    }

    setTeams(formattedTeams);
    setUnassignedUsers(remainingUsers);

    toast.success(t("teamsGeneratedSuccess"));
  };

  // Add user to team
  const addUserToTeam = (teamId: string, user: TeamMember) => {
    setTeams(
      teams.map((team) => {
        if (team.id === teamId) {
          return {
            ...team,
            teamMembers: [...team.teamMembers, user],
          };
        }
        return team;
      })
    );

    setUnassignedUsers(unassignedUsers.filter((u) => u.id !== user.id));
    toast.info(t("userAddedToTeam", { name: user.fullName, team: teamId }));
  };

  // Remove user from team
  const removeUserFromTeam = (teamId: string, userId: string) => {
    const updatedTeams = teams.map((team) => {
      if (team.id === teamId) {
        // If removing the team leader, select a new one randomly from remaining members
        let updatedTeamLeaderId = team.teamLeaderId;
        const updatedMembers = team.teamMembers.filter(
          (member) => member.id !== userId
        );

        if (userId === team.teamLeaderId && updatedMembers.length > 0) {
          const newLeaderIndex = Math.floor(
            Math.random() * updatedMembers.length
          );
          updatedTeamLeaderId = updatedMembers[newLeaderIndex].id;
        }

        return {
          ...team,
          teamLeaderId: updatedTeamLeaderId,
          teamMembers: updatedMembers,
        };
      }
      return team;
    });

    // Find the user to add back to unassigned users
    const removedUser = participants.find((p) => p.id === userId);
    if (removedUser) {
      setUnassignedUsers([...unassignedUsers, removedUser]);
      toast.info(
        t("userRemovedFromTeam", { name: removedUser.fullName, team: teamId })
      );
    }

    // Filter out empty teams
    setTeams(updatedTeams.filter((team) => team.teamMembers.length > 0));
  };

  // Change team leader
  const changeTeamLeader = (teamId: string, newLeaderId: string) => {
    setTeams(
      teams.map((team) => {
        if (team.id === teamId) {
          return {
            ...team,
            teamLeaderId: newLeaderId,
          };
        }
        return team;
      })
    );

    const newLeader = participants.find((p) => p.id === newLeaderId);
    if (newLeader) {
      toast.info(
        t("newTeamLeaderAssigned", { name: newLeader.fullName, team: teamId })
      );
    }
  };

  // Create a new team
  const createNewTeam = () => {
    const newTeamId = `team-${teams.length + 1}`;
    setTeams([
      ...teams,
      {
        id: newTeamId,
        teamLeaderId: "",
        teamMembers: [],
      },
    ]);
    toast.info(t("newTeamCreated", { team: newTeamId }));
  };

  // Delete a team
  const deleteTeam = (teamId: string) => {
    const teamToDelete = teams.find((t) => t.id === teamId);
    if (teamToDelete) {
      // Move all team members to unassigned users
      setUnassignedUsers([...unassignedUsers, ...teamToDelete.teamMembers]);
      // Remove the team
      setTeams(teams.filter((t) => t.id !== teamId));
      toast.warning(t("teamDeleted", { team: teamId }));
    }
  };

  // Submit teams
  const submitTeams = async () => {
    // Check if all teams have leaders
    const teamsWithoutLeaders = teams.filter((team) => !team.teamLeaderId);
    if (teamsWithoutLeaders.length > 0) {
      showModal({
        type: "warning",
        title: t("missingTeamLeaders"),
        message: t("teamsWithoutLeadersMessage", {
          count: teamsWithoutLeaders.length,
        }),
      });
      return;
    }

    // Format teams for API according to the expected structure
    const formattedTeamsForApi = teams.map((team) => ({
      teamLeaderId: team.teamLeaderId,
      // Include all team members, including the leader
      teamMembers: team.teamMembers.map((member) => ({
        userId: member.id,
      })),
      teamHackathons: [
        {
          hackathonId: hackathonId,
          status: "ACTIVE" as const,
        },
      ],
    }));

    try {
      setSubmitLoading(true);
      toast.info(t("creatingTeams"));

      // Call the API to create teams
      const response = await teamService.createBulkTeams(formattedTeamsForApi);

      if (response.data) {
        toast.success(
          response.message ||
            t("teamsCreatedSuccess", { count: response.data.length })
        );
        showModal({
          type: "success",
          title: t("teamsCreated"),
          message: t("teamsCreatedSuccess", { count: response.data.length }),
        });
      } else {
        throw new Error(response.message || t("failedToCreateTeams"));
      }
    } catch (error: any) {
      console.error("Error submitting teams:", error);
      toast.error(error.message || t("failedToCreateTeams"));
      showModal({
        type: "error",
        title: t("error"),
        message: error.message || t("failedToCreateTeams"),
      });
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8 h-64 transition-colors duration-300">
        <LoadingSpinner size="lg" showText={true} />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md transition-colors duration-300">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-800 dark:text-gray-100">
        {t("teamFormation")}
      </h2>

      {/* Team Size Configuration */}
      <div className="bg-gray-50 dark:bg-gray-700 p-3 sm:p-4 rounded-md mb-4 sm:mb-6 transition-colors duration-300">
        <h3 className="text-base sm:text-lg font-medium mb-2 sm:mb-3 text-gray-700 dark:text-gray-200">
          {t("teamSizeConfiguration")}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t("minimumTeamSize")}
            </label>
            <input
              type="number"
              min="2"
              value={minTeamSize}
              onChange={(e) => setMinTeamSize(parseInt(e.target.value) || 2)}
              className="w-full p-2 border dark:border-gray-600 rounded-md bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300"
            />
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t("maximumTeamSize")}
            </label>
            <input
              type="number"
              min={minTeamSize}
              value={maxTeamSize}
              onChange={(e) =>
                setMaxTeamSize(parseInt(e.target.value) || minTeamSize)
              }
              className="w-full p-2 border dark:border-gray-600 rounded-md bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300"
            />
          </div>
        </div>
        <button
          onClick={formTeams}
          className="mt-3 sm:mt-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white px-3 sm:px-4 py-1.5 sm:py-2 text-sm rounded-md transition-colors duration-300 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
        >
          {t("generateTeams")}
        </button>
      </div>

      {/* Teams Display */}
      <div className="mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 sm:mb-3 gap-2 sm:gap-0">
          <h3 className="text-base sm:text-lg font-medium text-gray-700 dark:text-gray-200">
            {t("teams", { count: teams.length })}
          </h3>
          <button
            onClick={createNewTeam}
            className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 text-white px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm transition-colors duration-300 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          >
            {t("createNewTeam")}
          </button>
        </div>

        <div className="space-y-3 sm:space-y-4">
          {teams.map((team) => (
            <div
              key={team.id}
              className="border dark:border-gray-600 rounded-md p-3 sm:p-4 transition-colors duration-300"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 sm:mb-3 gap-2 sm:gap-0">
                <h4 className="font-medium text-gray-800 dark:text-gray-200">
                  {team.id}
                </h4>
                <button
                  onClick={() => deleteTeam(team.id)}
                  className="bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 text-white px-2 py-1 rounded-md text-xs sm:text-sm transition-colors duration-300 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                >
                  {t("deleteTeam")}
                </button>
              </div>

              <div className="mb-2 sm:mb-3">
                <p className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t("teamLeader")}
                </p>
                {team.teamLeaderId ? (
                  <div className="bg-blue-50 dark:bg-blue-900/30 p-2 rounded-md text-blue-800 dark:text-blue-200 transition-colors duration-300">
                    {team.teamMembers.find((m) => m.id === team.teamLeaderId)
                      ?.fullName || t("noName")}
                  </div>
                ) : (
                  <div className="bg-yellow-50 dark:bg-yellow-900/30 p-2 rounded-md text-xs sm:text-sm text-yellow-800 dark:text-yellow-200 transition-colors duration-300">
                    {t("noTeamLeaderSelected")}
                  </div>
                )}
              </div>

              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t("teamMembers", { count: team.teamMembers.length })}
                </p>
                <ul className="space-y-1 sm:space-y-2">
                  {team.teamMembers.map((member) => (
                    <li
                      key={member.id}
                      className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b dark:border-gray-600 pb-1 gap-2 sm:gap-0 transition-colors duration-300"
                    >
                      <div className="flex items-center">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gray-200 dark:bg-gray-600 flex justify-center items-center mr-2 transition-colors duration-300">
                          {member.avatarUrl ? (
                            <Image
                              src={member.avatarUrl}
                              alt={member.fullName}
                              width={32}
                              height={32}
                              className="w-6 h-6 sm:w-8 sm:h-8 rounded-full"
                            />
                          ) : (
                            <span className="text-gray-600 dark:text-gray-300">
                              {member.fullName.charAt(0)}
                            </span>
                          )}
                        </div>
                        <span className="text-sm sm:text-base text-gray-800 dark:text-gray-200">
                          {member.fullName}
                        </span>
                      </div>
                      <div className="flex space-x-2 sm:space-x-3 ml-8 sm:ml-0">
                        {member.id !== team.teamLeaderId && (
                          <button
                            onClick={() => changeTeamLeader(team.id, member.id)}
                            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-xs sm:text-sm transition-colors duration-300"
                          >
                            {t("makeLeader")}
                          </button>
                        )}
                        <button
                          onClick={() => removeUserFromTeam(team.id, member.id)}
                          className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 text-xs sm:text-sm transition-colors duration-300"
                        >
                          {t("remove")}
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Unassigned Users */}
      <div className="mb-4 sm:mb-6">
        <h3 className="text-base sm:text-lg font-medium mb-2 sm:mb-3 text-gray-700 dark:text-gray-200">
          {t("unassignedUsers", { count: unassignedUsers.length })}
        </h3>
        {unassignedUsers.length > 0 ? (
          <div className="border dark:border-gray-600 rounded-md p-3 sm:p-4 transition-colors duration-300">
            <ul className="space-y-1 sm:space-y-2">
              {unassignedUsers.map((user) => (
                <li
                  key={user.id}
                  className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b dark:border-gray-600 pb-1 gap-2 sm:gap-0 transition-colors duration-300"
                >
                  <div className="flex items-center">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gray-200 dark:bg-gray-600 flex justify-center items-center mr-2 transition-colors duration-300">
                      {user.avatarUrl ? (
                        <Image
                          src={user.avatarUrl}
                          alt={user.fullName}
                          width={32}
                          height={32}
                          className="w-6 h-6 sm:w-8 sm:h-8 rounded-full"
                        />
                      ) : (
                        <span className="text-gray-600 dark:text-gray-300">
                          {user.fullName.charAt(0)}
                        </span>
                      )}
                    </div>
                    <span className="text-sm sm:text-base text-gray-800 dark:text-gray-200">
                      {user.fullName}
                    </span>
                  </div>
                  <div className="w-full sm:w-auto mt-1 sm:mt-0">
                    <select
                      className="w-full sm:w-auto border dark:border-gray-600 rounded-md p-1 text-sm bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300"
                      onChange={(e) => {
                        if (e.target.value) {
                          addUserToTeam(e.target.value, user);
                        }
                        e.target.value = "";
                      }}
                      defaultValue=""
                    >
                      <option value="" disabled>
                        {t("addToTeam")}
                      </option>
                      {teams.map((team) => (
                        <option key={team.id} value={team.id}>
                          {team.id} ({team.teamMembers.length} {t("members")})
                        </option>
                      ))}
                    </select>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="text-gray-500 dark:text-gray-400 italic">
            {t("allUsersAssigned")}
          </div>
        )}
      </div>

      {/* Submit Button */}
      <div className="text-right">
        <button
          onClick={submitTeams}
          disabled={teams.length === 0 || submitLoading}
          className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-md text-sm sm:text-base transition-colors duration-300 focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${
            teams.length === 0 || submitLoading
              ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed text-gray-200"
              : "bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 text-white focus:ring-green-500"
          }`}
        >
          {submitLoading ? t("creatingTeams") : t("submitTeams")}
        </button>
      </div>
    </div>
  );
}
