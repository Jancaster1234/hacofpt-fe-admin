// src/app/[locale]/(protected)/demo-add-data/_components/CreateJudgeSubmissionTab.tsx
"use client";

import React, { useState, useEffect } from "react";
import { hackathonService } from "@/services/hackathon.service";
import { roundService } from "@/services/round.service";
import { roundMarkCriterionService } from "@/services/roundMarkCriterion.service";
import { teamRoundService } from "@/services/teamRound.service";
import { teamRoundJudgeService } from "@/services/teamRoundJudge.service";
import { submissionService } from "@/services/submission.service";
import { judgeSubmissionService } from "@/services/judgeSubmission.service";
import { Hackathon } from "@/types/entities/hackathon";
import { Round } from "@/types/entities/round";
import { RoundMarkCriterion } from "@/types/entities/roundMarkCriterion";
import { TeamRound } from "@/types/entities/teamRound";
import { TeamRoundJudge } from "@/types/entities/teamRoundJudge";
import { Submission } from "@/types/entities/submission";
import { JudgeSubmission } from "@/types/entities/judgeSubmission";

const CreateJudgeSubmissionTab: React.FC = () => {
  // State for form selections
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [selectedHackathonId, setSelectedHackathonId] = useState<string>("");
  const [rounds, setRounds] = useState<Round[]>([]);
  const [selectedRoundId, setSelectedRoundId] = useState<string>("");

  // State for processing data
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<{ success: boolean; message: string }>({
    success: false,
    message: "",
  });
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [processingStatus, setProcessingStatus] = useState<string>("");

  // Log details for debugging
  const [logDetails, setLogDetails] = useState<string[]>([]);

  // Fetch all hackathons on component mount
  useEffect(() => {
    const fetchHackathons = async () => {
      setIsLoading(true);
      try {
        const response = await hackathonService.getAllHackathons();
        if (response.data && response.data.length > 0) {
          setHackathons(response.data);
        }
      } catch (error) {
        console.error("Error fetching hackathons:", error);
        setErrorMessage("Failed to fetch hackathons.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchHackathons();
  }, []);

  // Fetch rounds when a hackathon is selected
  useEffect(() => {
    if (!selectedHackathonId) {
      setRounds([]);
      setSelectedRoundId("");
      return;
    }

    const fetchRounds = async () => {
      setIsLoading(true);
      try {
        const response =
          await roundService.getRoundsByHackathonId(selectedHackathonId);
        if (response.data && response.data.length > 0) {
          setRounds(response.data);
        } else {
          setRounds([]);
        }
      } catch (error) {
        console.error("Error fetching rounds:", error);
        setErrorMessage("Failed to fetch rounds for selected hackathon.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRounds();
  }, [selectedHackathonId]);

  const handleCreateJudgeSubmissions = async () => {
    if (!selectedRoundId) {
      setErrorMessage("Please select a round first.");
      return;
    }

    setIsLoading(true);
    setResult({ success: false, message: "" });
    setErrorMessage("");
    setProcessingStatus("Starting judge submission creation process...");
    setLogDetails([]);

    try {
      // Step 1: Get round mark criteria by round ID
      setProcessingStatus("Fetching round mark criteria...");
      const roundMarkCriteriaResponse =
        await roundMarkCriterionService.getRoundMarkCriteriaByRoundId(
          selectedRoundId
        );
      const roundMarkCriteria = roundMarkCriteriaResponse.data || [];
      addLog(`Found ${roundMarkCriteria.length} mark criteria for the round`);

      if (roundMarkCriteria.length === 0) {
        throw new Error("No mark criteria found for this round");
      }

      // Step 2: Get team rounds by round ID
      setProcessingStatus("Fetching team rounds...");
      const teamRoundsResponse =
        await teamRoundService.getTeamRoundsByRoundId(selectedRoundId);
      const teamRounds = teamRoundsResponse.data || [];
      addLog(`Found ${teamRounds.length} team rounds`);

      if (teamRounds.length === 0) {
        throw new Error("No team rounds found for this round");
      }

      let totalJudgeSubmissionsCreated = 0;

      // Step 3: Process each team round
      for (const teamRound of teamRounds) {
        if (!teamRound.id || !teamRound.teamId) continue;

        addLog(`Processing team round for team ID: ${teamRound.teamId}`);
        setProcessingStatus(`Processing team round ${teamRound.id}...`);

        // Step 3a: Get judges for this team round
        const teamRoundJudgesResponse =
          await teamRoundJudgeService.getTeamRoundJudgesByTeamRoundId(
            teamRound.id
          );
        const teamRoundJudges = teamRoundJudgesResponse.data || [];
        addLog(
          `Found ${teamRoundJudges.length} team round judges for team round`
        );

        if (teamRoundJudges.length === 0) {
          addLog(
            `No team round judges found for team round ${teamRound.id}, skipping...`
          );
          continue;
        }

        // Step 3b: Get latest submission for this team and round
        const submissionsResponse =
          await submissionService.getSubmissionsByTeamAndRound(
            teamRound.teamId,
            selectedRoundId
          );

        const submissions = submissionsResponse.data || [];
        // Sort submissions by date to get the latest one
        const latestSubmission =
          submissions.length > 0
            ? submissions.sort(
                (a, b) =>
                  new Date(b.submittedAt).getTime() -
                  new Date(a.submittedAt).getTime()
              )[0]
            : null;

        if (!latestSubmission) {
          addLog(
            `No submissions found for team ${teamRound.teamId} in round ${selectedRoundId}, skipping...`
          );
          continue;
        }

        addLog(`Found latest submission ID: ${latestSubmission.id}`);

        // Step 3c: Find team round judges whose judges haven't marked this submission
        const teamRoundJudgesWithoutSubmission = teamRoundJudges.filter(
          (teamRoundJudge) => {
            // Make sure the judge reference exists
            if (!teamRoundJudge.judge || !teamRoundJudge.judge.id) {
              addLog(
                `Team round judge ${teamRoundJudge.id} has no judge reference, skipping...`
              );
              return false;
            }

            // Check if this judge already has a submission for this team
            const existingJudgeSubmission =
              latestSubmission.judgeSubmissions?.find(
                (js) => js.judge?.id === teamRoundJudge.judge?.id
              );
            return !existingJudgeSubmission;
          }
        );

        addLog(
          `Found ${teamRoundJudgesWithoutSubmission.length} judges who haven't marked the submission`
        );

        // Step 4: Create judge submissions for judges who haven't marked
        for (const teamRoundJudge of teamRoundJudgesWithoutSubmission) {
          // Make sure the judge reference exists and has an ID
          if (!teamRoundJudge.judge || !teamRoundJudge.judge.id) continue;

          const judgeId = teamRoundJudge.judge.id;

          setProcessingStatus(
            `Creating judge submission for judge ID: ${judgeId}...`
          );

          // Generate random scores for each criterion
          const judgeSubmissionDetails = roundMarkCriteria.map((criterion) => ({
            roundMarkCriterionId: criterion.id,
            score: Math.floor(Math.random() * 10) + 1, // Random score between 1-10
            note: `Auto-generated score for ${criterion.name || "criterion"}`,
          }));

          // Calculate average score
          const totalScore = judgeSubmissionDetails.reduce(
            (sum, detail) => sum + detail.score,
            0
          );
          const averageScore = totalScore / judgeSubmissionDetails.length;

          // Create the judge submission
          const judgeSubmissionData = {
            judgeId: judgeId,
            submissionId: latestSubmission.id,
            score: averageScore,
            note: "Auto-generated demo judge submission",
            judgeSubmissionDetails: judgeSubmissionDetails,
          };

          try {
            const createResponse =
              await judgeSubmissionService.createJudgeSubmission(
                judgeSubmissionData
              );
            if (createResponse.data) {
              totalJudgeSubmissionsCreated++;
              addLog(
                `Successfully created judge submission for judge ${judgeId}`
              );
            }
          } catch (submissionError) {
            addLog(
              `Failed to create judge submission for judge ${judgeId}: ${submissionError}`
            );
          }
        }
      }

      // Final result
      setResult({
        success: true,
        message: `Successfully created ${totalJudgeSubmissionsCreated} judge submissions.`,
      });
    } catch (error: any) {
      console.error("Error creating judge submissions:", error);
      setErrorMessage(
        `Failed to create judge submissions: ${error.message || "Unknown error"}`
      );
      setResult({
        success: false,
        message: `Error: ${error.message || "Unknown error"}`,
      });
    } finally {
      setIsLoading(false);
      setProcessingStatus("Processing complete.");
    }
  };

  const addLog = (message: string) => {
    setLogDetails((prev) => [...prev, message]);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-6">Create Judge Submissions</h2>

      <div className="mb-6 space-y-4">
        <div>
          <label
            htmlFor="hackathon"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Select Hackathon
          </label>
          <select
            id="hackathon"
            value={selectedHackathonId}
            onChange={(e) => setSelectedHackathonId(e.target.value)}
            className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            disabled={isLoading}
          >
            <option value="">-- Select a Hackathon --</option>
            {hackathons.map((hackathon) => (
              <option key={hackathon.id} value={hackathon.id}>
                {hackathon.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="round"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Select Round
          </label>
          <select
            id="round"
            value={selectedRoundId}
            onChange={(e) => setSelectedRoundId(e.target.value)}
            className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            disabled={isLoading || !selectedHackathonId || rounds.length === 0}
          >
            <option value="">-- Select a Round --</option>
            {rounds.map((round) => (
              <option key={round.id} value={round.id}>
                {round.roundTitle}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleCreateJudgeSubmissions}
          disabled={isLoading || !selectedRoundId}
          className={`px-4 py-2 rounded-md text-white font-medium ${
            isLoading || !selectedRoundId
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isLoading ? "Processing..." : "Generate Demo Judge Submissions"}
        </button>
      </div>

      {/* Status and Results */}
      {processingStatus && (
        <div className="mt-4 p-3 bg-blue-50 rounded-md">
          <p className="font-medium text-blue-800">{processingStatus}</p>
        </div>
      )}

      {result.message && (
        <div
          className={`mt-4 p-3 rounded-md ${result.success ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}
        >
          <p className="font-medium">{result.message}</p>
        </div>
      )}

      {errorMessage && (
        <div className="mt-4 p-3 bg-red-50 rounded-md">
          <p className="font-medium text-red-800">{errorMessage}</p>
        </div>
      )}

      {/* Log Details */}
      {logDetails.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-2">Process Log</h3>
          <div className="p-3 bg-gray-100 rounded-md max-h-60 overflow-y-auto">
            {logDetails.map((log, index) => (
              <p key={index} className="text-sm text-gray-700 mb-1">
                {log}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateJudgeSubmissionTab;
