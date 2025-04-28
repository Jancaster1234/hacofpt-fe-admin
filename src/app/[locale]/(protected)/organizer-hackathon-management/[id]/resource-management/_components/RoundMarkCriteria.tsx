// src/app/[locale]/(protected)/organizer-hackathon-management/[id]/resource-management/_components/RoundMarkCriteria.tsx
import { useEffect, useState } from "react";
import { Round } from "@/types/entities/round";
import { RoundMarkCriterion } from "@/types/entities/roundMarkCriterion";
import RoundMarkCriterionForm from "./RoundMarkCriterionForm";
import { Plus, Edit, Trash2 } from "lucide-react";
import { roundService } from "@/services/round.service";
import { roundMarkCriterionService } from "@/services/roundMarkCriterion.service";
import { useApiModal } from "@/hooks/useApiModal";
import ApiResponseModal from "@/components/common/ApiResponseModal";
import { useTranslations } from "@/hooks/useTranslations";
import { useToast } from "@/hooks/use-toast";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function RoundMarkCriteria({
  hackathonId,
}: {
  hackathonId: string;
}) {
  const t = useTranslations("roundMarkCriteria");
  const toast = useToast();

  const [rounds, setRounds] = useState<Round[]>([]);
  const [activeRoundId, setActiveRoundId] = useState<string | null>(null);
  const [roundMarkCriteria, setRoundMarkCriteria] = useState<{
    [roundId: string]: RoundMarkCriterion[];
  }>({});
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCriterion, setEditingCriterion] =
    useState<RoundMarkCriterion | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingRounds, setIsFetchingRounds] = useState(false);
  const [isFetchingCriteria, setIsFetchingCriteria] = useState(false);

  // Use the API modal hook
  const { modalState, hideModal, showSuccess, showError } = useApiModal();

  const fetchRounds = async () => {
    setIsFetchingRounds(true);
    try {
      const response = await roundService.getRoundsByHackathonId(hackathonId);
      setRounds(response.data);
      if (response.data.length > 0) {
        setActiveRoundId(response.data[0].id);
        // First round's criteria will be loaded by the useEffect
      }
    } catch (error) {
      showError("Error", t("errors.failedToLoadRounds"));
      console.error("Error fetching rounds:", error);
    } finally {
      setIsFetchingRounds(false);
    }
  };

  const fetchRoundMarkCriteria = async (roundId: string) => {
    setIsFetchingCriteria(true);
    try {
      const response =
        await roundMarkCriterionService.getRoundMarkCriteriaByRoundId(roundId);
      setRoundMarkCriteria((prev) => ({
        ...prev,
        [roundId]: response.data,
      }));
    } catch (error) {
      showError("Error", t("errors.failedToLoadCriteria"));
      console.error("Error fetching mark criteria:", error);
    } finally {
      setIsFetchingCriteria(false);
    }
  };

  useEffect(() => {
    fetchRounds();
    // Don't include toast in the dependency array to avoid infinite loops
  }, [hackathonId]);

  useEffect(() => {
    if (activeRoundId) {
      fetchRoundMarkCriteria(activeRoundId);
    }
    // Don't include toast in the dependency array to avoid infinite loops
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

      // Show success toast instead of modal
      toast.success(response.message || t("toasts.criterionCreated"));

      setIsFormOpen(false);
      setEditingCriterion(null);
    } catch (error: any) {
      // Show error toast
      toast.error(error?.message || t("errors.failedToCreateCriterion"));
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

      // Show success toast
      toast.success(response.message || t("toasts.criterionUpdated"));

      setIsFormOpen(false);
      setEditingCriterion(null);
    } catch (error: any) {
      // Show error toast
      toast.error(error?.message || t("errors.failedToUpdateCriterion"));
      console.error("Error updating mark criterion:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCriterion = async (criterionId: string) => {
    if (!activeRoundId) return;

    setIsLoading(true);
    try {
      const response =
        await roundMarkCriterionService.deleteRoundMarkCriterion(criterionId);

      // Update the state by removing the deleted criterion
      setRoundMarkCriteria((prev) => ({
        ...prev,
        [activeRoundId]: prev[activeRoundId].filter(
          (criterion) => criterion.id !== criterionId
        ),
      }));

      // Show success toast
      toast.success(response.message || t("toasts.criterionDeleted"));
    } catch (error: any) {
      // Show error toast
      toast.error(error?.message || t("errors.failedToDeleteCriterion"));
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
    <div className="transition-colors duration-300 dark:text-gray-100">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
        <h2 className="text-xl font-semibold dark:text-white">{t("title")}</h2>
        {activeRoundId && (
          <button
            onClick={openCreateForm}
            className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors duration-200 flex items-center text-sm shadow-sm dark:bg-blue-600 dark:hover:bg-blue-700"
            disabled={isLoading || isFetchingRounds || isFetchingCriteria}
            aria-label={t("buttons.addCriterion")}
          >
            <Plus size={16} className="mr-1" /> {t("buttons.addCriterion")}
          </button>
        )}
      </div>

      {isFetchingRounds ? (
        <div className="py-4 flex justify-center">
          <LoadingSpinner size="md" showText={true} />
        </div>
      ) : (
        <div className="flex space-x-2 overflow-x-auto border-b mb-4 dark:border-gray-700 pb-1 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
          {rounds.map((round) => (
            <button
              key={round.id}
              className={`p-2 whitespace-nowrap transition-all duration-200 ${
                activeRoundId === round.id
                  ? "border-b-2 border-green-500 text-green-500 dark:text-green-400 dark:border-green-400 font-medium"
                  : "text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
              }`}
              onClick={() => setActiveRoundId(round.id)}
              disabled={isLoading || isFetchingCriteria}
            >
              {round.roundTitle}
            </button>
          ))}
        </div>
      )}

      {isFormOpen && (
        <div className="mb-6 p-4 border rounded-lg shadow-sm dark:border-gray-700 bg-white dark:bg-gray-800 transition-colors duration-300">
          <RoundMarkCriterionForm
            criterion={editingCriterion}
            onSubmit={
              editingCriterion ? handleUpdateCriterion : handleCreateCriterion
            }
            onCancel={closeForm}
            isLoading={isLoading}
          />
        </div>
      )}

      {activeRoundId && (
        <div className="space-y-4">
          {isFetchingCriteria ? (
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow text-center transition-colors duration-300">
              <LoadingSpinner size="md" showText={true} />
            </div>
          ) : roundMarkCriteria[activeRoundId]?.length > 0 ? (
            <div className="grid gap-4">
              {roundMarkCriteria[activeRoundId].map((criterion) => (
                <div
                  key={criterion.id}
                  className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md transition-all hover:shadow-lg duration-300"
                >
                  <div className="flex flex-col sm:flex-row justify-between">
                    <div className="mb-2 sm:mb-0">
                      <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
                        {criterion.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {t("maxScore")}: {criterion.maxScore}
                      </p>
                      {criterion.note && (
                        <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm">
                          {criterion.note}
                        </p>
                      )}
                    </div>
                    <div className="flex space-x-2 mt-2 sm:mt-0">
                      <button
                        onClick={() => openEditForm(criterion)}
                        className="p-1 text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400 transition-colors duration-200"
                        aria-label={t("buttons.edit")}
                        disabled={isLoading}
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteCriterion(criterion.id)}
                        className="p-1 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 transition-colors duration-200"
                        aria-label={t("buttons.delete")}
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
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow text-center transition-colors duration-300">
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                {t("noCriteria")}
              </p>
              <button
                onClick={openCreateForm}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200 text-sm shadow-sm dark:bg-blue-600 dark:hover:bg-blue-700"
                disabled={isLoading}
              >
                {t("buttons.addFirstCriterion")}
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

      {/* Display loading spinner during API operations */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-10 dark:bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
            <LoadingSpinner size="lg" showText={true} />
          </div>
        </div>
      )}
    </div>
  );
}
