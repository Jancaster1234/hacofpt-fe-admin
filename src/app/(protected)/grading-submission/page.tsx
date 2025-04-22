// src/app/(protected)/grading-submission/page.tsx
"use client";
import { useState, useMemo } from "react";
import HackathonList from "./_components/HackathonList";
import Filters from "./_components/Filters";
import SearchSortBar from "./_components/SearchSortBar";
import Pagination from "./_components/Pagination";
import { Hackathon } from "@/types/entities/hackathon";
import { useQuery } from "@tanstack/react-query";
import { hackathonService } from "@/services/hackathon.service";
import CreateHackathonModal from "./_components/CreateHackathonModal";

// TODO: {lv2} Research: add Metadata solution for client components
// export const metadata: Metadata = {
//   title: "Hackathon Page",
//   description:
//     "This is the hackathon page where users can participate in hackathons.",
// };

//NOTE: This page is client component, client side data fetching, client side pagination and filtering
// TODO: {Lv2} Check optimization, check logic position
async function getHackathons(): Promise<Hackathon[]> {
  const response = await hackathonService.getAllHackathons();
  return response.data;
}

const ITEMS_PER_PAGE = 6; // Limit items per page

// TODO: {lv3} Should I Enable Refetching
export default function HackathonPage() {
  const [filters, setFilters] = useState<{
    enrollmentStatus: string[];
    categories: string[];
    organizations: string[];
  }>({
    enrollmentStatus: ["open"],
    categories: [],
    organizations: [],
  });
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    data: hackathons = [],
    error,
    isLoading,
  } = useQuery<Hackathon[]>({
    queryKey: ["hackathons"],
    queryFn: getHackathons,
    staleTime: 60 * 1000, // 1 minute before refetch
    refetchOnWindowFocus: false, // Disable automatic refetching when the window regains focus to avoid unnecessary API calls
  });

  // Apply Filters & Memoize the Computation
  const filteredHackathons = useMemo(() => {
    return hackathons.filter((hackathon) => {
      const matchesStatus =
        filters.enrollmentStatus.length > 0
          ? filters.enrollmentStatus.some(
              (status) =>
                hackathon.enrollmentStatus.toLowerCase() ===
                status.toLowerCase()
            )
          : true;
      const matchesCategory =
        filters.categories.length > 0
          ? filters.categories.some((category) =>
              hackathon.category.includes(category)
            )
          : true;
      const matchesOrganization =
        filters.organizations.length > 0
          ? filters.organizations.some((org) =>
              hackathon.organization.includes(org)
            )
          : true;

      return matchesStatus && matchesCategory && matchesOrganization;
    });
  }, [hackathons, filters]);

  // Pagination: Slice the filtered results
  const paginatedHackathons = useMemo(() => {
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    return filteredHackathons.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredHackathons, page]);

  // Reset to page 1 when filters change
  useMemo(() => setPage(1), [filters]);

  if (isLoading) return <p>Loading hackathons...</p>;
  if (error) return <p>Failed to load hackathons.</p>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex gap-4">
        {/* Sidebar Filters */}
        <div className="w-1/4">
          <Filters selectedFilters={filters} onFilterChange={setFilters} />
        </div>

        {/* Main Content */}
        <div className="w-3/4">
          <SearchSortBar />
          {/* Safely fallback to empty array if hackathons is undefined */}
          <HackathonList hackathons={paginatedHackathons ?? []} />
          <Pagination
            page={page}
            onPageChange={setPage}
            totalItems={filteredHackathons.length}
            itemsPerPage={ITEMS_PER_PAGE}
          />
        </div>

        {/* Modal Component */}
        {isModalOpen && (
          <CreateHackathonModal onClose={() => setIsModalOpen(false)} />
        )}
      </div>
    </div>
  );
}
