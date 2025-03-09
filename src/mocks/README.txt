// src\mocks\README.txt

MOCK DATA GUIDELINES

PURPOSE:
This folder contains mock data for the project. It is used to simulate API responses before the backend is available.

FILE NAMING CONVENTION:
- Each entity should have its own file, named in the format:
  <entity>.mock.ts (e.g., hackathons.mock.ts, users.mock.ts)
- The file should contain:
  - An array of mock data (e.g., hackathonsMock)
  - Helper functions to retrieve specific mock data

DATA STRUCTURE:
- Ensure mock data follows the same structure as the expected API response.
- Use TypeScript types or interfaces for consistency.

EXAMPLE STRUCTURE:
  /src/mocks/
    ├── hackathons.mock.ts
    ├── users.mock.ts
    ├── projects.mock.ts
    ├── index.ts  (optional: export all mocks)
    ├── README.txt

ACCESSING MOCK DATA:
- Import the required mock file:
  import { hackathonsMock, getMockHackathonById } from "@/mocks/hackathons.mock";
- Use helper functions to fetch mock items by ID or other criteria.

CLEANUP REMINDER:
- Remove or disable mocks once the actual backend API is ready.
