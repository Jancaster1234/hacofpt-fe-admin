// src/app/(protected)/organizer-hackathon-management/[id]/resource-management/_components/RoundMarkCriterionForm.tsx
import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { RoundMarkCriterion } from "@/types/entities/roundMarkCriterion";

interface RoundMarkCriterionFormProps {
  criterion: RoundMarkCriterion | null;
  onSubmit: (data: { name: string; maxScore: number; note?: string }) => void;
  onCancel: () => void;
}

export default function RoundMarkCriterionForm({
  criterion,
  onSubmit,
  onCancel,
}: RoundMarkCriterionFormProps) {
  const [name, setName] = useState("");
  const [maxScore, setMaxScore] = useState(10);
  const [note, setNote] = useState("");
  const [errors, setErrors] = useState<{ name?: string; maxScore?: string }>(
    {}
  );

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
      newErrors.name = "Name is required";
    }

    if (maxScore <= 0) {
      newErrors.maxScore = "Max score must be greater than 0";
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
    <div className="bg-white p-4 rounded-lg shadow-md mb-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">
          {criterion ? "Edit Mark Criterion" : "Create Mark Criterion"}
        </h3>
        <button
          onClick={onCancel}
          className="p-1 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-medium mb-1">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`w-full p-2 border rounded-md ${
              errors.name ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="e.g. Innovation"
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-medium mb-1">
            Max Score <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            value={maxScore}
            onChange={(e) => setMaxScore(parseInt(e.target.value) || 0)}
            min="1"
            className={`w-full p-2 border rounded-md ${
              errors.maxScore ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.maxScore && (
            <p className="text-red-500 text-xs mt-1">{errors.maxScore}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-medium mb-1">
            Note (Optional)
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            rows={3}
            placeholder="Describe what this criterion evaluates..."
          />
        </div>

        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            {criterion ? "Update" : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
}
