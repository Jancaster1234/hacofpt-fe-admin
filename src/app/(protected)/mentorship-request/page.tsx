// src/app/(protected)/mentorship-request/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth_v0";
import { fetchMockMentorshipRequests } from "./_mocks/fetchMockMentorshipRequests";
import { updateMentorshipRequest } from "./_api/updateMentorshipRequest";
import {
  MentorshipRequest,
  MentorshipStatus,
} from "@/types/entities/mentorshipRequest";
import { ChevronDown, ChevronUp, Check, X, Loader2 } from "lucide-react";

export default function MentorshipRequestsPage() {
  const { user } = useAuth();
  const [mentorshipRequests, setMentorshipRequests] = useState<
    MentorshipRequest[]
  >([]);
  const [expandedHackathons, setExpandedHackathons] = useState<
    Record<string, boolean>
  >({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (user) {
      fetchMockMentorshipRequests(user.id).then(setMentorshipRequests);
    }
  }, [user]);

  // Group mentorship requests by hackathon
  const groupedByHackathon = mentorshipRequests.reduce((acc, request) => {
    const hackathonTitle = request.hackathon?.title || "Unknown Hackathon";
    if (!acc[hackathonTitle]) {
      acc[hackathonTitle] = [];
    }
    acc[hackathonTitle].push(request);
    return acc;
  }, {} as Record<string, MentorshipRequest[]>);

  const toggleHackathon = (title: string) => {
    setExpandedHackathons((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const handleUpdateStatus = async (
    requestId: string,
    status: Extract<MentorshipStatus, "APPROVED" | "REJECTED">
  ) => {
    if (!user) return;

    // Set loading state for this specific request
    setLoading((prev) => ({ ...prev, [requestId]: true }));

    try {
      const updatedRequest = await updateMentorshipRequest({
        requestId,
        status,
        evaluatedById: user.id,
      });

      // Update the state with the updated request
      setMentorshipRequests((prev) =>
        prev.map((request) =>
          request.id === requestId
            ? {
                ...request,
                status: updatedRequest.status,
                evaluatedAt: updatedRequest.evaluatedAt,
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
    } catch (error) {
      console.error("Failed to update request:", error);
      // You could add toast notification here
    } finally {
      setLoading((prev) => ({ ...prev, [requestId]: false }));
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-3xl font-bold text-gray-900 text-center mb-6">
        Mentorship Requests
      </h1>

      {Object.keys(groupedByHackathon).length === 0 ? (
        <p className="text-center text-gray-600">
          No mentorship requests found.
        </p>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedByHackathon).map(
            ([hackathonTitle, requests]) => (
              <div
                key={hackathonTitle}
                className="bg-white p-4 rounded-lg shadow-md"
              >
                {/* Hackathon Title Header */}
                <div
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => toggleHackathon(hackathonTitle)}
                >
                  <h2 className="text-xl font-semibold">{hackathonTitle}</h2>
                  {expandedHackathons[hackathonTitle] ? (
                    <ChevronUp />
                  ) : (
                    <ChevronDown />
                  )}
                </div>

                {/* Mentorship Requests (Expandable) */}
                {expandedHackathons[hackathonTitle] && (
                  <div className="mt-4 space-y-4">
                    {requests.map((request) => (
                      <div
                        key={request.id}
                        className="border p-3 rounded-md bg-gray-50"
                      >
                        <p>
                          <strong>Team:</strong>{" "}
                          {request.team?.name || "Unknown Team"}
                        </p>
                        <p>
                          <strong>Status:</strong>{" "}
                          <span
                            className={`font-semibold ${
                              request.status === "PENDING"
                                ? "text-yellow-500"
                                : request.status === "APPROVED"
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {request.status}
                          </span>
                        </p>
                        {request.evaluatedBy && (
                          <p>
                            <strong>Evaluated By:</strong>{" "}
                            {request.evaluatedBy.firstName}{" "}
                            {request.evaluatedBy.lastName}
                          </p>
                        )}
                        {request.evaluatedAt && (
                          <p>
                            <strong>Evaluated At:</strong>{" "}
                            {new Date(request.evaluatedAt).toLocaleString()}
                          </p>
                        )}

                        {/* Action Buttons - Only show for PENDING requests */}
                        {request.status === "PENDING" && (
                          <div className="mt-3 flex space-x-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleUpdateStatus(request.id, "APPROVED");
                              }}
                              disabled={loading[request.id]}
                              className="flex items-center px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 disabled:opacity-50"
                            >
                              {loading[request.id] ? (
                                <Loader2
                                  size={16}
                                  className="animate-spin mr-1"
                                />
                              ) : (
                                <Check size={16} className="mr-1" />
                              )}
                              Approve
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleUpdateStatus(request.id, "REJECTED");
                              }}
                              disabled={loading[request.id]}
                              className="flex items-center px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 disabled:opacity-50"
                            >
                              {loading[request.id] ? (
                                <Loader2
                                  size={16}
                                  className="animate-spin mr-1"
                                />
                              ) : (
                                <X size={16} className="mr-1" />
                              )}
                              Reject
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
    </div>
  );
}
