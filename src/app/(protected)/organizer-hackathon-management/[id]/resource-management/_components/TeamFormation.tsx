// src/app/(protected)/organizer-hackathon-management/[id]/resource-management/_components/TeamFormation.tsx
import React, { useState, useEffect } from "react";
import { fetchMockIndividualRegistrationsByHackathonIdAndStatus } from "../_mocks/fetchMockIndividualRegistrationsByHackathonIdAndStatus";
import { fetchMockUserByUsername } from "../_mocks/fetchMockUserByUsername";
import { User } from "@/types/entities/user";
import { useApiModal } from "@/hooks/useApiModal";

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
  const [loading, setLoading] = useState(true);
  const [participants, setParticipants] = useState<TeamMember[]>([]);
  const [teams, setTeams] = useState<FormattedTeam[]>([]);
  const [unassignedUsers, setUnassignedUsers] = useState<TeamMember[]>([]);
  const [minTeamSize, setMinTeamSize] = useState(3);
  const [maxTeamSize, setMaxTeamSize] = useState(5);
  const { showModal } = useApiModal();

  // Fetch approved registrations and related user data
  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        setLoading(true);
        // Fetch all approved registrations
        const registrations =
          await fetchMockIndividualRegistrationsByHackathonIdAndStatus(
            hackathonId,
            "APPROVED"
          );

        // For each registration, get user details
        const userPromises = registrations.map(async (reg) => {
          try {
            const user = await fetchMockUserByUsername(reg.createdByUserName);
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
          title: "Error",
          message: "Failed to load participants data.",
        });
        setLoading(false);
      }
    };

    fetchParticipants();
  }, [hackathonId, showModal]);

  // Function to form teams based on min and max team size
  const formTeams = () => {
    if (participants.length === 0) {
      showModal({
        type: "warning",
        title: "No Participants",
        message: "There are no participants to form teams.",
      });
      return;
    }

    // Validate inputs
    if (minTeamSize < 2) {
      showModal({
        type: "warning",
        title: "Invalid Team Size",
        message: "Minimum team size should be at least 2.",
      });
      return;
    }

    if (maxTeamSize < minTeamSize) {
      showModal({
        type: "warning",
        title: "Invalid Team Size",
        message:
          "Maximum team size should be greater than or equal to minimum team size.",
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
  };

  // Delete a team
  const deleteTeam = (teamId: string) => {
    const teamToDelete = teams.find((t) => t.id === teamId);
    if (teamToDelete) {
      // Move all team members to unassigned users
      setUnassignedUsers([...unassignedUsers, ...teamToDelete.teamMembers]);
      // Remove the team
      setTeams(teams.filter((t) => t.id !== teamId));
    }
  };

  // Submit teams
  const submitTeams = () => {
    // Check if all teams have leaders
    const teamsWithoutLeaders = teams.filter((team) => !team.teamLeaderId);
    if (teamsWithoutLeaders.length > 0) {
      showModal({
        type: "warning",
        title: "Missing Team Leaders",
        message: `${teamsWithoutLeaders.length} team(s) don't have a leader. Please assign leaders to all teams.`,
      });
      return;
    }

    // Format teams for API
    const formattedTeamsForApi = teams.map((team) => ({
      teamLeaderId: team.teamLeaderId,
      teamMembers: team.teamMembers
        .filter((member) => member.id !== team.teamLeaderId)
        .map((member) => ({
          userId: member.id,
        })),
    }));

    console.log("Submitting teams:", formattedTeamsForApi);
    showModal({
      type: "success",
      title: "Teams Submitted",
      message: `Successfully created ${formattedTeamsForApi.length} teams.`,
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        Loading participants data...
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Team Formation</h2>

      {/* Team Size Configuration */}
      <div className="bg-gray-50 p-4 rounded-md mb-6">
        <h3 className="text-lg font-medium mb-3">Team Size Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Minimum Team Size
            </label>
            <input
              type="number"
              min="2"
              value={minTeamSize}
              onChange={(e) => setMinTeamSize(parseInt(e.target.value) || 2)}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Maximum Team Size
            </label>
            <input
              type="number"
              min={minTeamSize}
              value={maxTeamSize}
              onChange={(e) =>
                setMaxTeamSize(parseInt(e.target.value) || minTeamSize)
              }
              className="w-full p-2 border rounded-md"
            />
          </div>
        </div>
        <button
          onClick={formTeams}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          Generate Teams
        </button>
      </div>

      {/* Teams Display */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-medium">Teams ({teams.length})</h3>
          <button
            onClick={createNewTeam}
            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-sm"
          >
            Create New Team
          </button>
        </div>

        <div className="space-y-4">
          {teams.map((team) => (
            <div key={team.id} className="border rounded-md p-4">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium">{team.id}</h4>
                <button
                  onClick={() => deleteTeam(team.id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded-md text-sm"
                >
                  Delete Team
                </button>
              </div>

              <div className="mb-3">
                <p className="text-sm font-medium text-gray-700 mb-1">
                  Team Leader
                </p>
                {team.teamLeaderId ? (
                  <div className="bg-blue-50 p-2 rounded-md">
                    {team.teamMembers.find((m) => m.id === team.teamLeaderId)
                      ?.fullName || "No name"}
                  </div>
                ) : (
                  <div className="bg-yellow-50 p-2 rounded-md text-sm">
                    No team leader selected
                  </div>
                )}
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">
                  Team Members ({team.teamMembers.length})
                </p>
                <ul className="space-y-2">
                  {team.teamMembers.map((member) => (
                    <li
                      key={member.id}
                      className="flex justify-between items-center border-b pb-1"
                    >
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex justify-center items-center mr-2">
                          {member.avatarUrl ? (
                            <img
                              src={member.avatarUrl}
                              alt={member.fullName}
                              className="w-8 h-8 rounded-full"
                            />
                          ) : (
                            member.fullName.charAt(0)
                          )}
                        </div>
                        <span>{member.fullName}</span>
                      </div>
                      <div className="flex space-x-2">
                        {member.id !== team.teamLeaderId && (
                          <button
                            onClick={() => changeTeamLeader(team.id, member.id)}
                            className="text-blue-600 hover:text-blue-800 text-sm"
                          >
                            Make Leader
                          </button>
                        )}
                        <button
                          onClick={() => removeUserFromTeam(team.id, member.id)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Remove
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
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3">
          Unassigned Users ({unassignedUsers.length})
        </h3>
        {unassignedUsers.length > 0 ? (
          <div className="border rounded-md p-4">
            <ul className="space-y-2">
              {unassignedUsers.map((user) => (
                <li
                  key={user.id}
                  className="flex justify-between items-center border-b pb-1"
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex justify-center items-center mr-2">
                      {user.avatarUrl ? (
                        <img
                          src={user.avatarUrl}
                          alt={user.fullName}
                          className="w-8 h-8 rounded-full"
                        />
                      ) : (
                        user.fullName.charAt(0)
                      )}
                    </div>
                    <span>{user.fullName}</span>
                  </div>
                  <div>
                    <select
                      className="border rounded-md p-1"
                      onChange={(e) => {
                        if (e.target.value) {
                          addUserToTeam(e.target.value, user);
                        }
                        e.target.value = "";
                      }}
                      defaultValue=""
                    >
                      <option value="" disabled>
                        Add to team...
                      </option>
                      {teams.map((team) => (
                        <option key={team.id} value={team.id}>
                          {team.id} ({team.teamMembers.length} members)
                        </option>
                      ))}
                    </select>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="text-gray-500 italic">
            All users have been assigned to teams
          </div>
        )}
      </div>

      {/* Submit Button */}
      <div className="text-right">
        <button
          onClick={submitTeams}
          disabled={teams.length === 0}
          className={`px-4 py-2 rounded-md ${
            teams.length === 0
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          } text-white`}
        >
          Submit Teams
        </button>
      </div>
    </div>
  );
}
