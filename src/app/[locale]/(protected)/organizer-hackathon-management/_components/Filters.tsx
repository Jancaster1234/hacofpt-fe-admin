// src/app/[locale]/hackathon/_components/Filters.tsx
"use client";

import { useState } from "react";
import { useTranslations } from "@/hooks/useTranslations";

// Define the filter options
const categoryOptions = [
  "Coding Hackathons",
  "External Hackathons",
  "Internal Hackathons",
  "Design Hackathons",
  "Others",
];

const organizationOptions = [
  "FPTU",
  "NASA",
  "IAI HACKATHON",
  "CE Hackathon",
  "Others",
];

const enrollmentStatusOptions = ["upcoming", "open", "closed"];

type FiltersProps = {
  selectedFilters: {
    enrollmentStatus: string[];
    categories: string[];
    organizations: string[];
  };
  onFilterChange: (filters: {
    enrollmentStatus: string[];
    categories: string[];
    organizations: string[];
  }) => void;
};

export default function Filters({
  selectedFilters,
  onFilterChange,
}: FiltersProps) {
  const t = useTranslations("hackathon");
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const toggleSelection = (
    value: string,
    state: string[],
    key: "categories" | "organizations" | "enrollmentStatus"
  ) => {
    const newState = state.includes(value)
      ? state.filter((item) => item !== value)
      : [...state, value];

    onFilterChange({ ...selectedFilters, [key]: newState });
  };

  const toggleMobileFilters = () => {
    setIsMobileFiltersOpen(!isMobileFiltersOpen);
  };

  return (
    <>
      {/* Mobile filter toggle button */}
      <div className="lg:hidden mb-4">
        <button
          onClick={toggleMobileFilters}
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-300 flex items-center justify-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
            />
          </svg>
          {t("filters")}
        </button>
      </div>

      {/* Filter sidebar content */}
      <div
        className={`
          lg:block
          ${isMobileFiltersOpen ? "block" : "hidden"}
          bg-white dark:bg-gray-900 p-4 md:p-5 rounded-lg shadow-md transition-all duration-300 border dark:border-gray-700
        `}
      >
        <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">
          {t("filterBy")}
        </h3>

        {/* Category Filter */}
        <div className="mb-6">
          <h4 className="font-medium mb-3 text-gray-800 dark:text-gray-200">
            {t("categories")}
          </h4>
          <div className="space-y-2">
            {categoryOptions.map((category) => (
              <div key={category} className="flex items-center">
                <input
                  type="checkbox"
                  id={`category-${category}`}
                  checked={selectedFilters.categories.includes(category)}
                  onChange={() =>
                    toggleSelection(
                      category,
                      selectedFilters.categories,
                      "categories"
                    )
                  }
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:focus:ring-blue-400"
                />
                <label
                  htmlFor={`category-${category}`}
                  className="ml-2 text-sm text-gray-700 dark:text-gray-300"
                >
                  {t(`category${category.replace(/\s+/g, "")}`)}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Enrollment Status Filter */}
        <div className="mb-6">
          <h4 className="font-medium mb-3 text-gray-800 dark:text-gray-200">
            {t("status")}
          </h4>
          <div className="space-y-2">
            {enrollmentStatusOptions.map((status) => (
              <div key={status} className="flex items-center">
                <input
                  type="checkbox"
                  id={`status-${status}`}
                  checked={selectedFilters.enrollmentStatus.includes(status)}
                  onChange={() =>
                    toggleSelection(
                      status,
                      selectedFilters.enrollmentStatus,
                      "enrollmentStatus"
                    )
                  }
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:focus:ring-blue-400"
                />
                <label
                  htmlFor={`status-${status}`}
                  className="ml-2 text-sm text-gray-700 dark:text-gray-300 capitalize"
                >
                  {t(
                    `status${status.charAt(0).toUpperCase() + status.slice(1)}`
                  )}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Organization Filter */}
        <div className="mb-4">
          <h4 className="font-medium mb-3 text-gray-800 dark:text-gray-200">
            {t("organizations")}
          </h4>
          <div className="space-y-2">
            {organizationOptions.map((org) => (
              <div key={org} className="flex items-center">
                <input
                  type="checkbox"
                  id={`org-${org}`}
                  checked={selectedFilters.organizations.includes(org)}
                  onChange={() =>
                    toggleSelection(
                      org,
                      selectedFilters.organizations,
                      "organizations"
                    )
                  }
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:focus:ring-blue-400"
                />
                <label
                  htmlFor={`org-${org}`}
                  className="ml-2 text-sm text-gray-700 dark:text-gray-300"
                >
                  {t(`organization${org.replace(/\s+/g, "")}`)}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
