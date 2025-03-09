/entities/ → Contains core business types (mirroring backend models)

eg:
// src/types/entities/hackathon.ts
export type Hackathon = {
  id: number;
  title: string;
  description: string;
  enrollmentCount: number;
  startDate: string;
  endDate: string;
  type: string;
  status: string;
  requiredTechnologies: string[];
};

filename convention: camelCase