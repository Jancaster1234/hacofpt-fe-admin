// src/app/profile/_components/HackathonParticipatedTab.tsx
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { User } from "@/types/entities/user";
import { useState } from "react";

export default function HackathonParticipatedTab({ user }: { user: User }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const totalPages = Math.ceil(user.userHackathons.length / itemsPerPage);
  const paginatedHackathons = user.userHackathons.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when page size changes
  };

  return (
    <Card className="mt-6">
      <CardContent className="p-6 overflow-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left border-b">
              <th className="py-2">Image</th>
              <th>Title</th>
              <th>Time</th>
              <th>Status</th>
              <th>Placement</th>
            </tr>
          </thead>
          <tbody>
            {paginatedHackathons.map((userHackathon) => {
              const hackathon = userHackathon.hackathon;

              const userTeam = user.userTeams.find(
                (ut) => ut.team?.hackathonId === hackathon?.id
              );

              const placement =
                hackathon?.hackathonResults?.find(
                  (result) => result.teamId === userTeam?.teamId
                )?.placement ?? "-";

              return (
                <tr key={userHackathon.id} className="border-b">
                  <td className="py-2">
                    {hackathon?.bannerImageUrl && (
                      <Image
                        src={hackathon.bannerImageUrl}
                        alt="Hackathon banner"
                        width={100}
                        height={60}
                        className="rounded object-cover"
                      />
                    )}
                  </td>
                  <td>{hackathon?.title ?? "-"}</td>
                  <td>
                    From: {hackathon?.startDate ?? "-"}
                    <br />
                    To: {hackathon?.endDate ?? "-"}
                  </td>
                  <td className="font-semibold">
                    {hackathon?.status === "ONGOING"
                      ? "Taking place"
                      : hackathon?.status === "CLOSED"
                      ? "Closed"
                      : hackathon?.status ?? "-"}
                  </td>
                  <td>{placement}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Pagination Controls with items per page and pagination buttons side by side */}
        <div className="flex items-center justify-center mt-4 flex-wrap gap-6">
          {/* Items per page selector */}
          <div className="flex items-center gap-2">
            <span className="text-sm">Items per page:</span>
            <select
              value={itemsPerPage}
              onChange={handlePageSizeChange}
              className="border rounded px-2 py-1 text-sm"
            >
              <option value={3}>3</option>
              <option value={5}>5</option>
              <option value={10}>10</option>
            </select>
          </div>

          {/* Pagination buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              ◀ Prev
            </button>
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index + 1)}
                className={`px-3 py-1 border rounded ${
                  currentPage === index + 1 ? "bg-gray-300" : ""
                }`}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Next ▶
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
