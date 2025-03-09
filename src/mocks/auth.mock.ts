// src/mocks/auth.mock.ts
import { User } from "@/types/entities/users";

export const mockUsers: User[] = [
  {
    id: "1",
    email: "admin@example.com",
    firstName: "Alice",
    lastName: "Johnson",
    role: "Admin",
    avatarUrl:
      "https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174669.jpg",
    bio: "Administrator overseeing the hackathon operations.",
    country: "USA",
    city: "San Francisco",
    birthdate: "1985-09-12",
    phone: "+1234567890",
    university: "Tech University",
    linkedinUrl: "https://linkedin.com/in/aliceadmin",
    githubUrl: "https://github.com/aliceadmin",
    skills: ["Management", "Event Planning"],
    experienceLevel: "Advanced",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    email: "organizer@example.com",
    firstName: "Bob",
    lastName: "Smith",
    role: "Organizer",
    avatarUrl:
      "https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174669.jpg",
    bio: "Passionate about bringing developers together for innovation.",
    country: "Canada",
    city: "Toronto",
    birthdate: "1990-04-21",
    phone: "+1987654321",
    university: "Event Management School",
    linkedinUrl: "https://linkedin.com/in/boborganizer",
    githubUrl: "https://github.com/boborganizer",
    skills: ["Public Speaking", "Sponsorship Management"],
    experienceLevel: "Advanced",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
    email: "judge@example.com",
    firstName: "Charlie",
    lastName: "Davis",
    role: "Judge",
    avatarUrl:
      "https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174669.jpg",
    bio: "Experienced software engineer evaluating hackathon projects.",
    country: "UK",
    city: "London",
    birthdate: "1980-07-08",
    phone: "+447123456789",
    university: "Harvard University",
    linkedinUrl: "https://linkedin.com/in/charliejudge",
    githubUrl: "https://github.com/charliejudge",
    skills: ["AI", "Blockchain", "Cybersecurity"],
    experienceLevel: "Advanced",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "4",
    email: "mentor@example.com",
    firstName: "David",
    lastName: "Williams",
    role: "Mentor",
    avatarUrl:
      "https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174669.jpg",
    bio: "Helping young developers shape their career paths.",
    country: "Germany",
    city: "Berlin",
    birthdate: "1982-12-03",
    phone: "+49123456789",
    university: "MIT",
    linkedinUrl: "https://linkedin.com/in/davidmentor",
    githubUrl: "https://github.com/davidmentor",
    skills: ["Full Stack Development", "Cloud Computing"],
    experienceLevel: "Advanced",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "5",
    email: "teamleader@example.com",
    firstName: "Eva",
    lastName: "Martinez",
    role: "TeamLeader",
    avatarUrl:
      "https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174669.jpg",
    bio: "Leading a team of ambitious coders.",
    country: "France",
    city: "Paris",
    birthdate: "1997-03-25",
    phone: "+33123456789",
    university: "FPT University",
    linkedinUrl: "https://linkedin.com/in/evateamleader",
    githubUrl: "https://github.com/evateamleader",
    skills: ["React", "Node.js", "Project Management"],
    experienceLevel: "Intermediate",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "6",
    email: "thanhphuccrkh@gmail.com",
    firstName: "Phan Thanh Phuc",
    lastName: "Bui",
    role: "TeamMember",
    avatarUrl:
      "https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174669.jpg",
    bio: "Excited to collaborate and learn new skills.",
    country: "Japan",
    city: "Tokyo",
    birthdate: "2000-11-18",
    phone: "+819012345678",
    university: "Tokyo Tech",
    linkedinUrl: "https://linkedin.com/in/frankteammember",
    githubUrl: "https://github.com/frankteammember",
    skills: ["Python", "Django", "Machine Learning"],
    experienceLevel: "Beginner",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export let mockAccessToken: string | null = "mock_access_token";
let mockRefreshToken: string | null = "mock_refresh_token";

export function simulateLogin(email: string, password: string) {
  if (email === "test@example.com" && password === "password") {
    return {
      accessToken: mockAccessToken,
      refreshToken: mockRefreshToken,
      user: mockUsers,
    };
  }
  throw new Error("Invalid credentials");
}

export function simulateLogout() {
  mockAccessToken = null;
  mockRefreshToken = null;
}

export function simulateTokenRefresh() {
  if (mockRefreshToken) {
    mockAccessToken = "new_mock_access_token";
    return { accessToken: mockAccessToken };
  }
  throw new Error("Refresh token expired");
}
