// src/app/(protected)/organizer-hackathon-management/[id]/resource-management/_components/TeamRequests.tsx
"use client";
import React, { useState, useEffect } from "react";
import { TeamRequest, TeamRequestStatus } from "@/types/entities/teamRequest";
import { useAuth } from "@/hooks/useAuth_v0";
import { Badge } from "@/components/ui/badge";
import { useApiModal } from "@/hooks/useApiModal";
import { teamRequestService } from "@/services/teamRequest.service";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, CheckCircle, XCircle } from "lucide-react";

interface TeamRequestsProps {
  hackathonId: string;
}

export default function TeamRequests({ hackathonId }: TeamRequestsProps) {
  const { user } = useAuth();
  const { showError, showSuccess } = useApiModal();
  const [teamRequests, setTeamRequests] = useState<TeamRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedRequest, setSelectedRequest] = useState<TeamRequest | null>(
    null
  );
  const [updateNote, setUpdateNote] = useState("");
  const [updatingRequest, setUpdatingRequest] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    const loadTeamRequests = async () => {
      setLoading(true);
      try {
        const { data, message } =
          await teamRequestService.getTeamRequestsByHackathon(hackathonId);

        if (data && Array.isArray(data)) {
          setTeamRequests(data);
        } else {
          showError(
            "Error",
            "Failed to load team requests: Invalid response data"
          );
        }
      } catch (error) {
        console.error("Error loading team requests:", error);
        showError(
          "Error",
          "Failed to load team requests. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    loadTeamRequests();
  }, [hackathonId, showError]);

  const getStatusBadgeColor = (status: TeamRequestStatus) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "UNDER_REVIEW":
        return "bg-blue-100 text-blue-800";
      case "APPROVED":
        return "bg-green-100 text-green-800";
      case "REJECTED":
        return "bg-red-100 text-red-800";
      case "CANCELED":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const updateTeamRequest = async (status: "APPROVED" | "REJECTED") => {
    if (!selectedRequest) return;

    setUpdatingRequest(true);
    try {
      const { data, message } = await teamRequestService.reviewTeamRequest({
        requestId: selectedRequest.id,
        status,
        note: updateNote || selectedRequest.note || "",
      });

      if (data) {
        // Update the local state with the updated request
        setTeamRequests((prev) =>
          prev.map((req) => (req.id === selectedRequest.id ? data : req))
        );

        showSuccess(
          "Success",
          `Team request ${status.toLowerCase()} successfully`
        );
      } else {
        showError(
          "Error",
          message || `Failed to ${status.toLowerCase()} team request`
        );
      }

      setOpenDialog(false);
      setSelectedRequest(null);
      setUpdateNote("");
    } catch (error) {
      console.error("Error updating team request:", error);
      showError(
        "Error",
        `Failed to ${status.toLowerCase()} team request. Please try again later.`
      );
    } finally {
      setUpdatingRequest(false);
    }
  };

  const filteredRequests = teamRequests.filter((request) => {
    if (statusFilter === "all") return true;
    return request.status === statusFilter;
  });

  // Pagination
  const totalPages = Math.ceil(filteredRequests.length / pageSize);
  const paginatedRequests = filteredRequests.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleOpenDialog = (request: TeamRequest) => {
    setSelectedRequest(request);
    setUpdateNote(request.note || "");
    setOpenDialog(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <span className="ml-2">Loading team requests...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <div>
            <label
              htmlFor="statusFilter"
              className="block text-sm font-medium text-gray-700"
            >
              Filter by Status
            </label>
            <Select
              value={statusFilter}
              onValueChange={(value) => {
                setStatusFilter(value);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="UNDER_REVIEW">Under Review</SelectItem>
                <SelectItem value="APPROVED">Approved</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
                <SelectItem value="CANCELED">Canceled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label
              htmlFor="pageSize"
              className="block text-sm font-medium text-gray-700"
            >
              Page Size
            </label>
            <Select
              value={pageSize.toString()}
              onValueChange={(value) => {
                setPageSize(parseInt(value));
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="10" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span className="text-sm">
            Page {currentPage} of {totalPages || 1}
          </span>
          <Button
            variant="outline"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages || totalPages === 0}
          >
            Next
          </Button>
        </div>
      </div>

      {paginatedRequests.length === 0 ? (
        <div className="text-center p-8 bg-gray-50 rounded-md">
          <p className="text-gray-500">
            No team requests found matching the selected filters.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {paginatedRequests.map((request) => (
            <Card key={request.id} className="overflow-hidden">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Team Request</CardTitle>
                    <CardDescription>
                      Created by: {request.createdByUserName}
                    </CardDescription>
                  </div>
                  <Badge className={getStatusBadgeColor(request.status)}>
                    {request.status.replace("_", " ").toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-sm">Note</h4>
                    <p className="text-gray-600">
                      {request.note || "No note provided"}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm mb-2">
                      Team Members ({request.teamRequestMembers.length})
                    </h4>
                    <div className="space-y-2">
                      {request.teamRequestMembers.map((member) => (
                        <div
                          key={member.id}
                          className="flex items-center justify-between p-2 bg-gray-50 rounded"
                        >
                          <div className="flex items-center gap-2">
                            {member.user?.avatarUrl && (
                              <img
                                src={member.user.avatarUrl}
                                alt={`${member.user.firstName} ${member.user.lastName}`}
                                className="w-8 h-8 rounded-full"
                              />
                            )}
                            <div>
                              <p className="font-medium">
                                {member.user?.firstName} {member.user?.lastName}
                              </p>
                              <p className="text-sm text-gray-500">
                                {member.user?.email}
                              </p>
                            </div>
                          </div>
                          <Badge
                            className={
                              member.status === "APPROVED"
                                ? "bg-green-100 text-green-800"
                                : member.status === "REJECTED"
                                ? "bg-red-100 text-red-800"
                                : member.status === "no_response"
                                ? "bg-gray-100 text-gray-800"
                                : "bg-yellow-100 text-yellow-800"
                            }
                          >
                            {member.status.replace("_", " ").toUpperCase()}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-gray-50 border-t px-6 py-3">
                <div className="w-full flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    Deadline:{" "}
                    {new Date(
                      request.confirmationDeadline
                    ).toLocaleDateString()}
                  </div>
                  {request.status === "UNDER_REVIEW" && (
                    <Button onClick={() => handleOpenDialog(request)}>
                      Review
                    </Button>
                  )}
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Review Team Request</DialogTitle>
            <DialogDescription>
              Update the status of this team request. This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="note" className="text-sm font-medium">
                Note (Optional)
              </label>
              <Textarea
                id="note"
                value={updateNote}
                onChange={(e) => setUpdateNote(e.target.value)}
                placeholder="Add a note about your decision..."
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium">Team Members</h4>
              <div className="space-y-2">
                {selectedRequest?.teamRequestMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded"
                  >
                    <div className="flex items-center gap-2">
                      {member.user?.avatarUrl && (
                        <img
                          src={member.user.avatarUrl}
                          alt={`${member.user.firstName} ${member.user.lastName}`}
                          className="w-8 h-8 rounded-full"
                        />
                      )}
                      <div>
                        <p className="font-medium">
                          {member.user?.firstName} {member.user?.lastName}
                        </p>
                        <p className="text-sm text-gray-500">
                          {member.user?.email}
                        </p>
                      </div>
                    </div>
                    <Badge
                      className={
                        member.status === "APPROVED"
                          ? "bg-green-100 text-green-800"
                          : member.status === "REJECTED"
                          ? "bg-red-100 text-red-800"
                          : member.status === "no_response"
                          ? "bg-gray-100 text-gray-800"
                          : "bg-yellow-100 text-yellow-800"
                      }
                    >
                      {member.status.replace("_", " ").toUpperCase()}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter className="sm:justify-between">
            <Button
              variant="destructive"
              disabled={updatingRequest}
              onClick={() => updateTeamRequest("REJECTED")}
            >
              {updatingRequest ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Rejecting...
                </>
              ) : (
                <>
                  <XCircle className="mr-2 h-4 w-4" />
                  Reject
                </>
              )}
            </Button>
            <Button
              variant="default"
              disabled={updatingRequest}
              onClick={() => updateTeamRequest("APPROVED")}
            >
              {updatingRequest ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Approving...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Approve
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
