// src/app/[locale]/(protected)/organizer-hackathon-management/[id]/resource-management/_components/RoundMarkCriterionForm.tsx
import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { RoundMarkCriterion } from "@/types/entities/roundMarkCriterion";
import { useTranslations } from "@/hooks/useTranslations";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

interface RoundMarkCriterionFormProps {
  criterion: RoundMarkCriterion | null;
  onSubmit: (data: { name: string; maxScore: number; note?: string }) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function RoundMarkCriterionForm({
  criterion,
  onSubmit,
  onCancel,
  isLoading = false,
}: RoundMarkCriterionFormProps) {
  const [name, setName] = useState("");
  const [maxScore, setMaxScore] = useState(10);
  const [note, setNote] = useState("");
  const [errors, setErrors] = useState<{ name?: string; maxScore?: string }>(
    {}
  );
  const t = useTranslations("roundMarkCriterion");

  useEffect(() => {
    if (criterion) {
      setName(criterion.name);
      setMaxScore(criterion.maxScore);
      setNote(criterion.note || "");
    }
  }, [criterion]);

  const validate = () => {
    const newErrors: { name?: string; maxScore?: string } = {};

    if (!name.trim()) {
      newErrors.name = t("errors.nameRequired");
    }

    if (maxScore <= 0) {
      newErrors.maxScore = t("errors.maxScorePositive");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validate()) {
      onSubmit({
        name,
        maxScore,
        note: note.trim() || undefined,
      });
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md mb-4 transition-colors duration-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
          {criterion ? t("editCriterion") : t("createCriterion")}
        </h3>
        <button
          onClick={onCancel}
          className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          disabled={isLoading}
          aria-label={t("cancel")}
        >
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1">
            {t("name")} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
              errors.name
                ? "border-red-500 dark:border-red-500"
                : "border-gray-300 dark:border-gray-600"
            }`}
            placeholder={t("namePlaceholder")}
            disabled={isLoading}
            aria-invalid={errors.name ? "true" : "false"}
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1">
            {t("maxScore")} <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            value={maxScore}
            onChange={(e) => setMaxScore(parseInt(e.target.value) || 0)}
            min="1"
            className={`w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
              errors.maxScore
                ? "border-red-500 dark:border-red-500"
                : "border-gray-300 dark:border-gray-600"
            }`}
            disabled={isLoading}
            aria-invalid={errors.maxScore ? "true" : "false"}
          />
          {errors.maxScore && (
            <p className="text-red-500 text-xs mt-1">{errors.maxScore}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1">
            {t("note")}
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            rows={3}
            placeholder={t("notePlaceholder")}
            disabled={isLoading}
          />
        </div>

        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-white disabled:opacity-50 transition-colors"
            disabled={isLoading}
          >
            {t("cancel")}
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 transition-colors flex items-center justify-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" /> {t("processing")}
              </>
            ) : criterion ? (
              t("update")
            ) : (
              t("create")
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
