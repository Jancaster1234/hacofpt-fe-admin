// src/app/[locale]/(protected)/organizer-hackathon-management/[id]/resource-management/_components/TeamRequests.tsx
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
import { Loader2, CheckCircle, XCircle, Users, Calendar } from "lucide-react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useToast } from "@/hooks/use-toast";
import { useTranslations } from "@/hooks/useTranslations";
import Image from "next/image";

interface TeamRequestsProps {
  hackathonId: string;
}

export default function TeamRequests({ hackathonId }: TeamRequestsProps) {
  const { user } = useAuth();
  const { showError, showSuccess } = useApiModal();
  const toast = useToast();
  const t = useTranslations("teamRequests");

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
          // Don't show toast during initial data loading
        } else {
          showError("Error", message || t("errors.invalidResponseData"));
        }
      } catch (error) {
        console.error("Error loading team requests:", error);
        showError("Error", t("errors.failedToLoad"));
      } finally {
        setLoading(false);
      }
    };

    loadTeamRequests();
  }, [hackathonId, showError, t]);

  const getStatusBadgeColor = (status: TeamRequestStatus) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "UNDER_REVIEW":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "APPROVED":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "REJECTED":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "CANCELED":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  const updateTeamRequest = async (status: "APPROVED" | "REJECTED") => {
    if (!selectedRequest) return;

    setUpdatingRequest(true);
    try {
      // Show loading toast
      toast.info(t("toasts.processing"));

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

        // Show success toast
        toast.success(message || t(`toasts.${status.toLowerCase()}Success`));
      } else {
        // Show error toast
        toast.error(message || t(`toasts.${status.toLowerCase()}Failed`));
      }

      setOpenDialog(false);
      setSelectedRequest(null);
      setUpdateNote("");
    } catch (error) {
      console.error("Error updating team request:", error);
      toast.error(t(`toasts.${status.toLowerCase()}Failed`));
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
      <div className="flex justify-center items-center h-64 transition-colors duration-300">
        <LoadingSpinner size="lg" showText={true} />
        <span className="ml-2 text-gray-700 dark:text-gray-300">
          {t("loading")}
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-6 transition-colors duration-300">
      <div className="flex flex-col md:flex-row flex-wrap justify-between items-start md:items-center gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full md:w-auto">
          <div>
            <label
              htmlFor="statusFilter"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              {t("filters.status")}
            </label>
            <Select
              value={statusFilter}
              onValueChange={(value) => {
                setStatusFilter(value);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-full sm:w-[180px] bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                <SelectValue placeholder={t("filters.allStatuses")} />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-800">
                <SelectItem value="all">{t("filters.allStatuses")}</SelectItem>
                <SelectItem value="PENDING">{t("status.pending")}</SelectItem>
                <SelectItem value="UNDER_REVIEW">
                  {t("status.underReview")}
                </SelectItem>
                <SelectItem value="APPROVED">{t("status.approved")}</SelectItem>
                <SelectItem value="REJECTED">{t("status.rejected")}</SelectItem>
                <SelectItem value="CANCELED">{t("status.canceled")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label
              htmlFor="pageSize"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              {t("pagination.pageSize")}
            </label>
            <Select
              value={pageSize.toString()}
              onValueChange={(value) => {
                setPageSize(parseInt(value));
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-full sm:w-[100px] bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                <SelectValue placeholder="10" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-800">
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <Button
            variant="outline"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {t("pagination.previous")}
          </Button>
          <span className="text-sm text-gray-700 dark:text-gray-300">
            {t("pagination.pageInfo", {
              current: currentPage,
              total: totalPages || 1,
            })}
          </span>
          <Button
            variant="outline"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages || totalPages === 0}
            className="transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {t("pagination.next")}
          </Button>
        </div>
      </div>

      {paginatedRequests.length === 0 ? (
        <div className="text-center p-8 bg-gray-50 dark:bg-gray-800 rounded-md transition-colors duration-300">
          <p className="text-gray-500 dark:text-gray-400">
            {t("noRequestsFound")}
          </p>
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {paginatedRequests.map((request) => (
            <Card
              key={request.id}
              className="overflow-hidden h-full transition-all duration-300 hover:shadow-md bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-gray-800 dark:text-gray-200">
                      {t("card.title")}
                    </CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-400">
                      {t("card.createdBy")}: {request.createdByUserName}
                    </CardDescription>
                  </div>
                  <Badge
                    className={`${getStatusBadgeColor(request.status)} transition-colors duration-300`}
                  >
                    {t(
                      `status.${request.status.toLowerCase().replace("_", "")}`
                    )}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-sm text-gray-800 dark:text-gray-200">
                      {t("card.note")}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 break-words">
                      {request.note || t("card.noNote")}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm mb-2 flex items-center gap-1 text-gray-800 dark:text-gray-200">
                      <Users size={16} className="inline" />
                      {t("card.teamMembers", {
                        count: request.teamRequestMembers.length,
                      })}
                    </h4>
                    <div className="space-y-2">
                      {request.teamRequestMembers.map((member) => (
                        <div
                          key={member.id}
                          className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded transition-colors duration-300"
                        >
                          <div className="flex items-center gap-2">
                            {member.user?.avatarUrl && (
                              <div className="relative w-8 h-8 rounded-full overflow-hidden">
                                <Image
                                  src={member.user.avatarUrl}
                                  alt={`${member.user.firstName} ${member.user.lastName}`}
                                  fill
                                  sizes="32px"
                                  className="object-cover"
                                />
                              </div>
                            )}
                            <div>
                              <p className="font-medium text-gray-800 dark:text-gray-200 text-sm">
                                {member.user?.firstName} {member.user?.lastName}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {member.user?.email}
                              </p>
                            </div>
                          </div>
                          <Badge
                            className={`
                              ${
                                member.status === "APPROVED"
                                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                  : member.status === "REJECTED"
                                    ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                                    : member.status === "no_response"
                                      ? "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                                      : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                              } transition-colors duration-300
                            `}
                          >
                            {t(
                              `status.${member.status.toLowerCase().replace("_", "")}`
                            )}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 px-6 py-3 transition-colors duration-300">
                <div className="w-full flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                  <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                    <Calendar size={14} className="inline" />
                    {t("card.deadline")}:{" "}
                    {new Date(
                      request.confirmationDeadline
                    ).toLocaleDateString()}
                  </div>
                  {request.status === "UNDER_REVIEW" && (
                    <Button
                      onClick={() => handleOpenDialog(request)}
                      className="w-full sm:w-auto transition-all duration-200 hover:bg-blue-600 bg-blue-500 text-white"
                    >
                      {t("actions.review")}
                    </Button>
                  )}
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors duration-300">
          <DialogHeader>
            <DialogTitle className="text-gray-800 dark:text-gray-200">
              {t("dialog.title")}
            </DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-400">
              {t("dialog.description")}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label
                htmlFor="note"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                {t("dialog.noteLabel")}
              </label>
              <Textarea
                id="note"
                value={updateNote}
                onChange={(e) => setUpdateNote(e.target.value)}
                placeholder={t("dialog.notePlaceholder")}
                className="min-h-[100px] bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors duration-300"
              />
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {t("dialog.teamMembers")}
              </h4>
              <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
                {selectedRequest?.teamRequestMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded transition-colors duration-300"
                  >
                    <div className="flex items-center gap-2">
                      {member.user?.avatarUrl && (
                        <div className="relative w-8 h-8 rounded-full overflow-hidden">
                          <Image
                            src={member.user.avatarUrl}
                            alt={`${member.user.firstName} ${member.user.lastName}`}
                            fill
                            sizes="32px"
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-gray-800 dark:text-gray-200 text-sm">
                          {member.user?.firstName} {member.user?.lastName}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {member.user?.email}
                        </p>
                      </div>
                    </div>
                    <Badge
                      className={`
                        ${
                          member.status === "APPROVED"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                            : member.status === "REJECTED"
                              ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                              : member.status === "no_response"
                                ? "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                                : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                        } transition-colors duration-300
                      `}
                    >
                      {t(
                        `status.${member.status.toLowerCase().replace("_", "")}`
                      )}
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
              className="transition-all duration-200 hover:bg-red-600 dark:hover:bg-red-700 text-white"
            >
              {updatingRequest ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("dialog.rejecting")}
                </>
              ) : (
                <>
                  <XCircle className="mr-2 h-4 w-4" />
                  {t("dialog.reject")}
                </>
              )}
            </Button>
            <Button
              variant="default"
              disabled={updatingRequest}
              onClick={() => updateTeamRequest("APPROVED")}
              className="transition-all duration-200 hover:bg-blue-600 dark:hover:bg-blue-700 bg-blue-500 text-white"
            >
              {updatingRequest ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("dialog.approving")}
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  {t("dialog.approve")}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
