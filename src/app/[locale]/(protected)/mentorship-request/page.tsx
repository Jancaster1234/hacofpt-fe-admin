"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth_v0";
import { mentorshipRequestService } from "@/services/mentorshipRequest.service";
import { MentorshipRequest } from "@/types/entities/mentorshipRequest";
import {
  ChevronDown,
  ChevronUp,
  Check,
  X,
  Loader2,
  Moon,
  Sun,
} from "lucide-react";
import ApiResponseModal from "@/components/common/ApiResponseModal";
import { useApiModal } from "@/hooks/useApiModal";
import { useTranslations } from "@/hooks/useTranslations";
import { useToast } from "@/hooks/use-toast";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Link from "next/link";

export default function MentorshipRequestsPage() {
  const { user } = useAuth();
  const [mentorshipRequests, setMentorshipRequests] = useState<
    MentorshipRequest[]
  >([]);
  const [expandedHackathons, setExpandedHackathons] = useState<
    Record<string, boolean>
  >({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);
  const { modalState, hideModal, showSuccess, showError } = useApiModal();
  const t = useTranslations("mentorshipRequests");
  const toast = useToast();

  useEffect(() => {
    const fetchMentorshipRequests = async () => {
      if (!user?.id) return;

      setIsLoading(true);
      try {
        // Fetch mentorship requests by mentor ID
        const response =
          await mentorshipRequestService.getMentorshipRequestsByMentorId(
            user.id
          );

        if (response.data) {
          setMentorshipRequests(response.data);
        } else {
          showError(
            t("requestFailed"),
            response.message || t("failedToFetchRequests")
          );
        }
      } catch (error: any) {
        showError(t("error"), error.message || t("errorFetchingRequests"));
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchMentorshipRequests();
    }
  }, [user, showError, t]);

  // Group mentorship requests by hackathon
  const groupedByHackathon = mentorshipRequests.reduce(
    (acc, request) => {
      const hackathonTitle = request.hackathon?.title || t("unknownHackathon");
      if (!acc[hackathonTitle]) {
        acc[hackathonTitle] = [];
      }
      acc[hackathonTitle].push(request);
      return acc;
    },
    {} as Record<string, MentorshipRequest[]>
  );

  const toggleHackathon = (title: string) => {
    setExpandedHackathons((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const handleApproveRequest = async (requestId: string) => {
    if (!user) return;

    // Set loading state for this specific request
    setLoading((prev) => ({ ...prev, [requestId]: true }));

    try {
      // Find the request to update
      const requestToUpdate = mentorshipRequests.find(
        (req) => req.id === requestId
      );

      if (!requestToUpdate) {
        throw new Error(t("requestNotFound"));
      }

      // Show loading toast
      toast.info(t("approvingRequest"));

      const response = await mentorshipRequestService.approveMentorshipRequest({
        id: requestId,
        hackathonId: requestToUpdate.hackathonId,
        mentorId: requestToUpdate.mentorId,
        teamId: requestToUpdate.teamId,
        evaluatedById: user.id,
      });

      if (response.data) {
        // Update the state with the updated request
        setMentorshipRequests((prev) =>
          prev.map((request) =>
            request.id === requestId
              ? {
                  ...request,
                  status: "APPROVED",
                  evaluatedAt: response.data.evaluatedAt,
                  evaluatedBy: user
                    ? {
                        id: user.id,
                        firstName: user.firstName,
                        lastName: user.lastName,
                      }
                    : undefined,
                  evaluatedById: user.id,
                }
              : request
          )
        );

        // Show success modal
        showSuccess(
          t("success"),
          response.message || t("requestApprovedSuccess")
        );

        // Show success toast
        toast.success(response.message || t("requestApprovedSuccess"));
      } else {
        throw new Error(response.message || t("failedToApprove"));
      }
    } catch (error: any) {
      // Show error modal
      showError(
        t("approvalFailed"),
        error.message || t("errorApprovingRequest")
      );

      // Show error toast
      toast.error(error.message || t("errorApprovingRequest"));
    } finally {
      setLoading((prev) => ({ ...prev, [requestId]: false }));
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    if (!user) return;

    // Set loading state for this specific request
    setLoading((prev) => ({ ...prev, [requestId]: true }));

    try {
      // Find the request to update
      const requestToUpdate = mentorshipRequests.find(
        (req) => req.id === requestId
      );

      if (!requestToUpdate) {
        throw new Error(t("requestNotFound"));
      }

      // Show loading toast
      toast.info(t("rejectingRequest"));

      const response = await mentorshipRequestService.rejectMentorshipRequest({
        id: requestId,
        hackathonId: requestToUpdate.hackathonId,
        mentorId: requestToUpdate.mentorId,
        teamId: requestToUpdate.teamId,
        evaluatedById: user.id,
      });

      if (response.data) {
        // Update the state with the updated request
        setMentorshipRequests((prev) =>
          prev.map((request) =>
            request.id === requestId
              ? {
                  ...request,
                  status: "REJECTED",
                  evaluatedAt: response.data.evaluatedAt,
                  evaluatedBy: user
                    ? {
                        id: user.id,
                        firstName: user.firstName,
                        lastName: user.lastName,
                      }
                    : undefined,
                  evaluatedById: user.id,
                }
              : request
          )
        );

        // Show success modal
        showSuccess(
          t("success"),
          response.message || t("requestRejectedSuccess")
        );

        // Show success toast
        toast.success(response.message || t("requestRejectedSuccess"));
      } else {
        throw new Error(response.message || t("failedToReject"));
      }
    } catch (error: any) {
      // Show error modal
      showError(
        t("rejectionFailed"),
        error.message || t("errorRejectingRequest")
      );

      // Show error toast
      toast.error(error.message || t("errorRejectingRequest"));
    } finally {
      setLoading((prev) => ({ ...prev, [requestId]: false }));
    }
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 text-center mb-4 sm:mb-6 transition-colors duration-300">
        {t("pageTitle")}
      </h1>

      {/* Language Switcher */}
      <div className="flex justify-center mb-4 gap-2">
        <Link
          href="/en/mentorship-request"
          className="px-3 py-1 rounded bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors duration-300"
        >
          English
        </Link>
        <Link
          href="/vi/mentorship-request"
          className="px-3 py-1 rounded bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors duration-300"
        >
          Tiếng Việt
        </Link>
      </div>

      {isLoading ? (
        <div className="flex flex-col justify-center items-center h-32">
          <LoadingSpinner size="lg" showText={true} />
          <span className="mt-2 text-gray-600 dark:text-gray-400 transition-colors duration-300">
            {t("loadingRequests")}
          </span>
        </div>
      ) : Object.keys(groupedByHackathon).length === 0 ? (
        <div className="text-center p-6 rounded-lg bg-white dark:bg-gray-800 shadow-md transition-colors duration-300">
          <p className="text-gray-600 dark:text-gray-400">
            {t("noRequestsFound")}
          </p>
        </div>
      ) : (
        <div className="space-y-4 sm:space-y-6">
          {Object.entries(groupedByHackathon).map(
            ([hackathonTitle, requests]) => (
              <div
                key={hackathonTitle}
                className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg"
              >
                {/* Hackathon Title Header */}
                <div
                  className="flex justify-between items-center cursor-pointer group"
                  onClick={() => toggleHackathon(hackathonTitle)}
                >
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 transition-colors duration-300">
                    {hackathonTitle}
                  </h2>
                  <span className="text-gray-500 dark:text-gray-400 transition-colors duration-300 transform group-hover:scale-110">
                    {expandedHackathons[hackathonTitle] ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </span>
                </div>

                {/* Mentorship Requests (Expandable) */}
                {expandedHackathons[hackathonTitle] && (
                  <div className="mt-3 sm:mt-4 space-y-3 sm:space-y-4">
                    {requests.map((request) => (
                      <div
                        key={request.id}
                        className="border border-gray-200 dark:border-gray-700 p-2 sm:p-3 rounded-md bg-gray-50 dark:bg-gray-850 transition-colors duration-300"
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <p className="text-sm sm:text-base text-gray-800 dark:text-gray-200 transition-colors duration-300">
                            <span className="font-medium">{t("team")}: </span>
                            {request.team?.name || t("unknownTeam")}
                          </p>
                          <p className="text-sm sm:text-base text-gray-800 dark:text-gray-200 transition-colors duration-300">
                            <span className="font-medium">{t("status")}: </span>
                            <span
                              className={`font-semibold ${
                                request.status === "PENDING"
                                  ? "text-yellow-500 dark:text-yellow-400"
                                  : request.status === "APPROVED"
                                    ? "text-green-600 dark:text-green-400"
                                    : "text-red-600 dark:text-red-400"
                              } transition-colors duration-300`}
                            >
                              {t(request.status.toLowerCase())}
                            </span>
                          </p>
                        </div>

                        {request.evaluatedBy && (
                          <p className="text-sm sm:text-base text-gray-800 dark:text-gray-200 transition-colors duration-300">
                            <span className="font-medium">
                              {t("evaluatedBy")}:{" "}
                            </span>
                            {request.evaluatedBy.firstName}{" "}
                            {request.evaluatedBy.lastName}
                          </p>
                        )}

                        {request.evaluatedAt && (
                          <p className="text-sm sm:text-base text-gray-800 dark:text-gray-200 transition-colors duration-300">
                            <span className="font-medium">
                              {t("evaluatedAt")}:{" "}
                            </span>
                            {new Date(request.evaluatedAt).toLocaleString()}
                          </p>
                        )}

                        {/* Action Buttons - Only show for PENDING requests */}
                        {request.status === "PENDING" && (
                          <div className="mt-3 flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleApproveRequest(request.id);
                              }}
                              disabled={loading[request.id]}
                              className="flex items-center justify-center px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded hover:bg-green-200 dark:hover:bg-green-800 disabled:opacity-50 transition-colors duration-300"
                            >
                              {loading[request.id] ? (
                                <Loader2
                                  size={16}
                                  className="animate-spin mr-1"
                                />
                              ) : (
                                <Check size={16} className="mr-1" />
                              )}
                              {t("approve")}
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRejectRequest(request.id);
                              }}
                              disabled={loading[request.id]}
                              className="flex items-center justify-center px-3 py-1 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded hover:bg-red-200 dark:hover:bg-red-800 disabled:opacity-50 transition-colors duration-300"
                            >
                              {loading[request.id] ? (
                                <Loader2
                                  size={16}
                                  className="animate-spin mr-1"
                                />
                              ) : (
                                <X size={16} className="mr-1" />
                              )}
                              {t("reject")}
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
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
