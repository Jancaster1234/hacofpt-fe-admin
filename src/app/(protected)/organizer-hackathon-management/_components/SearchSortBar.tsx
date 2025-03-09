// src/app/hackathon/_components/SearchSortBar.tsx
"use client";
import { useState } from "react";

export default function SearchSortBar() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("suggestion");

  return (
    <div className="flex justify-between items-center mb-4">
      <input
        type="text"
        placeholder="Search hackathons..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border p-2 rounded w-2/3"
      />
      <select
        value={sort}
        onChange={(e) => setSort(e.target.value)}
        className="border p-2 rounded"
      >
        <option value="suggestion">Suggestion</option>
        <option value="latest">Latest</option>
      </select>
    </div>
  );
}
