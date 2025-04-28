// src/app/[locale]/(protected)/organizer-hackathon-management/[id]/resource-management/_components/IndividualRegistrationRequests.tsx
"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { IndividualRegistrationRequest } from "@/types/entities/individualRegistrationRequest";
import { useApiModal } from "@/hooks/useApiModal";
import { Badge } from "@/components/ui/badge";
import { individualRegistrationRequestService } from "@/services/individualRegistrationRequest.service";
import { useAuth } from "@/hooks/useAuth_v0";
import { useTranslations } from "@/hooks/useTranslations";
import { useToast } from "@/hooks/use-toast";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

interface IndividualRegistrationRequestsProps {
  hackathonId: string;
}

export default function IndividualRegistrationRequests({
  hackathonId,
}: IndividualRegistrationRequestsProps) {
  const [registrations, setRegistrations] = useState<
    IndividualRegistrationRequest[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const { showModal } = useApiModal();
  const { user } = useAuth();
  const t = useTranslations("registrationRequests");
  const toast = useToast();

  useEffect(() => {
    const loadRegistrations = async () => {
      try {
        setLoading(true);
        const { data, message } =
          await individualRegistrationRequestService.getIndividualRegistrationsByHackathonId(
            hackathonId
          );

        if (data) {
          setRegistrations(data);
        } else {
          throw new Error(message || t("failedToLoadRegistrations"));
        }
      } catch (error) {
        showModal(t("errorTitle"), t("failedToLoadRegistrations"), "error");
      } finally {
        setLoading(false);
      }
    };

    loadRegistrations();
  }, [hackathonId, showModal, t]);

  const updateRegistrationStatus = async (
    registrationId: string,
    status: "APPROVED" | "REJECTED"
  ) => {
    try {
      setProcessingId(registrationId);

      const { data, message } =
        await individualRegistrationRequestService.updateIndividualRegistrationRequest(
          {
            id: registrationId,
            hackathonId,
            status,
            reviewedById: user?.id,
          }
        );

      if (data) {
        // Update the local state after successful API call
        setRegistrations((prevRegistrations) =>
          prevRegistrations.map((reg) =>
            reg.id === registrationId ? data : reg
          )
        );

        // Show toast based on status
        toast.success(
          message || status === "APPROVED"
            ? t("approvalSuccess")
            : t("rejectionSuccess")
        );
      } else {
        throw new Error(message || t("updateStatusFailed"));
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : t("updateStatusFailed")
      );
    } finally {
      setProcessingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return (
          <Badge className="bg-yellow-500 dark:bg-yellow-600 text-white">
            {t("pending")}
          </Badge>
        );
      case "APPROVED":
        return (
          <Badge className="bg-green-500 dark:bg-green-600 text-white">
            {t("approved")}
          </Badge>
        );
      case "REJECTED":
        return (
          <Badge className="bg-red-500 dark:bg-red-600 text-white">
            {t("rejected")}
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <LoadingSpinner size="md" showText />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 sm:p-6 transition-colors duration-200">
      <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-900 dark:text-white">
        {t("individualRegistrationRequests")}
      </h2>

      {registrations.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">
          {t("noRegistrationRequests")}
        </p>
      ) : (
        <div className="overflow-x-auto -mx-4 sm:-mx-6">
          <div className="inline-block min-w-full px-4 sm:px-6">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-gray-200 dark:border-gray-700">
                  <TableHead className="py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300">
                    {t("user")}
                  </TableHead>
                  <TableHead className="py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300">
                    {t("status")}
                  </TableHead>
                  <TableHead className="py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 hidden sm:table-cell">
                    {t("submittedOn")}
                  </TableHead>
                  <TableHead className="py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 hidden md:table-cell">
                    {t("reviewedBy")}
                  </TableHead>
                  <TableHead className="py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300">
                    {t("actions")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {registrations.map((registration) => (
                  <TableRow
                    key={registration.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
                  >
                    <TableCell className="py-2 sm:py-4 text-sm text-gray-900 dark:text-gray-100">
                      {registration.createdByUserName}
                    </TableCell>
                    <TableCell className="py-2 sm:py-4">
                      {getStatusBadge(registration.status)}
                    </TableCell>
                    <TableCell className="py-2 sm:py-4 text-sm text-gray-700 dark:text-gray-300 hidden sm:table-cell">
                      {formatDate(registration.createdAt)}
                    </TableCell>
                    <TableCell className="py-2 sm:py-4 text-sm text-gray-700 dark:text-gray-300 hidden md:table-cell">
                      {registration.reviewedBy
                        ? `${registration.reviewedBy.firstName} ${registration.reviewedBy.lastName}`
                        : t("notReviewedYet")}
                    </TableCell>
                    <TableCell className="py-2 sm:py-4">
                      {registration.status === "PENDING" && (
                        <div className="flex flex-col xs:flex-row gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={processingId === registration.id}
                            className="bg-green-50 dark:bg-green-900 text-green-600 dark:text-green-200 hover:bg-green-100 dark:hover:bg-green-800 border-green-200 dark:border-green-700 transition-colors duration-150"
                            onClick={() =>
                              updateRegistrationStatus(
                                registration.id,
                                "APPROVED"
                              )
                            }
                          >
                            {processingId === registration.id ? (
                              <LoadingSpinner size="sm" className="mr-2" />
                            ) : null}
                            {t("approve")}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={processingId === registration.id}
                            className="bg-red-50 dark:bg-red-900 text-red-600 dark:text-red-200 hover:bg-red-100 dark:hover:bg-red-800 border-red-200 dark:border-red-700 transition-colors duration-150"
                            onClick={() =>
                              updateRegistrationStatus(
                                registration.id,
                                "REJECTED"
                              )
                            }
                          >
                            {processingId === registration.id ? (
                              <LoadingSpinner size="sm" className="mr-2" />
                            ) : null}
                            {t("reject")}
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
}
