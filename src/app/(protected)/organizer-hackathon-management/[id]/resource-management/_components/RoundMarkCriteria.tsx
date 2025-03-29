// src/app/(protected)/organizer-hackathon-management/[id]/resource-management/_components/RoundMarkCriteria.tsx
import { useEffect, useState } from "react";
import { fetchMockRounds } from "../_mocks/fetchMockRounds";
import { fetchMockRoundMarkCriteria } from "../_mocks/fetchMockRoundMarkCriteria";
import { Round } from "@/types/entities/round";
import { RoundMarkCriterion } from "@/types/entities/roundMarkCriterion";
import RoundMarkCriterionForm from "./RoundMarkCriterionForm";
import { Plus, Edit, Trash2 } from "lucide-react";

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

  useEffect(() => {
    fetchMockRounds(hackathonId).then((roundsData) => {
      setRounds(roundsData);
      if (roundsData.length > 0) {
        setActiveRoundId(roundsData[0].id);
      }

      // Fetch mark criteria for each round
      roundsData.forEach((round) => {
        fetchMockRoundMarkCriteria(round.id).then((criteriaData) => {
          setRoundMarkCriteria((prev) => ({
            ...prev,
            [round.id]: criteriaData,
          }));
        });
      });
    });
  }, [hackathonId]);

  const handleCreateCriterion = async (data: {
    name: string;
    maxScore: number;
    note?: string;
  }) => {
    if (!activeRoundId) return;

    // Create request format for backend API
    /* 
    API Request format:
    POST /api/rounds/{roundId}/mark-criteria
    {
      name: string;
      maxScore: number;
      note?: string;
    }
    */

    // Mock implementation for now
    const newCriterion: RoundMarkCriterion = {
      id: `new-${Date.now()}`,
      round: rounds.find((r) => r.id === activeRoundId)!,
      name: data.name,
      maxScore: data.maxScore,
      note: data.note || "",
      judgeSubmissionDetails: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setRoundMarkCriteria((prev) => ({
      ...prev,
      [activeRoundId]: [...(prev[activeRoundId] || []), newCriterion],
    }));

    setIsFormOpen(false);
    setEditingCriterion(null);
  };

  const handleUpdateCriterion = async (data: {
    name: string;
    maxScore: number;
    note?: string;
  }) => {
    if (!activeRoundId || !editingCriterion) return;

    // Update request format for backend API
    /* 
    API Request format:
    PUT /api/mark-criteria/{criterionId}
    {
      name: string;
      maxScore: number;
      note?: string;
    }
    */

    // Mock implementation for now
    const updatedCriteria = roundMarkCriteria[activeRoundId].map((criterion) =>
      criterion.id === editingCriterion.id
        ? {
            ...criterion,
            name: data.name,
            maxScore: data.maxScore,
            note: data.note || "",
            updatedAt: new Date().toISOString(),
          }
        : criterion
    );

    setRoundMarkCriteria((prev) => ({
      ...prev,
      [activeRoundId]: updatedCriteria,
    }));

    setIsFormOpen(false);
    setEditingCriterion(null);
  };

  const handleDeleteCriterion = async (criterionId: string) => {
    if (!activeRoundId) return;

    // Delete request format for backend API
    /* 
    API Request format:
    DELETE /api/mark-criteria/{criterionId}
    */

    // Mock implementation for now
    const filteredCriteria = roundMarkCriteria[activeRoundId].filter(
      (criterion) => criterion.id !== criterionId
    );

    setRoundMarkCriteria((prev) => ({
      ...prev,
      [activeRoundId]: filteredCriteria,
    }));
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
        />
      )}

      {activeRoundId && (
        <div className="space-y-4">
          {roundMarkCriteria[activeRoundId]?.length > 0 ? (
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
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteCriterion(criterion.id)}
                        className="p-1 text-gray-500 hover:text-red-500"
                        aria-label="Delete criterion"
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
              >
                Add First Criterion
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
