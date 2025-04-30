// src/app/[locale]/(protected)/organizer-hackathon-management/_components/SearchSortBar.tsx
"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "@/hooks/useTranslations";

type SearchSortBarProps = {
  searchValue: string;
  sortValue: string;
  onSearchChange: (value: string) => void;
  onSortChange: (value: string) => void;
};

export default function SearchSortBar({
  searchValue,
  sortValue,
  onSearchChange,
  onSortChange,
}: SearchSortBarProps) {
  const t = useTranslations("hackathon");
  const [search, setSearch] = useState(searchValue);

  // Update local state when props change
  useEffect(() => {
    setSearch(searchValue);
  }, [searchValue]);

  // Handle input changes with debounce
  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);

    // Use debounce to avoid too many updates
    const timeoutId = setTimeout(() => {
      onSearchChange(value);
    }, 300);

    return () => clearTimeout(timeoutId);
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-6 w-full transition-all duration-300">
      <div className="w-full sm:w-2/3 relative">
        <input
          type="text"
          placeholder={t("searchPlaceholder")}
          value={search}
          onChange={handleSearchInput}
          className="border dark:border-gray-700 p-2 pl-10 rounded-lg w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none shadow-sm transition-colors duration-300"
          aria-label={t("searchHackathons")}
        />
        <svg
          className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          ></path>
        </svg>
      </div>
      <div className="w-full sm:w-auto">
        <select
          value={sortValue}
          onChange={(e) => onSortChange(e.target.value)}
          className="border dark:border-gray-700 p-2 rounded-lg w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none shadow-sm transition-colors duration-300"
          aria-label={t("sortBy")}
        >
          <option value="latest">{t("sortByLatest")}</option>
          <option value="oldest">{t("sortByOldest")}</option>
        </select>
      </div>
    </div>
  );
}
