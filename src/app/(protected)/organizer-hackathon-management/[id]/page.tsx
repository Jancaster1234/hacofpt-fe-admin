// src/app/(protected)/organizer-hackathon-management/[id]/page.tsx
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

  // Query to fetch hackathon data
  const {
    data: hackathon,
    error: hackathonError,
    isLoading: isLoadingHackathon,
  } = useQuery<Hackathon>({
    queryKey: ["hackathon", id],
    queryFn: () => getHackathon(id),
    staleTime: 60 * 1000, // 1 minute before refetch
    refetchOnWindowFocus: false,
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

  // For metadata-related side effects
  useEffect(() => {
    if (hackathon) {
      document.title = hackathon.title || "Hackathon Detail";
      // Update meta description if needed
      const metaDescription = document.querySelector(
        'meta[name="description"]'
      );
      if (metaDescription) {
        metaDescription.setAttribute("content", hackathon.description || "");
      }
    }
  }, [hackathon]);

  if (isLoadingHackathon || isLoadingUserHackathons)
    return <p>Loading hackathon details...</p>;

  if (hackathonError || userHackathonsError)
    return <p>Failed to load hackathon details.</p>;

  if (!hackathon) return <p>No hackathon found.</p>;

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
        title={hackathon.title}
        subtitle={hackathon.subtitle}
        date={hackathon.enrollStartDate}
        enrollmentCount={hackathon.enrollmentCount}
        id={id}
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
          mark_criteria: "",
        }}
      />
    </div>
  );
}
