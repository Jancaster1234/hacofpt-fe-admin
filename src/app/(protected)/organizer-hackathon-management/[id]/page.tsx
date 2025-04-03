// src/app/(protected)/organizer-hackathon-management/[id]/page.tsx
"use client";
// TODO: [Lv1] check if should cache the page server side and revalidate
// TODO: [Lv1] check if nextjs able to cache this page client-side
import { Metadata } from "next";
import HackathonBanner from "./_components/HackathonBanner";
import HackathonTabs from "./_components/HackathonTabs";
import HackathonOverview from "./_components/HackathonOverview";
import { Hackathon } from "@/types/entities/hackathon"; // Import type
import EditSaveButtons from "./_components/EditSaveButtons";
import ResourceManagementButton from "./_components/ResourceManagementButton";
import { hackathonService } from "@/services/hackathon.service";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

// TODO: [Lv1] check if memoization is enabled by default, without the need of enable force-cache

// This function should be memoized to avoid fetching the same data multiple times
async function getHackathon(id: string): Promise<Hackathon[]> {
  const response = await hackathonService.getHackathonById(id);
  return response.data.length > 0 ? response.data[0] : null;
}

export default function HackathonDetail() {
  const params = useParams();
  const id = params.id as string;

  const {
    data: hackathon,
    error,
    isLoading,
  } = useQuery<Hackathon>({
    queryKey: ["hackathon", id],
    queryFn: () => getHackathon(id),
    staleTime: 60 * 1000, // 1 minute before refetch
    refetchOnWindowFocus: false,
  });

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

  if (isLoading) return <p>Loading hackathon details...</p>;
  if (error) return <p>Failed to load hackathon details.</p>;
  if (!hackathon) return <p>No hackathon found.</p>;

  return (
    <div className="container mx-auto p-4 sm:p-6">
      {/* Edit & Save Buttons */}
      <div className="flex gap-4 mb-4">
        <EditSaveButtons hackathonId={id} initialHackathonData={hackathon} />
        <ResourceManagementButton hackathonId={id} />
      </div>

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
