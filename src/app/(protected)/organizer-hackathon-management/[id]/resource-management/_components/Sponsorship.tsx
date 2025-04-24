// src/app/(protected)/organizer-hackathon-management/[id]/resource-management/_components/Sponsorship.tsx
import React, { useState, useEffect } from "react";
import { Sponsorship as SponsorshipType } from "@/types/entities/sponsorship";
import { sponsorshipService } from "@/services/sponsorship.service";
import SponsorshipList from "./SponsorshipList";
import SponsorshipDetails from "./SponsorshipDetails";
import SponsorshipForm from "./SponsorshipForm";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ErrorMessage from "@/components/common/ErrorMessage";
import { useAuth } from "@/hooks/useAuth_v0";
import { hasOrganizerRole } from "@/utils/roleUtils";

interface SponsorshipProps {
  hackathonId: string;
}

type ViewMode = "LIST" | "DETAILS" | "ADD" | "EDIT";

const Sponsorship: React.FC<SponsorshipProps> = ({ hackathonId }) => {
  const { user } = useAuth();
  const isOrganizer = hasOrganizerRole(user);

  const [sponsorships, setSponsorships] = useState<SponsorshipType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSponsorshipId, setSelectedSponsorshipId] = useState<
    string | null
  >(null);
  const [currentSponsorship, setCurrentSponsorship] = useState<
    SponsorshipType | undefined
  >(undefined);
  const [viewMode, setViewMode] = useState<ViewMode>("LIST");

  const loadSponsorships = async () => {
    try {
      setLoading(true);
      const response = await sponsorshipService.getAllSponsorships();
      setSponsorships(response.data);
      setError(null);
    } catch (err: any) {
      setError(
        err.message || "Failed to load sponsorships. Please try again later."
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSponsorships();
  }, []);

  useEffect(() => {
    const loadSponsorshipDetails = async () => {
      if (selectedSponsorshipId) {
        try {
          setLoading(true);
          const response = await sponsorshipService.getSponsorshipById(
            selectedSponsorshipId
          );
          setCurrentSponsorship(response.data);
        } catch (err: any) {
          setError(err.message || "Failed to load sponsorship details");
          console.error(err);
        } finally {
          setLoading(false);
        }
      } else {
        setCurrentSponsorship(undefined);
      }
    };

    if (viewMode === "DETAILS" || viewMode === "EDIT") {
      loadSponsorshipDetails();
    }
  }, [selectedSponsorshipId, viewMode]);

  const handleSelectSponsorship = (id: string) => {
    setSelectedSponsorshipId(id);
    setViewMode("DETAILS");
  };

  // Add a check to determine if the user is the creator
  const isCreator = (sponsorship: SponsorshipType) => {
    return user && sponsorship.createdByUserName === user.username;
  };

  const handleAddNewSponsorship = () => {
    if (!isOrganizer) {
      setError("Only organizers can add new sponsorships");
      return;
    }

    setSelectedSponsorshipId(null);
    setCurrentSponsorship(undefined);
    setViewMode("ADD");
  };

  const handleEditSponsorship = () => {
    if (!isOrganizer) {
      setError("Only organizers can edit sponsorships");
      return;
    }

    setViewMode("EDIT");
  };

  const handleFormSuccess = () => {
    loadSponsorships();
    setViewMode("LIST");
    setSelectedSponsorshipId(null);
  };

  const handleBackToList = () => {
    setViewMode("LIST");
    setSelectedSponsorshipId(null);
  };

  if (loading && viewMode === "LIST") {
    return <LoadingSpinner />;
  }

  if (error && viewMode === "LIST") {
    return <ErrorMessage message={error} />;
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Sponsorship Management
      </h2>

      {viewMode === "LIST" && (
        <SponsorshipList
          sponsorships={sponsorships}
          onSelectSponsorship={handleSelectSponsorship}
          onAddNewSponsorship={handleAddNewSponsorship}
          isOrganizer={isOrganizer}
        />
      )}

      {viewMode === "DETAILS" && selectedSponsorshipId && (
        <SponsorshipDetails
          sponsorshipId={selectedSponsorshipId}
          sponsorship={currentSponsorship}
          hackathonId={hackathonId}
          onBack={handleBackToList}
          onEdit={handleEditSponsorship}
          loading={loading}
          error={error}
          isOrganizer={isOrganizer}
        />
      )}

      {(viewMode === "ADD" || viewMode === "EDIT") &&
        isOrganizer &&
        (viewMode === "ADD" ||
          (currentSponsorship && isCreator(currentSponsorship))) && (
          <SponsorshipForm
            hackathonId={hackathonId}
            sponsorship={currentSponsorship}
            onSuccess={handleFormSuccess}
            onCancel={handleBackToList}
          />
        )}

      {(viewMode === "ADD" || viewMode === "EDIT") &&
        (!isOrganizer ||
          (viewMode === "EDIT" &&
            currentSponsorship &&
            !isCreator(currentSponsorship))) && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4">
            <p>
              Only the organizer who created this sponsorship can add or edit
              sponsorships.
            </p>
            <button
              onClick={handleBackToList}
              className="mt-2 bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-3 rounded"
            >
              Back to List
            </button>
          </div>
        )}
    </div>
  );
};

export default Sponsorship;
