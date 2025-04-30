// src/app/[locale]/(protected)/hackathon/[id]/page.tsx
"use client";

import { Metadata } from "next";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth_v0";

import HackathonBanner from "./_components/HackathonBanner";
import HackathonTabs from "./_components/HackathonTabs";
import HackathonOverview from "./_components/HackathonOverview";
import EditSaveButtons from "./_components/EditSaveButtons";
import ResourceManagementButton from "./_components/ResourceManagementButton";

import { hackathonService } from "@/services/hackathon.service";
import { userHackathonService } from "@/services/userHackathon.service";
import { Hackathon } from "@/types/entities/hackathon";
import { UserHackathon } from "@/types/entities/userHackathon";
import { useTranslations } from "@/hooks/useTranslations";
import { useToast } from "@/hooks/use-toast";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { teamService } from "@/services/team.service";
import { individualRegistrationRequestService } from "@/services/individualRegistrationRequest.service";

// This function should be memoized to avoid fetching the same data multiple times
async function getHackathon(id: string): Promise<Hackathon> {
  const response = await hackathonService.getHackathonById(id);
  return response.data.length > 0 ? response.data[0] : null;
}

export default function HackathonDetail() {
  const params = useParams();
  const id = params.id as string;
  const { user } = useAuth();
  const [canManageHackathon, setCanManageHackathon] = useState(false);
  const t = useTranslations("hackathonDetail");
  const toast = useToast();
  const [enrollmentCount, setEnrollmentCount] = useState<number>(0);

  // Query to fetch hackathon data
  const {
    data: hackathon,
    error,
    isLoading,
  } = useQuery<Hackathon | null>({
    queryKey: ["hackathon", id],
    queryFn: () => getHackathon(id),
    staleTime: 60 * 1000, // 1 minute before refetch
    refetchOnWindowFocus: false,
    onError: (error: any) => {
      toast.error(error.message || t("errorLoading"));
    },
    onSuccess: (data) => {
      if (data) {
        toast.success(t("loadedSuccessfully"));
      }
    },
  });

  // Query to fetch user hackathon roles data
  const {
    data: userHackathons,
    error: userHackathonsError,
    isLoading: isLoadingUserHackathons,
  } = useQuery<UserHackathon[]>({
    queryKey: ["userHackathons", id],
    queryFn: async () => {
      const response =
        await userHackathonService.getUserHackathonsByHackathonId(id);
      return response.data;
    },
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
  });

  // Check if current user has management permissions for this hackathon
  useEffect(() => {
    if (user && hackathon) {
      // Check if user is the creator of the hackathon
      const isCreator = hackathon.createdByUserName === user.username;

      // Check if user is an organizer for this hackathon
      const isOrganizer =
        userHackathons?.some(
          (userHackathon) =>
            userHackathon.user.id === user.id &&
            userHackathon.role === "ORGANIZER"
        ) || false;

      // User can manage if they're either the creator or an assigned organizer
      setCanManageHackathon(isCreator || isOrganizer);
    }
  }, [user, hackathon, userHackathons]);

  // Fetch teams and individual registrations to calculate enrollmentCount
  useEffect(() => {
    if (!id) return;

    const calculateEnrollmentCount = async () => {
      try {
        // Fetch teams for this hackathon
        const teamsResponse = await teamService.getTeamsByHackathonId(id);
        const teams = teamsResponse.data;

        // Fetch approved individual registrations
        const individualRegistrationsResponse =
          await individualRegistrationRequestService.getApprovedIndividualRegistrationsByHackathonId(
            id
          );
        const approvedIndividualRegistrations =
          individualRegistrationsResponse.data;

        // Calculate total enrollment count
        // Sum of all team members plus approved individual registrations
        const teamMembersCount = teams.reduce(
          (acc, team) => acc + team.teamMembers.length,
          0
        );
        const totalEnrollmentCount =
          teamMembersCount + approvedIndividualRegistrations.length;

        setEnrollmentCount(totalEnrollmentCount);
      } catch (error) {
        console.error("Error calculating enrollment count:", error);
        // If there's an error, set enrollmentCount to 0 or handle appropriately
        setEnrollmentCount(0);
      }
    };

    calculateEnrollmentCount();
  }, [id]);

  // For metadata-related side effects
  useEffect(() => {
    if (hackathon) {
      document.title = hackathon.title || t("pageTitle");
      // Update meta description if needed
      const metaDescription = document.querySelector(
        'meta[name="description"]'
      );
      if (metaDescription) {
        metaDescription.setAttribute("content", hackathon.description || "");
      }
    }
  }, [hackathon, t]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <LoadingSpinner size="lg" />
        <span className="ml-3 text-gray-700 dark:text-gray-300">
          {t("loading")}
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 text-center">
        <p className="text-red-500 dark:text-red-400 font-medium text-lg">
          {t("failedToLoad")}
        </p>
      </div>
    );
  }

  if (!hackathon) {
    return (
      <div className="container mx-auto p-4 text-center">
        <p className="text-gray-700 dark:text-gray-300 font-medium text-lg">
          {t("noHackathonFound")}
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-6">
      {/* Edit & Save Buttons - Only show if user is creator or organizer */}
      {canManageHackathon && (
        <div className="flex gap-4 mb-4">
          <EditSaveButtons hackathonId={id} initialHackathonData={hackathon} />
          <ResourceManagementButton hackathonId={id} />
        </div>
      )}

      <HackathonBanner
        bannerImageUrl={hackathon.bannerImageUrl}
        altText={hackathon.title}
      />
      <HackathonOverview
        id={id}
        title={hackathon.title}
        subtitle={hackathon.subTitle}
        startDate={hackathon.startDate}
        endDate={hackathon.endDate}
        enrollStartDate={hackathon.enrollStartDate}
        enrollEndDate={hackathon.enrollEndDate}
        enrollmentCount={enrollmentCount}
        minimumTeamMembers={hackathon.minimumTeamMembers}
        maximumTeamMembers={hackathon.maximumTeamMembers}
      />
      <HackathonTabs
        content={{
          information: hackathon.information,
          description: hackathon.description,
          participant: hackathon.participant,
          documentation: hackathon.documentation,
          contact: hackathon.contact,
        }}
        hackathonId={id}
      />
    </div>
  );
}
