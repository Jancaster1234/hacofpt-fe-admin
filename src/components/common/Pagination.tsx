// src/components/common/Pagination.tsx
import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
}) => {
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      // Show all pages if total pages are less than or equal to maxPagesToShow
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always include first page
      pageNumbers.push(1);

      // Calculate start and end of page range around current page
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);

      // Adjust start and end to ensure we always have 3 pages in the middle
      if (start === 2) end = Math.min(4, totalPages - 1);
      if (end === totalPages - 1) start = Math.max(2, totalPages - 3);

      // Add ellipsis after first page if needed
      if (start > 2) {
        pageNumbers.push("...");
      }

      // Add middle pages
      for (let i = start; i <= end; i++) {
        pageNumbers.push(i);
      }

      // Add ellipsis before last page if needed
      if (end < totalPages - 1) {
        pageNumbers.push("...");
      }

      // Always include last page
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-center bg-white p-4 shadow rounded-lg">
      <div className="text-sm text-gray-600 mb-4 md:mb-0">
        Showing {Math.min((currentPage - 1) * pageSize + 1, totalItems)} to{" "}
        {Math.min(currentPage * pageSize, totalItems)} of {totalItems} users
      </div>

      <div className="flex items-center">
        {/* Page size selector */}
        <div className="mr-6">
          <label className="text-sm text-gray-600 mr-2">Show:</label>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>

        {/* Pagination controls */}
        <div className="flex items-center">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-2 py-1 rounded-md ${
              currentPage === 1
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <ChevronLeft size={18} />
          </button>

          <div className="flex mx-1">
            {getPageNumbers().map((page, index) => (
              <React.Fragment key={index}>
                {page === "..." ? (
                  <span className="px-3 py-1 text-gray-500">...</span>
                ) : (
                  <button
                    onClick={() =>
                      typeof page === "number" && onPageChange(page)
                    }
                    className={`px-3 py-1 mx-0.5 rounded-md ${
                      currentPage === page
                        ? "bg-blue-600 text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {page}
                  </button>
                )}
              </React.Fragment>
            ))}
          </div>

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages || totalPages === 0}
            className={`px-2 py-1 rounded-md ${
              currentPage === totalPages || totalPages === 0
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
