// src/app/(protected)/grading-submission/_components/Filters.tsx
"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const categories = [
  "Coding Hackathons",
  "External Hackathons",
  "Internal Hackathons",
  "Design Hackathons",
  "Others",
];

const organizations = [
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
  const {
    enrollmentStatus,
    categories: selectedCategories,
    organizations: selectedOrganizations,
  } = selectedFilters;

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

  return (
    <div className="p-6 border rounded-xl bg-white shadow-sm dark:bg-gray-800 dark:border-gray-700">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Filters</h3>

      <div className="space-y-6">
        {/* Category Filter */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Category</h4>
          <div className="space-y-2">
            {categories.map((cat) => (
              <div key={cat} className="flex items-center space-x-2">
                <Checkbox
                  id={`category-${cat}`}
                  checked={selectedCategories.includes(cat)}
                  onCheckedChange={() =>
                    toggleSelection(cat, selectedCategories, "categories")
                  }
                />
                <Label
                  htmlFor={`category-${cat}`}
                  className="text-sm font-normal text-gray-600 dark:text-gray-400 cursor-pointer hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
                >
                  {cat}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Enrollment Status Filter */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Enrollment Status</h4>
          <div className="space-y-2">
            {enrollmentStatusOptions.map((statusValue) => (
              <div key={statusValue} className="flex items-center space-x-2">
                <Checkbox
                  id={`status-${statusValue}`}
                  checked={enrollmentStatus.includes(statusValue)}
                  onCheckedChange={() =>
                    toggleSelection(
                      statusValue,
                      enrollmentStatus,
                      "enrollmentStatus"
                    )
                  }
                />
                <Label
                  htmlFor={`status-${statusValue}`}
                  className="text-sm font-normal text-gray-600 dark:text-gray-400 cursor-pointer hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
                >
                  {statusValue.charAt(0).toUpperCase() + statusValue.slice(1)}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Organization Filter */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Organization</h4>
          <div className="space-y-2">
            {organizations.map((org) => (
              <div key={org} className="flex items-center space-x-2">
                <Checkbox
                  id={`org-${org}`}
                  checked={selectedOrganizations.includes(org)}
                  onCheckedChange={() =>
                    toggleSelection(org, selectedOrganizations, "organizations")
                  }
                />
                <Label
                  htmlFor={`org-${org}`}
                  className="text-sm font-normal text-gray-600 dark:text-gray-400 cursor-pointer hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
                >
                  {org}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
