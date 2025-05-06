// src/app/[locale]/(protected)/calendar/hackathon/[id]/calendar/layout.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth_v0";
import { userHackathonService } from "@/services/userHackathon.service";
import { UserHackathon } from "@/types/entities/userHackathon";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useToast } from "@/hooks/use-toast";

export default function CalendarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const params = useParams();
  const router = useRouter();
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  const hackathonId = Array.isArray(params.id) ? params.id[0] : params.id;

  // Use useCallback to prevent unnecessary re-renders and to stabilize the function
  const checkUserAccess = useCallback(async () => {
    if (!user || !hackathonId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      // Fetch user hackathons for the current hackathon
      const response =
        await userHackathonService.getUserHackathonsByHackathonId(hackathonId);

      if (response.data) {
        // Check if current user is in the user hackathons list
        const currentUserHackathonAccess = response.data.find(
          (userHackathon: UserHackathon) => userHackathon.user?.id === user.id
        );

        if (currentUserHackathonAccess) {
          setHasAccess(true);
          // No need for success toast here as this is a background check
        } else {
          // User doesn't have access to this hackathon calendar
          toast.warning("You don't have access to this hackathon calendar");
          setHasAccess(false);
        }
      } else {
        toast.error(
          response.message || "Failed to retrieve hackathon access information"
        );
        setHasAccess(false);
      }
    } catch (error: any) {
      console.error("Error checking hackathon calendar access:", error);
      toast.error(
        error.message ||
          "Error checking calendar access. Please try again later."
      );
      setHasAccess(false);
    } finally {
      setLoading(false);
    }
  }, [hackathonId, user, router]); // toast is intentionally excluded from dependencies

  useEffect(() => {
    checkUserAccess();
  }, [checkUserAccess]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" showText />
      </div>
    );
  }

  // If user doesn't have access, show access denied message instead of children
  return hasAccess ? (
    children
  ) : (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <div className="text-center p-6 max-w-md bg-white rounded-lg border border-red-200 shadow-md">
        <svg
          className="mx-auto mb-4 w-12 h-12 text-red-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
        <p className="text-gray-600 mb-4">
          You don't have permission to access this hackathon calendar. Please
          contact the hackathon organizer if you believe this is a mistake.
        </p>
        <button
          onClick={() => router.push("/calendar")}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Return to Calendar
        </button>
      </div>
    </div>
  );
}
