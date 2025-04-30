// src/app/[locale]/(protected)/organizer-hackathon-management/[id]/_components/IndividualParticipantsTab.tsx
"use client";

import { useState, useEffect } from "react";
import { individualRegistrationRequestService } from "@/services/individualRegistrationRequest.service";
import { userService } from "@/services/user.service";
import { IndividualRegistrationRequest } from "@/types/entities/individualRegistrationRequest";
import { User } from "@/types/entities/user";
import { useTranslations } from "@/hooks/useTranslations";
import { useToast } from "@/hooks/use-toast";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Image from "next/image";

// Define a type that extends IndividualRegistrationRequest with user details
interface EnhancedRegistration extends IndividualRegistrationRequest {
  userDetails?: User;
}

export function IndividualParticipantsTab({
  hackathonId,
}: {
  hackathonId: string;
}) {
  const t = useTranslations("participants");
  const { error: showError } = useToast(); // Correctly destructure the error function

  const [approvedRegistrations, setApprovedRegistrations] = useState<
    EnhancedRegistration[]
  >([]);
  const [completedRegistrations, setCompletedRegistrations] = useState<
    EnhancedRegistration[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeStatus, setActiveStatus] = useState<"APPROVED" | "COMPLETED">(
    "APPROVED"
  );

  // Function to fetch user details for a registration
  const fetchUserDetails = async (
    registration: IndividualRegistrationRequest
  ): Promise<EnhancedRegistration> => {
    if (!registration.createdByUserName) {
      return registration;
    }

    try {
      const userResponse = await userService.getUserByUsername(
        registration.createdByUserName
      );
      if (userResponse && userResponse.data) {
        return {
          ...registration,
          userDetails: userResponse.data,
        };
      }
    } catch (err) {
      console.error(
        `Failed to fetch user details for ${registration.createdByUserName}:`,
        err
      );
    }

    return registration;
  };

  useEffect(() => {
    let isCancelled = false;

    const fetchIndividualRegistrations = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch both APPROVED and COMPLETED registrations in parallel
        const [approvedRes, completedRes] = await Promise.all([
          individualRegistrationRequestService.getApprovedIndividualRegistrationsByHackathonId(
            hackathonId
          ),
          individualRegistrationRequestService.getCompletedIndividualRegistrationsByHackathonId(
            hackathonId
          ),
        ]);

        if (isCancelled) return;

        // Fetch user details for all registrations
        const approvedWithUsers = await Promise.all(
          (approvedRes.data || []).map(fetchUserDetails)
        );

        const completedWithUsers = await Promise.all(
          (completedRes.data || []).map(fetchUserDetails)
        );

        if (!isCancelled) {
          setApprovedRegistrations(approvedWithUsers);
          setCompletedRegistrations(completedWithUsers);
        }
      } catch (err) {
        console.error("Error fetching individual registrations:", err);
        if (!isCancelled) {
          const errorMessage = t("failedToLoadParticipants");
          setError(errorMessage);
          showError(errorMessage); // Use the destructured error function
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchIndividualRegistrations();

    return () => {
      isCancelled = true;
    };
  }, [hackathonId, t, showError]); // Add showError to dependencies

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8 transition-colors duration-300">
        <LoadingSpinner size="md" showText={true} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 dark:text-red-400 py-4 transition-colors duration-300">
        {error}
      </div>
    );
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
      <div className="py-4 text-gray-700 dark:text-gray-300 transition-colors duration-300">
        {t("noParticipantsRegistered")}
      </div>
    );
  }

  return (
    <div className="transition-colors duration-300">
      <div className="flex mb-4 border-b dark:border-gray-700">
        <button
          onClick={() => setActiveStatus("APPROVED")}
          className={`px-3 sm:px-4 py-2 transition-colors duration-200 ${
            activeStatus === "APPROVED"
              ? "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-t-lg font-medium"
              : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
          }`}
        >
          {t("approved")} ({approvedRegistrations.length})
        </button>
        <button
          onClick={() => setActiveStatus("COMPLETED")}
          className={`px-3 sm:px-4 py-2 transition-colors duration-200 ${
            activeStatus === "COMPLETED"
              ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-t-lg font-medium"
              : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
          }`}
        >
          {t("completed")} ({completedRegistrations.length})
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 transition-colors duration-300">
        {currentRegistrations.length === 0 ? (
          <div className="py-6 text-center text-gray-500 dark:text-gray-400">
            {t("noRegistrationsFound", { status: activeStatus.toLowerCase() })}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {currentRegistrations.map((registration) => {
              const userName =
                registration.createdByUserName || t("unknownUser");
              const userDetails = registration.userDetails;
              const email = userDetails?.email || "";
              const avatarUrl = userDetails?.avatarUrl;
              const formattedDate = new Date(
                registration.createdAt || ""
              ).toLocaleDateString();

              return (
                <div
                  key={registration.id}
                  className="border dark:border-gray-700 rounded-lg p-3 sm:p-4 shadow-sm 
                           bg-white dark:bg-gray-800 flex items-center gap-3 
                           hover:shadow-md transition-all duration-300"
                >
                  {avatarUrl ? (
                    <div className="w-10 h-10 rounded-full flex-shrink-0 overflow-hidden relative">
                      <Image
                        src={avatarUrl}
                        alt={userName}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div
                      className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 
                                flex items-center justify-center flex-shrink-0
                                transition-colors duration-300"
                    >
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                        {userName.charAt(0)}
                      </span>
                    </div>
                  )}

                  <div className="min-w-0">
                    <div className="font-medium text-gray-900 dark:text-gray-100 truncate">
                      {userName}
                    </div>

                    {email && (
                      <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">
                        {email}
                      </div>
                    )}

                    <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                      {t("registeredOn")} {formattedDate}
                    </div>

                    <div className="mt-1">
                      <span
                        className={`text-xs px-2 py-0.5 rounded transition-colors duration-300 ${
                          registration.status === "APPROVED"
                            ? "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
                            : "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                        }`}
                      >
                        {t(registration.status.toLowerCase())}
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
