// src/app/[locale]/(protected)/organizer-hackathon-management/[id]/resource-management/_components/SponsorshipHackathonDetailForm.tsx
import React, { useState } from "react";
import { SponsorshipHackathonDetail } from "@/types/entities/sponsorshipHackathonDetail";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useTranslations } from "@/hooks/useTranslations";
import { useToast } from "@/hooks/use-toast";
import { sponsorshipHackathonDetailService } from "@/services/sponsorshipHackathonDetail.service";

interface SponsorshipHackathonDetailFormProps {
  sponsorshipHackathonId: string;
  detail?: SponsorshipHackathonDetail;
  onSuccess: () => void;
  onCancel: () => void;
}

const SponsorshipHackathonDetailForm: React.FC<
  SponsorshipHackathonDetailFormProps
> = ({ sponsorshipHackathonId, detail, onSuccess, onCancel }) => {
  const t = useTranslations("sponsorshipDetail");
  const toast = useToast();

  const [formData, setFormData] = useState<{
    content: string;
    moneySpent: number;
    status: "PLANNED" | "COMPLETED" | "CANCELLED";
    timeFrom: string;
    timeTo: string;
  }>({
    content: detail?.content || "",
    moneySpent: detail?.moneySpent || 0,
    status:
      (detail?.status as "PLANNED" | "COMPLETED" | "CANCELLED") || "PLANNED",
    timeFrom: detail?.timeFrom
      ? new Date(detail.timeFrom).toISOString().slice(0, 16)
      : "",
    timeTo: detail?.timeTo
      ? new Date(detail.timeTo).toISOString().slice(0, 16)
      : "",
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "moneySpent" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError(null);

      const payload = {
        sponsorshipHackathonId,
        ...formData,
      };

      let response;
      if (detail?.id) {
        // Update existing detail
        response =
          await sponsorshipHackathonDetailService.updateSponsorshipHackathonDetailInformation(
            detail.id,
            payload
          );
      } else {
        // Create new detail
        response =
          await sponsorshipHackathonDetailService.createSponsorshipHackathonDetail(
            payload
          );
      }

      // Show success toast with response message
      toast.success(response.message || t("detailSaveSuccess"));
      onSuccess();
    } catch (err: any) {
      const errorMsg = err.message || t("detailSaveFailed");
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-sm transition-colors duration-200">
        <LoadingSpinner size="md" showText={true} />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 sm:p-6 transition-colors duration-200">
      <div className="flex justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {detail ? t("editDetail") : t("createNewDetail")}
        </h3>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t("description")}*
          </label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
            required
            aria-required="true"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t("moneySpent")}*
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 dark:text-gray-400">
                $
              </span>
              <input
                type="number"
                name="moneySpent"
                value={formData.moneySpent}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="w-full pl-8 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                required
                aria-required="true"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t("status.status")}*
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
              required
              aria-required="true"
            >
              <option value="PLANNED">{t("planned")}</option>
              <option value="COMPLETED">{t("completed")}</option>
              <option value="CANCELLED">{t("cancelled")}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t("fromDateTime")}*
            </label>
            <input
              type="datetime-local"
              name="timeFrom"
              value={formData.timeFrom}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
              required
              aria-required="true"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t("toDateTime")}*
            </label>
            <input
              type="datetime-local"
              name="timeTo"
              value={formData.timeTo}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
              required
              aria-required="true"
            />
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={onCancel}
            className="w-full sm:w-auto px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400 transition-colors"
          >
            {t("cancel")}
          </button>
          <button
            type="submit"
            className="w-full sm:w-auto px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
          >
            {detail ? t("updateDetail") : t("createDetail")}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SponsorshipHackathonDetailForm;
