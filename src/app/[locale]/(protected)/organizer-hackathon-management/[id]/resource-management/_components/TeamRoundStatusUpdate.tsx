// src/app/[locale]/(protected)/organizer-hackathon-management/[id]/resource-management/_components/TeamRoundStatusUpdate.tsx
import { useState } from "react";
import { teamRoundService } from "@/services/teamRound.service";
import { TeamRound, TeamRoundStatus } from "@/types/entities/teamRound";
import { Submission } from "@/types/entities/submission";
import { useApiModal } from "@/hooks/useApiModal";

interface TeamRoundStatusUpdateProps {
  teamRound: TeamRound;
  latestSubmission: Submission | null;
  refreshData: () => void;
}

export function TeamRoundStatusUpdate({
  teamRound,
  latestSubmission,
  refreshData,
}: TeamRoundStatusUpdateProps) {
  const [status, setStatus] = useState<TeamRoundStatus | "">("");
  const [description, setDescription] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const { showSuccess, showError } = useApiModal();

  // Check if the latest submission has a final score
  const hasFinalScore =
    latestSubmission && latestSubmission.finalScore !== undefined;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!status) return;

    setIsUpdating(true);
    try {
      const data = {
        id: teamRound.id,
        teamId: teamRound.teamId || teamRound.team?.id || "",
        roundId: teamRound.roundId || "",
        status,
        description: description || undefined,
      };

      const response = await teamRoundService.updateTeamRound(data);

      if (response.data) {
        showSuccess(
          "Status Updated",
          `Team ${teamRound.team?.name} status updated to ${status}`
        );
        setShowForm(false);
        setStatus("");
        setDescription("");
        refreshData();
      }
    } catch (error) {
      console.error("Error updating team round status:", error);
      showError(
        "Update Failed",
        "Failed to update team round status. Please try again."
      );
    } finally {
      setIsUpdating(false);
    }
  };

  if (!hasFinalScore) {
    return null;
  }

  return (
    <div className="mt-3 border-t pt-3 border-gray-200">
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
        >
          Update Team Status
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as TeamRoundStatus)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              required
            >
              <option value="">Select status</option>
              <option value="PASSED">PASSED</option>
              <option value="FAILED">FAILED</option>
              <option value="DISQUALIFIED_DUE_TO_VIOLATION">
                DISQUALIFIED DUE TO VIOLATION
              </option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description (Optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              rows={3}
            />
          </div>
          <div className="flex space-x-2">
            <button
              type="submit"
              disabled={isUpdating || !status}
              className={`px-4 py-2 text-sm font-medium text-white rounded-md ${
                isUpdating || !status
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isUpdating ? "Updating..." : "Update Status"}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setStatus("");
                setDescription("");
              }}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
