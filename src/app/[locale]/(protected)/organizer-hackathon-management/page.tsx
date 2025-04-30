"use client";
import { useState, useMemo, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import HackathonList from "./_components/HackathonList";
import Filters from "./_components/Filters";
import SearchSortBar from "./_components/SearchSortBar";
import Pagination from "./_components/Pagination";
import { Hackathon } from "@/types/entities/hackathon";
import { useQuery } from "@tanstack/react-query";
import { hackathonService } from "@/services/hackathon.service";
import { useTranslations } from "@/hooks/useTranslations";
import { useToast } from "@/hooks/use-toast";

async function getHackathons(): Promise<{
  data: Hackathon[];
  message?: string;
}> {
  const response = await hackathonService.getAllHackathons();
  return response;
}

const ITEMS_PER_PAGE = 6; // Limit items per page

export default function HackathonPage() {
  const t = useTranslations("hackathon");
  const toast = useToast();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("suggestion");
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

  // Use ref to track if we've already shown the toast
  const shownToastRef = useRef(false);

  const {
    data: hackathonsResponse,
    error,
    isLoading,
  } = useQuery<{ data: Hackathon[]; message?: string }>({
    queryKey: ["hackathons"],
    queryFn: getHackathons,
    staleTime: 60 * 1000, // 1 minute before refetch
    refetchOnWindowFocus: false, // Disable automatic refetching when the window regains focus
  });

  // Only show toast on initial load and prevent re-renders
  useEffect(() => {
    if (hackathonsResponse?.message && !shownToastRef.current) {
      toast.success(hackathonsResponse.message);
      shownToastRef.current = true;
    }
  }, [hackathonsResponse]);

  // Show error toast if API call fails
  useEffect(() => {
    if (error && !shownToastRef.current) {
      toast.error(
        error instanceof Error ? error.message : t("errorFetchingHackathons")
      );
      shownToastRef.current = true;
    }
  }, [error, t]);

  // Reset the ref when the query key changes
  useEffect(() => {
    return () => {
      shownToastRef.current = false;
    };
  }, []);

  // Handle search input change
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setPage(1); // Reset to first page when search changes
  };

  // Handle sort change
  const handleSortChange = (value: string) => {
    setSortBy(value);
  };

  // Handle create hackathon navigation
  const handleCreateHackathon = () => {
    router.push("/organizer-hackathon-management/create");
  };

  // Apply Filters, Search and Sort & Memoize the Computation
  const filteredHackathons = useMemo(() => {
    if (!hackathonsResponse?.data) return [];

    // First, apply filters
    let result = hackathonsResponse.data.filter((hackathon) => {
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

    // Then, apply search if there's a search term
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase().trim();
      result = result.filter((hackathon) =>
        hackathon.title.toLowerCase().includes(searchLower)
      );
    }

    // Finally, apply sorting
    if (sortBy === "latest") {
      return [...result].sort(
        (a, b) =>
          new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
      );
    }

    // Default sorting (suggestion)
    return result;
  }, [hackathonsResponse?.data, filters, searchTerm, sortBy]);

  // Pagination: Slice the filtered results
  const paginatedHackathons = useMemo(() => {
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    return filteredHackathons.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredHackathons, page]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [filters, searchTerm, sortBy]);

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 flex justify-center items-center min-h-[50vh]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-t-blue-500 border-b-blue-700 border-gray-200"></div>
          <p className="mt-2 text-gray-700 dark:text-gray-300">
            {t("loading")}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 flex justify-center items-center min-h-[50vh]">
        <div className="text-center text-red-600 dark:text-red-400">
          <p>{t("failedToLoad")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 transition-colors duration-300">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-0">
          {t("hackathonPageTitle")}
        </h1>

        <button
          onClick={handleCreateHackathon}
          className="bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition-all duration-300 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-green-300 dark:focus:ring-green-800 shadow-sm flex items-center"
          aria-label={t("createHackathonAriaLabel")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          {t("createHackathon")}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Filters */}
        <div className="w-full lg:w-1/4">
          <Filters selectedFilters={filters} onFilterChange={setFilters} />
        </div>

        {/* Main Content */}
        <div className="w-full lg:w-3/4">
          <SearchSortBar
            searchValue={searchTerm}
            sortValue={sortBy}
            onSearchChange={handleSearchChange}
            onSortChange={handleSortChange}
          />

          {/* Results summary */}
          <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
            {t("resultsCount", { count: filteredHackathons.length })}
          </div>

          {/* Hackathon list */}
          <HackathonList hackathons={paginatedHackathons} />

          {/* Pagination */}
          {filteredHackathons.length > 0 && (
            <Pagination
              page={page}
              onPageChange={setPage}
              totalItems={filteredHackathons.length}
              itemsPerPage={ITEMS_PER_PAGE}
            />
          )}
        </div>
      </div>
    </div>
  );
}
