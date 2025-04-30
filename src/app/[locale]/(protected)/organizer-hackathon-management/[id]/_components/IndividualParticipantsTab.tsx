// src/app/[locale]/(protected)/organizer-hackathon-management/[id]/_components/IndividualParticipantsTab.tsx
"use client";

import { useState, useEffect } from "react";
import { individualRegistrationRequestService } from "@/services/individualRegistrationRequest.service";
import { IndividualRegistrationRequest } from "@/types/entities/individualRegistrationRequest";
import Image from "next/image";

export function IndividualParticipantsTab({
  hackathonId,
}: {
  hackathonId: string;
}) {
  const [approvedRegistrations, setApprovedRegistrations] = useState<
    IndividualRegistrationRequest[]
  >([]);
  const [completedRegistrations, setCompletedRegistrations] = useState<
    IndividualRegistrationRequest[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeStatus, setActiveStatus] = useState<"APPROVED" | "COMPLETED">(
    "APPROVED"
  );

  useEffect(() => {
    const fetchIndividualRegistrations = async () => {
      try {
        setIsLoading(true);

        // Fetch both APPROVED and COMPLETED registrations in parallel
        const [approvedRes, completedRes] = await Promise.all([
          individualRegistrationRequestService.getApprovedIndividualRegistrationsByHackathonId(
            hackathonId
          ),
          individualRegistrationRequestService.getCompletedIndividualRegistrationsByHackathonId(
            hackathonId
          ),
        ]);

        setApprovedRegistrations(approvedRes.data);
        setCompletedRegistrations(completedRes.data);
      } catch (err) {
        console.error("Error fetching individual registrations:", err);
        setError(
          "Failed to load individual participants. Please try again later."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchIndividualRegistrations();
  }, [hackathonId]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">Loading participants...</div>
    );
  }

  if (error) {
    return <div className="text-red-500 py-4">{error}</div>;
  }

  const currentRegistrations =
    activeStatus === "APPROVED"
      ? approvedRegistrations
      : completedRegistrations;

  if (
    approvedRegistrations.length === 0 &&
    completedRegistrations.length === 0
  ) {
    return (
      <div className="py-4">
        No individual participants have registered for this hackathon yet.
      </div>
    );
  }

  return (
    <div>
      <div className="flex mb-4">
        <button
          onClick={() => setActiveStatus("APPROVED")}
          className={`px-4 py-2 ${
            activeStatus === "APPROVED"
              ? "bg-blue-100 text-blue-800 rounded-t-lg font-medium"
              : "text-gray-600"
          }`}
        >
          Approved ({approvedRegistrations.length})
        </button>
        <button
          onClick={() => setActiveStatus("COMPLETED")}
          className={`px-4 py-2 ${
            activeStatus === "COMPLETED"
              ? "bg-green-100 text-green-800 rounded-t-lg font-medium"
              : "text-gray-600"
          }`}
        >
          Completed ({completedRegistrations.length})
        </button>
      </div>

      <div className="bg-white">
        {currentRegistrations.length === 0 ? (
          <div className="py-6 text-center text-gray-500">
            No {activeStatus.toLowerCase()} registrations found.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentRegistrations.map((registration) => {
              // If we have proper user data structure, use it
              // This section might need adjustment based on actual data structure
              const userName = registration.createdByUserName || "Unknown User";

              return (
                <div
                  key={registration.id}
                  className="border rounded-lg p-4 shadow-sm flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-600">
                      {userName.charAt(0)}
                    </span>
                  </div>

                  <div>
                    <div className="font-medium">{userName}</div>

                    <div className="text-sm text-gray-500">
                      Registered on{" "}
                      {new Date(registration.createdAt).toLocaleDateString()}
                    </div>

                    <div className="mt-1">
                      <span
                        className={`text-xs px-2 py-0.5 rounded ${
                          registration.status === "APPROVED"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {registration.status}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
