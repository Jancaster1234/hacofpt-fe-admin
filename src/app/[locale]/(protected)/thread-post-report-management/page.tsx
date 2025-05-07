// src/app/[locale]/(protected)/thread-post-report-management/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth_v0";
import { threadPostReportService } from "@/services/threadPostReport.service";
import { threadPostService } from "@/services/threadPost.service";
import { useTranslations } from "@/hooks/useTranslations";
import { useToast } from "@/hooks/use-toast";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import {
  ThreadPostReport,
  ThreadPostReportStatus,
} from "@/types/entities/threadPostReport";

export default function ThreadPostReportManagement() {
  const { user } = useAuth();
  const t = useTranslations("threadPostReport");
  const toast = useToast();

  const [reports, setReports] = useState<ThreadPostReport[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    fetchReports();
    // Don't include toast functions in dependency array
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await threadPostReportService.getAllThreadPostReports();
      setReports(response.data);
    } catch (err) {
      setError(t("error"));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (
    report: ThreadPostReport,
    newStatus: ThreadPostReportStatus
  ) => {
    if (!report.id || !report.threadPost?.id) return;
    try {
      setUpdating((prev) => ({ ...prev, [report.id]: true }));
      const response = await threadPostReportService.reviewThreadPostReport(
        report.id,
        {
          status: newStatus,
        }
      );

      // If the report is being reviewed (not dismissed), delete the thread post
      if (newStatus === "REVIEWED" && report.threadPost?.id) {
        try {
          await threadPostService.deleteThreadPost(report.threadPost?.id);
          console.log(
            `Thread post ${report.threadPost?.id} deleted successfully`
          );
        } catch (deleteErr) {
          console.error(`Failed to delete thread post: ${deleteErr}`);
          // We'll continue even if deletion fails since the report status was updated
        }
      }

      // Update local state after successful API call
      setReports((prevReports) =>
        prevReports.map((r) =>
          r.id === report.id ? { ...r, status: newStatus } : r
        )
      );

      // Show success toast
      toast.success(response.message || t("updateSuccess"));
    } catch (err: any) {
      const errorMessage = err.message || t("updateError");
      setError(errorMessage);
      toast.error(errorMessage);
      console.error(err);
    } finally {
      setUpdating((prev) => ({ ...prev, [report.id]: false }));
    }
  };

  const getStatusBadgeClass = (status: ThreadPostReportStatus) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "REVIEWED":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "DISMISSED":
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4 transition-colors duration-300">
        <LoadingSpinner size="lg" showText={true} />
        <p className="text-gray-600 dark:text-gray-300 mt-4">{t("loading")}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4 transition-colors duration-300">
        <p className="text-red-600 dark:text-red-400 text-center">{error}</p>
        <button
          onClick={fetchReports}
          className="mt-4 rounded bg-blue-500 dark:bg-blue-600 px-4 py-2 text-white hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors duration-200"
        >
          {t("tryAgain")}
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 sm:p-6 transition-colors duration-300">
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
          {t("management")}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {t("welcome", {
            name: user ? `${user.firstName} ${user.lastName}` : "Guest",
          })}
        </p>
      </div>

      {reports.length === 0 ? (
        <div className="rounded-lg bg-white dark:bg-gray-800 p-4 sm:p-6 shadow transition-colors duration-300">
          <p className="text-gray-600 dark:text-gray-400">{t("noReports")}</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="w-full rounded-lg bg-white dark:bg-gray-800 transition-colors duration-300">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                  {t("tableHeaders.id")}
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                  {t("tableHeaders.threadPostId")}
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300 hidden sm:table-cell">
                  {t("tableHeaders.reason")}
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                  {t("tableHeaders.status")}
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300 hidden md:table-cell">
                  {t("tableHeaders.createdBy")}
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300 hidden md:table-cell">
                  {t("tableHeaders.createdAt")}
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                  {t("tableHeaders.actions")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {reports.map((report) => (
                <tr
                  key={report.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors duration-200"
                >
                  <td className="whitespace-nowrap px-3 sm:px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {report.id.substring(0, 8)}...
                  </td>
                  <td className="whitespace-nowrap px-3 sm:px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {report.threadPostId?.substring(0, 8)}...
                  </td>
                  <td className="px-3 sm:px-6 py-4 text-sm text-gray-500 dark:text-gray-400 hidden sm:table-cell">
                    <div className="max-w-xs truncate" title={report.reason}>
                      {report.reason}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 sm:px-6 py-4 text-sm">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusBadgeClass(
                        report.status
                      )}`}
                    >
                      {t(`status.${report.status.toLowerCase()}`)}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-3 sm:px-6 py-4 text-sm text-gray-500 dark:text-gray-400 hidden md:table-cell">
                    {report.createdByUserName || "N/A"}
                  </td>
                  <td className="whitespace-nowrap px-3 sm:px-6 py-4 text-sm text-gray-500 dark:text-gray-400 hidden md:table-cell">
                    {formatDate(report.createdAt)}
                  </td>
                  <td className="whitespace-nowrap px-3 sm:px-6 py-4 text-sm">
                    {report.status === "PENDING" && (
                      <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
                        <button
                          onClick={() => handleUpdateStatus(report, "REVIEWED")}
                          disabled={updating[report.id]}
                          className="rounded bg-blue-500 dark:bg-blue-600 px-3 py-1 text-xs text-white hover:bg-blue-600 dark:hover:bg-blue-700 disabled:opacity-50 transition-colors duration-200"
                          aria-label={t("actions.markReviewed")}
                        >
                          {updating[report.id]
                            ? t("actions.updating")
                            : t("actions.markReviewed")}
                        </button>
                        <button
                          onClick={() =>
                            handleUpdateStatus(report, "DISMISSED")
                          }
                          disabled={updating[report.id]}
                          className="rounded bg-gray-500 dark:bg-gray-600 px-3 py-1 text-xs text-white hover:bg-gray-600 dark:hover:bg-gray-700 disabled:opacity-50 transition-colors duration-200"
                          aria-label={t("actions.dismiss")}
                        >
                          {updating[report.id]
                            ? t("actions.updating")
                            : t("actions.dismiss")}
                        </button>
                      </div>
                    )}
                    {report.status !== "PENDING" && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {t("actions.processed")}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
