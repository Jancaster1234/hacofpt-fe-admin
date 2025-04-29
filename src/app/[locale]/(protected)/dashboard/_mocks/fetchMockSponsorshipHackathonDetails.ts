// src/app/[locale]/(protected)/dashboard/_mocks/fetchMockSponsorshipHackathonDetails.ts

import {
  SponsorshipHackathonDetail,
  SponsorshipDetailStatus,
} from "@/types/entities/sponsorshipHackathonDetail";

export const fetchMockSponsorshipHackathonDetails = ({
  sponsorshipHackathonId,
}: {
  sponsorshipHackathonId?: string;
}): Promise<SponsorshipHackathonDetail[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockDetails: SponsorshipHackathonDetail[] = [
        {
          id: "shd1",
          sponsorshipHackathonId: "sh1",
          moneySpent: 10000,
          content: "Paid for promotional materials and swag.",
          status: "COMPLETED",
          timeFrom: new Date(
            Date.now() - 1000 * 60 * 60 * 24 * 15
          ).toISOString(),
          timeTo: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "shd2",
          sponsorshipHackathonId: "sh2",
          moneySpent: 5000,
          content: "Venue branding and signage.",
          status: "PLANNED",
          timeFrom: new Date(
            Date.now() + 1000 * 60 * 60 * 24 * 5
          ).toISOString(),
          timeTo: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "shd3",
          sponsorshipHackathonId: "sh3",
          moneySpent: 0,
          content: "Reserved for future activities.",
          status: "CANCELLED",
          timeFrom: new Date(
            Date.now() + 1000 * 60 * 60 * 24 * 10
          ).toISOString(),
          timeTo: new Date(Date.now() + 1000 * 60 * 60 * 24 * 12).toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      resolve(mockDetails);
    }, 500);
  });
};
