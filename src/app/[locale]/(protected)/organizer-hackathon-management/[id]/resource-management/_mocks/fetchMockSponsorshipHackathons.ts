// src/app/[locale]/(protected)/organizer-hackathon-management/[id]/resource-management/_mocks/fetchMockSponsorshipHackathons.ts

import { SponsorshipHackathon } from "@/types/entities/sponsorshipHackathon";

export const fetchMockSponsorshipHackathons = ({
  hackathonId,
  sponsorshipId,
}: {
  hackathonId?: string;
  sponsorshipId?: string;
}): Promise<SponsorshipHackathon[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockSponsorshipHackathons: SponsorshipHackathon[] = [
        {
          id: "sh1",
          hackathonId: "hack1",
          sponsorshipId: "spons1",
          totalMoney: 50000,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdByUserName: "organizerAlice",
        },
        {
          id: "sh2",
          hackathonId: "hack2",
          sponsorshipId: "spons2",
          totalMoney: 20000,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdByUserName: "organizerBob",
        },
        {
          id: "sh3",
          hackathonId: "hack1",
          sponsorshipId: "spons3",
          totalMoney: 75000,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdByUserName: "organizerCharlie",
        },
      ];
      resolve(mockSponsorshipHackathons);
    }, 500);
  });
};
