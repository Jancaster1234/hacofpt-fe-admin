// src/app/[locale]/(protected)/thread-post-report-management/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth_v0";
import { threadPostReportService } from "@/services/threadPostReport.service";
import {
  ThreadPostReport,
  ThreadPostReportStatus,
} from "@/types/entities/threadPostReport";

export default function ThreadPostReportManagement() {
  const { user } = useAuth();
  const [reports, setReports] = useState<ThreadPostReport[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await threadPostReportService.getAllThreadPostReports();
      setReports(response.data);
    } catch (err) {
      setError("Failed to fetch thread post reports");
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
      await threadPostReportService.reviewThreadPostReport(report.id, {
        status: newStatus,
      });

      // Update local state after successful API call
      setReports((prevReports) =>
        prevReports.map((r) =>
          r.id === report.id ? { ...r, status: newStatus } : r
        )
      );
    } catch (err) {
      setError(`Failed to update report status: ${err}`);
      console.error(err);
    } finally {
      setUpdating((prev) => ({ ...prev, [report.id]: false }));
    }
  };

  const getStatusBadgeClass = (status: ThreadPostReportStatus) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "REVIEWED":
        return "bg-green-100 text-green-800";
      case "DISMISSED":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
        <p className="text-gray-600">Loading thread post reports...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
        <p className="text-red-600">{error}</p>
        <button
          onClick={fetchReports}
          className="mt-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Thread Post Report Management
        </h1>
        <p className="text-gray-600">
          Welcome, {user ? `${user.firstName} ${user.lastName}` : "Guest"}!
          Manage reported thread posts below.
        </p>
      </div>

      {reports.length === 0 ? (
        <div className="rounded-lg bg-white p-6 shadow">
          <p className="text-gray-600">No thread post reports found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full rounded-lg bg-white shadow">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Thread Post ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Reason
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Created By
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Created At
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {reports.map((report) => (
                <tr key={report.id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {report.id.substring(0, 8)}...
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {report.threadPostId?.substring(0, 8)}...
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {report.reason}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusBadgeClass(
                        report.status
                      )}`}
                    >
                      {report.status}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {report.createdByUserName || "N/A"}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {formatDate(report.createdAt)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm">
                    {report.status === "PENDING" && (
                      <div className="space-x-2">
                        <button
                          onClick={() => handleUpdateStatus(report, "REVIEWED")}
                          disabled={updating[report.id]}
                          className="rounded bg-green-500 px-3 py-1 text-xs text-white hover:bg-green-600 disabled:opacity-50"
                        >
                          {updating[report.id]
                            ? "Updating..."
                            : "Mark Reviewed"}
                        </button>
                        <button
                          onClick={() =>
                            handleUpdateStatus(report, "DISMISSED")
                          }
                          disabled={updating[report.id]}
                          className="rounded bg-gray-500 px-3 py-1 text-xs text-white hover:bg-gray-600 disabled:opacity-50"
                        >
                          {updating[report.id] ? "Updating..." : "Dismiss"}
                        </button>
                      </div>
                    )}
                    {report.status !== "PENDING" && (
                      <span className="text-xs text-gray-500">
                        Already processed
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
