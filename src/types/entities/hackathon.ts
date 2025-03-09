// src/types/entities/hackathon.ts
import { Round } from "./round";
export type Hackathon = {
  id: string;
  title: string;
  subtitle: string;
  bannerImageUrl: string;
  enrollStartDate: string;
  enrollEndDate: string;
  enrollmentCount: number;
  startDate: string;
  endDate: string;
  information: string;
  description: string;
  participant: string;
  documentation: string[]; // document public URLs
  contact: string;
  category: string; // New: Used for category filtering
  organization: string; // New: Used for organization filtering
  enrollmentStatus: string;
  minimumTeamMembers: number;
  maximumTeamMembers: number;
  numberOfRounds: number; // New: Number of rounds in the hackathon
  rounds: Round[]; // New: Directly linking rounds
  createdByUserId: string;
};
