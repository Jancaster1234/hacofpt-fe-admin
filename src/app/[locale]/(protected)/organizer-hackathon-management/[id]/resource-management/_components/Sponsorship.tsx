// src/app/[locale]/(protected)/organizer-hackathon-management/[id]/resource-management/_components/Sponsorship.tsx
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
import { useTranslations } from "@/hooks/useTranslations";
import { useToast } from "@/hooks/use-toast";

interface SponsorshipProps {
  hackathonId: string;
}

type ViewMode = "LIST" | "DETAILS" | "ADD" | "EDIT";

const Sponsorship: React.FC<SponsorshipProps> = ({ hackathonId }) => {
  const t = useTranslations("sponsorship");
  const toast = useToast();
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
      const errorMessage = err.message || t("errors.loadFailed");
      setError(errorMessage);
      toast.error(errorMessage);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSponsorships();
    // Don't include toast in dependencies to avoid infinite loops
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
          const errorMessage = err.message || t("errors.loadDetailsFailed");
          setError(errorMessage);
          toast.error(errorMessage);
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
    // Don't include toast in dependencies to avoid infinite loops
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
      const errorMessage = t("errors.organizerOnly");
      setError(errorMessage);
      toast.error(errorMessage);
      return;
    }

    setSelectedSponsorshipId(null);
    setCurrentSponsorship(undefined);
    setViewMode("ADD");
  };

  const handleEditSponsorship = () => {
    if (!isOrganizer) {
      const errorMessage = t("errors.organizerOnly");
      setError(errorMessage);
      toast.error(errorMessage);
      return;
    }

    setViewMode("EDIT");
  };

  const handleFormSuccess = () => {
    toast.success(t("success.formSubmitted"));
    loadSponsorships();
    setViewMode("LIST");
    setSelectedSponsorshipId(null);
  };

  const handleBackToList = () => {
    setViewMode("LIST");
    setSelectedSponsorshipId(null);
  };

  if (loading && viewMode === "LIST") {
    return <LoadingSpinner size="lg" showText={true} />;
  }

  if (error && viewMode === "LIST") {
    return <ErrorMessage message={error} />;
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 sm:p-6 transition-colors duration-200">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-4 sm:mb-6">
        {t("title")}
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
          <div className="bg-yellow-100 dark:bg-yellow-900 border-l-4 border-yellow-500 text-yellow-700 dark:text-yellow-300 p-4 mb-4 rounded transition-colors duration-200">
            <p>{t("errors.creatorOnly")}</p>
            <button
              onClick={handleBackToList}
              className="mt-2 bg-yellow-500 hover:bg-yellow-600 dark:hover:bg-yellow-400 text-white dark:text-gray-900 py-1 px-3 rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50"
            >
              {t("actions.backToList")}
            </button>
          </div>
        )}
    </div>
  );
};

export default Sponsorship;
