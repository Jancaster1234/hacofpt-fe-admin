// src/app/[locale]/(protected)/calendar/_components/Pagination.tsx
"use client";

import { useTranslations } from "@/hooks/useTranslations";

type PaginationProps = {
  page: number;
  onPageChange: (newPage: number) => void;
  totalItems: number;
  itemsPerPage: number;
};

export default function Pagination({
  page,
  onPageChange,
  totalItems,
  itemsPerPage,
}: PaginationProps) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const t = useTranslations("pagination");

  return (
    <div className="flex justify-center mt-6 mb-4">
      <div className="flex items-center shadow-sm rounded overflow-hidden transition-colors duration-300">
        <button
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
          className="px-3 py-2 sm:px-4 sm:py-2 border dark:border-gray-700 rounded-l bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label={t("previousPage")}
        >
          <span aria-hidden="true">{"<"}</span>
        </button>
        <span className="px-3 py-2 sm:px-4 sm:py-2 border-t border-b dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 transition-colors duration-300">
          {t("pageInfo", { current: page, total: totalPages })}
        </span>
        <button
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="px-3 py-2 sm:px-4 sm:py-2 border dark:border-gray-700 rounded-r bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label={t("nextPage")}
        >
          <span aria-hidden="true">{">"}</span>
        </button>
      </div>
    </div>
  );
}
