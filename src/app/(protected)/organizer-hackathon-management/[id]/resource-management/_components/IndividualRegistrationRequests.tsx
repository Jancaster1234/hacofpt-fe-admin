// src/app/(protected)/organizer-hackathon-management/[id]/resource-management/_components/IndividualRegistrationRequests.tsx
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
import { fetchMockIndividualRegistrationsByHackathonId } from "../_mocks/fetchMockIndividualRegistrationsByHackathonId";
import { useApiModal } from "@/hooks/useApiModal";
import { Badge } from "@/components/ui/badge";

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
  const { showModal } = useApiModal();

  useEffect(() => {
    const loadRegistrations = async () => {
      try {
        const data = await fetchMockIndividualRegistrationsByHackathonId(
          hackathonId
        );
        setRegistrations(data);
      } catch (error) {
        showModal(
          "Error",
          "Failed to load individual registration requests",
          "error"
        );
      } finally {
        setLoading(false);
      }
    };

    loadRegistrations();
  }, [hackathonId, showModal]);

  const updateRegistrationStatus = async (
    registrationId: string,
    status: "APPROVED" | "REJECTED"
  ) => {
    try {
      // This would be replaced with an actual API call in production
      // Mock implementation for now
      setRegistrations((prevRegistrations) =>
        prevRegistrations.map((reg) =>
          reg.id === registrationId ? { ...reg, status } : reg
        )
      );

      showModal(
        "Success",
        `Registration ${
          status === "APPROVED" ? "approved" : "rejected"
        } successfully`,
        "success"
      );
    } catch (error) {
      showModal("Error", "Failed to update registration status", "error");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case "APPROVED":
        return <Badge className="bg-green-500">Approved</Badge>;
      case "REJECTED":
        return <Badge className="bg-red-500">Rejected</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        Loading registration requests...
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">
        Individual Registration Requests
      </h2>

      {registrations.length === 0 ? (
        <p className="text-gray-500">No registration requests found.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Submitted On</TableHead>
              <TableHead>Reviewed By</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {registrations.map((registration) => (
              <TableRow key={registration.id}>
                <TableCell>{registration.createdByUserName}</TableCell>
                <TableCell>{getStatusBadge(registration.status)}</TableCell>
                <TableCell>{formatDate(registration.createdAt)}</TableCell>
                <TableCell>
                  {registration.reviewedBy
                    ? `${registration.reviewedBy.firstName} ${registration.reviewedBy.lastName}`
                    : "Not reviewed yet"}
                </TableCell>
                <TableCell>
                  {registration.status === "PENDING" && (
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-green-50 text-green-600 hover:bg-green-100 border-green-200"
                        onClick={() =>
                          updateRegistrationStatus(registration.id, "APPROVED")
                        }
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-red-50 text-red-600 hover:bg-red-100 border-red-200"
                        onClick={() =>
                          updateRegistrationStatus(registration.id, "REJECTED")
                        }
                      >
                        Reject
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
