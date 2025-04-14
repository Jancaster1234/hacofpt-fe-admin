// src/app/(protected)/organizer-hackathon-management/[id]/resource-management/_components/SponsorshipForm.tsx
import React, { useState, useEffect } from "react";
import { Sponsorship } from "@/types/entities/sponsorship";
import { sponsorshipService } from "@/services/sponsorship.service";

interface SponsorshipFormProps {
  hackathonId: string;
  sponsorship?: Sponsorship;
  onSuccess: () => void;
  onCancel: () => void;
}

const SponsorshipForm: React.FC<SponsorshipFormProps> = ({
  hackathonId,
  sponsorship,
  onSuccess,
  onCancel,
}) => {
  const isEditMode = Boolean(sponsorship?.id);

  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    content: "",
    money: 0,
    timeFrom: "",
    timeTo: "",
    status: "PENDING" as "PENDING" | "ACTIVE" | "COMPLETED" | "CANCELLED",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load sponsorship data if in edit mode
  useEffect(() => {
    if (sponsorship) {
      setFormData({
        name: sponsorship.name,
        brand: sponsorship.brand,
        content: sponsorship.content || "",
        money: sponsorship.money,
        timeFrom: new Date(sponsorship.timeFrom).toISOString().split("T")[0],
        timeTo: new Date(sponsorship.timeTo).toISOString().split("T")[0],
        status: sponsorship.status as
          | "PENDING"
          | "ACTIVE"
          | "COMPLETED"
          | "CANCELLED",
      });
    }
  }, [sponsorship]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "money" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (isEditMode) {
        await sponsorshipService.updateSponsorship({
          id: sponsorship?.id,
          ...formData,
        });
      } else {
        await sponsorshipService.createSponsorship(formData);
      }
      onSuccess();
    } catch (err: any) {
      setError(err.message || "Failed to save sponsorship");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold">
          {isEditMode ? "Edit Sponsorship" : "Add New Sponsorship"}
        </h3>
        <button
          onClick={onCancel}
          className="text-gray-600 hover:text-gray-800"
        >
          Cancel
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sponsorship Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Brand
            </label>
            <input
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount ($)
            </label>
            <input
              type="number"
              name="money"
              value={formData.money}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="PENDING">Pending</option>
              <option value="ACTIVE">Active</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              name="timeFrom"
              value={formData.timeFrom}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              type="date"
              name="timeTo"
              value={formData.timeTo}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="mr-3 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : isEditMode ? "Update" : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SponsorshipForm;
