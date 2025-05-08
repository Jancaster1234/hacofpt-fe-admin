// src/app/[locale]/(protected)/organizer-hackathon-management/[id]/resource-management/_components/SponsorshipForm.tsx
import React, { useState, useEffect } from "react";
import { Sponsorship } from "@/types/entities/sponsorship";
import { sponsorshipService } from "@/services/sponsorship.service";
import { useTranslations } from "@/hooks/useTranslations";
import { useToast } from "@/hooks/use-toast";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

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
  const t = useTranslations("sponsorship");
  const toast = useToast();
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

  // Format datetime string for input fields
  const formatDateTimeForInput = (dateString: string): string => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16); // Format as "YYYY-MM-DDThh:mm"
  };

  // Parse datetime from backend to local format
  const parseDateTime = (dateString: string): string => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16); // "YYYY-MM-DDThh:mm" format
  };

  // Load sponsorship data if in edit mode
  useEffect(() => {
    if (sponsorship) {
      setFormData({
        name: sponsorship.name,
        brand: sponsorship.brand,
        content: sponsorship.content || "",
        money: sponsorship.money,
        timeFrom: parseDateTime(sponsorship.timeFrom),
        timeTo: parseDateTime(sponsorship.timeTo),
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
      // Create a copy of form data to send to backend
      const submissionData = {
        ...formData,
        // Ensure we have time component, default to 00:00:00 if not provided
        timeFrom: formData.timeFrom.includes("T")
          ? formData.timeFrom
          : `${formData.timeFrom}T00:00:00`,
        timeTo: formData.timeTo.includes("T")
          ? formData.timeTo
          : `${formData.timeTo}T00:00:00`,
      };

      let response;
      if (isEditMode) {
        response = await sponsorshipService.updateSponsorship({
          id: sponsorship?.id,
          ...submissionData,
        });
      } else {
        response = await sponsorshipService.createSponsorship(submissionData);
      }

      // Show success toast
      toast.success(response.message || t("sponsorshipSaveSuccess"));
      onSuccess();
    } catch (err: any) {
      const errorMsg = err.message || t("sponsorshipSaveFailed");
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-sm transition-colors duration-200">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 sm:mb-0">
          {isEditMode ? t("editSponsorship") : t("addNewSponsorship")}
        </h3>
        <button
          onClick={onCancel}
          className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors"
          aria-label={t("cancel")}
        >
          {t("cancel")}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded">
          {error}
        </div>
      )}

      {isSubmitting ? (
        <div className="flex justify-center py-8">
          <LoadingSpinner size="md" showText={true} />
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t("sponsorshipName")} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                aria-required="true"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t("brand")} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                aria-required="true"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t("amount")} (VND) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="money"
                value={formData.money}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                aria-required="true"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t("status.status")}
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
              >
                <option value="PENDING">{t("pending")}</option>
                <option value="ACTIVE">{t("active")}</option>
                <option value="COMPLETED">{t("completed")}</option>
                <option value="CANCELLED">{t("cancelled")}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t("startDateTime")} <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                name="timeFrom"
                value={formData.timeFrom}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                aria-required="true"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t("endDateTime")} <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                name="timeTo"
                value={formData.timeTo}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                aria-required="true"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t("description")}
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
            />
          </div>

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onCancel}
              className="w-full sm:w-auto px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400 transition-colors"
              disabled={isSubmitting}
            >
              {t("cancel")}
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? t("saving")
                : isEditMode
                  ? t("update")
                  : t("create")}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default SponsorshipForm;
