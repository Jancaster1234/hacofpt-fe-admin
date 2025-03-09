/api/ → Contains types specifically for API interactions (requests/responses)

eg:
// src/types/api/hackathonApi.ts
import { Hackathon } from "../entities/hackathon";

export type HackathonResponse = {
  success: boolean;
  data: Hackathon;
};

export type HackathonListResponse = {
  success: boolean;
  data: Hackathon[];
};

filename convention: camelCase