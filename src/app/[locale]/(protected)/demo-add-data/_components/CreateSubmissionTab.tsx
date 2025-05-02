// src/app/[locale]/(protected)/demo-add-data/_components/CreateSubmissionTab.tsx
"use client";

import React, { useState, useEffect } from "react";
import { hackathonService } from "@/services/hackathon.service";
import { roundService } from "@/services/round.service";
import { teamRoundService } from "@/services/teamRound.service";
import { submissionService } from "@/services/submission.service";
import { Hackathon } from "@/types/entities/hackathon";
import { Round } from "@/types/entities/round";
import { TeamRound } from "@/types/entities/teamRound";

const CreateSubmissionTab: React.FC = () => {
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [selectedHackathon, setSelectedHackathon] = useState<string>("");
  const [rounds, setRounds] = useState<Round[]>([]);
  const [selectedRound, setSelectedRound] = useState<string>("");
  const [teamRounds, setTeamRounds] = useState<TeamRound[]>([]);
  const [teamsWithoutSubmissions, setTeamsWithoutSubmissions] = useState<
    TeamRound[]
  >([]);
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error" | "info" | null;
  }>({
    text: "",
    type: null,
  });

  // Fetch all hackathons on component mount
  useEffect(() => {
    const fetchHackathons = async () => {
      try {
        setIsLoading(true);
        const response = await hackathonService.getAllHackathons();
        setHackathons(response.data);
      } catch (error) {
        setMessage({
          text: "Failed to fetch hackathons",
          type: "error",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchHackathons();
  }, []);

  // Fetch rounds when hackathon is selected
  useEffect(() => {
    const fetchRounds = async () => {
      if (!selectedHackathon) return;

      try {
        setIsLoading(true);
        const response =
          await roundService.getRoundsByHackathonId(selectedHackathon);
        setRounds(response.data);
        setSelectedRound("");
        setTeamRounds([]);
        setTeamsWithoutSubmissions([]);
      } catch (error) {
        setMessage({
          text: "Failed to fetch rounds",
          type: "error",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchRounds();
  }, [selectedHackathon]);

  // Fetch team rounds and check for submissions when round is selected
  useEffect(() => {
    const fetchTeamRoundsAndCheckSubmissions = async () => {
      if (!selectedRound) return;

      try {
        setIsLoading(true);
        const teamRoundsResponse =
          await teamRoundService.getTeamRoundsByRoundId(selectedRound);
        setTeamRounds(teamRoundsResponse.data);

        // For each team round, check if submission exists
        const teamsWithoutSubmissionsArr = [];

        for (const teamRound of teamRoundsResponse.data) {
          const submissionsResponse =
            await submissionService.getSubmissionsByTeamAndRound(
              teamRound.teamId,
              selectedRound
            );

          if (!submissionsResponse.data.length) {
            teamsWithoutSubmissionsArr.push(teamRound);
          }
        }

        setTeamsWithoutSubmissions(teamsWithoutSubmissionsArr);

        if (teamsWithoutSubmissionsArr.length === 0) {
          setMessage({
            text: "All teams have already submitted for this round",
            type: "info",
          });
        } else {
          setMessage({
            text: `Found ${teamsWithoutSubmissionsArr.length} teams without submissions`,
            type: "info",
          });
        }
      } catch (error) {
        setMessage({
          text: "Failed to fetch team rounds or submissions",
          type: "error",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeamRoundsAndCheckSubmissions();
  }, [selectedRound]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFiles(Array.from(event.target.files));
    }
  };

  const handleSubmit = async () => {
    if (
      !selectedRound ||
      teamsWithoutSubmissions.length === 0 ||
      files.length === 0
    ) {
      setMessage({
        text: "Please select a round, ensure there are teams without submissions, and upload files",
        type: "error",
      });
      return;
    }

    try {
      setIsLoading(true);
      setMessage({
        text: "Creating submissions...",
        type: "info",
      });

      const results = [];
      for (const teamRound of teamsWithoutSubmissions) {
        const result = await submissionService.createSubmissionWithFiles(
          files,
          selectedRound,
          teamRound.teamId,
          "SUBMITTED"
        );
        results.push(result);
      }

      const successCount = results.filter((result) => result.data).length;

      setMessage({
        text: `Successfully created ${successCount} submissions out of ${teamsWithoutSubmissions.length} teams`,
        type: "success",
      });

      // Refresh the teams without submissions list
      if (selectedRound) {
        const teamRoundsResponse =
          await teamRoundService.getTeamRoundsByRoundId(selectedRound);
        setTeamRounds(teamRoundsResponse.data);

        const newTeamsWithoutSubmissions = [];
        for (const teamRound of teamRoundsResponse.data) {
          const submissionsResponse =
            await submissionService.getSubmissionsByTeamAndRound(
              teamRound.teamId,
              selectedRound
            );

          if (!submissionsResponse.data.length) {
            newTeamsWithoutSubmissions.push(teamRound);
          }
        }

        setTeamsWithoutSubmissions(newTeamsWithoutSubmissions);
      }
    } catch (error) {
      setMessage({
        text: "Error creating submissions",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-xl font-semibold">Create Submission for Teams</h2>

      {/* Message display */}
      {message.text && (
        <div
          className={`p-4 mb-4 rounded ${
            message.type === "success"
              ? "bg-green-100 text-green-800"
              : message.type === "error"
                ? "bg-red-100 text-red-800"
                : "bg-blue-100 text-blue-800"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Hackathon Selection */}
      <div>
        <label className="block mb-2 font-medium text-gray-700">
          Select Hackathon
        </label>
        <select
          className="w-full p-2 border border-gray-300 rounded-md"
          value={selectedHackathon}
          onChange={(e) => setSelectedHackathon(e.target.value)}
          disabled={isLoading}
        >
          <option value="">Select a hackathon</option>
          {hackathons.map((hackathon) => (
            <option key={hackathon.id} value={hackathon.id}>
              {hackathon.title}
            </option>
          ))}
        </select>
      </div>

      {/* Round Selection */}
      {selectedHackathon && (
        <div>
          <label className="block mb-2 font-medium text-gray-700">
            Select Round
          </label>
          <select
            className="w-full p-2 border border-gray-300 rounded-md"
            value={selectedRound}
            onChange={(e) => setSelectedRound(e.target.value)}
            disabled={isLoading || rounds.length === 0}
          >
            <option value="">Select a round</option>
            {rounds.map((round) => (
              <option key={round.id} value={round.id}>
                {round.roundTitle}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Teams Without Submissions */}
      {selectedRound && teamsWithoutSubmissions.length > 0 && (
        <div>
          <h3 className="mb-2 font-medium text-gray-700">
            Teams Without Submissions ({teamsWithoutSubmissions.length})
          </h3>
          <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-md p-2">
            <ul className="divide-y divide-gray-200">
              {teamsWithoutSubmissions.map((teamRound) => (
                <li key={teamRound.id} className="py-2">
                  Team ID: {teamRound.teamId}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* File Upload */}
      {selectedRound && teamsWithoutSubmissions.length > 0 && (
        <div>
          <label className="block mb-2 font-medium text-gray-700">
            Upload Files
          </label>
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            disabled={isLoading}
          />
          <p className="mt-1 text-sm text-gray-500">
            Selected files: {files.length}
          </p>
        </div>
      )}

      {/* Submit Button */}
      {selectedRound && teamsWithoutSubmissions.length > 0 && (
        <button
          onClick={handleSubmit}
          disabled={isLoading || files.length === 0}
          className={`px-4 py-2 text-white rounded-md ${
            isLoading || files.length === 0
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isLoading ? "Creating Submissions..." : "Create Submissions"}
        </button>
      )}
    </div>
  );
};

export default CreateSubmissionTab;
