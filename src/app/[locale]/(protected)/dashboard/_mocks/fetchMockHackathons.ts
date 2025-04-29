// src/app/[locale]/(protected)/dashboard/_mocks/fetchMockHackathons.ts
import { Hackathon } from "@/types/entities/hackathon";

export const fetchMockHackathons = (): Promise<Hackathon[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockHackathons: Hackathon[] = [
        {
          id: "hack1",
          title: "AI Innovation Challenge",
          subtitle: "Build the future with AI",
          bannerImageUrl: "https://example.com/banner1.jpg",
          enrollStartDate: "2025-05-01T00:00:00.000Z",
          enrollEndDate: "2025-05-15T23:59:59.000Z",
          enrollmentCount: 150,
          startDate: "2025-05-20T00:00:00.000Z",
          endDate: "2025-05-25T23:59:59.000Z",
          information: "Open to all developers interested in AI.",
          description:
            "This hackathon invites teams to create innovative solutions using AI.",
          documentation: [
            "https://docs.example.com/ai",
            "https://github.com/example/ai-guide",
          ],
          contact: "contact@example.com",
          category: "Artificial Intelligence",
          organization: "OpenAI Community",
          enrollmentStatus: "Open",
          status: "ACTIVE",
          minimumTeamMembers: 2,
          maximumTeamMembers: 5,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdByUserName: "adminuser",
        },
        {
          id: "hack2",
          title: "GreenTech Hackathon",
          subtitle: "Innovate for a sustainable future",
          bannerImageUrl: "https://example.com/banner2.jpg",
          enrollStartDate: "2025-06-01T00:00:00.000Z",
          enrollEndDate: "2025-06-10T23:59:59.000Z",
          enrollmentCount: 80,
          startDate: "2025-06-15T00:00:00.000Z",
          endDate: "2025-06-18T23:59:59.000Z",
          information: "Solutions for climate and environment.",
          description:
            "Join us to build solutions for environmental sustainability.",
          documentation: ["https://docs.greentech.org/start"],
          contact: "greentech@example.com",
          category: "Sustainability",
          organization: "EcoFuture Org",
          enrollmentStatus: "Upcoming",
          status: "INACTIVE",
          minimumTeamMembers: 3,
          maximumTeamMembers: 6,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdByUserName: "janeadmin",
        },
      ];
      resolve(mockHackathons);
    }, 500);
  });
};
