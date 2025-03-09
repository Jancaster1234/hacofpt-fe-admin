// src/app/hackathon/_components/Pagination.tsx
"use client";

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
  return (
    <div className="flex justify-center mt-4">
      <button
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        className="px-4 py-2 border rounded-l disabled:opacity-50"
      >
        {"<"}
      </button>
      <span className="px-4 py-2 border">
        {page} / {totalPages}
      </span>
      <button
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        className="px-4 py-2 border rounded-r disabled:opacity-50"
      >
        {">"}
      </button>
    </div>
  );
}
