// src/app/(protected)/organizer-hackathon-management/[id]/resource-management/_components/RoundMarkCriteria.tsx
import { useEffect, useState } from "react";
import { Round } from "@/types/entities/round";
import { RoundMarkCriterion } from "@/types/entities/roundMarkCriterion";
import RoundMarkCriterionForm from "./RoundMarkCriterionForm";
import { Plus, Edit, Trash2 } from "lucide-react";
import { roundService } from "@/services/round.service";
import { roundMarkCriterionService } from "@/services/roundMarkCriterion.service";
import { useApiModal } from "@/hooks/useApiModal";
import ApiResponseModal from "@/components/common/ApiResponseModal";

export default function RoundMarkCriteria({
  hackathonId,
}: {
  hackathonId: string;
}) {
  const [rounds, setRounds] = useState<Round[]>([]);
  const [activeRoundId, setActiveRoundId] = useState<string | null>(null);
  const [roundMarkCriteria, setRoundMarkCriteria] = useState<{
    [roundId: string]: RoundMarkCriterion[];
  }>({});
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCriterion, setEditingCriterion] =
    useState<RoundMarkCriterion | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Use the API modal hook
  const { modalState, hideModal, showSuccess, showError } = useApiModal();

  const fetchRounds = async () => {
    setIsLoading(true);
    try {
      const response = await roundService.getRoundsByHackathonId(hackathonId);
      setRounds(response.data);
      if (response.data.length > 0) {
        setActiveRoundId(response.data[0].id);
        // Fetch mark criteria for the first round
        if (response.data[0].id) {
          fetchRoundMarkCriteria(response.data[0].id);
        }
      }
    } catch (error) {
      showError("Error", "Failed to load rounds");
      console.error("Error fetching rounds:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRoundMarkCriteria = async (roundId: string) => {
    setIsLoading(true);
    try {
      // Note: This API endpoint isn't shown in the provided services
      // You may need to add this method to your roundMarkCriterionService
      // For now, assuming it returns an array of RoundMarkCriterion objects

      const response =
        await roundMarkCriterionService.getRoundMarkCriteriaByRoundId(roundId);
      setRoundMarkCriteria((prev) => ({
        ...prev,
        [roundId]: response.data,
      }));

      // Since the endpoint is not available in the provided code, we'll
      // use an empty array for now as placeholder
      // setRoundMarkCriteria((prev) => ({
      //   ...prev,
      //   [roundId]: [],
      // }));
    } catch (error) {
      showError("Error", "Failed to load mark criteria");
      console.error("Error fetching mark criteria:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRounds();
  }, [hackathonId]);

  useEffect(() => {
    if (activeRoundId) {
      fetchRoundMarkCriteria(activeRoundId);
    }
  }, [activeRoundId]);

  const handleCreateCriterion = async (data: {
    name: string;
    maxScore: number;
    note?: string;
  }) => {
    if (!activeRoundId) return;

    setIsLoading(true);
    try {
      const response = await roundMarkCriterionService.createRoundMarkCriterion(
        {
          name: data.name,
          maxScore: data.maxScore,
          note: data.note || "",
          roundId: activeRoundId,
        }
      );

      // Update the state with the new criterion
      setRoundMarkCriteria((prev) => ({
        ...prev,
        [activeRoundId]: [...(prev[activeRoundId] || []), response.data],
      }));

      showSuccess(
        "Success",
        response.message || "Mark criterion created successfully"
      );
      setIsFormOpen(false);
      setEditingCriterion(null);
    } catch (error) {
      showError("Error", "Failed to create mark criterion");
      console.error("Error creating mark criterion:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateCriterion = async (data: {
    name: string;
    maxScore: number;
    note?: string;
  }) => {
    if (!activeRoundId || !editingCriterion) return;

    setIsLoading(true);
    try {
      const response = await roundMarkCriterionService.updateRoundMarkCriterion(
        editingCriterion.id,
        {
          name: data.name,
          maxScore: data.maxScore,
          note: data.note || "",
          roundId: activeRoundId,
        }
      );

      // Update the state with the updated criterion
      setRoundMarkCriteria((prev) => ({
        ...prev,
        [activeRoundId]: prev[activeRoundId].map((criterion) =>
          criterion.id === editingCriterion.id ? response.data : criterion
        ),
      }));

      showSuccess(
        "Success",
        response.message || "Mark criterion updated successfully"
      );
      setIsFormOpen(false);
      setEditingCriterion(null);
    } catch (error) {
      showError("Error", "Failed to update mark criterion");
      console.error("Error updating mark criterion:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCriterion = async (criterionId: string) => {
    if (!activeRoundId) return;

    setIsLoading(true);
    try {
      const response = await roundMarkCriterionService.deleteRoundMarkCriterion(
        criterionId
      );

      // Update the state by removing the deleted criterion
      setRoundMarkCriteria((prev) => ({
        ...prev,
        [activeRoundId]: prev[activeRoundId].filter(
          (criterion) => criterion.id !== criterionId
        ),
      }));

      showSuccess(
        "Success",
        response.message || "Mark criterion deleted successfully"
      );
    } catch (error) {
      showError("Error", "Failed to delete mark criterion");
      console.error("Error deleting mark criterion:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const openEditForm = (criterion: RoundMarkCriterion) => {
    setEditingCriterion(criterion);
    setIsFormOpen(true);
  };

  const openCreateForm = () => {
    setEditingCriterion(null);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingCriterion(null);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Round Mark Criteria</h2>
        {activeRoundId && (
          <button
            onClick={openCreateForm}
            className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center"
            disabled={isLoading}
          >
            <Plus size={16} className="mr-1" /> Add Criterion
          </button>
        )}
      </div>

      <div className="flex space-x-2 overflow-x-auto border-b mb-4">
        {rounds.map((round) => (
          <button
            key={round.id}
            className={`p-2 ${
              activeRoundId === round.id
                ? "border-b-2 border-green-500 text-green-500"
                : "text-gray-600"
            }`}
            onClick={() => setActiveRoundId(round.id)}
            disabled={isLoading}
          >
            {round.roundTitle}
          </button>
        ))}
      </div>

      {isFormOpen && (
        <RoundMarkCriterionForm
          criterion={editingCriterion}
          onSubmit={
            editingCriterion ? handleUpdateCriterion : handleCreateCriterion
          }
          onCancel={closeForm}
          isLoading={isLoading}
        />
      )}

      {activeRoundId && (
        <div className="space-y-4">
          {isLoading ? (
            <div className="bg-white p-4 rounded-lg shadow text-center">
              <p className="text-gray-500">Loading...</p>
            </div>
          ) : roundMarkCriteria[activeRoundId]?.length > 0 ? (
            <div className="grid gap-4">
              {roundMarkCriteria[activeRoundId].map((criterion) => (
                <div
                  key={criterion.id}
                  className="bg-white p-4 rounded-lg shadow-md"
                >
                  <div className="flex justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-800">
                        {criterion.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Max Score: {criterion.maxScore}
                      </p>
                      {criterion.note && (
                        <p className="text-gray-600 mt-2">{criterion.note}</p>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => openEditForm(criterion)}
                        className="p-1 text-gray-500 hover:text-blue-500"
                        aria-label="Edit criterion"
                        disabled={isLoading}
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteCriterion(criterion.id)}
                        className="p-1 text-gray-500 hover:text-red-500"
                        aria-label="Delete criterion"
                        disabled={isLoading}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white p-4 rounded-lg shadow text-center">
              <p className="text-gray-500">
                No mark criteria defined for this round.
              </p>
              <button
                onClick={openCreateForm}
                className="mt-2 px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                disabled={isLoading}
              >
                Add First Criterion
              </button>
            </div>
          )}
        </div>
      )}

      {/* API Response Modal */}
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
