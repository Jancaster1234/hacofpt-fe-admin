"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth_v0";
import { fetchMockMentorshipRequests } from "./_mocks/fetchMockMentorshipRequests";
import { MentorshipRequest } from "@/types/entities/mentorshipRequest";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function MentorshipRequestsPage() {
  const { user } = useAuth();
  const [mentorshipRequests, setMentorshipRequests] = useState<
    MentorshipRequest[]
  >([]);
  const [expandedHackathons, setExpandedHackathons] = useState<
    Record<string, boolean>
  >({});

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
