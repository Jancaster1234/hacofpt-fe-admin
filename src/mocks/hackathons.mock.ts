// src/mocks/hackathons.mock.ts
import { Hackathon } from "@/types/entities/hackathon";

export const hackathonsMock: Hackathon[] = [
  {
    id: "1",
    title: "Hackathon 2024",
    subtitle: "Innovate, Build, Compete!",
    bannerImageUrl:
      "https://doanthanhnien.vn/Content/uploads/images/132311755918511627_Banner.jpg",
    enrollStartDate: "2024-03-01",
    enrollEndDate: "2024-04-01",
    enrollmentCount: 150,
    startDate: "2024-04-05",
    endDate: "2024-04-07",
    information:
      "Join us for an exciting 48-hour hackathon where innovation meets execution.",
    description:
      "A great hackathon that brings together developers, designers, and entrepreneurs.",
    participant: "Open to students and professionals from all backgrounds.",
    documentation: [
      "https://example.com/docs/hackathon-2024-rules.pdf",
      "https://example.com/docs/hackathon-2024-schedule.pdf",
    ],
    contact: "contact@hackathon2024.com",
    category: "Coding Hackathons",
    organization: "FPTU",
    enrollmentStatus: "open",
    minimumTeamMembers: 4,
    maximumTeamMembers: 6,
    numberOfRounds: 3,
    createdByUserId: "2",
    rounds: [
      {
        id: "1",
        hackathonId: "1",
        roundNumber: 1,
        markCriteria: [
          { id: "1", roundId: "1", criteria: "Innovation", maxScore: 10 },
          { id: "2", roundId: "1", criteria: "Feasibility", maxScore: 10 },
        ],
      },
      {
        id: "2",
        hackathonId: "1",
        roundNumber: 2,
        markCriteria: [
          { id: "3", roundId: "2", criteria: "Implementation", maxScore: 15 },
          { id: "4", roundId: "2", criteria: "Presentation", maxScore: 10 },
        ],
      },
    ],
  },
  {
    id: "2",
    title: "Hackathon 2023",
    subtitle: "Code, Create, Collaborate!",
    bannerImageUrl:
      "https://i0.wp.com/hannahed.co/wp-content/uploads/2022/07/290782336_7746065928768366_6033188322521996662_n.jpg?w=1080&ssl=1",
    enrollStartDate: "2023-03-10",
    enrollEndDate: "2023-04-10",
    enrollmentCount: 120,
    startDate: "2023-04-15",
    endDate: "2023-04-17",
    information:
      "A thrilling hackathon experience filled with creativity and problem-solving.",
    description: "Last year's hackathon where teams built amazing projects.",
    participant: "Anyone passionate about technology and innovation.",
    documentation: [
      "https://example.com/docs/hackathon-2023-rules.pdf",
      "https://example.com/docs/hackathon-2023-schedule.pdf",
    ],
    contact: "contact@hackathon2023.com",
    category: "Design Hackathons",
    organization: "NASA",
    enrollmentStatus: "closed",
    minimumTeamMembers: 4,
    maximumTeamMembers: 6,
    numberOfRounds: 2,
    createdByUserId: "2",
    rounds: [
      {
        id: "3",
        hackathonId: "2",
        roundNumber: 1,
        markCriteria: [
          { id: "5", roundId: "3", criteria: "Creativity", maxScore: 10 },
          {
            id: "6",
            roundId: "3",
            criteria: "Technical Complexity",
            maxScore: 10,
          },
        ],
      },
    ],
  },
  {
    id: "3",
    title: "Hackathon 2022",
    subtitle: "Think Big, Build Bigger!",
    bannerImageUrl:
      "https://moitruongachau.com/vnt_upload/career/06_2022/Vong_chung_ket_cuoc_thi_hoc_thuat_Loc_Xanh.png",
    enrollStartDate: "2022-03-15",
    enrollEndDate: "2022-04-15",
    enrollmentCount: 100,
    startDate: "2022-04-20",
    endDate: "2022-04-22",
    information:
      "A hackathon where ideas turned into reality through technology.",
    description:
      "Two years ago, developers gathered to solve real-world challenges.",
    participant: "Students, developers, and startup enthusiasts.",
    documentation: [
      "https://example.com/docs/hackathon-2022-rules.pdf",
      "https://example.com/docs/hackathon-2022-schedule.pdf",
    ],
    contact: "contact@hackathon2022.com",
    category: "External Hackathons",
    organization: "IAI HACKATHON",
    enrollmentStatus: "open",
    minimumTeamMembers: 4,
    maximumTeamMembers: 6,
    numberOfRounds: 3,
    createdByUserId: "2",
    rounds: [
      {
        id: "5",
        hackathonId: "3",
        roundNumber: 1,
        markCriteria: [
          {
            id: "9",
            roundId: "5",
            criteria: "Penetration Testing",
            maxScore: 15,
          },
          {
            id: "10",
            roundId: "5",
            criteria: "Defensive Strategy",
            maxScore: 10,
          },
        ],
      },
    ],
  },
  {
    id: "4",
    title: "Cybersecurity Challenge",
    subtitle: "Secure the Future",
    bannerImageUrl:
      "https://doanthanhnien.vn/Content/uploads/images/132311755918511627_Banner.jpg",
    enrollStartDate: "2024-01-10",
    enrollEndDate: "2024-02-20",
    enrollmentCount: 75,
    startDate: "2024-02-25",
    endDate: "2024-02-27",
    information: "Test your cybersecurity skills in this thrilling event.",
    description:
      "A hackathon where participants tackle real-world security issues.",
    participant: "For ethical hackers, security researchers, and IT students.",
    documentation: [
      "https://example.com/docs/cybersecurity-rules.pdf",
      "https://example.com/docs/cybersecurity-schedule.pdf",
    ],
    contact: "contact@cybersecurityhack.com",
    category: "Cybersecurity Hackathons",
    organization: "MIT",
    enrollmentStatus: "open",
    minimumTeamMembers: 2,
    maximumTeamMembers: 4,
    numberOfRounds: 3,
    createdByUserId: "2",
    rounds: [
      {
        id: "5",
        hackathonId: "4",
        roundNumber: 1,
        markCriteria: [
          {
            id: "9",
            roundId: "5",
            criteria: "Penetration Testing",
            maxScore: 15,
          },
          {
            id: "10",
            roundId: "5",
            criteria: "Defensive Strategy",
            maxScore: 10,
          },
        ],
      },
    ],
  },
  {
    id: "5",
    title: "FinTech Innovation Hack",
    subtitle: "Revolutionizing Finance with Tech",
    bannerImageUrl:
      "https://doanthanhnien.vn/Content/uploads/images/132311755918511627_Banner.jpg",
    enrollStartDate: "2024-05-01",
    enrollEndDate: "2024-06-01",
    enrollmentCount: 110,
    startDate: "2024-06-10",
    endDate: "2024-06-12",
    information: "Build next-gen financial solutions in this FinTech hack.",
    description:
      "Bringing together finance and technology to create innovative solutions.",
    participant: "Open to developers, designers, and finance experts.",
    documentation: [
      "https://example.com/docs/fintech-rules.pdf",
      "https://example.com/docs/fintech-schedule.pdf",
    ],
    contact: "contact@fintechhack.com",
    category: "FinTech Hackathons",
    organization: "Visa",
    enrollmentStatus: "upcoming",
    minimumTeamMembers: 3,
    maximumTeamMembers: 6,
    numberOfRounds: 2,
    createdByUserId: "2",
    rounds: [
      {
        id: "6",
        hackathonId: "5",
        roundNumber: 1,
        markCriteria: [
          { id: "11", roundId: "6", criteria: "User Experience", maxScore: 10 },
          { id: "12", roundId: "6", criteria: "Security", maxScore: 15 },
        ],
      },
    ],
  },
  {
    id: "6",
    title: "Blockchain Revolution Hack",
    subtitle: "Decentralize Everything!",
    bannerImageUrl:
      "https://doanthanhnien.vn/Content/uploads/images/132311755918511627_Banner.jpg",
    enrollStartDate: "2024-07-01",
    enrollEndDate: "2024-08-01",
    enrollmentCount: 80,
    startDate: "2024-08-10",
    endDate: "2024-08-12",
    information: "Building the future with blockchain and smart contracts.",
    description:
      "A hackathon for blockchain developers and crypto enthusiasts.",
    participant:
      "Open to blockchain developers, crypto experts, and fintech innovators.",
    documentation: [
      "https://example.com/docs/blockchain-rules.pdf",
      "https://example.com/docs/blockchain-schedule.pdf",
    ],
    contact: "contact@blockchainhack.com",
    category: "Blockchain Hackathons",
    organization: "Ethereum Foundation",
    enrollmentStatus: "upcoming",
    minimumTeamMembers: 3,
    maximumTeamMembers: 6,
    numberOfRounds: 2,
    createdByUserId: "2",
    rounds: [
      {
        id: "7",
        hackathonId: "6",
        roundNumber: 1,
        markCriteria: [
          {
            id: "13",
            roundId: "7",
            criteria: "Smart Contract Security",
            maxScore: 10,
          },
          {
            id: "14",
            roundId: "7",
            criteria: "Decentralization",
            maxScore: 10,
          },
        ],
      },
    ],
  },
  {
    id: "7",
    title: "HealthTech Innovation Challenge",
    subtitle: "Transforming Healthcare with Technology",
    bannerImageUrl:
      "https://doanthanhnien.vn/Content/uploads/images/132311755918511627_Banner.jpg",
    enrollStartDate: "2024-06-01",
    enrollEndDate: "2024-07-01",
    enrollmentCount: 95,
    startDate: "2024-07-05",
    endDate: "2024-07-07",
    information: "A hackathon for developing innovative healthcare solutions.",
    description:
      "Bringing healthcare and technology together to solve medical challenges.",
    participant: "Doctors, engineers, developers, and health enthusiasts.",
    documentation: [
      "https://example.com/docs/healthtech-rules.pdf",
      "https://example.com/docs/healthtech-schedule.pdf",
    ],
    contact: "contact@healthtechhack.com",
    category: "HealthTech Hackathons",
    organization: "WHO",
    enrollmentStatus: "open",
    minimumTeamMembers: 3,
    maximumTeamMembers: 6,
    numberOfRounds: 2,
    createdByUserId: "2",
    rounds: [
      {
        id: "8",
        hackathonId: "7",
        roundNumber: 1,
        markCriteria: [
          {
            id: "15",
            roundId: "8",
            criteria: "Impact on Healthcare",
            maxScore: 10,
          },
          {
            id: "16",
            roundId: "8",
            criteria: "Technical Feasibility",
            maxScore: 10,
          },
        ],
      },
    ],
  },
  {
    id: "8",
    title: "EdTech Disrupt Hackathon",
    subtitle: "Revolutionizing Education with AI",
    bannerImageUrl:
      "https://doanthanhnien.vn/Content/uploads/images/132311755918511627_Banner.jpg",
    enrollStartDate: "2024-09-01",
    enrollEndDate: "2024-10-01",
    enrollmentCount: 100,
    startDate: "2024-10-10",
    endDate: "2024-10-12",
    information:
      "A hackathon focused on improving education through AI and technology.",
    description:
      "Join us in developing next-gen EdTech solutions for the future.",
    participant: "Open to students, educators, and developers.",
    documentation: [
      "https://example.com/docs/edtech-rules.pdf",
      "https://example.com/docs/edtech-schedule.pdf",
    ],
    contact: "contact@edtechhack.com",
    category: "EdTech Hackathons",
    organization: "Google for Education",
    enrollmentStatus: "upcoming",
    minimumTeamMembers: 2,
    maximumTeamMembers: 5,
    numberOfRounds: 2,
    createdByUserId: "2",
    rounds: [
      {
        id: "9",
        hackathonId: "8",
        roundNumber: 1,
        markCriteria: [
          { id: "17", roundId: "9", criteria: "AI Integration", maxScore: 10 },
          { id: "18", roundId: "9", criteria: "User Engagement", maxScore: 10 },
        ],
      },
    ],
  },
];

export function getMockHackathonById(id: string): Hackathon | null {
  return hackathonsMock.find((h) => h.id === id) || null;
}
