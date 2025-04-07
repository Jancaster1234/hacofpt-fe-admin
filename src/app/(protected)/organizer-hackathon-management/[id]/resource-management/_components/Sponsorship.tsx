// src/app/(protected)/organizer-hackathon-management/[id]/resource-management/_components/Sponsorship.tsx
import React, { useState, useEffect } from "react";
import { fetchMockSponsorships } from "../_mocks/fetchMockSponsorships";
import { Sponsorship as SponsorshipType } from "@/types/entities/sponsorship";
import SponsorshipList from "./SponsorshipList";
import SponsorshipDetails from "./SponsorshipDetails";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ErrorMessage from "@/components/common/ErrorMessage";

interface SponsorshipProps {
  hackathonId: string;
}

const Sponsorship: React.FC<SponsorshipProps> = ({ hackathonId }) => {
  const [sponsorships, setSponsorships] = useState<SponsorshipType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSponsorshipId, setSelectedSponsorshipId] = useState<
    string | null
  >(null);

  useEffect(() => {
    const loadSponsorships = async () => {
      try {
        setLoading(true);
        const data = await fetchMockSponsorships();
        setSponsorships(data);
        setError(null);
      } catch (err) {
        setError("Failed to load sponsorships. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadSponsorships();
  }, []);

  const handleSelectSponsorship = (id: string) => {
    setSelectedSponsorshipId(id);
  };

  const handleBackToList = () => {
    setSelectedSponsorshipId(null);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Sponsorship Management
      </h2>

      {selectedSponsorshipId ? (
        <SponsorshipDetails
          sponsorshipId={selectedSponsorshipId}
          hackathonId={hackathonId}
          onBack={handleBackToList}
        />
      ) : (
        <SponsorshipList
          sponsorships={sponsorships}
          onSelectSponsorship={handleSelectSponsorship}
        />
      )}
    </div>
  );
};

export default Sponsorship;
