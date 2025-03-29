// src/app/(protected)/grading-submission/[id]/_mocks/fetchMockSubmissions.ts
import { Submission } from "@/types/entities/submission";

export const fetchMockSubmissions = (
  createdById: string,
  roundId: string
): Promise<Submission[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockSubmissions: Submission[] = [
        {
          id: "sub1",
          round: { id: roundId, roundTitle: `Round ${roundId}` },
          fileUrls: [
            {
              id: "file1",
              fileUrl: "/submissions/file1.pdf",
              fileName: "ProjectProposal.pdf",
            },
            {
              id: "file2",
              fileUrl: "/submissions/file2.png",
              fileName: "ArchitectureDiagram.png",
            },
          ],
          judgeSubmissions: [
            {
              id: "js1",
              judge: {
                id: "judge1",
                firstName: "Alice",
                lastName: "Anderson",
                email: "alice.anderson@example.com",
                userRoles: [
                  {
                    id: "ur2",
                    user: {
                      id: "judge1",
                      firstName: "Alice",
                      lastName: "Anderson",
                    },
                    role: { id: "2", name: "JUDGE" },
                  },
                ],
                skills: ["Software Engineering", "AI"],
              },
              score: 85,
              note: "Great submission with a clear project plan.",
              judgeSubmissionDetails: [
                {
                  id: "jsd1",
                  roundMarkCriterion: {
                    id: "rmc1",
                    name: "Technical Implementation",
                    maxScore: 50,
                    note: "Assessing code quality and structure.",
                  },
                  score: 45,
                  note: "Code is well-structured and maintainable.",
                  createdAt: new Date().toISOString(),
                },
                {
                  id: "jsd2",
                  roundMarkCriterion: {
                    id: "rmc2",
                    name: "Innovation",
                    maxScore: 30,
                    note: "Evaluates creativity and originality.",
                  },
                  score: 25,
                  note: "The idea is innovative and has potential.",
                  createdAt: new Date().toISOString(),
                },
              ],
              createdAt: new Date().toISOString(),
            },
            {
              id: "js2",
              judge: {
                id: "judge2",
                firstName: "Bob",
                lastName: "Brown",
                email: "bob.brown@example.com",
                userRoles: [
                  {
                    id: "ur2",
                    user: {
                      id: "judge2",
                    },
                    role: { id: "2", name: "JUDGE" },
                  },
                ],
                skills: ["Product Management", "UI/UX"],
              },
              score: 78,
              note: "Good structure, but needs better user experience.",
              judgeSubmissionDetails: [
                {
                  id: "jsd3",
                  roundMarkCriterion: {
                    id: "rmc1",
                    name: "Technical Implementation",
                    maxScore: 50,
                    note: "Assessing code quality and structure.",
                  },
                  score: 40,
                  note: "Good code structure, but some areas need improvement.",
                  createdAt: new Date().toISOString(),
                },
                {
                  id: "jsd4",
                  roundMarkCriterion: {
                    id: "rmc3",
                    name: "User Experience",
                    maxScore: 20,
                    note: "Assesses ease of use and design.",
                  },
                  score: 15,
                  note: "UI is clean but could be more intuitive.",
                  createdAt: new Date().toISOString(),
                },
              ],
              createdAt: new Date().toISOString(),
            },
          ],
          status: "SUBMITTED",
          submittedAt: new Date().toISOString(),
          finalScore: 81.5,
          createdAt: new Date().toISOString(),
          createdBy: {
            id: createdById,
            firstName: "John",
            lastName: "Doe",
            email: "john.doe@example.com",
            userRoles: [
              {
                id: "ur5",
                user: {
                  id: createdById,
                },
                role: { id: "6", name: "TEAM_MEMBER" },
              },
            ],
          },
        },
        {
          id: "sub2",
          round: { id: roundId, roundTitle: `Round ${roundId}` },
          fileUrls: [
            {
              id: "file3",
              fileUrl: "/submissions/file3.docx",
              fileName: "DesignDocument.docx",
            },
          ],
          judgeSubmissions: [],
          status: "DRAFT",
          submittedAt: "",
          finalScore: undefined,
          createdAt: new Date().toISOString(),
          createdBy: {
            id: createdById,
            firstName: "John",
            lastName: "Doe",
            email: "john.doe@example.com",
            userRoles: [
              {
                id: "ur5",
                user: {
                  id: createdById,
                },
                role: { id: "6", name: "TEAM_MEMBER" },
              },
            ],
          },
        },
      ];

      resolve(mockSubmissions);
    }, 500);
  });
};
