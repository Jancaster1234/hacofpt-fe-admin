// src/app/[locale]/(protected)/demo-add-data/_components/BulkRegistrationTab.tsx
"use client";

import React, { useState, useEffect } from "react";
import { hackathonService } from "@/services/hackathon.service";
import { teamService } from "@/services/team.service";
import { teamRequestService } from "@/services/teamRequest.service";
import { userService } from "@/services/user.service";
import { individualRegistrationRequestService } from "@/services/individualRegistrationRequest.service";
import { Hackathon } from "@/types/entities/hackathon";
import { Team } from "@/types/entities/team";
import { TeamRequest } from "@/types/entities/teamRequest";
import { User } from "@/types/entities/user";
import { IndividualRegistrationRequest } from "@/types/entities/individualRegistrationRequest";

const BulkRegistrationTab: React.FC = () => {
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [selectedHackathon, setSelectedHackathon] = useState<string>("");
  const [teams, setTeams] = useState<Team[]>([]);
  const [teamRequests, setTeamRequests] = useState<TeamRequest[]>([]);
  const [allTeamMembers, setAllTeamMembers] = useState<User[]>([]);
  const [pendingRegistrations, setPendingRegistrations] = useState<
    IndividualRegistrationRequest[]
  >([]);
  const [approvedRegistrations, setApprovedRegistrations] = useState<
    IndividualRegistrationRequest[]
  >([]);
  const [completedRegistrations, setCompletedRegistrations] = useState<
    IndividualRegistrationRequest[]
  >([]);
  const [registeredUsers, setRegisteredUsers] = useState<User[]>([]);
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const [numRegistrations, setNumRegistrations] = useState<number>(5);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error" | "info" | null;
  }>({
    text: "",
    type: null,
  });

  // Fetch all hackathons
  useEffect(() => {
    const fetchHackathons = async () => {
      try {
        const response = await hackathonService.getAllHackathons();
        if (response.data && response.data.length > 0) {
          setHackathons(response.data);
        }
      } catch (error) {
        console.error("Error fetching hackathons:", error);
        setMessage({
          text: "Failed to load hackathons. Please try again.",
          type: "error",
        });
      }
    };

    fetchHackathons();
  }, []);

  // Fetch data when a hackathon is selected
  useEffect(() => {
    if (!selectedHackathon) return;

    const fetchData = async () => {
      setIsLoading(true);
      setMessage({ text: "Loading data...", type: "info" });

      try {
        // Get teams for the selected hackathon
        const teamsResponse =
          await teamService.getTeamsByHackathonId(selectedHackathon);

        if (teamsResponse.data && teamsResponse.data.length > 0) {
          setTeams(teamsResponse.data);
        }

        // Get team requests for the selected hackathon
        const teamRequestsResponse =
          await teamRequestService.getTeamRequestsByHackathon(
            selectedHackathon
          );

        if (teamRequestsResponse.data && teamRequestsResponse.data.length > 0) {
          setTeamRequests(teamRequestsResponse.data);
        }

        // Get all team members
        const teamMembersResponse = await userService.getTeamMembers();
        setAllTeamMembers(teamMembersResponse.data);

        // Get pending registrations
        const pendingResponse =
          await individualRegistrationRequestService.getPendingIndividualRegistrationsByHackathonId(
            selectedHackathon
          );
        setPendingRegistrations(pendingResponse.data);

        // Get approved registrations
        const approvedResponse =
          await individualRegistrationRequestService.getApprovedIndividualRegistrationsByHackathonId(
            selectedHackathon
          );
        setApprovedRegistrations(approvedResponse.data);

        // Get completed registrations
        const completedResponse =
          await individualRegistrationRequestService.getCompletedIndividualRegistrationsByHackathonId(
            selectedHackathon
          );
        setCompletedRegistrations(completedResponse.data);

        // Fetch users by usernames for all registrations
        await fetchRegisteredUsers([
          ...pendingResponse.data,
          ...approvedResponse.data,
          ...completedResponse.data,
        ]);

        setMessage({ text: "Data loaded successfully", type: "success" });
      } catch (error) {
        console.error("Error fetching data:", error);
        setMessage({
          text: "Failed to load data. Please try again.",
          type: "error",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedHackathon]);

  // Fetch users by usernames from registrations
  const fetchRegisteredUsers = async (
    registrations: IndividualRegistrationRequest[]
  ) => {
    try {
      const uniqueUsernames = Array.from(
        new Set(
          registrations
            .map((reg) => reg.createdByUserName)
            .filter(Boolean) as string[]
        )
      );

      const usersPromises = uniqueUsernames.map((username) =>
        userService.getUserByUsername(username)
      );

      const usersResponses = await Promise.all(usersPromises);
      const users = usersResponses
        .filter((response) => response.data && response.data.id)
        .map((response) => response.data);

      setRegisteredUsers(users);
      return users;
    } catch (error) {
      console.error("Error fetching registered users:", error);
      return [];
    }
  };

  // Calculate available users whenever dependencies change
  useEffect(() => {
    if (!selectedHackathon || !allTeamMembers.length) return;
    calculateAvailableUsers();
  }, [
    selectedHackathon,
    teams,
    teamRequests,
    pendingRegistrations,
    allTeamMembers,
    registeredUsers,
  ]);

  const calculateAvailableUsers = () => {
    // Extract all team member IDs from teams
    const teamMemberIds = new Set<string>();
    teams.forEach((team) => {
      team.teamMembers.forEach((member) => {
        if (member.user?.id) {
          teamMemberIds.add(member.user.id);
        }
      });
    });

    // Get registered user IDs (including pending)
    const registeredUserIds = new Set<string>();
    registeredUsers.forEach((user) => {
      if (user.id) {
        registeredUserIds.add(user.id);
      }
    });

    // Get pending registration user IDs
    const pendingRegistrationUserIds = new Set<string>();
    pendingRegistrations.forEach((reg) => {
      if (reg.createdByUserId) {
        pendingRegistrationUserIds.add(reg.createdByUserId);
      }
    });

    // Get users in approved team requests
    const approvedTeamRequestUserIds = new Set<string>();
    teamRequests.forEach((teamRequest) => {
      teamRequest.teamRequestMembers.forEach((member) => {
        if (member.status === "APPROVED" && member.userId) {
          approvedTeamRequestUserIds.add(member.userId);
        }
      });
    });

    // Filter team members who are not already in teams, registrations, or approved team requests
    const available = allTeamMembers.filter(
      (user) =>
        user.id &&
        !teamMemberIds.has(user.id) &&
        !registeredUserIds.has(user.id) &&
        !pendingRegistrationUserIds.has(user.id) &&
        !approvedTeamRequestUserIds.has(user.id) &&
        user.userRoles?.some((role) => role.role?.name === "TEAM_MEMBER")
    );

    setAvailableUsers(available);
  };

  const handleCreateBulkRegistrations = async () => {
    if (!selectedHackathon || !availableUsers.length) {
      setMessage({
        text: "No hackathon selected or no available users found",
        type: "error",
      });
      return;
    }

    setIsLoading(true);
    setMessage({ text: "Creating registrations...", type: "info" });

    try {
      // Determine how many users to register (limited by available users)
      const count = Math.min(numRegistrations, availableUsers.length);

      // Randomly select users for registration
      const shuffled = [...availableUsers].sort(() => 0.5 - Math.random());
      const selectedUsers = shuffled.slice(0, count);

      // Prepare data for bulk creation
      const registrationData = selectedUsers.map((user) => ({
        hackathonId: selectedHackathon,
        status: "PENDING" as const,
        createdByUserId: user.id,
      }));

      // Create bulk registrations
      const response =
        await individualRegistrationRequestService.createBulkIndividualRegistrationRequests(
          registrationData
        );

      setMessage({
        text: `Successfully created ${response.data.length} registration requests`,
        type: "success",
      });

      // Refresh data after creating registrations
      const pendingResponse =
        await individualRegistrationRequestService.getPendingIndividualRegistrationsByHackathonId(
          selectedHackathon
        );
      setPendingRegistrations(pendingResponse.data);

      const approvedResponse =
        await individualRegistrationRequestService.getApprovedIndividualRegistrationsByHackathonId(
          selectedHackathon
        );
      setApprovedRegistrations(approvedResponse.data);

      const completedResponse =
        await individualRegistrationRequestService.getCompletedIndividualRegistrationsByHackathonId(
          selectedHackathon
        );
      setCompletedRegistrations(completedResponse.data);

      // Fetch updated registered users
      await fetchRegisteredUsers([
        ...pendingResponse.data,
        ...approvedResponse.data,
        ...completedResponse.data,
      ]);

      // Recalculate available users
      calculateAvailableUsers();
    } catch (error) {
      console.error("Error creating bulk registrations:", error);
      setMessage({
        text: "Failed to create registrations. Please try again.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="mb-4 text-xl font-semibold">
        Bulk Individual Registration
      </h2>

      {/* Message display */}
      {message.text && (
        <div
          className={`mb-4 rounded-md p-4 ${
            message.type === "success"
              ? "bg-green-50 text-green-800"
              : message.type === "error"
                ? "bg-red-50 text-red-800"
                : "bg-blue-50 text-blue-800"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Hackathon selection */}
      <div className="mb-6">
        <label
          htmlFor="hackathon"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Select Hackathon
        </label>
        <select
          id="hackathon"
          className="block w-full rounded-md border border-gray-300 bg-white p-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          value={selectedHackathon}
          onChange={(e) => setSelectedHackathon(e.target.value)}
          disabled={isLoading}
        >
          <option value="">-- Select a hackathon --</option>
          {hackathons.map((hackathon) => (
            <option key={hackathon.id} value={hackathon.id}>
              {hackathon.title}
            </option>
          ))}
        </select>
      </div>

      {/* Stats display */}
      {selectedHackathon && (
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-5">
          <div className="rounded-lg bg-white p-4 shadow">
            <h3 className="text-sm font-medium text-gray-500">Teams</h3>
            <p className="mt-1 text-2xl font-semibold text-gray-900">
              {teams.length}
            </p>
          </div>
          <div className="rounded-lg bg-white p-4 shadow">
            <h3 className="text-sm font-medium text-gray-500">Team Members</h3>
            <p className="mt-1 text-2xl font-semibold text-gray-900">
              {teams.reduce((acc, team) => acc + team.teamMembers.length, 0)}
            </p>
          </div>
          <div className="rounded-lg bg-white p-4 shadow">
            <h3 className="text-sm font-medium text-gray-500">
              Pending Registrations
            </h3>
            <p className="mt-1 text-2xl font-semibold text-gray-900">
              {pendingRegistrations.length}
            </p>
          </div>
          <div className="rounded-lg bg-white p-4 shadow">
            <h3 className="text-sm font-medium text-gray-500">
              Approved Registrations
            </h3>
            <p className="mt-1 text-2xl font-semibold text-gray-900">
              {approvedRegistrations.length}
            </p>
          </div>
          <div className="rounded-lg bg-white p-4 shadow">
            <h3 className="text-sm font-medium text-gray-500">
              Completed Registrations
            </h3>
            <p className="mt-1 text-2xl font-semibold text-gray-900">
              {completedRegistrations.length}
            </p>
          </div>
        </div>
      )}

      {/* Registration creation controls */}
      {selectedHackathon && (
        <div className="rounded-lg bg-white p-6 shadow">
          <h3 className="mb-4 text-lg font-medium text-gray-900">
            Create Bulk Registrations
          </h3>

          <div className="mb-4">
            <p className="text-sm text-gray-600">
              Available users for registration:{" "}
              <span className="font-bold">{availableUsers.length}</span>
            </p>
          </div>

          <div className="mb-4">
            <label
              htmlFor="numRegistrations"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Number of Registrations to Create
            </label>
            <input
              type="number"
              id="numRegistrations"
              min="1"
              max={availableUsers.length}
              className="block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              value={numRegistrations}
              onChange={(e) =>
                setNumRegistrations(
                  Math.max(
                    1,
                    Math.min(
                      parseInt(e.target.value) || 1,
                      availableUsers.length
                    )
                  )
                )
              }
              disabled={isLoading || availableUsers.length === 0}
            />
          </div>

          <button
            className="rounded-md bg-blue-600 px-4 py-2 text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-400"
            onClick={handleCreateBulkRegistrations}
            disabled={
              isLoading || availableUsers.length === 0 || numRegistrations <= 0
            }
          >
            {isLoading ? "Processing..." : "Create Registrations"}
          </button>
        </div>
      )}
    </div>
  );
};

export default BulkRegistrationTab;
