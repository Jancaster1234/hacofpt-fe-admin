// src/app/hackathon/_components/Filters.tsx
"use client";

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
    <div className="p-4 border rounded-lg bg-white shadow">
      <h3 className="font-bold mb-2">Filter</h3>

      {/* Category Filter */}
      <div>
        <h4 className="font-semibold">Category</h4>
        {categories.map((cat) => (
          <label key={cat} className="block">
            <input
              type="checkbox"
              checked={selectedCategories.includes(cat)}
              onChange={() =>
                toggleSelection(cat, selectedCategories, "categories")
              }
            />
            {cat}
          </label>
        ))}
      </div>

      {/* Enrollment Status Filter */}
      <div className="mt-4">
        <h4 className="font-semibold">Enrollment Status</h4>
        {enrollmentStatusOptions.map((statusValue) => (
          <label key={statusValue} className="block">
            <input
              type="checkbox"
              checked={enrollmentStatus.includes(statusValue)}
              onChange={() =>
                toggleSelection(
                  statusValue,
                  enrollmentStatus,
                  "enrollmentStatus"
                )
              }
            />
            {statusValue.charAt(0).toUpperCase() + statusValue.slice(1)}
          </label>
        ))}
      </div>

      {/* Organization Filter */}
      <div className="mt-4">
        <h4 className="font-semibold">Organization</h4>
        {organizations.map((org) => (
          <label key={org} className="block">
            <input
              type="checkbox"
              checked={selectedOrganizations.includes(org)}
              onChange={() =>
                toggleSelection(org, selectedOrganizations, "organizations")
              }
            />
            {org}
          </label>
        ))}
      </div>
    </div>
  );
}
