// src/lib/makeData.ts
import { faker } from "@faker-js/faker";
import { User, UserRole, UserStatus } from "@/types/entities/users";

export function generateFakeUser(): User {
  return {
    id: faker.string.uuid(),
    email: faker.internet.email(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    role: faker.helpers.arrayElement<UserRole>([
      "Admin",
      "Organizer",
      "Judge",
      "Mentor",
      "TeamLeader",
      "TeamMember",
    ]),
    avatarUrl: faker.image.avatar(),
    bio: faker.person.bio(),
    country: faker.location.country(),
    city: faker.location.city(),
    birthdate: faker.date
      .birthdate({ min: 18, max: 50, mode: "age" })
      .toISOString(),
    phone: `+84 ${faker.string.numeric(9)}`,
    studentId: faker.helpers.maybe(() => faker.string.alphanumeric(8)), // Optional
    university: faker.helpers.maybe(() => faker.company.name()), // Optional for external mentors/judges
    linkedinUrl: faker.helpers.maybe(() => faker.internet.url()),
    githubUrl: faker.helpers.maybe(() => faker.internet.url()),
    skills: faker.helpers.arrayElements(
      [
        "JavaScript",
        "TypeScript",
        "React",
        "Node.js",
        "Python",
        "Django",
        "Machine Learning",
      ],
      faker.number.int({ min: 1, max: 5 })
    ),
    experienceLevel: faker.helpers.arrayElement([
      "Beginner",
      "Intermediate",
      "Advanced",
    ]),
    status: faker.helpers.arrayElement<UserStatus>([
      "Active",
      "Inactive",
      "Banned",
      "Pending",
      "Archived",
    ]),
    createdAt: faker.date.past().toISOString(),
    updatedAt: faker.date.recent().toISOString(),
    createdById: faker.string.uuid(),
  };
}

// Generate multiple fake users
export function generateFakeUsers(count: number = 10): User[] {
  return Array.from({ length: count }, generateFakeUser);
}
