// src/app/[locale]/(protected)/profile/_components/HackathonParticipatedTab.tsx
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { User } from "@/types/entities/user";
import { useState } from "react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export default function HackathonParticipatedTab({ user }: { user: User }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [isLoading] = useState(false);

  const userHackathons = user.userHackathons || [];
  const totalPages = Math.ceil(userHackathons.length / itemsPerPage);
  const paginatedHackathons = userHackathons.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageSizeChange = (value: string) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1);
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "CLOSED":
        return "bg-red-100 text-red-800 hover:bg-red-200";
      case "ONGOING":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  const getPlacementBadge = (placement: number | string) => {
    if (placement === "-") return null;

    const badges = {
      1: "bg-yellow-100 text-yellow-800 border-2 border-yellow-400",
      2: "bg-gray-100 text-gray-800 border-2 border-gray-400",
      3: "bg-orange-100 text-orange-800 border-2 border-orange-400",
    };

    return badges[placement as keyof typeof badges] || "bg-blue-100 text-blue-800";
  };

  if (isLoading) {
    return (
      <Card className="mt-6">
        <CardContent className="p-6">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (userHackathons.length === 0) {
    return (
      <Card className="mt-6">
        <CardContent className="p-6 text-center">
          <div className="flex flex-col items-center justify-center py-10">
            <Image
              src="/empty-state.png"
              alt="No hackathons"
              width={200}
              height={200}
              className="mb-4 opacity-50"
            />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Hackathons Yet
            </h3>
            <p className="text-gray-500 max-w-sm">
              You haven&apos;t participated in any hackathons yet. Join one to start your journey!
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-6">
      <CardContent className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-3 px-4 text-left font-semibold text-gray-900">Image</th>
                <th className="py-3 px-4 text-left font-semibold text-gray-900">Title</th>
                <th className="py-3 px-4 text-left font-semibold text-gray-900">Time</th>
                <th className="py-3 px-4 text-left font-semibold text-gray-900">Status</th>
                <th className="py-3 px-4 text-left font-semibold text-gray-900">Placement</th>
              </tr>
            </thead>
            <tbody>
              {paginatedHackathons.map((userHackathon) => {
                const hackathon = userHackathon.hackathon;
                // For participants, show the first team's placement
                const placement = userHackathon.role === "PARTICIPANT"
                  ? (hackathon?.hackathonResults?.[0]?.placement ?? "-")
                  : "-";

                return (
                  <tr
                    key={userHackathon.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-4 px-4">
                      {hackathon?.bannerImageUrl ? (
                        <div className="relative w-[120px] h-[70px] rounded-lg overflow-hidden">
                          <Image
                            src={hackathon.bannerImageUrl || ''}
                            alt={hackathon.title || 'Hackathon banner'}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-[120px] h-[70px] bg-gray-200 rounded-lg flex items-center justify-center">
                          <span className="text-gray-400">No image</span>
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-medium text-gray-900">{hackathon?.title ?? "-"}</div>
                      <div className="text-sm text-gray-500">{userHackathon.role}</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="space-y-1">
                        <div className="text-sm text-gray-500">
                          Start: {hackathon?.startDate ? format(new Date(hackathon.startDate), "MMM dd, yyyy") : "-"}
                        </div>
                        <div className="text-sm text-gray-500">
                          End: {hackathon?.endDate ? format(new Date(hackathon.endDate), "MMM dd, yyyy") : "-"}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <Badge className={cn("font-medium", getStatusBadgeColor(hackathon?.status || ""))}>
                        {hackathon?.status === "ONGOING"
                          ? "Taking place"
                          : hackathon?.status === "CLOSED"
                            ? "Closed"
                            : hackathon?.status ?? "-"}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      {placement !== "-" && (
                        <Badge className={cn("font-medium", getPlacementBadge(placement))}>
                          {placement === 1 ? "1st Place 🏆" :
                            placement === 2 ? "2nd Place 🥈" :
                              placement === 3 ? "3rd Place 🥉" :
                                `${placement}th Place`}
                        </Badge>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between mt-6">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Items per page</span>
            <Select
              value={itemsPerPage.toString()}
              onValueChange={handlePageSizeChange}
            >
              <SelectTrigger className="w-[70px]">
                <SelectValue placeholder="5" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3">3</SelectItem>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>

            <div className="flex items-center">
              {[...Array(totalPages)].map((_, index) => {
                const pageNumber = index + 1;
                // Show first page, current page, last page, and pages around current page
                if (
                  pageNumber === 1 ||
                  pageNumber === totalPages ||
                  (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                ) {
                  return (
                    <Button
                      key={index}
                      variant={currentPage === pageNumber ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setCurrentPage(pageNumber)}
                      className="mx-1"
                    >
                      {pageNumber}
                    </Button>
                  );
                } else if (
                  pageNumber === currentPage - 2 ||
                  pageNumber === currentPage + 2
                ) {
                  return (
                    <span key={index} className="px-2 text-gray-400">
                      ...
                    </span>
                  );
                }
                return null;
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
