// src/app/[locale]/(protected)/organizer-hackathon-management/[id]/resource-management/_mocks/fetchMockSponsorships.ts

import { Sponsorship, SponsorshipStatus } from "@/types/entities/sponsorship";

export const fetchMockSponsorships = (): Promise<Sponsorship[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const now = new Date().toISOString();

      const mockSponsorships: Sponsorship[] = [
        {
          id: "spons1",
          name: "Tech Giants Sponsorship",
          brand: "Tech Giants Inc.",
          content:
            "Providing top-tier tech gear for the hackathon participants.",
          money: 50000,
          timeFrom: new Date(
            Date.now() - 1000 * 60 * 60 * 24 * 30
          ).toISOString(), // 30 days ago
          timeTo: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(), // 30 days later
          status: "ACTIVE",
          createdAt: now,
          updatedAt: now,
          createdByUserName: "user_name",
        },
        {
          id: "spons2",
          name: "GreenTech Partnership",
          brand: "GreenTech Co.",
          content: "Supporting eco-friendly hardware projects.",
          money: 20000,
          timeFrom: new Date(
            Date.now() - 1000 * 60 * 60 * 24 * 60
          ).toISOString(),
          timeTo: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
          status: "COMPLETED",
          createdAt: now,
          updatedAt: now,
          createdByUserName: "user_name",
        },
        {
          id: "spons3",
          name: "Cloud Innovators Backing",
          brand: "Cloud Innovators",
          content: "Offering cloud credits and mentorship to teams.",
          money: 75000,
          timeFrom: new Date().toISOString(),
          timeTo: new Date(Date.now() + 1000 * 60 * 60 * 24 * 60).toISOString(),
          status: "PENDING",
          createdAt: now,
          updatedAt: now,
          createdByUserName: "user_name",
        },
      ];
      resolve(mockSponsorships);
    }, 500);
  });
};
